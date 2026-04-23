// ╔═══════════════════════════════════════════════════════════════╗
// ║  ROUTINE ENGINE v2.2.3                                       ║
// ║  Full-day routine intelligence for Louise Pro                ║
// ║  Replaces Sleep Engine v1 — backward compatible              ║
// ║                                                              ║
// ║  Analyzes: sleep, feeds, bath, diapers                       ║
// ║  Uses: WHO/AAP research + learned patterns + recency decay   ║
// ║                                                              ║
// ║  v2.1.0: Time-window gates for retrospective hints           ║
// ║   • Morning review (06h-10h): night sleep consistency,       ║
// ║     wakings insights (sleeping through, frequent wakings,    ║
// ║     pattern detected, cause pattern, trend)                  ║
// ║   • End-of-day (22h+): shorter naps, WHO total sleep,        ║
// ║     great sleep day, below/above recommended                 ║
// ║   • Contextual hints (feed overdue, bedtime approaching,     ║
// ║     bath reminder, excellent nap, diaper check) unchanged    ║
// ╚═══════════════════════════════════════════════════════════════╝
//
// PUBLIC API:
//
//   RoutineEngine.analyze(entries, numDays, ageWeeks)
//     → { sleep, feeds, bath, wake, daysAnalyzed, confidence }
//
//   RoutineEngine.getStatus(elapsed, pattern, napPos, ageWeeks)
//     → { state, el, target:{min,avg,max}, rem, prog, wind, over,
//         predictedTime, napPos, confidence }
//
//   RoutineEngine.predict(todayEntries, pattern, wakeMin, ageWeeks)
//     → [{ type, timeMin, duration, confidence, status, pos? }]
//
//   RoutineEngine.getInsights(entries, todayEntries, pattern, ageWeeks, lang)
//     → [{ type, icon, title, desc }]
//
//   RoutineEngine.getGuideline(ageWeeks)
//     → { ww, naps, totalSleep, feeds }
//
//   -- BACKWARD COMPAT (drop-in for SleepEngine) --
//   RoutineEngine.getSleepRec(entries, age, birthDate)
//   RoutineEngine.getNapSug(entries, rec)
//   RoutineEngine.analyzeSleepPatterns(entries, numDays)
//   RoutineEngine.projectSchedule(wakeMin, pattern, todayNaps)
//   RoutineEngine.getDayInsights(todayE, pattern, guideline)
//
//   RoutineEngine.toMinutes("HH:MM") → number
//   RoutineEngine.minToTime(number) → "HH:MM"
//   RoutineEngine.VERSION

(function(root) {
  "use strict";

  var VERSION = "2.2.3";

  // ════════════════════════════════════════════════════════
  // HELPERS
  // ════════════════════════════════════════════════════════

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }

  function dateOffset(base, offset) {
    var d = new Date(base + "T12:00:00");
    d.setDate(d.getDate() + offset);
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }

  function toMinutes(t) {
    var parts = (t || "12:00").split(":").map(Number);
    return parts[0] * 60 + (parts[1] || 0);
  }

  function minToTime(m) {
    var h = Math.floor(m / 60) % 24;
    var r = Math.round(m % 60);
    return String(h).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  }

  function fmtDur(m) {
    if (!m) return "0min";
    var h = Math.floor(m / 60), r = m % 60;
    return h > 0 ? (r > 0 ? h + "h" + r + "m" : h + "h") : r + "min";
  }

  function median(arr) {
    if (!arr.length) return 0;
    var s = arr.slice().sort(function(a, b) { return a - b; });
    var mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
  }

  function weightedAvg(values, weights) {
    if (!values.length) return 0;
    var sumW = 0, sumV = 0;
    for (var i = 0; i < values.length; i++) {
      sumV += values[i] * (weights[i] || 1);
      sumW += (weights[i] || 1);
    }
    return sumW > 0 ? Math.round(sumV / sumW) : 0;
  }

  // ════════════════════════════════════════════════════════
  // RECENCY WEIGHTING
  // Days ago → weight (exponential decay)
  // halfLife=4: yesterday=1.0, 4 days ago=0.5, 7 days ago=0.3
  // ════════════════════════════════════════════════════════

  function recencyWeight(daysAgo, halfLife) {
    halfLife = halfLife || 4;
    return Math.exp(-0.693 * daysAgo / halfLife);
  }

  // ════════════════════════════════════════════════════════
  // BLEND: learned data vs research guideline
  // With few data points, trusts guideline more.
  // threshold=5: at 5 data points, 100% learned
  // ════════════════════════════════════════════════════════

  function blend(learned, guideline, dataPoints, threshold) {
    threshold = threshold || 5;
    var w = Math.min(1, dataPoints / threshold);
    return Math.round(w * learned + (1 - w) * guideline);
  }

  // ════════════════════════════════════════════════════════
  // RESEARCH DATA — WHO / AAP / NHS baselines
  // Expanded: sleep + feeds + daily totals
  // ════════════════════════════════════════════════════════

  var GUIDELINES = [
    {
      maxW: 4, label: "0-1m",
      ww: { min: 30, max: 60 },
      naps: { min: 4, max: 5, label: "4-5" },
      totalSleep: { min: 15, max: 17 },
      feeds: {
        interval: { min: 90, max: 180 },
        count: { min: 8, max: 12 },
        mlPerFeed: { min: 30, max: 90 },
        mlPerDay: { min: 400, max: 700 }
      }
    },
    {
      maxW: 8, label: "1-2m",
      ww: { min: 45, max: 75 },
      naps: { min: 4, max: 5, label: "4-5" },
      totalSleep: { min: 14, max: 16 },
      feeds: {
        interval: { min: 120, max: 180 },
        count: { min: 7, max: 10 },
        mlPerFeed: { min: 60, max: 120 },
        mlPerDay: { min: 600, max: 900 }
      }
    },
    {
      maxW: 12, label: "2-3m",
      ww: { min: 60, max: 90 },
      naps: { min: 3, max: 4, label: "3-4" },
      totalSleep: { min: 14, max: 16 },
      feeds: {
        interval: { min: 120, max: 210 },
        count: { min: 6, max: 9 },
        mlPerFeed: { min: 90, max: 150 },
        mlPerDay: { min: 700, max: 1000 }
      }
    },
    {
      maxW: 16, label: "3-4m",
      ww: { min: 75, max: 120 },
      naps: { min: 3, max: 4, label: "3-4" },
      totalSleep: { min: 14, max: 15 },
      feeds: {
        interval: { min: 150, max: 210 },
        count: { min: 5, max: 8 },
        mlPerFeed: { min: 120, max: 180 },
        mlPerDay: { min: 750, max: 1050 }
      }
    },
    {
      maxW: 28, label: "4-7m",
      ww: { min: 120, max: 180 },
      naps: { min: 2, max: 3, label: "2-3" },
      totalSleep: { min: 13, max: 15 },
      feeds: {
        interval: { min: 180, max: 240 },
        count: { min: 5, max: 7 },
        mlPerFeed: { min: 150, max: 210 },
        mlPerDay: { min: 700, max: 1000 }
      }
    },
    {
      maxW: 40, label: "7-10m",
      ww: { min: 150, max: 210 },
      naps: { min: 2, max: 2, label: "2" },
      totalSleep: { min: 13, max: 14 },
      feeds: {
        interval: { min: 180, max: 240 },
        count: { min: 4, max: 6 },
        mlPerFeed: { min: 150, max: 240 },
        mlPerDay: { min: 600, max: 900 }
      }
    },
    {
      maxW: 56, label: "10-14m",
      ww: { min: 180, max: 240 },
      naps: { min: 1, max: 2, label: "1-2" },
      totalSleep: { min: 12, max: 14 },
      feeds: {
        interval: { min: 180, max: 300 },
        count: { min: 3, max: 5 },
        mlPerFeed: { min: 120, max: 240 },
        mlPerDay: { min: 500, max: 800 }
      }
    },
    {
      maxW: 104, label: "14-24m",
      ww: { min: 240, max: 360 },
      naps: { min: 1, max: 1, label: "1" },
      totalSleep: { min: 11, max: 14 },
      feeds: {
        interval: { min: 240, max: 300 },
        count: { min: 3, max: 4 },
        mlPerFeed: { min: 120, max: 240 },
        mlPerDay: { min: 400, max: 600 }
      }
    }
  ];

  function getGuideline(ageWeeks) {
    for (var i = 0; i < GUIDELINES.length; i++) {
      if (ageWeeks < GUIDELINES[i].maxW) return GUIDELINES[i];
    }
    return GUIDELINES[GUIDELINES.length - 1];
  }

  // Backward compat: old WW format
  var WW = GUIDELINES.map(function(g) {
    return { maxW: g.maxW, min: g.ww.min, max: g.ww.max, naps: g.naps.label };
  });

  // ════════════════════════════════════════════════════════
  // CORE ANALYSIS — analyzes ALL event types
  // ════════════════════════════════════════════════════════

  function analyze(allEntries, numDays, ageWeeks) {
    var today = todayStr();
    var g = ageWeeks != null ? getGuideline(ageWeeks) : GUIDELINES[0];

    // ── Collect per-day data ──
    var dayData = [];
    for (var d = 0; d < numDays; d++) {
      var date = dateOffset(today, -d);
      var de = allEntries.filter(function(e) { return e.date === date; });
      if (de.length === 0) continue;

      var weight = recencyWeight(d);

      // Wake time
      var wakeMin = null;
      var wk = de.find(function(e) { return e.type === "wakeup"; });
      if (wk) {
        wakeMin = toMinutes(wk.time);
      } else {
        var sl = de
          .filter(function(e) { return (e.type === "sleep" || e.type === "nap") && e.durationMin > 0; })
          .sort(function(a, b) { return a.time.localeCompare(b.time); });
        if (sl.length > 0) {
          var em = toMinutes(sl[0].time) + sl[0].durationMin;
          if (em >= 300 && em <= 720) wakeMin = em;
        }
      }

      // Naps
      var naps = de
        .filter(function(e) { return e.type === "nap" && e.durationMin > 0; })
        .sort(function(a, b) { return a.time.localeCompare(b.time); });

      // Feeds (bottle + nursing)
      var feeds = de
        .filter(function(e) { return e.type === "bottle" || e.type === "nursing"; })
        .sort(function(a, b) { return a.time.localeCompare(b.time); });

      // Bath
      var baths = de.filter(function(e) { return e.type === "bath"; });

      // Bedtime — v10.8.0: filtrar IDs terminando em "_b" para não contar metade pós-midnight
      // de um bedtime cross-midnight como noite separada (cada noite só entra uma vez no dayData).
      // v11.7.9: MERGE as duas metades antes de analisar, senão wakings pós-meia-noite somem.
      // Era bug silencioso pra newborns (bedtime 21h-06h → TODAS as wakings reais acontecem
      // pós-midnight → engine reportava "Avg 1 waking/night" quando na real eram 2-3).
      var bed = de.find(function(e) { return e.type === "sleep" && !(e.id||"").endsWith("_b"); });
      if (bed) {
        var bedSibling = null;
        for (var sbi = 0; sbi < allEntries.length; sbi++) {
          if (allEntries[sbi] && allEntries[sbi].id === bed.id + "_b") { bedSibling = allEntries[sbi]; break; }
        }
        if (bedSibling) {
          var mergedBed = {};
          for (var bkK in bed) mergedBed[bkK] = bed[bkK];
          mergedBed.durationMin = (bed.durationMin || 0) + (bedSibling.durationMin || 0);
          mergedBed.wakings = (bed.wakings || []).concat(bedSibling.wakings || []);
          bed = mergedBed;
        }
      }
      var bedMin = bed ? toMinutes(bed.time) : null;
      var nightTimeInBed = bed && bed.durationMin ? bed.durationMin : null;
      // Extract wakings and compute real sleep (time in bed minus awake time).
      // Two sources of wakings are combined:
      //   1. Explicit — user pressed "Night Wake" button during bedtime (bed.wakings array).
      //   2. Retroactive — bottle/nursing/diaper/medicine events timestamped inside the
      //      bedtime range but never explicitly linked via Night Wake. Mirrors the
      //      display logic in SleepBlock (index.html) so the analysis matches what
      //      the user actually sees in history.
      var explicitWakings = (bed && Array.isArray(bed.wakings)) ? bed.wakings.slice() : [];
      var retroWakings = [];
      if (bed && bed.durationMin) {
        var bedStartMs = new Date(bed.date + "T" + bed.time).getTime();
        var bedEndMs = bedStartMs + bed.durationMin * 60000;
        if (!isNaN(bedStartMs)) {
          var linkedIds = {};
          for (var ewi = 0; ewi < explicitWakings.length; ewi++) {
            var evs = explicitWakings[ewi].events || [];
            for (var evi = 0; evi < evs.length; evi++) linkedIds[evs[evi]] = true;
          }
          var EXCLUDED_RETRO = { sleep: 1, nap: 1, wakeup: 1, nightwaking: 1, growth: 1 };
          // v11.8.6: cluster + boundary grace pra n\u00e3o inflar count com eventos que n\u00e3o
          // s\u00e3o wakings de verdade (mamada right before bedtime acabar, log retroativo sem
          // tap Night Wake mas pr\u00f3ximo de uma waking explicita, etc).
          var CLUSTER_MS = 30 * 60 * 1000;       // eventos a <=30min de uma waking j\u00e1 contada: agregam nela
          var BOUNDARY_GRACE_MS = 15 * 60 * 1000; // 15min near bed start/end: considera wind-down/wake-up feed
          // Pre-compute absolute timestamps das explicitWakings (cross-midnight aware).
          var explicitWakingMs = [];
          for (var ewMi = 0; ewMi < explicitWakings.length; ewMi++) {
            var ewM = explicitWakings[ewMi];
            if (!ewM || !ewM.time) continue;
            var ewMsCandidate = new Date(bed.date + "T" + ewM.time).getTime();
            if (isNaN(ewMsCandidate)) continue;
            // Se o horario ta antes do bed.time (ex: waking 01:47 para bed 21:00), rolou pra next day
            if (ewMsCandidate < bedStartMs) ewMsCandidate += 24 * 60 * 60 * 1000;
            explicitWakingMs.push(ewMsCandidate);
          }
          for (var aei = 0; aei < allEntries.length; aei++) {
            var aev = allEntries[aei];
            if (!aev || EXCLUDED_RETRO[aev.type]) continue;
            if (aev.id === bed.id || linkedIds[aev.id]) continue;
            if (!aev.date || !aev.time) continue;
            var aevMs = new Date(aev.date + "T" + aev.time).getTime();
            if (isNaN(aevMs)) continue;
            if (aevMs < bedStartMs || aevMs > bedEndMs) continue;
            // Boundary grace: eventos muito pr\u00f3ximos do inicio/fim do bedtime s\u00e3o wind-down/wake-up feeds.
            if (aevMs - bedStartMs < BOUNDARY_GRACE_MS) continue;
            if (bedEndMs - aevMs < BOUNDARY_GRACE_MS) continue;
            // Cluster: se ja existe uma waking (explicita ou retro) a <=30min, n\u00e3o cria nova.
            var clustered = false;
            for (var cwi = 0; cwi < explicitWakingMs.length; cwi++) {
              if (Math.abs(aevMs - explicitWakingMs[cwi]) <= CLUSTER_MS) { clustered = true; break; }
            }
            if (!clustered) {
              for (var rwi = 0; rwi < retroWakings.length; rwi++) {
                var rwT = retroWakings[rwi].time;
                var rwMs = new Date(bed.date + "T" + rwT).getTime();
                if (rwMs < bedStartMs) rwMs += 24 * 60 * 60 * 1000;
                if (Math.abs(aevMs - rwMs) <= CLUSTER_MS) { clustered = true; break; }
              }
            }
            if (clustered) continue;
            // Novo retro waking.
            retroWakings.push({ time: aev.time, durationMin: 0, events: [aev.id] });
          }
        }
      }
      var nightWakings = explicitWakings.concat(retroWakings);
      // Night is "tracked" if user either pressed Night Wake OR there's at least one
      // retroactive event inside the bedtime window. Both signal real baby activity.
      var hasWakingsTracking = !!bed && (nightWakings.length > 0 || Array.isArray(bed.wakings));
      // awakeMin intentionally uses only explicit wakings — retro events lack duration.
      var awakeMin = explicitWakings.reduce(function(s, w) { return s + (w.durationMin || 0); }, 0);
      var nightSleepMin = nightTimeInBed != null ? Math.max(0, nightTimeInBed - awakeMin) : null;

      // Diapers
      var diapers = de.filter(function(e) { return e.type === "diaper"; });

      // Total nap minutes this day
      var napTotalMin = naps.reduce(function(s, n) { return s + (n.durationMin || 0); }, 0);

      dayData.push({
        date: date,
        daysAgo: d,
        weight: weight,
        wakeMin: wakeMin,
        naps: naps,
        napCount: naps.length,
        napTotalMin: napTotalMin,
        nightSleepMin: nightSleepMin,
        nightTimeInBed: nightTimeInBed,
        nightWakings: nightWakings,
        nightWakingsCount: nightWakings.length,
        hasWakingsTracking: hasWakingsTracking,
        nightAwakeMin: awakeMin,
        totalSleepMin: napTotalMin + (nightSleepMin || 0),
        feeds: feeds,
        feedCount: feeds.length,
        baths: baths,
        bedMin: bedMin,
        diapers: diapers,
        diapersCount: diapers.length
      });
    }

    if (dayData.length < 1) return null;

    // ═══════════════════════════
    // SLEEP ANALYSIS
    // ═══════════════════════════

    var sleepDays = dayData.filter(function(dd) {
      return dd.wakeMin != null && dd.napCount > 0;
    });

    // Wake windows by nap position (recency-weighted)
    var maxPos = sleepDays.length > 0
      ? Math.max.apply(null, sleepDays.map(function(dd) { return dd.napCount; }))
      : 0;

    var positions = [];
    for (var p = 1; p <= Math.min(maxPos, 8); p++) {
      var wwVals = [], wwWeights = [], durVals = [], durWeights = [];

      for (var si = 0; si < sleepDays.length; si++) {
        var dd = sleepDays[si];
        if (!dd.wakeMin) continue;

        var prev = dd.wakeMin;
        var sortedNaps = dd.naps.slice().sort(function(a, b) { return a.time.localeCompare(b.time); });

        for (var ni = 0; ni < sortedNaps.length; ni++) {
          if (ni + 1 === p) {
            var ns = toMinutes(sortedNaps[ni].time);
            var ww = ns - prev;
            var dur = sortedNaps[ni].durationMin;
            if (ww > 0 && ww < 600) {
              wwVals.push(ww);
              wwWeights.push(dd.weight);
              durVals.push(dur);
              durWeights.push(dd.weight);
            }
            break;
          }
          prev = toMinutes(sortedNaps[ni].time) + sortedNaps[ni].durationMin;
        }
      }

      if (wwVals.length >= 2) {
        var avgWW = weightedAvg(wwVals, wwWeights);
        var avgDur = weightedAvg(durVals, durWeights);

        positions.push({
          pos: p,
          avgWW: avgWW,
          minWW: Math.min.apply(null, wwVals),
          maxWW: Math.max.apply(null, wwVals),
          medianWW: median(wwVals),
          avgDur: avgDur,
          minDur: Math.min.apply(null, durVals),
          maxDur: Math.max.apply(null, durVals),
          pts: wwVals.length
        });
      }
    }

    // Bedtime wake window (recency-weighted)
    var bedWWVals = [], bedWWWeights = [];
    for (var bi = 0; bi < sleepDays.length; bi++) {
      var bdd = sleepDays[bi];
      if (!bdd.bedMin || bdd.napCount === 0) continue;
      var lastNap = bdd.naps.slice().sort(function(a, b) { return b.time.localeCompare(a.time); })[0];
      if (!lastNap) continue;
      var lastNapEnd = toMinutes(lastNap.time) + lastNap.durationMin;
      var bww = bdd.bedMin - lastNapEnd;
      if (bww > 0 && bww < 600) {
        bedWWVals.push(bww);
        bedWWWeights.push(bdd.weight);
      }
    }
    var avgBedWW = bedWWVals.length >= 2 ? weightedAvg(bedWWVals, bedWWWeights) : null;

    // Average naps per day
    var napCounts = sleepDays.map(function(dd) { return dd.napCount; });
    var avgNaps = napCounts.length > 0
      ? Math.round(napCounts.reduce(function(s, v) { return s + v; }, 0) / napCounts.length * 10) / 10
      : 0;

    // Total nap sleep per day (weighted)
    var totalNapVals = [], totalNapWeights = [];
    for (var ti = 0; ti < sleepDays.length; ti++) {
      var tdd = sleepDays[ti];
      var tot = tdd.naps.reduce(function(s, n) { return s + n.durationMin; }, 0);
      totalNapVals.push(tot);
      totalNapWeights.push(tdd.weight);
    }
    var avgTotalSleep = totalNapVals.length > 0 ? weightedAvg(totalNapVals, totalNapWeights) : 0;

    // Overall WW average (across all positions, for backward compat)
    var allWWVals = [], allWWWeights = [];
    for (var pi = 0; pi < positions.length; pi++) {
      // Use position averages weighted by data points
      allWWVals.push(positions[pi].avgWW);
      allWWWeights.push(positions[pi].pts);
    }
    var overallAvgWW = allWWVals.length > 0 ? weightedAvg(allWWVals, allWWWeights) : null;

    // ═══════════════════════════
    // NIGHT SLEEP ANALYSIS
    // ═══════════════════════════

    var nightVals = [], nightWeights = [];
    var totalDailyVals = [], totalDailyWeights = [];
    for (var ni2 = 0; ni2 < dayData.length; ni2++) {
      var ndd = dayData[ni2];
      if (ndd.nightSleepMin && ndd.nightSleepMin > 60) {
        nightVals.push(ndd.nightSleepMin);
        nightWeights.push(ndd.weight);
      }
      if (ndd.totalSleepMin > 0 && ndd.nightSleepMin) {
        totalDailyVals.push(ndd.totalSleepMin);
        totalDailyWeights.push(ndd.weight);
      }
    }

    var nightSleepAnalysis = {
      avgDuration: nightVals.length >= 2 ? weightedAvg(nightVals, nightWeights) : null,
      minDuration: nightVals.length >= 2 ? Math.min.apply(null, nightVals) : null,
      maxDuration: nightVals.length >= 2 ? Math.max.apply(null, nightVals) : null,
      pts: nightVals.length
    };

    var totalDailySleep = {
      avg: totalDailyVals.length >= 2 ? weightedAvg(totalDailyVals, totalDailyWeights) : null,
      min: totalDailyVals.length >= 2 ? Math.min.apply(null, totalDailyVals) : null,
      max: totalDailyVals.length >= 2 ? Math.max.apply(null, totalDailyVals) : null,
      pts: totalDailyVals.length
    };

    // ═══════════════════════════
    // WAKINGS ANALYSIS
    // ═══════════════════════════

    var wakingCounts = [], wakingCountWeights = [];
    var allWakingTimes = []; // minutes from 0-1440 (treating post-midnight as +1440)
    var allWakingDurations = [];
    var wakingTypeCounter = { feed: 0, diaper: 0, other: 0 };
    var nightsWithData = 0; // nights where Night Wake was used (explicit tracking)
    var nightsWithSleepNoTracking = 0; // nights with sleep registered but no Night Wake usage

    for (var wi2 = 0; wi2 < dayData.length; wi2++) {
      var wdd = dayData[wi2];
      // Only count nights where the user explicitly used Night Wake (wakings array exists).
      // Otherwise, "0 wakings" would be a false positive caused by the user not tracking
      // (e.g. "Sleeping through the night" insight on a 1-month-old, which is impossible).
      if (wdd.nightTimeInBed != null && wdd.nightTimeInBed > 60) {
        if (!wdd.hasWakingsTracking) {
          nightsWithSleepNoTracking++;
          continue;
        }
        nightsWithData++;
        wakingCounts.push(wdd.nightWakingsCount);
        wakingCountWeights.push(wdd.weight);

        var sleepStartMin = wdd.bedMin || 1320; // fallback 22:00
        for (var wk = 0; wk < wdd.nightWakings.length; wk++) {
          var wkg = wdd.nightWakings[wk];
          if (!wkg.time) continue;
          var wkgMin = toMinutes(wkg.time);
          // Cross-midnight: if waking time is before sleep start, add 1440
          if (wkgMin < sleepStartMin) wkgMin += 1440;
          allWakingTimes.push(wkgMin % 1440); // store as 0-1440
          allWakingDurations.push(wkg.durationMin || 0);

          // Classify by linked events (or fallback to 'other')
          var linkedIds = wkg.events || [];
          var hasFeed = false, hasDiaper = false;
          for (var li = 0; li < linkedIds.length; li++) {
            var linked = allEntries.find(function(e) { return e.id === linkedIds[li]; });
            if (!linked) continue;
            if (linked.type === "bottle" || linked.type === "nursing") hasFeed = true;
            if (linked.type === "diaper") hasDiaper = true;
          }
          if (hasFeed) wakingTypeCounter.feed++;
          else if (hasDiaper) wakingTypeCounter.diaper++;
          else wakingTypeCounter.other++;
        }
      }
    }

    // Find most common waking time (cluster within ±30min)
    var mostCommonWakingTime = null;
    if (allWakingTimes.length >= 3) {
      var bestCluster = { center: null, count: 0 };
      for (var ci = 0; ci < allWakingTimes.length; ci++) {
        var center = allWakingTimes[ci];
        var count = 0;
        for (var cj = 0; cj < allWakingTimes.length; cj++) {
          var diff = Math.abs(allWakingTimes[cj] - center);
          // Handle wrap-around (e.g. 23:50 vs 00:10)
          if (diff > 720) diff = 1440 - diff;
          if (diff <= 30) count++;
        }
        if (count > bestCluster.count) bestCluster = { center: center, count: count };
      }
      if (bestCluster.count >= Math.max(2, Math.floor(allWakingTimes.length * 0.5))) {
        mostCommonWakingTime = bestCluster.center;
      }
    }

    // Determine most common waking type
    var totalTyped = wakingTypeCounter.feed + wakingTypeCounter.diaper + wakingTypeCounter.other;
    var mostCommonType = null, mostCommonPct = 0;
    if (totalTyped >= 2) {
      var types = ["feed", "diaper", "other"];
      for (var ti2 = 0; ti2 < types.length; ti2++) {
        var pct = wakingTypeCounter[types[ti2]] / totalTyped;
        if (pct > mostCommonPct) {
          mostCommonPct = pct;
          mostCommonType = types[ti2];
        }
      }
    }

    // Trend: compare wakings in recent half vs older half
    var wakingTrend = null;
    if (wakingCounts.length >= 4) {
      var half = Math.floor(wakingCounts.length / 2);
      var recentAvg = wakingCounts.slice(0, half).reduce(function(s, v) { return s + v; }, 0) / half;
      var olderAvg = wakingCounts.slice(half).reduce(function(s, v) { return s + v; }, 0) / (wakingCounts.length - half);
      if (olderAvg > 0 && Math.abs(recentAvg - olderAvg) >= 0.5) {
        wakingTrend = recentAvg < olderAvg ? "improving" : "worsening";
      }
    }

    var wakingsAnalysis = {
      avgPerNight: wakingCounts.length >= 2
        ? Math.round(weightedAvg(wakingCounts, wakingCountWeights) * 10) / 10
        : null,
      totalWakings: allWakingTimes.length,
      nightsAnalyzed: nightsWithData,
      avgDuration: allWakingDurations.length >= 2
        ? Math.round(allWakingDurations.reduce(function(s, v) { return s + v; }, 0) / allWakingDurations.length)
        : null,
      mostCommonTime: mostCommonWakingTime,
      mostCommonType: mostCommonType,
      mostCommonTypePct: Math.round(mostCommonPct * 100),
      trend: wakingTrend,
      pts: wakingCounts.length
    };

    // ═══════════════════════════
    // FEED ANALYSIS
    // ═══════════════════════════

    var feedIntervals = [], feedIntervalWeights = [];
    var feedCounts = [], feedMlTotals = [], feedMlPer = [];

    for (var fi = 0; fi < dayData.length; fi++) {
      var fdd = dayData[fi];
      if (fdd.feedCount >= 2) {
        feedCounts.push(fdd.feedCount);
        // Calculate intervals between consecutive feeds
        for (var fj = 1; fj < fdd.feeds.length; fj++) {
          var gap = toMinutes(fdd.feeds[fj].time) - toMinutes(fdd.feeds[fj - 1].time);
          if (gap > 15 && gap < 600) {
            feedIntervals.push(gap);
            feedIntervalWeights.push(fdd.weight);
          }
        }
      }
      // Daily ml total
      var dayMl = fdd.feeds.reduce(function(s, f) { return s + (f.ml || 0); }, 0);
      if (dayMl > 0) feedMlTotals.push(dayMl);
      fdd.feeds.forEach(function(f) { if (f.ml) feedMlPer.push(f.ml); });
    }

    var feedAnalysis = {
      avgInterval: feedIntervals.length >= 3
        ? weightedAvg(feedIntervals, feedIntervalWeights)
        : null,
      minInterval: feedIntervals.length >= 3
        ? Math.min.apply(null, feedIntervals)
        : null,
      maxInterval: feedIntervals.length >= 3
        ? Math.max.apply(null, feedIntervals)
        : null,
      avgCount: feedCounts.length >= 2
        ? Math.round(feedCounts.reduce(function(s, v) { return s + v; }, 0) / feedCounts.length * 10) / 10
        : null,
      avgMlPerDay: feedMlTotals.length >= 2
        ? Math.round(feedMlTotals.reduce(function(s, v) { return s + v; }, 0) / feedMlTotals.length)
        : null,
      avgMlPerFeed: feedMlPer.length >= 3
        ? Math.round(feedMlPer.reduce(function(s, v) { return s + v; }, 0) / feedMlPer.length)
        : null,
      pts: feedIntervals.length
    };

    // ── Feed-before-nap correlation ──
    var feedBeforeNap = 0, napTotal = 0;
    for (var cn = 0; cn < sleepDays.length; cn++) {
      var cdd = sleepDays[cn];
      for (var cni = 0; cni < cdd.naps.length; cni++) {
        napTotal++;
        var napStart = toMinutes(cdd.naps[cni].time);
        // Was there a feed 5-30 min before this nap?
        var hadFeed = cdd.feeds.some(function(f) {
          var feedEnd = toMinutes(f.time) + (f.durationMin || 15);
          return (napStart - feedEnd >= 0) && (napStart - feedEnd <= 30);
        });
        if (hadFeed) feedBeforeNap++;
      }
    }
    feedAnalysis.preNapPct = napTotal >= 3
      ? Math.round(feedBeforeNap / napTotal * 100)
      : null;

    // ═══════════════════════════
    // BATH ANALYSIS
    // ═══════════════════════════

    var bathBeforeBed = [], bathToBedGaps = [], bathTimes = [], bathWeights = [];
    for (var bai = 0; bai < dayData.length; bai++) {
      var badd = dayData[bai];
      if (badd.baths.length > 0) {
        var lastBath = badd.baths.slice().sort(function(a, b) {
          return b.time.localeCompare(a.time);
        })[0];
        var bathMin = toMinutes(lastBath.time);
        bathTimes.push(bathMin);
        bathWeights.push(badd.weight);
        if (badd.bedMin) {
          var bathToBed = badd.bedMin - bathMin;
          if (bathToBed > 0 && bathToBed < 300) {
            bathBeforeBed.push(badd.date);
            bathToBedGaps.push(bathToBed);
          }
        }
      }
    }

    var bathAnalysis = {
      avgTime: bathTimes.length >= 2 ? weightedAvg(bathTimes, bathWeights) : null,
      avgBeforeBed: bathToBedGaps.length >= 2
        ? Math.round(bathToBedGaps.reduce(function(s, v) { return s + v; }, 0) / bathToBedGaps.length)
        : null,
      correlation: bathBeforeBed.length,
      daysWithBath: dayData.filter(function(dd) { return dd.baths.length > 0; }).length,
      pts: bathToBedGaps.length
    };

    // ═══════════════════════════
    // WAKE TIME CONSISTENCY
    // ═══════════════════════════

    var wakeTimes = [], wakeWeights = [];
    for (var wi = 0; wi < dayData.length; wi++) {
      if (dayData[wi].wakeMin != null) {
        wakeTimes.push(dayData[wi].wakeMin);
        wakeWeights.push(dayData[wi].weight);
      }
    }

    var wakeAnalysis = {
      avgTime: wakeTimes.length >= 2 ? weightedAvg(wakeTimes, wakeWeights) : null,
      minTime: wakeTimes.length >= 2 ? Math.min.apply(null, wakeTimes) : null,
      maxTime: wakeTimes.length >= 2 ? Math.max.apply(null, wakeTimes) : null,
      consistency: wakeTimes.length >= 3
        ? Math.round(100 - (Math.max.apply(null, wakeTimes) - Math.min.apply(null, wakeTimes)) / 3)
        : null,
      pts: wakeTimes.length
    };

    // ═══════════════════════════
    // BEDTIME ANALYSIS
    // ═══════════════════════════

    var bedTimes = [], bedWeights = [];
    for (var bei = 0; bei < dayData.length; bei++) {
      if (dayData[bei].bedMin != null) {
        bedTimes.push(dayData[bei].bedMin);
        bedWeights.push(dayData[bei].weight);
      }
    }

    var bedtimeAnalysis = {
      avgTime: bedTimes.length >= 2 ? weightedAvg(bedTimes, bedWeights) : null,
      minTime: bedTimes.length >= 2 ? Math.min.apply(null, bedTimes) : null,
      maxTime: bedTimes.length >= 2 ? Math.max.apply(null, bedTimes) : null,
      pts: bedTimes.length
    };

    // ═══════════════════════════
    // CONFIDENCE SCORE
    // ═══════════════════════════
    // 0-100: how much the engine trusts its predictions
    // Based on: days analyzed, data completeness, consistency

    var dataScore = Math.min(100, sleepDays.length * 15); // 0-100, saturates at ~7 days
    var consistencyScore = wakeAnalysis.consistency || 50;
    var confidence = Math.round(dataScore * 0.6 + consistencyScore * 0.4);

    return {
      daysAnalyzed: dayData.length,
      daysWithSleep: sleepDays.length,
      confidence: confidence,
      ageWeeks: ageWeeks != null ? ageWeeks : null,

      sleep: {
        positions: positions,
        avgNaps: avgNaps,
        avgBedWW: avgBedWW,
        avgTotalSleep: avgTotalSleep,
        overallAvgWW: overallAvgWW,
        nightSleep: nightSleepAnalysis,
        totalDaily: totalDailySleep,
        wakings: wakingsAnalysis
      },

      feeds: feedAnalysis,
      bath: bathAnalysis,
      wake: wakeAnalysis,
      bedtime: bedtimeAnalysis,

      // Backward compat fields (flat)
      days: sleepDays.length,
      positions_compat: positions, // alias
      avgNaps_compat: avgNaps
    };
  }

  // ════════════════════════════════════════════════════════
  // STATUS — 5 states for the ring
  // ════════════════════════════════════════════════════════
  //
  // States:
  //   calm      — well within range (0-70% of target)
  //   opening   — approaching min observed WW (70-85%)
  //   sweet     — ideal window, between min and avg (85-100%)
  //   stretching — past avg, approaching max (100-115%)
  //   overdue   — beyond max observed (>115%)
  //
  // The target is position-specific when available,
  // otherwise falls back to overall avg, then guideline.

  function getStatus(elapsed, pattern, napPos, ageWeeks) {
    var g = getGuideline(ageWeeks || 0);
    var guidelineMid = (g.ww.min + g.ww.max) / 2;

    // Determine target range for this specific nap position
    var target = { min: g.ww.min, avg: guidelineMid, max: g.ww.max };
    var confidence = "guideline";
    var dataPoints = 0;

    if (pattern && pattern.sleep) {
      // Try position-specific data first
      var posData = null;
      if (napPos && pattern.sleep.positions) {
        posData = pattern.sleep.positions.find(function(p) { return p.pos === napPos; });
      }

      if (posData && posData.pts >= 2) {
        // Blend position data with guideline
        target.min = blend(posData.minWW, g.ww.min, posData.pts, 5);
        target.avg = blend(posData.avgWW, guidelineMid, posData.pts, 5);
        target.max = blend(posData.maxWW, g.ww.max, posData.pts, 5);
        dataPoints = posData.pts;
        confidence = dataPoints >= 5 ? "learned" : "blended";
      } else if (pattern.sleep.overallAvgWW) {
        // Fallback to overall average
        var pts = pattern.sleep.positions.reduce(function(s, p) { return s + p.pts; }, 0);
        target.avg = blend(pattern.sleep.overallAvgWW, guidelineMid, pts, 5);
        // Estimate min/max from avg
        target.min = Math.round(target.avg * 0.75);
        target.max = Math.round(target.avg * 1.3);
        dataPoints = pts;
        confidence = "blended";
      }
    }

    // Calculate state based on elapsed time vs target range
    var prog = target.avg > 0 ? elapsed / target.avg : 0;
    var state, rem;

    if (elapsed < target.min * 0.85) {
      state = "calm";
      rem = Math.max(0, Math.round(target.avg - elapsed));
    } else if (elapsed < target.min) {
      state = "opening";
      rem = Math.max(0, Math.round(target.avg - elapsed));
    } else if (elapsed <= target.avg) {
      state = "sweet";
      rem = Math.max(0, Math.round(target.avg - elapsed));
    } else if (elapsed <= target.max) {
      state = "stretching";
      rem = 0;
    } else {
      state = "overdue";
      rem = 0;
    }

    return {
      state: state,
      el: elapsed,
      target: target,
      rem: rem,
      prog: Math.min(1.3, prog), // allow >1 for stretching/overdue visual

      // Backward compat: wind = opening|sweet, over = stretching|overdue
      wind: state === "opening" || state === "sweet",
      over: state === "stretching" || state === "overdue",

      napPos: napPos,
      confidence: confidence,
      dataPoints: dataPoints
    };
  }

  // ════════════════════════════════════════════════════════
  // PREDICT — full day schedule (naps + feeds + bath + bed)
  // ════════════════════════════════════════════════════════

  function predict(todayEntries, pattern, wakeMin, ageWeeks) {
    if (!pattern) return [];

    var g = getGuideline(ageWeeks || 0);
    var sched = [];

    // ── Nap schedule ──
    var doneNaps = todayEntries
      .filter(function(e) { return e.type === "nap" && e.durationMin > 0; })
      .sort(function(a, b) { return a.time.localeCompare(b.time); });

    var cursor = wakeMin;
    var napPositions = pattern.sleep ? pattern.sleep.positions : [];
    var numPositions = napPositions.length > 0
      ? napPositions.length
      : Math.round((g.naps.min + g.naps.max) / 2);

    for (var i = 0; i < Math.max(napPositions.length, numPositions); i++) {
      var posData = napPositions[i] || null;

      if (i < doneNaps.length) {
        // Already happened
        var ns = toMinutes(doneNaps[i].time);
        var dur = doneNaps[i].durationMin;
        sched.push({
          type: "nap",
          pos: i + 1,
          timeMin: ns,
          duration: dur,
          ww: ns - cursor,
          status: "done",
          confidence: 1
        });
        cursor = ns + dur;
      } else {
        // Predicted
        var predWW = posData
          ? blend(posData.avgWW, (g.ww.min + g.ww.max) / 2, posData.pts, 5)
          : (g.ww.min + g.ww.max) / 2;
        var predDur = posData
          ? posData.avgDur
          : Math.round(pattern.sleep.avgTotalSleep / (pattern.sleep.avgNaps || 4));
        var predTime = cursor + predWW;

        var conf = posData ? Math.min(1, posData.pts / 5) : 0.3;
        sched.push({
          type: "nap",
          pos: i + 1,
          timeMin: predTime,
          duration: predDur,
          ww: predWW,
          durRange: posData ? posData.minDur + "-" + posData.maxDur + "min" : null,
          status: i === doneNaps.length ? "next" : "later",
          confidence: conf
        });
        cursor = predTime + predDur;
      }
    }

    // ── Bedtime ──
    var bedWW = pattern.sleep.avgBedWW;
    if (!bedWW && g.ww) {
      bedWW = Math.round((g.ww.min + g.ww.max) / 2 * 1.15); // bedtime WW is usually ~15% longer
    }
    if (bedWW) {
      var bedDone = todayEntries.find(function(e) { return e.type === "sleep"; });
      sched.push({
        type: "sleep",
        pos: 0,
        timeMin: bedDone ? toMinutes(bedDone.time) : cursor + bedWW,
        duration: 0,
        ww: bedWW,
        status: bedDone ? "done" : (doneNaps.length >= napPositions.length ? "next" : "later"),
        bed: true,
        confidence: pattern.bedtime.pts >= 3 ? 0.8 : 0.4
      });
    }

    // ── Feed predictions ──
    if (pattern.feeds && pattern.feeds.avgInterval) {
      var doneFeeds = todayEntries
        .filter(function(e) { return e.type === "bottle" || e.type === "nursing"; })
        .sort(function(a, b) { return a.time.localeCompare(b.time); });

      // Find last feed time
      var lastFeedMin = null;
      if (doneFeeds.length > 0) {
        var lastFeed = doneFeeds[doneFeeds.length - 1];
        lastFeedMin = toMinutes(lastFeed.time) + (lastFeed.durationMin || 0);
      } else {
        lastFeedMin = wakeMin;
      }

      // Predict next 2-3 feeds
      var feedCursor = lastFeedMin;
      var endOfDay = pattern.bedtime.avgTime || 1200; // default 20:00
      var feedNum = 0;
      while (feedCursor + pattern.feeds.avgInterval < endOfDay + 60 && feedNum < 3) {
        var nextFeedMin = feedCursor + pattern.feeds.avgInterval;
        if (nextFeedMin <= toMinutes(todayStr().split("T")[0] || "23:59")) {
          feedCursor = nextFeedMin;
          feedNum++;
          continue; // skip past feeds
        }
        sched.push({
          type: "feed",
          timeMin: nextFeedMin,
          duration: 15, // avg feed duration
          status: feedNum === 0 ? "next" : "later",
          confidence: Math.min(1, pattern.feeds.pts / 8),
          interval: pattern.feeds.avgInterval
        });
        feedCursor = nextFeedMin;
        feedNum++;
      }
    }

    // ── Bath prediction ──
    if (pattern.bath && pattern.bath.avgBeforeBed && pattern.bath.pts >= 2) {
      var bedTimeEst = pattern.bedtime.avgTime || 1200;
      var bathTime = bedTimeEst - pattern.bath.avgBeforeBed;
      var bathDone = todayEntries.find(function(e) { return e.type === "bath"; });

      sched.push({
        type: "bath",
        timeMin: bathDone ? toMinutes(bathDone.time) : bathTime,
        duration: 15,
        status: bathDone ? "done" : "later",
        confidence: Math.min(1, pattern.bath.pts / 4),
        beforeBed: pattern.bath.avgBeforeBed
      });
    }

    // Sort by time
    sched.sort(function(a, b) { return a.timeMin - b.timeMin; });

    return sched;
  }

  // ════════════════════════════════════════════════════════
  // INSIGHTS — intelligent observations
  // ════════════════════════════════════════════════════════

  function getInsights(entries, todayEntries, pattern, ageWeeks, lang) {
    if (!pattern) return [];
    var l = lang || "pt";
    var hints = [];
    var g = getGuideline(ageWeeks || 0);

    // ── 1. Wake time consistency ──
    if (pattern.wake && pattern.wake.consistency != null) {
      var spread = (pattern.wake.maxTime || 0) - (pattern.wake.minTime || 0);
      if (spread <= 45 && pattern.wake.pts >= 4) {
        hints.push({
          type: "good",
          icon: "sunrise",
          title: l === "en" ? "Consistent wake time" : "Horario de acordar consistente",
          desc: l === "en"
            ? "Wakes between " + minToTime(pattern.wake.minTime) + "-" + minToTime(pattern.wake.maxTime) + " (" + pattern.wake.pts + " days). A routine is forming!"
            : "Acorda entre " + minToTime(pattern.wake.minTime) + "-" + minToTime(pattern.wake.maxTime) + " (" + pattern.wake.pts + " dias). Rotina se formando!"
        });
      } else if (spread > 90 && pattern.wake.pts >= 4) {
        hints.push({
          type: "info",
          icon: "sunrise",
          title: l === "en" ? "Variable wake time" : "Horario de acordar variavel",
          desc: l === "en"
            ? "Wake varies " + fmtDur(spread) + " between days. Normal for this age."
            : "Acordar varia " + fmtDur(spread) + " entre dias. Normal pra essa idade."
        });
      }
    }

    // ── 2. Feed-before-nap correlation ──
    if (pattern.feeds && pattern.feeds.preNapPct != null && pattern.feeds.preNapPct >= 60) {
      hints.push({
        type: "good",
        icon: "bottle",
        title: l === "en" ? "Feed-nap pattern" : "Padrao mamada-soneca",
        desc: l === "en"
          ? pattern.feeds.preNapPct + "% of naps have a feed 5-30min before. The engine uses this in predictions."
          : pattern.feeds.preNapPct + "% das sonecas tem mamada 5-30min antes. O engine considera isso."
      });
    }

    // ── 3. Bath-bedtime correlation ──
    if (pattern.bath && pattern.bath.avgBeforeBed && pattern.bath.pts >= 2) {
      hints.push({
        type: "good",
        icon: "bath",
        title: l === "en" ? "Bath = bedtime signal" : "Banho = sinal de sono",
        desc: l === "en"
          ? "Night sleep starts ~" + fmtDur(pattern.bath.avgBeforeBed) + " after bath (" + pattern.bath.pts + " days). Bath is part of the routine."
          : "Sono noturno comeca ~" + fmtDur(pattern.bath.avgBeforeBed) + " apos banho (" + pattern.bath.pts + " dias). Banho faz parte da rotina."
      });
    }

    // ── 4. WW progression through the day ──
    if (pattern.sleep && pattern.sleep.positions.length >= 2) {
      var firstPos = pattern.sleep.positions[0];
      var lastPos = pattern.sleep.positions[pattern.sleep.positions.length - 1];
      if (firstPos && lastPos && lastPos.avgWW > firstPos.avgWW + 10) {
        hints.push({
          type: "info",
          icon: "clock",
          title: l === "en" ? "WW grows through the day" : "Janela cresce ao longo do dia",
          desc: l === "en"
            ? "WW1 (morning): " + fmtDur(firstPos.avgWW) + " vs WW" + lastPos.pos + " (afternoon): " + fmtDur(lastPos.avgWW) + ". Normal — babies handle more awake time later."
            : "WW1 (manha): " + fmtDur(firstPos.avgWW) + " vs WW" + lastPos.pos + " (tarde): " + fmtDur(lastPos.avgWW) + ". Normal — bebes aguentam mais a tarde."
        });
      }
    }

    // ── 5. Today shorter naps warning ──
    if (todayEntries && pattern.sleep) {
      var todayNaps = todayEntries.filter(function(e) { return e.type === "nap" && e.durationMin > 0; });
      var todayNapTotal = todayNaps.reduce(function(s, e) { return s + e.durationMin; }, 0);
      if (todayNaps.length >= 2) {
        var todayAvgDur = Math.round(todayNapTotal / todayNaps.length);
        var usualAvgDur = pattern.sleep.avgNaps > 0
          ? Math.round(pattern.sleep.avgTotalSleep / pattern.sleep.avgNaps)
          : 0;
        if (usualAvgDur > 0 && todayAvgDur < usualAvgDur * 0.7) {
          hints.push({
            type: "warn",
            icon: "alert",
            title: l === "en" ? "Shorter naps today" : "Sonecas mais curtas hoje",
            desc: l === "en"
              ? "Avg " + todayAvgDur + "min vs usual " + usualAvgDur + "min. May need an extra nap or earlier bedtime."
              : "Media " + todayAvgDur + "min vs usual " + usualAvgDur + "min. Pode precisar de uma soneca extra ou dormir mais cedo."
          });
        }
      }

      // Great sleep day
      if (todayNaps.length >= Math.floor(pattern.sleep.avgNaps) && todayNapTotal >= pattern.sleep.avgTotalSleep * 0.85) {
        hints.push({
          type: "good",
          icon: "star",
          title: l === "en" ? "Great sleep day!" : "Otimo dia de sono!",
          desc: l === "en"
            ? todayNaps.length + " naps, " + fmtDur(todayNapTotal) + " total sleep."
            : todayNaps.length + " sonecas, " + fmtDur(todayNapTotal) + " total de sono."
        });
      }
    }

    // ── 6. Louise vs guideline comparison ──
    if (pattern.sleep && pattern.sleep.overallAvgWW) {
      var guideMid = (g.ww.min + g.ww.max) / 2;
      var diff = pattern.sleep.overallAvgWW - guideMid;
      if (Math.abs(diff) > 10) {
        hints.push({
          type: "info",
          icon: "research",
          title: l === "en"
            ? "WW vs " + g.label + " guideline"
            : "Janela vs guideline " + g.label,
          desc: l === "en"
            ? "Avg WW: " + fmtDur(pattern.sleep.overallAvgWW) + " (guideline: " + g.ww.min + "-" + g.ww.max + "min). " + (diff > 0 ? "Slightly above — every baby is different." : "Slightly below — may be a sleepy phase.")
            : "Janela media: " + fmtDur(pattern.sleep.overallAvgWW) + " (guideline: " + g.ww.min + "-" + g.ww.max + "min). " + (diff > 0 ? "Acima — cada bebe e diferente." : "Abaixo — pode ser uma fase de mais sono.")
        });
      }
    }

    // ── 7. Feed interval vs guideline ──
    if (pattern.feeds && pattern.feeds.avgInterval) {
      var feedGuideMid = (g.feeds.interval.min + g.feeds.interval.max) / 2;
      var feedDiff = pattern.feeds.avgInterval - feedGuideMid;
      if (Math.abs(feedDiff) > 20 && pattern.feeds.pts >= 5) {
        hints.push({
          type: "info",
          icon: "bottle",
          title: l === "en"
            ? "Feed interval vs guideline"
            : "Intervalo mamada vs guideline",
          desc: l === "en"
            ? "Avg interval: " + fmtDur(pattern.feeds.avgInterval) + " (guideline: " + fmtDur(g.feeds.interval.min) + "-" + fmtDur(g.feeds.interval.max) + ")."
            : "Intervalo medio: " + fmtDur(pattern.feeds.avgInterval) + " (guideline: " + fmtDur(g.feeds.interval.min) + "-" + fmtDur(g.feeds.interval.max) + ")."
        });
      }
    }

    return hints;
  }

  // ════════════════════════════════════════════════════════
  // DETERMINE CURRENT NAP POSITION
  // Figures out which nap the baby is heading toward
  // ════════════════════════════════════════════════════════

  function getCurrentNapPos(todayEntries) {
    var doneNaps = todayEntries
      .filter(function(e) { return e.type === "nap" && e.durationMin > 0; })
      .sort(function(a, b) { return a.time.localeCompare(b.time); });
    return doneNaps.length + 1;
  }

  // ════════════════════════════════════════════════════════
  // BACKWARD COMPAT WRAPPERS
  // Drop-in replacements for SleepEngine functions
  // ════════════════════════════════════════════════════════

  // getSleepRec(entries, age, birthDate)
  // Returns: { phase, dl, g, a? } — same shape as before
  // CHANGE: phase 2 activates with 3+ days of data (not 2 months)
  function getSleepRec(entries, age, birthDate) {
    if (!age) return null;

    var ageWeeks = age.totalWeeks || 0;
    var g = getGuideline(ageWeeks);

    // Old behavior: gate on 2 months
    // New behavior: phase 2 when we have 3+ days with sleep data
    var pattern = analyze(entries, 7, ageWeeks);
    var hasSufficientData = pattern && pattern.daysWithSleep >= 3;

    // Still provide daysLeft for the countdown display (informational only)
    var dl = 0;
    if (birthDate) {
      var t = new Date(birthDate);
      t.setMonth(t.getMonth() + 2);
      dl = Math.max(0, Math.ceil((t - new Date()) / 864e5));
    }

    // Phase 2 if sufficient data OR baby > 2 months
    if (hasSufficientData || dl === 0) {
      // Build recommendation from pattern
      var a = null;
      if (pattern && pattern.sleep && pattern.sleep.overallAvgWW) {
        var guidelineMid = (g.ww.min + g.ww.max) / 2;
        var totalPts = pattern.sleep.positions.reduce(function(s, p) { return s + p.pts; }, 0);
        var rec = blend(pattern.sleep.overallAvgWW, guidelineMid, totalPts, 5);
        a = {
          avg: pattern.sleep.overallAvgWW,
          rec: rec,
          pts: totalPts,
          // New fields (engine v2)
          positions: pattern.sleep.positions,
          confidence: pattern.confidence,
          pattern: pattern
        };
      }
      return {
        phase: 2,
        dl: dl, // still informational
        g: { min: g.ww.min, max: g.ww.max, naps: g.naps.label },
        a: a
      };
    }

    // Phase 1: not enough data yet
    return {
      phase: 1,
      dl: dl,
      g: { min: g.ww.min, max: g.ww.max, naps: g.naps.label }
    };
  }

  // getNapSug(entries, rec)
  // Returns: { el, rem, prog, wind, over } + new fields
  function getNapSug(entries, rec) {
    if (!rec) return null;

    // Find last wake time (same logic as before)
    var lastWakeTime = null;
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (e.type === "wakeup" || e.type === "nightwaking") {
        var t = new Date(e.date + "T" + e.time);
        if (!lastWakeTime || t > lastWakeTime) lastWakeTime = t;
      }
      if ((e.type === "sleep" || e.type === "nap") && e.durationMin) {
        var start = new Date(e.date + "T" + e.time);
        var end = new Date(start.getTime() + e.durationMin * 60000);
        if (!lastWakeTime || end > lastWakeTime) lastWakeTime = end;
      }
    }
    if (!lastWakeTime) return null;

    var el = Math.max(0, Math.floor((Date.now() - lastWakeTime) / 60000));

    // Determine current nap position
    var todayStr2 = todayStr();
    var todayEntries = entries.filter(function(e) { return e.date === todayStr2; });
    var napPos = getCurrentNapPos(todayEntries);

    // Get pattern from rec (if v2 data available)
    var pattern = (rec.a && rec.a.pattern) ? rec.a.pattern : null;
    var ageWeeks = rec.g ? (function() {
      // Reverse-lookup age from guideline
      for (var j = 0; j < GUIDELINES.length; j++) {
        if (GUIDELINES[j].ww.min === rec.g.min && GUIDELINES[j].ww.max === rec.g.max) {
          return GUIDELINES[j].maxW - 1;
        }
      }
      return 4;
    })() : 4;

    // Use new 5-state status
    var status = getStatus(el, pattern, napPos, ageWeeks);

    // Predict time for next nap
    var predictedTime = null;
    if (lastWakeTime && status.target.avg) {
      var pred = new Date(lastWakeTime.getTime() + status.target.avg * 60000);
      predictedTime = String(pred.getHours()).padStart(2, "0") + ":" + String(pred.getMinutes()).padStart(2, "0");
    }

    return {
      // Backward compat
      el: el,
      rem: status.rem,
      prog: Math.min(1, el / (status.target.avg || 60)),
      wind: status.wind,
      over: status.over,

      // New v2 fields
      state: status.state,
      target: status.target,
      napPos: napPos,
      predictedTime: predictedTime,
      confidence: status.confidence,
      dataPoints: status.dataPoints
    };
  }

  // analyzeSleepPatterns(entries, numDays)
  // Returns same shape + new fields
  function analyzeSleepPatterns(entries, numDays) {
    // Determine age (approximate from entries)
    var pattern = analyze(entries, numDays, null);
    if (!pattern || pattern.daysWithSleep < 2) return null;

    // Return backward-compatible shape with extensions
    return {
      // Backward compat
      days: pattern.daysWithSleep,
      positions: pattern.sleep.positions,
      avgNaps: Math.round(pattern.sleep.avgNaps),
      avgBedWW: pattern.sleep.avgBedWW,
      avgTotalSleep: pattern.sleep.avgTotalSleep,

      // New v2 fields
      feeds: pattern.feeds,
      bath: pattern.bath,
      wake: pattern.wake,
      bedtime: pattern.bedtime,
      confidence: pattern.confidence,
      overallAvgWW: pattern.sleep.overallAvgWW,
      fullPattern: pattern
    };
  }

  // projectSchedule(wakeMin, pattern, todayNaps)
  // Returns same shape (nap-only for backward compat)
  function projectSchedule(wakeMin, pattern, todayNaps) {
    if (!pattern || !pattern.positions || !pattern.positions.length) return [];

    var done = todayNaps
      .filter(function(e) { return e.type === "nap" && e.durationMin > 0; })
      .sort(function(a, b) { return a.time.localeCompare(b.time); });

    var sched = [];
    var cursor = wakeMin;

    for (var i = 0; i < pattern.positions.length; i++) {
      var p = pattern.positions[i];
      if (i < done.length) {
        var ns = toMinutes(done[i].time);
        var dur = done[i].durationMin;
        sched.push({
          pos: p.pos, startMin: ns, durMin: dur,
          ww: ns - cursor, status: "done"
        });
        cursor = ns + dur;
      } else {
        var ns2 = cursor + p.avgWW;
        sched.push({
          pos: p.pos, startMin: ns2, durMin: p.avgDur,
          ww: p.avgWW, avgDur: p.avgDur,
          durRange: p.minDur + "-" + p.maxDur + "min",
          status: i === done.length ? "next" : "later"
        });
        cursor = ns2 + p.avgDur;
      }
    }

    // Bedtime
    if (pattern.avgBedWW) {
      sched.push({
        pos: 0,
        startMin: cursor + pattern.avgBedWW,
        durMin: 0,
        ww: pattern.avgBedWW,
        status: done.length >= pattern.positions.length ? "next" : "later",
        bed: true
      });
    }

    return sched;
  }

  // getDayInsights(todayE, pattern, guideline, lang)
  // Returns: [{ type, title, sub }] — backward compat shape
  // Includes: total sleep (naps+night) vs WHO, compensation, quality
  function getDayInsights(todayE, pattern, guideline, lang) {
    if (!pattern) return [];
    var l = lang || "en";
    var hints = [];

    // ── TIME WINDOWS for retrospective hints ──
    // Night-sleep analysis hints → only show in morning review window (6h-10h)
    // Day-balance hints → only show in end-of-day window (after 22h)
    var _nowD = new Date();
    var _nowMin = _nowD.getHours() * 60 + _nowD.getMinutes();
    // v11.7.9: era 06:00-09:59. Mudou pra 10:00-10:59 porque 6h-10h o bebê ainda pode
    // acordar/mamar — o dado fica stale em minutos. 10h-11h garante noite fechada.
    var isMorning = _nowMin >= 10 * 60 && _nowMin < 11 * 60;   // 10:00-10:59
    var isEndOfDay = _nowMin >= 22 * 60;                       // 22:00+

    var naps = todayE.filter(function(e) { return e.type === "nap" && e.durationMin > 0; });
    var napTotal = naps.reduce(function(s, e) { return s + e.durationMin; }, 0);

    // Find WHO guideline for total sleep
    var whoTotal = null;
    if (guideline) {
      for (var gi = 0; gi < GUIDELINES.length; gi++) {
        if (GUIDELINES[gi].ww.min === guideline.min && GUIDELINES[gi].ww.max === guideline.max) {
          whoTotal = GUIDELINES[gi].totalSleep;
          break;
        }
      }
    }
    if (!whoTotal) whoTotal = { min: 14, max: 17 };

    // Night sleep from pattern (average)
    var avgNightMin = (pattern.fullPattern && pattern.fullPattern.sleep &&
      pattern.fullPattern.sleep.nightSleep && pattern.fullPattern.sleep.nightSleep.avgDuration)
      ? pattern.fullPattern.sleep.nightSleep.avgDuration : null;

    // Estimated total daily sleep (naps today + avg night)
    var estTotalMin = avgNightMin ? (napTotal + avgNightMin) : null;
    var whoMinMin = whoTotal.min * 60;
    var whoMaxMin = whoTotal.max * 60;

    // 1. Shorter naps today (end-of-day review, after 22h)
    if (isEndOfDay && naps.length >= 2) {
      var avgDur = Math.round(napTotal / naps.length);
      var usualAvgDur = pattern.avgNaps > 0
        ? Math.round(pattern.avgTotalSleep / pattern.avgNaps) : 0;

      if (usualAvgDur > 0 && avgDur < usualAvgDur * 0.7) {
        var compensates = avgNightMin && estTotalMin && estTotalMin >= whoMinMin;
        if (compensates) {
          hints.push({
            type: "info",
            title: l === "en" ? "Short naps, good night" : "Sonecas curtas, boa noite",
            sub: l === "en"
              ? "Nap avg " + avgDur + "min (usual " + usualAvgDur + "min) but night sleep compensates"
              : "Media " + avgDur + "min (usual " + usualAvgDur + "min) mas sono noturno compensa"
          });
        } else {
          hints.push({
            type: "warn",
            title: l === "en" ? "Shorter naps today" : "Sonecas mais curtas hoje",
            sub: l === "en"
              ? "Avg " + avgDur + "min vs usual " + usualAvgDur + "min. May need earlier bedtime."
              : "Media " + avgDur + "min vs usual " + usualAvgDur + "min. Pode precisar dormir mais cedo."
          });
        }
      }
    }

    // 2. Total sleep vs WHO (end-of-day review, after 22h)
    if (isEndOfDay && estTotalMin && naps.length >= Math.floor(pattern.avgNaps || 0)) {
      var estTotalHrs = Math.round(estTotalMin / 6) / 10;

      if (estTotalMin >= whoMinMin && estTotalMin <= whoMaxMin) {
        hints.push({
          type: "good",
          title: l === "en" ? "Great sleep day!" : "Otimo dia de sono!",
          sub: l === "en"
            ? "~" + estTotalHrs + "h total (WHO: " + whoTotal.min + "-" + whoTotal.max + "h) " + naps.length + " naps + " + fmtDur(avgNightMin) + " night"
            : "~" + estTotalHrs + "h total (OMS: " + whoTotal.min + "-" + whoTotal.max + "h) " + naps.length + " sonecas + " + fmtDur(avgNightMin) + " noite"
        });
      } else if (estTotalMin < whoMinMin) {
        var deficit = Math.round(whoMinMin - estTotalMin);
        hints.push({
          type: "warn",
          title: l === "en" ? "Below recommended sleep" : "Abaixo do sono recomendado",
          sub: l === "en"
            ? "~" + estTotalHrs + "h total (WHO: " + whoTotal.min + "-" + whoTotal.max + "h). " + fmtDur(deficit) + " short."
            : "~" + estTotalHrs + "h total (OMS: " + whoTotal.min + "-" + whoTotal.max + "h). Faltam " + fmtDur(deficit) + "."
        });
      } else if (estTotalMin > whoMaxMin * 1.1) {
        hints.push({
          type: "info",
          title: l === "en" ? "Sleeping a lot today" : "Dormindo bastante hoje",
          sub: l === "en"
            ? "~" + estTotalHrs + "h (above " + whoTotal.max + "h). Could be a growth spurt!"
            : "~" + estTotalHrs + "h (acima de " + whoTotal.max + "h). Pode ser salto de crescimento!"
        });
      }
    } else if (isEndOfDay && !estTotalMin && naps.length >= Math.floor(pattern.avgNaps || 0) &&
               napTotal >= (pattern.avgTotalSleep || 0) * 0.85) {
      hints.push({
        type: "good",
        title: l === "en" ? "Good nap day!" : "Bom dia de sonecas!",
        sub: naps.length + (l === "en" ? " naps, " : " sonecas, ") + fmtDur(napTotal) + " total"
      });
    }

    // 3. Night sleep consistency insight (morning review, 6h-10h)
    if (isMorning && pattern.fullPattern && pattern.fullPattern.sleep &&
        pattern.fullPattern.sleep.nightSleep && pattern.fullPattern.sleep.nightSleep.pts >= 3) {
      var ns = pattern.fullPattern.sleep.nightSleep;
      var nightSpread = (ns.maxDuration || 0) - (ns.minDuration || 0);
      if (nightSpread <= 60 && ns.avgDuration) {
        hints.push({
          type: "good",
          title: l === "en" ? "Consistent night sleep" : "Sono noturno consistente",
          sub: l === "en"
            ? "Avg " + fmtDur(ns.avgDuration) + "/night (" + ns.pts + " nights, <1h variation)"
            : "Media " + fmtDur(ns.avgDuration) + "/noite (" + ns.pts + " noites, <1h variacao)"
        });
      }
    }

    // 4-7. WAKINGS INSIGHTS (morning review, 6h-10h)
    // Consolidated into ONE composite hint to avoid the "conflicting" feeling users had
    // when multiple wakings-related hints appeared at once (e.g. "Avg 1.3 wakings" +
    // "More wakings lately"). Exception: "Sleeping through the night" stays separate
    // because it's a positive milestone that deserves its own spotlight.
    if (isMorning && pattern.fullPattern && pattern.fullPattern.sleep && pattern.fullPattern.sleep.wakings) {
      var wa = pattern.fullPattern.sleep.wakings;
      // Sanity check: "sleeping through the night" only makes biological sense
      // from ~4 months. Below that, 0 wakings means the user didn't track,
      // not that the baby slept through (newborns physiologically must wake to feed).
      var ageWeeksForInsight = pattern.fullPattern.ageWeeks;
      var oldEnoughForSTTN = ageWeeksForInsight != null && ageWeeksForInsight >= 16;

      // 4a. SLEEPING THROUGH THE NIGHT -- stays separate (positive milestone)
      if (wa.avgPerNight === 0 && wa.nightsAnalyzed >= 3 && oldEnoughForSTTN) {
        hints.push({
          type: "good",
          title: l === "en" ? "Sleeping through the night" : "Dormindo a noite toda",
          sub: l === "en"
            ? "No wakings in " + wa.nightsAnalyzed + " nights -- amazing!"
            : "Sem despertares em " + wa.nightsAnalyzed + " noites -- incrivel!"
        });
      }
      // Composite hint -- only show if there's at least the core metric (avg per night)
      else if (wa.avgPerNight != null && wa.nightsAnalyzed >= 3 && wa.avgPerNight >= 1) {
        // Build the parts of the consolidated text
        var parts = [];

        // Core: average wakings per night (always first, grounds the rest as "historical average")
        var avgStr;
        if (l === "en") {
          avgStr = "Avg " + wa.avgPerNight + " waking" + (wa.avgPerNight !== 1 ? "s" : "") + "/night";
        } else {
          avgStr = "Media " + wa.avgPerNight + " despertar" + (wa.avgPerNight !== 1 ? "es" : "") + "/noite";
        }
        parts.push(avgStr);

        // Most common time (if clustered)
        if (wa.mostCommonTime != null && wa.totalWakings >= 3) {
          parts.push(l === "en"
            ? "usually around " + minToTime(wa.mostCommonTime)
            : "mais frequente ~" + minToTime(wa.mostCommonTime));
        }

        // Most common cause (if >=60%)
        if (wa.mostCommonType && wa.mostCommonTypePct >= 60 && wa.totalWakings >= 3) {
          var typeLabel = wa.mostCommonType === "feed"
            ? (l === "en" ? "feeds" : "mamadas")
            : wa.mostCommonType === "diaper"
              ? (l === "en" ? "diapers" : "fraldas")
              : (l === "en" ? "comfort" : "conforto");
          parts.push(l === "en"
            ? "mostly " + typeLabel + " (" + wa.mostCommonTypePct + "%)"
            : "geralmente " + typeLabel + " (" + wa.mostCommonTypePct + "%)");
        }

        // Trend (improving/worsening) -- shown as a dedicated small suffix
        var trendSuffix = "";
        if (wa.trend === "improving") {
          // U+00B7 middle dot + U+2193 down arrow -- inside string literal, safe
          trendSuffix = l === "en" ? " \u00b7 \u2193 fewer than last week" : " \u00b7 \u2193 menos que a semana passada";
        } else if (wa.trend === "worsening") {
          trendSuffix = l === "en" ? " \u00b7 \u2191 more than last week" : " \u00b7 \u2191 mais que a semana passada";
        }

        // Build title -- makes clear this is an aggregate of N nights
        var compositeTitle = l === "en"
          ? "Night pattern (" + wa.nightsAnalyzed + " nights)"
          : "Padrao das noites (" + wa.nightsAnalyzed + " noites)";

        // Type: info by default, but bump to "warn" if frequent wakings and worsening trend
        var compositeType = (wa.avgPerNight >= 3 && wa.trend === "worsening") ? "warn" : "info";

        hints.push({
          type: compositeType,
          title: compositeTitle,
          sub: parts.join(", ") + trendSuffix
        });
      }
    }

    // 8. PRE-FEED HINT — when a nap is approaching and history shows feed-before-nap pattern
    if (pattern.fullPattern && pattern.fullPattern.feeds &&
        pattern.fullPattern.feeds.preNapPct != null &&
        pattern.fullPattern.feeds.preNapPct >= 60) {
      // Check if there's a recent feed (in last 30min) — if yes, skip hint
      var nowMin = (function() { var d = new Date(); return d.getHours() * 60 + d.getMinutes(); })();
      var recentFeed = todayE.filter(function(e) {
        if (e.type !== "bottle" && e.type !== "nursing") return false;
        var feedMin = toMinutes(e.time) + (e.durationMin || 0);
        return (nowMin - feedMin) >= 0 && (nowMin - feedMin) <= 30;
      });

      // Check if a nap is coming (not currently napping, no recent nap end)
      var lastNapEnd = 0;
      var inNap = false;
      todayE.forEach(function(e) {
        if (e.type === "nap") {
          var ns = toMinutes(e.time);
          var ne = ns + (e.durationMin || 0);
          if (ns <= nowMin && ne >= nowMin) inNap = true;
          if (ne > lastNapEnd && ne <= nowMin) lastNapEnd = ne;
        }
      });

      // Only show hint if: not currently napping, no feed in last 30min, and last nap ended > 45min ago (so a new WW is building)
      var awakeFor = lastNapEnd > 0 ? (nowMin - lastNapEnd) : null;
      if (!inNap && recentFeed.length === 0 && (awakeFor == null || awakeFor >= 30)) {
        hints.push({
          type: "info",
          title: l === "en" ? "Feed before nap" : "Mamada antes da soneca",
          sub: l === "en"
            ? "Louise usually feeds before her nap (" + pattern.fullPattern.feeds.preNapPct + "% of the time). Prep ahead!"
            : "Louise costuma mamar antes da soneca (" + pattern.fullPattern.feeds.preNapPct + "% das vezes). Se prepare!"
        });
      }
    }

    // ─────────────────────────────────────────────────────
    // Shared "now" context for remaining hints
    // ─────────────────────────────────────────────────────
    var nowM = (function() { var d = new Date(); return d.getHours() * 60 + d.getMinutes(); })();
    var fp = pattern.fullPattern || null;
    var bedDoneToday = todayE.find(function(e) { return e.type === "sleep"; });
    var nightNapping = false; // are we past bedtime / sleeping?
    if (bedDoneToday) nightNapping = true;

    // 9. BEDTIME APPROACHING — 30-45min before habitual bedtime
    if (!nightNapping && fp && fp.bedtime && fp.bedtime.avgTime && fp.bedtime.pts >= 3) {
      var bedAvg = fp.bedtime.avgTime;
      var minsUntilBed = bedAvg - nowM;
      if (minsUntilBed >= 30 && minsUntilBed <= 45) {
        hints.push({
          type: "info",
          title: l === "en" ? "Bedtime approaching" : "Sono noturno se aproximando",
          sub: l === "en"
            ? "Louise usually sleeps around " + minToTime(bedAvg) + ". Start winding down."
            : "Louise costuma dormir por volta das " + minToTime(bedAvg) + ". Hora de desacelerar."
        });
      }
    }

    // 10. BATH REMINDER — ~30min before habitual bath time, if bath is part of routine
    if (!nightNapping && fp && fp.bath && fp.bath.avgTime != null && fp.bath.daysWithBath >= 3) {
      var bathDoneToday = todayE.find(function(e) { return e.type === "bath"; });
      if (!bathDoneToday) {
        var bathAvg = fp.bath.avgTime;
        var minsUntilBath = bathAvg - nowM;
        if (minsUntilBath >= 20 && minsUntilBath <= 40) {
          hints.push({
            type: "info",
            title: l === "en" ? "Bath time soon" : "Hora do banho chegando",
            sub: l === "en"
              ? "Bath usually around " + minToTime(bathAvg) + " (" + fp.bath.daysWithBath + " days routine)"
              : "Banho geralmente por volta das " + minToTime(bathAvg) + " (rotina de " + fp.bath.daysWithBath + " dias)"
          });
        }
      }
    }

    // 11. LAST FEED BEFORE BED — if Louise usually feeds close to bedtime
    if (!nightNapping && fp && fp.bedtime && fp.bedtime.avgTime && fp.bedtime.pts >= 3 && fp.feeds) {
      var bedAvg2 = fp.bedtime.avgTime;
      var minsUntilBed2 = bedAvg2 - nowM;
      if (minsUntilBed2 >= 15 && minsUntilBed2 <= 45) {
        // Check if already fed in last 30min
        var recentFeedBed = todayE.filter(function(e) {
          if (e.type !== "bottle" && e.type !== "nursing") return false;
          var fm = toMinutes(e.time) + (e.durationMin || 0);
          return (nowM - fm) >= 0 && (nowM - fm) <= 30;
        });
        if (recentFeedBed.length === 0) {
          hints.push({
            type: "info",
            title: l === "en" ? "Last feed of the day" : "Ultima mamada do dia",
            sub: l === "en"
              ? "Bedtime around " + minToTime(bedAvg2) + ". Usually a feed happens before."
              : "Sono por volta das " + minToTime(bedAvg2) + ". Geralmente tem mamada antes."
          });
        }
      }
    }

    // 12. LONG NAP CELEBRATION — if most recent nap was excellent (>= 130% of avg)
    if (pattern.avgNaps > 0 && pattern.avgTotalSleep > 0) {
      var sortedNaps = todayE
        .filter(function(e) { return e.type === "nap" && e.durationMin > 0; })
        .sort(function(a, b) { return b.time.localeCompare(a.time); });
      if (sortedNaps.length > 0) {
        var lastNap = sortedNaps[0];
        var lastNapEnd2 = toMinutes(lastNap.time) + lastNap.durationMin;
        var minsSinceNapEnd = nowM - lastNapEnd2;
        // Only celebrate if nap just ended (within last 20min) to stay relevant
        if (minsSinceNapEnd >= 0 && minsSinceNapEnd <= 20) {
          var usualNapDur = Math.round(pattern.avgTotalSleep / pattern.avgNaps);
          if (lastNap.durationMin >= usualNapDur * 1.3 && lastNap.durationMin >= 45) {
            hints.push({
              type: "good",
              title: l === "en" ? "Excellent nap!" : "Soneca excelente!",
              sub: l === "en"
                ? fmtDur(lastNap.durationMin) + " — " + Math.round(lastNap.durationMin / usualNapDur * 100) + "% of usual (" + fmtDur(usualNapDur) + ")"
                : fmtDur(lastNap.durationMin) + " — " + Math.round(lastNap.durationMin / usualNapDur * 100) + "% do usual (" + fmtDur(usualNapDur) + ")"
            });
          }
        }
      }
    }

    // 13. MISSED FEED — too long since last feed vs avg interval
    if (fp && fp.feeds && fp.feeds.avgInterval && fp.feeds.pts >= 5 && !nightNapping) {
      var feedsToday = todayE
        .filter(function(e) { return e.type === "bottle" || e.type === "nursing"; })
        .sort(function(a, b) { return b.time.localeCompare(a.time); });
      if (feedsToday.length > 0) {
        var lastFeedT = feedsToday[0];
        var lastFeedEnd = toMinutes(lastFeedT.time) + (lastFeedT.durationMin || 0);
        var minsSinceFeed = nowM - lastFeedEnd;
        var avgInt = fp.feeds.avgInterval;
        // Trigger when 40% past the average interval
        if (minsSinceFeed >= avgInt * 1.4 && minsSinceFeed <= avgInt * 2) {
          hints.push({
            type: "warn",
            title: l === "en" ? "Feed overdue" : "Mamada atrasada",
            sub: l === "en"
              ? fmtDur(minsSinceFeed) + " since last feed. Usual interval: " + fmtDur(avgInt) + "."
              : fmtDur(minsSinceFeed) + " desde a ultima mamada. Intervalo usual: " + fmtDur(avgInt) + "."
          });
        }
      }
    }

    // 14. CLUSTER FEEDING — 3+ feeds in a short window (under 90min total)
    if (fp && fp.feeds && fp.feeds.avgInterval) {
      var recentFeedsToday = todayE
        .filter(function(e) { return e.type === "bottle" || e.type === "nursing"; })
        .sort(function(a, b) { return a.time.localeCompare(b.time); });
      if (recentFeedsToday.length >= 3) {
        // Look at last 3 feeds
        var last3 = recentFeedsToday.slice(-3);
        var firstT = toMinutes(last3[0].time);
        var lastT = toMinutes(last3[2].time);
        var spanMin = lastT - firstT;
        // Cluster: 3 feeds within 90min AND spanMin < avgInterval * 1.2 (much tighter than usual)
        if (spanMin > 0 && spanMin <= 90 && spanMin < fp.feeds.avgInterval * 1.2) {
          // Only show if the cluster just ended (last feed within 30min)
          var minsSinceCluster = nowM - (lastT + (last3[2].durationMin || 0));
          if (minsSinceCluster >= 0 && minsSinceCluster <= 60) {
            hints.push({
              type: "info",
              title: l === "en" ? "Cluster feeding detected" : "Mamadas agrupadas detectadas",
              sub: l === "en"
                ? "3 feeds in " + fmtDur(spanMin) + ". Often a growth spurt sign."
                : "3 mamadas em " + fmtDur(spanMin) + ". Geralmente sinal de salto de crescimento."
            });
          }
        }
      }
    }

    // 15. DIAPER CONCERN — too long since last diaper change, or too few today
    var diapersToday = todayE.filter(function(e) { return e.type === "diaper"; });
    if (diapersToday.length > 0 && !nightNapping) {
      var sortedDiapers = diapersToday.slice().sort(function(a, b) { return b.time.localeCompare(a.time); });
      var lastDiaperMin = toMinutes(sortedDiapers[0].time);
      var minsSinceDiaper = nowM - lastDiaperMin;
      // Only alert if we're past morning (avoids false alarm early in the day)
      if (minsSinceDiaper >= 240 && nowM >= 600) {
        hints.push({
          type: "warn",
          title: l === "en" ? "Diaper check" : "Checar fralda",
          sub: l === "en"
            ? fmtDur(minsSinceDiaper) + " since last change. Time to check?"
            : fmtDur(minsSinceDiaper) + " desde a ultima troca. Hora de checar?"
        });
      }
    }
    // Low diaper count for the day (guideline: 6+ diapers for newborn)
    if (nowM >= 1080 && diapersToday.length > 0 && diapersToday.length < 4) {
      hints.push({
        type: "warn",
        title: l === "en" ? "Few diapers today" : "Poucas fraldas hoje",
        sub: l === "en"
          ? "Only " + diapersToday.length + " changes today. Newborns usually need 6+."
          : "Apenas " + diapersToday.length + " trocas hoje. Recem-nascidos geralmente precisam de 6+."
      });
    }

    // 16. FEED VOLUME vs WHO GUIDELINE
    if (fp && fp.feeds && nowM >= 1080) {
      var bottlesToday = todayE.filter(function(e) { return e.type === "bottle"; });
      var totalMlToday = bottlesToday.reduce(function(s, e) { return s + (e.ml || 0); }, 0);
      if (totalMlToday > 0) {
        var whoVol = null;
        if (guideline) {
          for (var gii = 0; gii < GUIDELINES.length; gii++) {
            if (GUIDELINES[gii].ww.min === guideline.min && GUIDELINES[gii].ww.max === guideline.max) {
              whoVol = GUIDELINES[gii].feeds;
              break;
            }
          }
        }
        if (whoVol && whoVol.mlPerDay) {
          if (totalMlToday < whoVol.mlPerDay.min * 0.85) {
            hints.push({
              type: "warn",
              title: l === "en" ? "Below recommended volume" : "Abaixo do volume recomendado",
              sub: l === "en"
                ? totalMlToday + "ml today (WHO: " + whoVol.mlPerDay.min + "-" + whoVol.mlPerDay.max + "ml)"
                : totalMlToday + "ml hoje (OMS: " + whoVol.mlPerDay.min + "-" + whoVol.mlPerDay.max + "ml)"
            });
          } else if (totalMlToday > whoVol.mlPerDay.max * 1.15) {
            hints.push({
              type: "info",
              title: l === "en" ? "Above recommended volume" : "Acima do volume recomendado",
              sub: l === "en"
                ? totalMlToday + "ml today (WHO: " + whoVol.mlPerDay.min + "-" + whoVol.mlPerDay.max + "ml). Growth spurt?"
                : totalMlToday + "ml hoje (OMS: " + whoVol.mlPerDay.min + "-" + whoVol.mlPerDay.max + "ml). Salto de crescimento?"
            });
          }
        }
      }
    }

    return hints;
  }

  // ════════════════════════════════════════════════════════
  // PUBLIC API
  // ════════════════════════════════════════════════════════

  root.RoutineEngine = {
    VERSION: VERSION,

    // Core v2 API
    analyze: analyze,
    getStatus: getStatus,
    predict: predict,
    getInsights: getInsights,
    getGuideline: getGuideline,
    getCurrentNapPos: getCurrentNapPos,
    GUIDELINES: GUIDELINES,

    // Helpers
    toMinutes: toMinutes,
    minToTime: minToTime,
    blend: blend,
    recencyWeight: recencyWeight,

    // Backward compat (SleepEngine drop-in)
    WW: WW,
    getSleepRec: getSleepRec,
    getNapSug: getNapSug,
    analyzeSleepPatterns: analyzeSleepPatterns,
    projectSchedule: projectSchedule,
    getDayInsights: getDayInsights
  };

})(typeof window !== "undefined" ? window : this);
