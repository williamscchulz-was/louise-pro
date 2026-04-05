// ╔═══════════════════════════════════════════════════════════════╗
// ║  ROUTINE ENGINE v2.0.0                                       ║
// ║  Full-day routine intelligence for Louise Pro                ║
// ║  Replaces Sleep Engine v1 — backward compatible              ║
// ║                                                              ║
// ║  Analyzes: sleep, feeds, bath, diapers                       ║
// ║  Uses: WHO/AAP research + learned patterns + recency decay   ║
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

  var VERSION = "2.0.0";

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

      // Bedtime
      var bed = de.find(function(e) { return e.type === "sleep"; });
      var bedMin = bed ? toMinutes(bed.time) : null;

      // Diapers
      var diapers = de.filter(function(e) { return e.type === "diaper"; });

      dayData.push({
        date: date,
        daysAgo: d,
        weight: weight,
        wakeMin: wakeMin,
        naps: naps,
        napCount: naps.length,
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

    var bathBeforeBed = [], bathToBedGaps = [];
    for (var bai = 0; bai < dayData.length; bai++) {
      var badd = dayData[bai];
      if (badd.baths.length > 0 && badd.bedMin) {
        var lastBath = badd.baths.slice().sort(function(a, b) {
          return b.time.localeCompare(a.time);
        })[0];
        var bathMin = toMinutes(lastBath.time);
        var bathToBed = badd.bedMin - bathMin;
        if (bathToBed > 0 && bathToBed < 300) {
          bathBeforeBed.push(badd.date);
          bathToBedGaps.push(bathToBed);
        }
      }
    }

    var bathAnalysis = {
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

      sleep: {
        positions: positions,
        avgNaps: avgNaps,
        avgBedWW: avgBedWW,
        avgTotalSleep: avgTotalSleep,
        overallAvgWW: overallAvgWW
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

  // getDayInsights(todayE, pattern, guideline)
  // Returns: [{ type, title, sub }] — backward compat shape
  function getDayInsights(todayE, pattern, guideline, lang) {
    if (!pattern) return [];
    var l = lang || "en";
    var hints = [];
    var naps = todayE.filter(function(e) { return e.type === "nap" && e.durationMin > 0; });
    var totalSleep = naps.reduce(function(s, e) { return s + e.durationMin; }, 0);

    if (naps.length >= 2) {
      var avgDur = Math.round(totalSleep / naps.length);
      var usualAvg = pattern.avgNaps > 0
        ? Math.round(pattern.avgTotalSleep / pattern.avgNaps)
        : 0;
      if (usualAvg > 0 && avgDur < usualAvg * 0.7) {
        hints.push({
          type: "warn",
          title: l === "en" ? "Shorter naps today" : "Sonecas mais curtas hoje",
          sub: (l === "en" ? "Avg " : "Media ") + avgDur + "min vs usual " + usualAvg + "min"
        });
      }
    }

    if (naps.length >= (pattern.avgNaps || 0) && totalSleep >= (pattern.avgTotalSleep || 0) * 0.85) {
      hints.push({
        type: "good",
        title: l === "en" ? "Great sleep day!" : "Otimo dia de sono!",
        sub: naps.length + (l === "en" ? " naps, " : " sonecas, ") + fmtDur(totalSleep) + " total"
      });
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
