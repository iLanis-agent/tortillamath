// Tortilla math engine - tortilla batch planning arithmetic.
// Pure functions, no DOM. All borrowed norms are labeled in the UI, not buried here.
'use strict';

function round1(x) { return Math.round(x * 10) / 10; }

// --- Ball weight -------------------------------------------------------------
// Weight scales with area. Labeled norm: 30 g rolls out to a classic 15 cm
// round on a typical press; your dough and press may differ.
function ballWeight(diameterCm, gramsAt15) {
  if (!(diameterCm > 0)) return { error: 'diameter must be positive' };
  if (!(gramsAt15 > 0)) return { error: 'reference weight must be positive' };
  var weight = round1(gramsAt15 * (diameterCm / 15) * (diameterCm / 15));
  var band = diameterCm < 12 ? 'street-taco size' : diameterCm <= 18 ? 'classic table size' : 'burrito territory';
  return { weight: weight, band: band };
}

// --- Batch from flour --------------------------------------------------------
// Flour plus hydration gives dough weight; the ball weight decides the count.
function batchFromFlour(flourG, hydrationPct, ballG) {
  if (!(flourG > 0)) return { error: 'flour must be positive' };
  if (!(hydrationPct > 0)) return { error: 'hydration must be positive' };
  if (!(ballG > 0)) return { error: 'ball weight must be positive' };
  var dough = round1(flourG * (1 + hydrationPct / 100));
  var balls = Math.floor(dough / ballG);
  var leftover = round1(dough - balls * ballG);
  return { dough: dough, balls: balls, leftover: leftover };
}

// --- Griddle plan ------------------------------------------------------------
// Labeled heuristic: seconds per side, two sides. Time is a plan, not a
// doneness verdict - the puff and the spots tell you when.
function griddlePlan(count, perBatch, secondsPerSide) {
  if (!(count > 0)) return { error: 'count must be positive' };
  if (!(perBatch > 0)) return { error: 'griddle capacity must be positive' };
  if (!(secondsPerSide > 0)) return { error: 'seconds must be positive' };
  var rounds = Math.ceil(count / perBatch);
  var totalMin = round1(rounds * 2 * secondsPerSide / 60);
  var lastRound = count - (rounds - 1) * perBatch;
  return { rounds: rounds, totalMin: totalMin, lastRound: lastRound };
}

// --- Text rendering (shared by UI and tests) ---------------------------------
function renderBall(r) {
  if (r.error) return r.error;
  return 'Weigh ' + r.weight + ' g per ball - ' + r.band + '.';
}
function renderBatch(r) {
  if (r.error) return r.error;
  return r.dough + ' g of dough makes ' + r.balls + ' balls with ' + r.leftover + ' g left over.';
}
function renderGriddle(r) {
  if (r.error) return r.error;
  return r.rounds + ' rounds, about ' + r.totalMin + ' minutes of griddle time; last round holds ' + r.lastRound + '.';
}

var api = {
  round1: round1,
  ballWeight: ballWeight,
  batchFromFlour: batchFromFlour,
  griddlePlan: griddlePlan,
  renderBall: renderBall,
  renderBatch: renderBatch,
  renderGriddle: renderGriddle
};
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.TortillaMath = api;
