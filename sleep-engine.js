// ╔═══════════════════════════════════════════════════════════╗
// ║  SLEEP ENGINE v1.0.0                                     ║
// ║  Standalone sleep analysis module for Louise Pro          ║
// ║  Zero dependencies — pure JS, no frameworks              ║
// ╚═══════════════════════════════════════════════════════════╝
//
// API:
//   SleepEngine.getSleepRec(entries, age, birthDate)
//   SleepEngine.getNapSug(entries, rec)
//   SleepEngine.analyzeSleepPatterns(entries, numDays)
//   SleepEngine.projectSchedule(wakeMin, pattern, todayNaps)
//   SleepEngine.getDayInsights(todayEntries, pattern, guideline, lang)
//   SleepEngine.getGuideline(ageWeeks)
//   SleepEngine.toMinutes("HH:MM") → number
//   SleepEngine.minToTime(number) → "HH:MM"
//   SleepEngine.WW — wake window guidelines data
//   SleepEngine.VERSION

(function (root) {
  "use strict";

  var VERSION = "1.0.0";

  // ── INTERNAL HELPERS ──────────────────────────────────────

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

  function fmtDur(m) {
    if (!m) return "0min";
    var h = Math.floor(m / 60), r = m % 60;
    return h > 0 ? (r > 0 ? h + "h" + r + "m" : h + "h") : r + "min";
  }

  // ── PUBLIC HELPERS ────────────────────────────────────────

  function toMinutes(t) {
    var parts = (t || "12:00").split(":").map(Number);
    return parts[0] * 60 + parts[1];
  }

  function minToTime(m) {
    return String(Math.floor(m / 60)).padStart(2, "0") + ":" +
      String(Math.round(m % 60)).padStart(2, "0");
  }

  // ── WAKE WINDOW GUIDELINES (by age in weeks) ─────────────

  var WW = [
    { maxW:   4, min:  30, max:  60, naps: "4-5" },
    { maxW:   8, min:  45, max:  75, naps: "4-5" },
    { maxW:  12, min:  60, max:  90, naps: "3-4" },
    { maxW:  16, min:  75, max: 120, naps: "3-4" },
    { maxW:  28, min: 120, max: 180, naps: "2-3" },
    { maxW:  40, min: 150, max: 210, naps: "2"   },
    { maxW:  56, min: 180, max: 240, naps: "1-2" },
    { maxW: 104, min: 240, max: 360, naps: "1"   },
  ];

  function getGuideline(ageWeeks) {
    for (var i = 0; i < WW.length; i++) {
      if (ageWeeks < WW[i].maxW) return WW[i];
    }
    return WW[WW.length - 1];
  }

  // ── PHASE DETECTION ───────────────────────────────────────
  // Phase 1: countdown (baby < 2 months) — uses guidelines only
  // Phase 2: personalized — learns from tracked data

  function daysUntilSchedule(birthDate) {
    if (!birthDate) return null;
    var t = new Date(birthDate);
    t.setMonth(t.getMonth() + 2);
    return Math.max(0, Math.ceil((t - new Date()) / 864e5));
  }

  // ── CORE: SLEEP RECOMMENDATION ────────────────────────────
  // Returns: { phase, dl, g, a? }
  //   phase 1: { phase:1, dl:daysLeft, g:guideline }
  //   phase 2: { phase:2, dl:0, g:guideline, a:{ avg, rec, pts } | null }

  function getSleepRec(entries, age, birthDate) {
    if (!age) return null;
    var dl = daysUntilSchedule(birthDate);
    var g = getGuideline(age.totalWeeks);
    if (dl > 0) return { phase: 1, dl: dl, g: g };

    // Phase 2: analyze actual wake windows from data
    var sorted = entries
      .filter(function (e) {
        return ["wakeup", "nightwaking", "sleep", "nap"].indexOf(e.type) >= 0;
      })
      .sort(function (a, b) {
        return new Date(b.date + "T" + b.time) - new Date(a.date + "T" + a.time);
      });

    var wins = [];
    for (var i = 0; i < sorted.length - 1; i++) {
      var c = sorted[i], p = sorted[i + 1];
      if ((c.type === "sleep" || c.type === "nap") &&
          (p.type === "wakeup" || p.type === "nightwaking")) {
        var wm = Math.floor(
          (new Date(c.date + "T" + c.time) - new Date(p.date + "T" + p.time)) / 6e4
        );
        if (wm > 10 && wm < 600) wins.push({ wm: wm });
      }
    }

    if (wins.length < 3) return { phase: 2, dl: 0, g: g, a: null };

    var avg = Math.round(wins.reduce(function (s, w) { return s + w.wm; }, 0) / wins.length);
    var rec = Math.round(avg * 0.7 + ((g.min + g.max) / 2) * 0.3);
    return { phase: 2, dl: 0, g: g, a: { avg: avg, rec: rec, pts: wins.length } };
  }

  // ── NAP SUGGESTION (real-time) ────────────────────────────
  // Returns: { el, rem, prog, wind, over } | null

  function getNapSug(entries, rec) {
    if (!rec) return null;
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
    var tgt = (rec.phase === 2 && rec.a) ? rec.a.rec : (rec.g.min + rec.g.max) / 2;
    var rem = Math.max(0, Math.round(tgt - el));
    return {
      el:   el,
      rem:  rem,
      prog: Math.min(1, el / tgt),
      wind: rem <= 15 && rem > 0,
      over: rem === 0 && el > 0,
    };
  }

  // ── PATTERN ANALYSIS (N-day lookback) ─────────────────────
  // Returns: { days, positions[], avgNaps, avgBedWW, avgTotalSleep } | null

  function analyzeSleepPatterns(allEntries, numDays) {
    var today = todayStr();
    var days = [];

    for (var d = 0; d < numDays; d++) {
      var date = dateOffset(today, -d);
      var de = allEntries.filter(function (e) { return e.date === date; });
      var wakeMin = null;

      // Find wake time
      var wk = de.find(function (e) { return e.type === "wakeup"; });
      if (wk) {
        wakeMin = toMinutes(wk.time);
      } else {
        var sl = de
          .filter(function (e) { return (e.type === "sleep" || e.type === "nap") && e.durationMin > 0; })
          .sort(function (a, b) { return a.time.localeCompare(b.time); });
        if (sl.length > 0) {
          var em = toMinutes(sl[0].time) + sl[0].durationMin;
          if (em >= 300 && em <= 720) wakeMin = em;
        }
      }
      if (!wakeMin) continue;

      // Collect naps
      var naps = de
        .filter(function (e) { return e.type === "nap" && e.durationMin > 0; })
        .sort(function (a, b) { return a.time.localeCompare(b.time); });
      if (naps.length === 0) continue;

      var nd = [];
      var prev = wakeMin;
      for (var i = 0; i < naps.length; i++) {
        var ns = toMinutes(naps[i].time);
        var ww = ns - prev;
        var dur = naps[i].durationMin;
        if (ww > 0 && ww < 600) nd.push({ pos: i + 1, ww: ww, dur: dur });
        prev = ns + dur;
      }

      // Bedtime wake window
      var bed = de.find(function (e) { return e.type === "sleep"; });
      var bww = bed ? (toMinutes(bed.time) - prev) : null;
      days.push({
        date: date, wakeMin: wakeMin, naps: nd,
        napCount: naps.length, bedWW: (bww && bww > 0) ? bww : null,
      });
    }

    if (days.length < 2) return null;

    // Aggregate by nap position
    var maxPos = Math.max.apply(null, days.map(function (d) { return d.napCount; }));
    var positions = [];
    for (var p = 1; p <= Math.min(maxPos, 8); p++) {
      var wws = days.map(function (d) { var n = d.naps.find(function (x) { return x.pos === p; }); return n ? n.ww : null; }).filter(Boolean);
      var durs = days.map(function (d) { var n = d.naps.find(function (x) { return x.pos === p; }); return n ? n.dur : null; }).filter(Boolean);
      if (wws.length >= 2) {
        positions.push({
          pos: p,
          avgWW:  Math.round(wws.reduce(function (s, v) { return s + v; }, 0) / wws.length),
          minWW:  Math.min.apply(null, wws),
          maxWW:  Math.max.apply(null, wws),
          avgDur: Math.round(durs.reduce(function (s, v) { return s + v; }, 0) / durs.length),
          minDur: Math.min.apply(null, durs),
          maxDur: Math.max.apply(null, durs),
          pts:    wws.length,
        });
      }
    }

    var avgNaps = Math.round(days.reduce(function (s, d) { return s + d.napCount; }, 0) / days.length);
    var bwws = days.map(function (d) { return d.bedWW; }).filter(Boolean);
    var avgBedWW = bwws.length >= 2 ? Math.round(bwws.reduce(function (s, v) { return s + v; }, 0) / bwws.length) : null;
    var totalSleepPerDay = days.map(function (d) { return d.naps.reduce(function (s, n) { return s + n.dur; }, 0); });
    var avgTotalSleep = Math.round(totalSleepPerDay.reduce(function (s, v) { return s + v; }, 0) / totalSleepPerDay.length);

    return {
      days:          days.length,
      positions:     positions,
      avgNaps:       avgNaps,
      avgBedWW:      avgBedWW,
      avgTotalSleep: avgTotalSleep,
    };
  }

  // ── SCHEDULE PROJECTION ───────────────────────────────────
  // Returns: [{ pos, startMin, durMin, ww, status, bed?, durRange? }]

  function projectSchedule(wakeMin, pattern, todayNaps) {
    if (!pattern || !pattern.positions.length) return [];
    var done = todayNaps
      .filter(function (e) { return e.type === "nap" && e.durationMin > 0; })
      .sort(function (a, b) { return a.time.localeCompare(b.time); });

    var sched = [];
    var cursor = wakeMin;

    for (var i = 0; i < pattern.positions.length; i++) {
      var p = pattern.positions[i];
      if (i < done.length) {
        var ns = toMinutes(done[i].time);
        var dur = done[i].durationMin;
        sched.push({ pos: p.pos, startMin: ns, durMin: dur, ww: ns - cursor, status: "done" });
        cursor = ns + dur;
      } else {
        var ns2 = cursor + p.avgWW;
        sched.push({
          pos: p.pos, startMin: ns2, durMin: p.avgDur,
          ww: p.avgWW, avgDur: p.avgDur,
          durRange: p.minDur + "-" + p.maxDur + "min",
          status: i === done.length ? "next" : "later",
        });
        cursor = ns2 + p.avgDur;
      }
    }

    if (pattern.avgBedWW) {
      sched.push({
        pos: 0, startMin: cursor + pattern.avgBedWW, durMin: 0,
        ww: pattern.avgBedWW,
        status: done.length >= pattern.positions.length ? "next" : "later",
        bed: true,
      });
    }
    return sched;
  }

  // ── DAY INSIGHTS ──────────────────────────────────────────
  // Returns: [{ type: "warn"|"good", title, sub }]

  function getDayInsights(todayE, pattern, guideline, lang) {
    if (!pattern) return [];
    var hints = [];
    var l = lang || "pt";
    var naps = todayE.filter(function (e) { return e.type === "nap" && e.durationMin > 0; });
    var totalSleep = naps.reduce(function (s, e) { return s + e.durationMin; }, 0);

    if (naps.length >= 2) {
      var avgDur = Math.round(totalSleep / naps.length);
      var usualAvg = Math.round(pattern.avgTotalSleep / pattern.avgNaps);
      if (avgDur < usualAvg * 0.7) {
        hints.push({
          type: "warn",
          title: l === "en" ? "Shorter naps today" : "Sonecas mais curtas hoje",
          sub: l === "en"
            ? "Avg " + avgDur + "min vs usual " + usualAvg + "min"
            : "Media " + avgDur + "min vs usual " + usualAvg + "min",
        });
      }
    }

    if (naps.length >= pattern.avgNaps && totalSleep >= pattern.avgTotalSleep * 0.85) {
      hints.push({
        type: "good",
        title: l === "en" ? "Great sleep day!" : "Otimo dia de sono!",
        sub: l === "en"
          ? naps.length + " naps \u00b7 " + fmtDur(totalSleep) + " total"
          : naps.length + " sonecas \u00b7 " + fmtDur(totalSleep) + " total",
      });
    }

    return hints;
  }

  // ── PUBLIC API ────────────────────────────────────────────

  root.SleepEngine = {
    VERSION:              VERSION,
    WW:                   WW,
    toMinutes:            toMinutes,
    minToTime:            minToTime,
    getGuideline:         getGuideline,
    getSleepRec:          getSleepRec,
    getNapSug:            getNapSug,
    analyzeSleepPatterns: analyzeSleepPatterns,
    projectSchedule:      projectSchedule,
    getDayInsights:       getDayInsights,
  };

})(typeof window !== "undefined" ? window : this);
