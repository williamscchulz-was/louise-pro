// ╔══════════════════════════════════════════════════════╗
// ║  LOUISE PRO · WHO GROWTH STANDARDS                   ║
// ║  Girls 0-24 months · LMS parameters                  ║
// ║                                                      ║
// ║  Exposes:                                            ║
// ║    window.WHO_GIRLS                                  ║
// ║    window.interpolateLMS(table, ageMonths)           ║
// ║    window.calcZScore(value, lms)                     ║
// ║    window.zToPercentile(z)                           ║
// ║    window.getPercentile(value, table, ageMonths)     ║
// ╚══════════════════════════════════════════════════════╝

window.WHO_GIRLS = {
  weight: [ // age_months, L, M, S
    [0,0.3809,3.2322,0.14171],[1,0.1714,4.1873,0.13724],[2,0.0962,5.1282,0.13000],
    [3,0.0402,5.8458,0.12619],[4,-0.005,6.4237,0.12402],[5,-0.043,6.8985,0.12274],
    [6,-0.0755,7.2970,0.12204],[7,-0.1006,7.6422,0.12178],[8,-0.1210,7.9487,0.12181],
    [9,-0.1383,8.2254,0.12199],[10,-0.1530,8.4800,0.12234],[11,-0.1658,8.7192,0.12282],
    [12,-0.1780,8.9481,0.12339],[15,-0.1987,9.5264,0.12576],[18,-0.1950,10.2391,0.12888],
    [21,-0.1830,10.9130,0.13160],[24,-0.1850,11.5190,0.13000],
  ],
  length: [ // age_months, L, M, S
    [0,1,49.1477,0.03790],[1,1,53.6872,0.03580],[2,1,57.0673,0.03611],
    [3,1,59.8029,0.03514],[4,1,62.0899,0.03483],[5,1,64.0301,0.03469],
    [6,1,65.7311,0.03464],[7,1,67.2873,0.03473],[8,1,68.7498,0.03494],
    [9,1,70.1435,0.03520],[10,1,71.4818,0.03549],[11,1,72.7710,0.03580],
    [12,1,73.9077,0.03611],[15,1,77.5049,0.03717],[18,1,80.7170,0.03825],
    [21,1,83.6573,0.03900],[24,1,86.4000,0.03950],
  ],
  head: [ // age_months, L, M, S
    [0,1,33.8787,0.03496],[1,1,36.5463,0.03314],[2,1,38.2521,0.03204],
    [3,1,39.5328,0.03148],[4,1,40.5817,0.03116],[5,1,41.4590,0.03096],
    [6,1,42.1849,0.03081],[7,1,42.8040,0.03073],[8,1,43.3445,0.03070],
    [9,1,43.8096,0.03070],[10,1,44.2049,0.03072],[11,1,44.5583,0.03078],
    [12,1,44.8915,0.03086],[15,1,45.5866,0.03103],[18,1,46.2490,0.03121],
    [21,1,46.7616,0.03133],[24,1,47.1900,0.03140],
  ],
};

window.interpolateLMS = function(table, ageMonths) {
  if (ageMonths <= table[0][0]) return { L: table[0][1], M: table[0][2], S: table[0][3] };
  if (ageMonths >= table[table.length-1][0]) { const l = table[table.length-1]; return { L: l[1], M: l[2], S: l[3] }; }
  for (let i = 0; i < table.length - 1; i++) {
    if (ageMonths >= table[i][0] && ageMonths <= table[i+1][0]) {
      const t = (ageMonths - table[i][0]) / (table[i+1][0] - table[i][0]);
      return { L: table[i][1]+(table[i+1][1]-table[i][1])*t, M: table[i][2]+(table[i+1][2]-table[i][2])*t, S: table[i][3]+(table[i+1][3]-table[i][3])*t };
    }
  }
  const l = table[table.length-1]; return { L: l[1], M: l[2], S: l[3] };
};

window.calcZScore = function(value, lms) {
  if (!value || !lms) return null;
  const { L, M, S } = lms;
  if (Math.abs(L) < 0.001) return Math.log(value / M) / S;
  return (Math.pow(value / M, L) - 1) / (L * S);
};

window.zToPercentile = function(z) {
  if (z === null) return null;
  // Approximation of standard normal CDF
  return Math.round(100 / (1 + Math.exp(-1.7155277 * z - 0.2716 * z * z * z)));
};

window.getPercentile = function(value, table, ageMonths) {
  const lms = window.interpolateLMS(table, ageMonths);
  const z = window.calcZScore(value, lms);
  return { z, percentile: window.zToPercentile(z), median: lms.M };
};
