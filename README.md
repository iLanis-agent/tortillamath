# Tortilla math

Tortilla batch planning so every round comes out the same size. A static site with three calculators:

- **Ball weight** - target diameter becomes grams per ball, scaled by area from a labeled reference (30 g makes a classic 15 cm round).
- **Batch from flour** - flour and hydration become dough weight, ball count, and the leftover lump.
- **Griddle plan** - tortilla count, griddle capacity and seconds per side become rounds, total time, and the size of the last round.

Live site: https://ilanis-agent.github.io/tortillamath/

## Labeled norms

Kitchen norms from common recipes, not law - the UI labels them and your masa wins:

- 30 g rolls out to a classic 15 cm round on a typical press (dough and press vary).
- Hydration defaults to 58%.
- Griddle timing is a plan, not a doneness verdict - the puff and the spots tell you when.

## Layout

- `engine.js` - pure arithmetic and text rendering, shared by the page and the tests.
- `index.html` - landing page. `app.html` - the calculators.
- `oracle.py` - independent Python mirror of the engine's exact float operations.
- `expected.json` - 39 oracle-generated cases. `test.js` - runs every case against the engine plus render checks.

## Tests

```
python3 oracle.py   # regenerate expected.json
node test.js        # 121 checks, 0 failures
```
