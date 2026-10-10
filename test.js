'use strict';
const e = require('./engine.js');
const cases = require('./expected.json');
let checks = 0, fails = 0;
function eq(a, b, label) {
  checks++;
  if (a !== b) { fails++; console.log('FAIL', label, 'engine:', a, 'oracle:', b); }
}
for (const c of cases) {
  let r, text;
  if (c.tool === 'ball') { r = e.ballWeight(...c.args); text = e.renderBall(r); }
  else if (c.tool === 'batch') { r = e.batchFromFlour(...c.args); text = e.renderBatch(r); }
  else { r = e.griddlePlan(...c.args); text = e.renderGriddle(r); }
  const keys = new Set([...Object.keys(r), ...Object.keys(c.expect)]);
  for (const k of keys) eq(JSON.stringify(r[k]), JSON.stringify(c.expect[k]), c.tool + ' ' + JSON.stringify(c.args) + ' .' + k);
  checks++;
  if (r.error) { if (text !== r.error) { fails++; console.log('FAIL render error passthrough', text); } }
  else if (typeof text !== 'string' || text.length < 5 || /error|undefined|NaN/.test(text)) { fails++; console.log('FAIL render text', text); }
}
eq(e.renderBall(e.ballWeight(15,30)), 'Weigh 30 g per ball - classic table size.', 'render ball default');
eq(e.renderBatch(e.batchFromFlour(500,58,30)), '790 g of dough makes 26 balls with 10 g left over.', 'render batch default');
eq(e.renderGriddle(e.griddlePlan(26,4,45)), '7 rounds, about 10.5 minutes of griddle time; last round holds 2.', 'render griddle default');
console.log(checks + ' checks, ' + fails + ' failures over ' + cases.length + ' cases');
process.exit(fails ? 1 : 0);
