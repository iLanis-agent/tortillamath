# Tortilla math oracle - mirrors engine.js float ops exactly (math.floor(x+0.5) == JS Math.round for positive magnitudes).
import json, math

def round1(x):
    return math.floor(x * 10 + 0.5) / 10

def ball_weight(diameterCm, gramsAt15):
    if not (diameterCm > 0): return {"error": "diameter must be positive"}
    if not (gramsAt15 > 0): return {"error": "reference weight must be positive"}
    weight = round1(gramsAt15 * (diameterCm / 15) * (diameterCm / 15))
    band = "street-taco size" if diameterCm < 12 else ("classic table size" if diameterCm <= 18 else "burrito territory")
    return {"weight": weight, "band": band}

def batch_from_flour(flourG, hydrationPct, ballG):
    if not (flourG > 0): return {"error": "flour must be positive"}
    if not (hydrationPct > 0): return {"error": "hydration must be positive"}
    if not (ballG > 0): return {"error": "ball weight must be positive"}
    dough = round1(flourG * (1 + hydrationPct / 100))
    balls = math.floor(dough / ballG)
    leftover = round1(dough - balls * ballG)
    return {"dough": dough, "balls": balls, "leftover": leftover}

def griddle_plan(count, perBatch, secondsPerSide):
    if not (count > 0): return {"error": "count must be positive"}
    if not (perBatch > 0): return {"error": "griddle capacity must be positive"}
    if not (secondsPerSide > 0): return {"error": "seconds must be positive"}
    rounds = math.ceil(count / perBatch)
    totalMin = round1(rounds * 2 * secondsPerSide / 60)
    lastRound = count - (rounds - 1) * perBatch
    return {"rounds": rounds, "totalMin": totalMin, "lastRound": lastRound}

cases = []
def bw(*a): cases.append({"tool": "ball", "args": list(a), "expect": ball_weight(*a)})
def bf(*a): cases.append({"tool": "batch", "args": list(a), "expect": batch_from_flour(*a)})
def gp(*a): cases.append({"tool": "griddle", "args": list(a), "expect": griddle_plan(*a)})

# ball: happy
bw(15, 30)      # exactly classic reference
bw(25, 30)      # 83.3 burrito
bw(10, 30)      # 13.3 street
bw(12, 30)      # 19.2 classic boundary (12 is classic)
bw(11.9, 30)    # street
bw(18, 30)      # classic boundary 43.2
bw(18.1, 30)    # burrito 43.7
bw(20, 25)      # custom reference: 44.4
bw(7.5, 30)     # 7.5
bw(30, 40)      # 160
# ball: errors
bw(0, 30)
bw(-15, 30)
bw(15, 0)
bw(15, -5)

# batch: happy
bf(500, 58, 30)     # defaults 790 -> 26, 10
bf(250, 60, 30)     # 400 -> 13, 10
bf(1000, 55, 83.3)  # 1550 -> 18, 50.6? 1550-18*83.3=1550-1499.4=50.6
bf(300, 50, 20)     # 450 -> 22, 10
bf(120, 58, 30)     # 189.6 -> 6, 9.6
bf(96, 50, 12)      # exact: 144 -> 12, 0
bf(750.5, 57.5, 33.3)  # decimals
bf(200, 70, 40)     # 340 -> 8, 20
# batch: errors
bf(0, 58, 30)
bf(-500, 58, 30)
bf(500, 0, 30)
bf(500, 58, 0)
bf(500, -2, 30)

# griddle: happy
gp(26, 4, 45)       # defaults: 7 rounds 10.5 min last 2
gp(24, 4, 45)       # exact: 6 rounds 9
gp(1, 4, 45)        # single
gp(4, 4, 60)        # one round 2 min
gp(50, 6, 40)       # 9 rounds 12
gp(10, 3, 50)       # 4 rounds 6.7
gp(30, 5, 42.5)     # decimal seconds: 6 rounds 8.5
# griddle: errors
gp(0, 4, 45)
gp(-10, 4, 45)
gp(26, 0, 45)
gp(26, 4, 0)
gp(26, -1, 45)

with open("expected.json", "w") as f:
    json.dump(cases, f, indent=1)
print(len(cases), "cases written")
