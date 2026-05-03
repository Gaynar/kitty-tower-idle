# Game Design Document — Cat House Idle (v3)

> **Revision notes (v4):** Art direction locked to **painterly HD pixel** style — high-resolution pixel art with large palettes, dithered fur/fabric texture, dark silhouette outlines, and no interior outlines. Section 21 expanded with full style specification. Appendix A updated with technical pixel art specs: resolution, palette rules, anti-aliasing requirements, `image-rendering: pixelated` CSS, animation frame stub, and per-asset production notes.
>
> **Tower direction update:** House expansion now means building upward into a cozy vertical cat tower. Rooms have explicit tower floors; new rooms are added above the current top floor.
>
> Previous revision (v3) scoped roster to 3 launch cats, locked starting rooms to 3, introduced the Like/Dislike trait system, and added the initial asset guide. All prior content remains in force.

---

## 1. High Concept

Cat House Idle is a cozy idle management game about caring for a small group of unique cats while gradually building, expanding, and personalizing a warm vertical cat tower.

Unlike traditional idle games that focus on collecting hundreds of units or endlessly scaling production numbers, Cat House Idle focuses on a limited cast of memorable cats and a tower that grows floor by floor. Each cat has distinct traits, a clear Like and Dislike that shape how they interact with rooms, and relationships that influence how different rooms perform.

The player does not directly control the cats. Instead, they shape the environment around them by assigning cats to rooms, upgrading spaces, placing furniture, expanding the house, and discovering how each cat responds to different conditions.

The fantasy is simple:

> Build a cozy tower, expand it room by room, place your cats wisely, return later, and see how your household has grown upward.

---

## 2. Core Design Pillars

### 2.1 Small Cast, High Attachment

The game starts with **3 cats**. Each one has a name, a clear visual identity, a personality, gameplay traits, and one explicit **Like** and one explicit **Dislike** that define their placement behavior.

The roster is designed to grow. New cats are unlocked through play — not purchased — and each new cat should feel like a meaningful addition, not a slot filler.

The goal is for players to remember cats as characters:

- "Mochi likes the Kitchen but gets grumpy around other cats."
- "Bean is always finding things, but needs company or she gets bored."
- "Miso loves the Bedroom. She hates being crowded."

A small roster only works if every cat feels mechanically and emotionally distinct.

### 2.2 Room Building as Core Progression

The tower is the main progression system. The player starts with 3 stacked rooms and expands upward, one floor at a time. Progression comes from unlocking new upper floors, upgrading existing rooms, adding furniture, and discovering how cats respond to each room's conditions.

The player should regularly think: "What room should I build on top next?" and "Which cats benefit most from this?"

### 2.3 Behavior Over Raw Stats

Cats are not production multipliers. Their value comes from behavior, placement, and interaction — sleeping more in the right room, calming a tense shared space, disrupting a napping cat, or finding something hidden when left alone in a new room.

### 2.4 Indirect Control

The player influences the cats but does not fully control them. Cats act semi-autonomously — mood changes, trait-driven behaviors, reactions to their Like or Dislike conditions, and relationship dynamics all happen on their own.

> The player creates the home. The cats bring it to life.

### 2.5 Cozy Discovery

**What discovery means in this game:** Cat traits, Likes, and Dislikes are always visible — the cats are transparent. Discovery is about finding *interaction chemistry*: what happens when this cat meets that room, this furniture, or that other cat. The player learns rules by experimenting with placement, not by uncovering hidden stats.

Events should be temporary, understandable, recoverable, and connected to specific cats, rooms, or furniture. They should create small stories, not frustration.

**Scale note:** The launch build has a small interaction count by design (3 cats, 3 rooms). The discovery system is built to scale — each new cat and room multiplies the interaction space. Launch is a proof of concept for the chemistry model, not the full expression of it.

### 2.6 Scope Principle

**Start small. Leave room to grow.** This document defines a complete, fun, and shippable starting experience. The systems are designed so that more cats, more rooms, and more interactions can be added later without reworking core logic.

---

## 3. Target Player Experience

> "I check in on my cat house, collect rewards, see how my cats used the rooms, make a few building or placement decisions, and leave feeling like the house is still growing while I'm gone."

**Quick Check-In (30–90 seconds):** Collect idle resources, read 1–3 event cards, make one small upgrade or placement change, and leave.

**Active Management Session (3–5 minutes):** Review cat moods, adjust room assignments, buy furniture, upgrade a room, check the Cat Diary, try to trigger a known synergy, and prepare the house for offline progression.

**House Planning Session (10+ minutes):** Experiment with cat combinations, study discovered interactions, rebuild room strategy, plan room expansion.

---

## 4. Core Gameplay Loop

### 4.1 Primary Session Loop

1. Player opens the game.
2. The game shows resources earned while away.
3. The game shows event cards from offline simulation.
4. Player reviews cat moods and room outcomes.
5. Player adjusts cat placement if desired.
6. Player spends resources on room upgrades, furniture, or house expansion.
7. Player checks new Cat Diary discoveries.
8. Player prepares the house for the next offline period.
9. Player closes the game. Cats continue generating resources and events.

### 4.2 Strategic Loop

Build and expand rooms → assign cats to rooms → cats enter temporary states over time → rooms generate resources based on cats, moods, upgrades, and furniture → interactions trigger bonuses, discoveries, or relationship changes → events teach the player about room and cat behavior → player reacts by changing placement or investing resources → new cats, rooms, furniture, and diary entries unlock.

### 4.3 Return Motivation Loop

Return hooks: collecting Coins and Comfort, seeing how rooms performed while away, discovering new Cat Diary entries, checking whether a relationship improved, seeing if a rare event triggered, and preparing the house for a different offline strategy.

The best return moment is not just "Number went up." It should be: "Number went up, *and* Miso discovered a new Nap Pile bonus in the upgraded Bedroom."

---

## 5. Core Resources

### 5.1 Coins

The primary building and upgrade currency.

**Generated by:** Productive rooms, cats in preferred conditions, Kitchen setups, certain room events, and furniture bonuses.

**Used for:** Room upgrades, furniture, house expansion, basic unlocks, capacity improvements.

### 5.2 Comfort

Represents how happy, safe, and settled the household feels.

**Generated by:** Calm cats, cozy rooms, good placements, Bedroom setups, positive relationships, and well-furnished rooms.

**Used for:** Unlocking new cats, improving offline gains, unlocking relationship insights, and upgrading cozy furniture.

### 5.3 Optional Later Resource: Curiosity

Represents discovery and cat interest. Should only be added after the core room and interaction systems are proven fun. Not part of the launch build.

---

## 6. Economy Specification

*All values are starting points for playtesting and should be adjusted based on feel.*

### 6.1 Pacing Target

The game targets a **medium pace**: checking in every 30–60 minutes is satisfying, active sessions of 10+ minutes are rewarding. The first room upgrade should be reachable after roughly **1–2 hours** of real time from a fresh start.

### 6.2 Base Production Rates

Production rates are expressed per **real-time minute** while the game is open or simulating offline. Each cat in a room contributes their base rate, modified by trait, state, furniture, and interaction bonuses.

**Coins per minute (base, no modifiers):**

| Room | Cat | Base Coins/min |
|---|---|---|
| Kitchen | Mochi (alone) | 2 |
| Kitchen | Any other cat | 0.8 |
| Living Room | Any cat | 0.7 |
| Bedroom | Any cat | 0.2 |

**Comfort per minute (base, no modifiers):**

| Room | Cat | Base Comfort/min |
|---|---|---|
| Bedroom | Miso (sleeping) | 1.5 |
| Bedroom | Any other cat | 0.4 |
| Living Room | Bean (with another cat) | 0.8 |
| Living Room | Any calm cat | 0.4 |
| Kitchen | Any cat | 0 |

*Revised from original values (Mochi was 12 Coins/min) to match the 1–2 hour first-upgrade pacing target. At these rates, early total household output is ~4 Coins/min and ~2.5 Comfort/min.*

**Modifier stacking formula:**

```
output = (base_rate + flat_bonuses) × M1 × M2 × M3 … capped at ×2.5 total multiplier
```

Flat bonuses add to base rate before any multiplication. Multiplicative modifiers all stack by multiplication (not addition). The ×2.5 cap applies to the final multiplier product.

| Modifier | Type | Value |
|---|---|---|
| Cat in their Liked room or condition | Multiplicative | ×1.5 |
| Active synergy | Multiplicative | ×1.25 |
| Relevant furniture present | Flat | +2 Coins/min or +1 Comfort/min per piece |
| Dislike condition active | Multiplicative | ×0.6 |
| Grumpy state | Multiplicative | ×0.5 (suppresses all synergies) |
| Positive state (Cuddly, Focused, Relaxed) | Multiplicative | ×1.2 |

**Worked example — Miso in Bedroom, Sleeping, Heated Blanket, no other cats:**
1. Base Comfort/min: 1.5
2. Flat bonus (Heated Blanket): +1.0
3. Base + flat: **2.5**
4. Multipliers: Sleeping × Lazy cat modifier = ×1.8; Like (Bedroom) = ×1.5
5. Product: 1.8 × 1.5 = 2.7 → **capped at ×2.5**
6. Final output: 2.5 × 2.5 = **6.25 Comfort/min**

### 6.3 Upgrade Costs

Costs are set so a player reaching a room upgrade for the first time has had roughly 1–2 hours of idle time.

**Room upgrades:**

| Upgrade | Coins cost | Comfort cost |
|---|---|---|
| Living Room: Soft Sofa | 240 | 0 |
| Living Room: Tall Cat Tree | 450 | 60 |
| Living Room: Toy Basket | 360 | 0 |
| Kitchen: Extra Food Bowls | 300 | 0 |
| Kitchen: Treat Cabinet | 540 | 0 |
| Kitchen: Countertop Expansion | 900 | 0 |
| Bedroom: Heated Blanket | 270 | 30 |
| Bedroom: Quiet Corner | 390 | 60 |
| Bedroom: Moonlit Window | 750 | 90 |
| Room expansion (any room, Level 2) | 1200 | 150 |
| Room expansion (any room, Level 3) | 2700 | 360 |

*All costs ~3× original values, revised to match adjusted production rates. At ~4 Coins/min early output: first furniture upgrade ~60 min, first room expansion ~5 hours. Tune during playtesting.*

**Cat unlocks:**

| Cat unlock trigger | Requirement |
|---|---|
| 4th cat: Comfort threshold unlock | 500 Comfort |
| 5th+ cat: event-driven or diary-driven | See Section 19 |

### 6.4 Offline Cap

The offline earnings cap is **4–6 hours** of equivalent production. After the cap, production stops, but the house continues simulating state changes and events.

- Base cap: 4 hours
- Cozy Bedroom upgrade: 5 hours
- Moonlit Window: 6 hours
- Dream Bedroom (post-launch): 8 hours

---

## 7. Cat System

### 7.1 Cat Structure

Each cat has:

- A name and personality description
- 1–2 **Traits** (passive behavioral modifiers)
- One **Like** — a specific room, condition, or furniture type that boosts their output and mood
- One **Dislike** — a specific condition (room state, nearby cat type, capacity, etc.) that reduces their output and raises Grumpy risk
- A mood tendency (how quickly they shift states)
- A gameplay role
- An unlock condition
- A favorite furniture type
- Short flavor text

The Like and Dislike are always visible to the player on the cat's profile card. They are not hidden systems — the player can and should use them to make placement decisions.

### 7.2 Cat Traits

**Lazy:** Sleeps more often. Less output while active, but improves offline gains in restful rooms. Best for: Bedroom, offline strategies, Comfort generation.

**Playful:** Triggers more light events. Higher chance of bonus interactions and discovery moments. Best for: Living Room, discovery setups.

**Curious:** Finds hidden bonuses faster. Higher chance of room discoveries. Best for: any room, Cat Diary progression.

**Calm:** Reduces tension in shared rooms. Improves Comfort generation. Best for: stabilizing shared rooms, relationship building.

**Greedy:** Generates extra Coins in food-related rooms or near food furniture. Best for: Kitchen, Coin generation.

**Territorial:** Performs better alone or in spacious rooms. Dislikes overcrowded or underdeveloped rooms. Best for: solo room assignments, expanded rooms.

**Social:** Gains bonuses when placed with other cats. More likely to trigger synergy events. Best for: Living Room, bonding, multi-cat rooms.

**Mischievous:** Finds unusual discoveries and triggers playful household events. Best for: discovery setups, toy-focused rooms.

### 7.3 Cat States and Transitions

Cats move between behavioral states through time-based decay and event-triggered changes.

**Available states:** Resting, Active, Playing, Hungry, Sleeping, Curious, Cuddly, Focused, Relaxed, Grumpy.

**Transition rules:**

| From state | To state | Trigger type | Condition |
|---|---|---|---|
| Active | Resting | Time-based | After 20–30 min in same room |
| Resting | Sleeping | Time-based | After 15 min Resting (Lazy cats: 8 min) |
| Sleeping | Active | Time-based | After 30–60 min Sleeping |
| Active | Grumpy | Event-triggered | Dislike condition is active |
| Grumpy | Relaxed | Time-based | After 15 min with Dislike removed |
| Grumpy | Relaxed | Event-triggered | Quiet Corner furniture present |
| Active | Cuddly | Event-triggered | Bonded relationship + Social cat nearby |
| Active | Focused | Event-triggered | Cat placed in Liked room with matching furniture |
| Any | Hungry | Time-based | Every 45–60 min, higher chance in Kitchen |
| Hungry | Active | Event-triggered | Food-related furniture present in room |
| Active | Curious | Event-triggered | Playful or Mischievous cat triggers discovery check |
| Sleeping | Grumpy | Event-triggered | Playful cat in same room interrupts sleep |

Trait modifiers on duration:
- Lazy cats: ×0.6 on time to reach Sleeping
- Calm cats: ×0.5 on Grumpy duration
- Quiet Corner furniture: removes Grumpy after 8 min flat

**Transition duration sampling:** When a cat enters a new state, sample the transition duration once from the specified range and store it as `stateTransitionDue` (Unix ms: `Date.now() + sampledDurationMs`). Transitions fire when `Date.now() >= stateTransitionDue`. This value is stored in save data and respected by the offline simulation — if the offline period crosses `stateTransitionDue`, the transition fires during the appropriate virtual tick. On reload, `stateTransitionDue` is never reset; the original sampled deadline is honoured.

**State effects on production:**

| State | Coins modifier | Comfort modifier | Notes |
|---|---|---|---|
| Active | ×1.0 | ×1.0 | Baseline |
| Resting | ×0.7 | ×1.2 | |
| Sleeping | ×0.3 | ×1.5 | Lazy cats: ×1.8 Comfort |
| Focused | ×1.3 | ×1.0 | |
| Cuddly | ×0.8 | ×1.4 | |
| Relaxed | ×1.1 | ×1.2 | |
| Grumpy | ×0.5 | ×0.5 | Suppresses synergies |
| Curious | ×1.0 | ×1.0 | Raises event check chance |
| Hungry | ×1.2 (Kitchen only) | ×0.8 | |
| Playing | ×0.8 | ×1.1 | Raises toy-event chance |

### 7.4 Relationship Progression

Relationships between cat pairs are tracked by a hidden integer `relationshipScore`. The score changes through shared events, not time. This means two cats who never interact stay neutral indefinitely — relationships only form through play.

**Score thresholds:**

| Score | Relationship tier | Save value |
|---|---|---|
| ≤ −10 | Rival | `"rival"` |
| −9 to −1 | Avoidant | `"avoidant"` |
| 0–9 | Neutral (default) | `"neutral"` |
| 10–24 | Friendly | `"friendly"` |
| ≥ 25 | Bonded | `"bonded"` |

**Score floor:** −15. **Score ceiling:** 40. Clamp after every update.

**Score changes per event:**

| Trigger | Change |
|---|---|
| Positive shared event (Shared Sunbeam, Quiet Afternoon, etc.) fires | +2 |
| Synergy interaction fires involving both cats | +3 |
| Conflict interaction fires involving both cats | −3 |
| Either cat is Grumpy while sharing a room (per 5-min tick) | −1 |
| Both cats in a positive state (Relaxed, Cuddly, Focused) in same room (per 5-min tick) | +1 |

**Reversibility:** All tiers are reversible. `bonded` degrades to `friendly` when the score drops below 25; `friendly` degrades to `neutral` below 10. Negative tiers (`avoidant`, `rival`) recover by accumulating positive events — there is no permanent relationship state. `rival` is simply `avoidant` with a worse score, not a special flag.

**Relationship effects:**

| Tier | Effect |
|---|---|
| `bonded` | +6% event rate when sharing a room; unlocks unique bonded diary entries |
| `friendly` | +3% event rate when sharing a room |
| `neutral` | No modifier |
| `avoidant` | −3% event rate; slightly higher Grumpy risk when sharing a room |
| `rival` | −6% event rate; Grumpy risk increased; suppresses synergies between this pair |

**Save schema addition:** Add `relationshipScore` alongside each relationship entry:

```json
"relationships": {
  "bean": { "score": 14 },
  "mochi": { "score": 3 }
}
```

Only `score` is stored. `tier` is always derived from `score` at load time and never persisted. Storing both would risk silent desync; the recalculation is a single comparison against five thresholds.

---

## 8. Room System

Rooms define the context in which cats behave. The game launches with 3 rooms arranged as a vertical starter tower. Additional rooms are unlocked during mid-game progression and are placed above the current top floor.

**Launch tower order:**

| Floor | Room |
|---|---|
| 3 | Bedroom |
| 2 | Living Room |
| 1 | Kitchen |

### 8.1 Living Room (Launch)

**Role:** Flexible starter room. **Produces:** Coins and Comfort. **Capacity:** 2 cats (base). **Special rule:** Social cats are more likely to trigger synergies here.

### 8.2 Kitchen (Launch)

**Role:** Productive resource room. **Produces:** Coins. **Capacity:** 1 cat (base). **Special rule:** Food-related cats gain bonuses from Kitchen furniture.

### 8.3 Bedroom (Launch)

**Role:** Offline progression and recovery. **Produces:** Comfort and offline bonuses. **Capacity:** 2 cats (base). **Special rule:** Sleeping cats improve offline gains.

### 8.4 Garden (Stage 2 Unlock)

**Role:** Discovery and relaxation. **Produces:** Comfort. **Capacity:** 2 cats (base). **Special rule:** Higher chance of visitor encounters and hidden discoveries.

### 8.5 Study (Stage 2 Unlock)

**Role:** Knowledge and meta-progression. **Produces:** Comfort. **Capacity:** 1 cat (base). **Special rule:** Improves Cat Diary hints and reveals interaction clues.

### 8.6 [PLACEHOLDER] Bathroom (Stage 2 Unlock)

**Role:** [PLACEHOLDER] **Produces:** [PLACEHOLDER] **Capacity:** [PLACEHOLDER] cats (base). **Special rule:** [PLACEHOLDER]

### 8.7 [PLACEHOLDER] Hallway (Stage 2 Unlock)

**Role:** [PLACEHOLDER — suggested: transitional space; cats passing through have a chance to trigger brief interactions] **Produces:** [PLACEHOLDER] **Capacity:** [PLACEHOLDER] cats (base). **Special rule:** [PLACEHOLDER]

### 8.8 [PLACEHOLDER] Porch (Stage 2 Unlock)

**Role:** [PLACEHOLDER — suggested: outdoor-adjacent relaxation; weather or time-of-day events] **Produces:** [PLACEHOLDER] **Capacity:** [PLACEHOLDER] cats (base). **Special rule:** [PLACEHOLDER]

### 8.9 [PLACEHOLDER] Sunroom (Stage 3 Unlock)

**Role:** [PLACEHOLDER] **Produces:** [PLACEHOLDER] **Capacity:** [PLACEHOLDER] cats (base). **Special rule:** [PLACEHOLDER]

### 8.10 [PLACEHOLDER] Playroom (Stage 3 Unlock)

**Role:** [PLACEHOLDER — suggested: high Playful/Mischievous output; toy-event focus] **Produces:** [PLACEHOLDER] **Capacity:** [PLACEHOLDER] cats (base). **Special rule:** [PLACEHOLDER]

### 8.11 [PLACEHOLDER] Library Nook (Stage 3 Unlock)

**Role:** [PLACEHOLDER] **Produces:** [PLACEHOLDER] **Capacity:** [PLACEHOLDER] cats (base). **Special rule:** [PLACEHOLDER]

---

## 9. House Building and Expansion

Tower building is the central progression system.

### 9.1 House Growth Stages

**Stage 1 — Starter Cat Tower (Launch):** Kitchen on floor 1, Living Room on floor 2, Bedroom on floor 3. Teaches basic placement, Coins and Comfort, cat preferences, Like/Dislike mechanics, furniture, and the Cat Diary.

**Stage 2 — Taller Tower (Post-Launch):** Adds Garden, Study, Bathroom, Hallway, or Porch as floors above the starter tower. Adds discovery, more placement decisions, and early vertical layout planning.

**Stage 3 — Specialized Cat Tower (Later):** Adds Sunroom, Playroom, Library Nook, Pantry, Loft, or Observatory-style tower rooms. Supports advanced cat relationships and rare interactions.

### 9.1.1 Upward Expansion Rule

Each room has a `towerFloor` integer. Floors increase upward. The UI renders higher floor numbers above lower floor numbers. New room unlocks receive the next available floor number unless a future feature explicitly allows reordering.

### 9.2 Room Expansion Paths

Each room has multiple expansion levels that add capacity, furniture slots, and behavioral changes. Room specialization paths (branching upgrade directions per room) are a **post-launch feature** — the launch build uses the linear upgrade paths defined in Section 6.3 only.

### 9.3 Furniture as Room Identity

Furniture affects cat states, room production, cat preferences, event pools, relationship growth, offline bonuses, and capacity pressure.

Key furniture examples (launch): Heated Blanket (Bedroom, Lazy cats), Toy Basket (Living Room, Playful cats), Extra Food Bowls (Kitchen, Greedy/Territorial cats), Soft Sofa (Living Room, Social cats), Quiet Cubby (Bedroom, Territorial cats).

---

## 10. Room Capacity

| Room | Base capacity | Max capacity |
|---|---|---|
| Living Room | 2 cats | 3 cats |
| Kitchen | 1 cat | 2 cats |
| Bedroom | 2 cats | 3 cats |
| Garden | 2 cats | 3 cats |
| Study | 1 cat | 2 cats |
| Bathroom | [PLACEHOLDER] | [PLACEHOLDER] |
| Hallway | [PLACEHOLDER] | [PLACEHOLDER] |
| Porch | [PLACEHOLDER] | [PLACEHOLDER] |
| Sunroom | [PLACEHOLDER] | [PLACEHOLDER] |
| Playroom | [PLACEHOLDER] | [PLACEHOLDER] |
| Library Nook | [PLACEHOLDER] | [PLACEHOLDER] |

---

## 11. Interaction System

Interactions occur when cats, traits, states, rooms, furniture, and relationships overlap. The player should eventually understand interactions as recipes: `cat + room + condition + furniture + other cat = possible outcome.`

### 11.1 Synergy Interactions (Launch)

**Nap Pile:** Two Lazy or Calm cats in the Bedroom → increased offline Comfort for several hours. Diary: "Some cats sleep better when they trust each other."

**Kitchen Focus:** Mochi alone in the Kitchen with food furniture → increased Coin generation. Diary: "A cat with purpose and a full bowl can accomplish great things."

**Quiet Evening:** Miso in the Bedroom while the Living Room has no Grumpy cats → Comfort bonus. Diary: "Miso seems to sleep better when the house is quiet." *Implementation note: "calm Living Room" means no cats currently in Grumpy state are assigned to the Living Room. Evaluated each tick.*

### 11.2 Conflict Interactions (Launch)

**Territory Dispute:** Territorial cat with another cat in a low-capacity room → reduced Comfort, Grumpy risk. Counterplay: expand the room, add furniture, or separate cats.

**Food Bowl Disagreement:** Greedy cat (Mochi) with another cat in Kitchen → Mochi gains Coins, other cat may become Grumpy. Counterplay: add Extra Food Bowls or move one cat.

**Interrupted Nap:** Playful cat (Bean) with Sleeping or Lazy cat (Miso) → Miso becomes Grumpy, Bean may gain a discovery bonus. Counterplay: place Bean in the Living Room instead.

### 11.3 Discovery Interactions (Launch)

**Hidden Toy:** Playful cat in active room → small Comfort gain, chance of toy diary entry.

**Midnight Playtime:** Playful cat active during offline → bonus Coins or Comfort, toy/room diary progress.

### 11.4 Adding New Interactions Later

New interactions can be added by appending to room-specific event pools and adding diary entries. No core system changes are required. Each interaction needs: a trigger condition, a mechanical effect, a Cat Diary entry, and optional flavor text.

---

## 12. Interaction Priority Rules

When multiple interactions, traits, states, and furniture effects apply simultaneously:

**Priority order (highest to lowest):**

1. **Explicit conflict states** — Grumpy suppresses all synergy bonuses for that cat, regardless of other rules.
2. **Most specific rule** — furniture targeting a specific trait overrides a general room rule.
3. **Relationship bonuses** — a Bonded pair in the same room applies their relationship bonus on top of room and furniture rules.
4. **Room-level rules** — general production modifiers apply after all the above.
5. **Base rates** — flat coins/comfort per minute from Section 6.2 are the floor.

**Stacking cap:** No cat can exceed ×2.5 total multiplier on any single resource.

**Like/Dislike in priority resolution:**
- A Like condition counts as a specificity-level 2 bonus (above room-level, below furniture).
- A Dislike condition active on a cat suppresses their Like bonus entirely. A cat cannot be benefiting from their Like at the same time their Dislike is active.

**Example resolution:**
Miso (Like: Bedroom, Dislike: Crowded rooms) is Sleeping in the Bedroom with a Heated Blanket and no other cats. Resolution:
1. No Grumpy state — proceed.
2. Heated Blanket improves Sleeping bonuses for Lazy cats: applies.
3. No relationship bonus active.
4. Bedroom room bonus for Sleeping cats: applies.
5. Like condition (Bedroom) active: ×1.5 bonus applies.
6. Dislike condition (crowded) not active — Like bonus is not suppressed.
7. All modifiers stack up to the ×2.5 cap on Comfort output.

---

## 13. Event System

Events are the main way the game tells stories. Events happen while the player is active, while offline, when cats are placed together, when a room condition is met, or when furniture modifies the event pool.

### 13.1 Event Design Rules

Each event should answer four questions: Why did this happen? Which cat caused it? What changed mechanically? What can the player learn from it?

### 13.2 Event Card Format

Each event card includes: event title, involved cat or cats, room, short flavor text, mechanical effect, optional player choice, and Cat Diary progress if relevant.

### 13.3 Event Trigger Rates

Events are checked on a **5-minute tick** while the app is open. During offline simulation, the same tick logic runs compressed.

**Base event chance per tick per cat:**

| Condition | Chance per tick |
|---|---|
| Default (any cat, any room) | 8% |
| Cat in their Liked room or condition | 12% |
| Cat in Liked condition + matching furniture | 18% |
| Playful or Mischievous trait | +5% additive |
| Curious trait | +4% additive |
| Grumpy state | −6% additive |
| Dislike condition active | −4% additive |
| Two cats with Bonded relationship in same room | +6% additive |

Events draw from a pool specific to the room and cats present. Once an event fires, it goes on a 30-minute cooldown for that cat. Rare events have a base 2% chance and no trait modifiers. Event cooldowns are persisted in save data as `eventCooldowns: { eventId: timestampMs }` (see Section 16.4) and are respected during offline simulation — the same event cannot fire more than once per 30-minute window even across sessions.

### 13.4 Launch Event Examples

1. **Hidden Toy** — Playful cat in active room → small Comfort gain, toy diary entry chance.
2. **Unexpected Nap Pile** — Two Lazy/Calm cats in Bedroom → increased offline Comfort, Cat Diary entry.
3. **Food Bowl Disagreement** — Mochi with another cat in Kitchen → one cat Grumpy, bonus Coins.
4. **Midnight Playtime** — Playful cat during offline → bonus Coins/Comfort, toy/room diary progress.
5. **Quiet Afternoon** — Calm cats in Living Room → Comfort boost, relationship progress.
6. **New Favorite Spot** — Cat spends repeated time in furnished room → preference bonus, diary hint.
7. **Shared Sunbeam** — Two cats both in Resting or Sleeping state in the same room → Comfort gain, bond progress.
8. **Stolen Snack** — Mochi in Kitchen → extra Coins, possible Grumpy state, kitchen hint.

---

## 14. Visibility and Discovery

### 14.1 Always Visible

Cat traits, Like, Dislike, current state, room assignment, basic production estimate, obvious conflicts, current room mood, furniture effects, and room capacity.

**Design intent:** Cats are transparent by design. Showing Like and Dislike upfront is not a spoiler — it is an invitation to experiment. The thing that is *not* shown upfront is what happens when specific cats, rooms, furniture, and states combine. That chemistry is the discovery layer.

### 14.2 Hints

Partial information guides experimentation: "Miso seems more relaxed around calm cats." "Something interesting may happen if you leave Mochi alone in the Kitchen."

### 14.3 Cat Diary

Once an interaction occurs, it is recorded in the Cat Diary. The diary tracks: cat profiles, discovered traits, known Likes and Dislikes, favorite furniture, discovered synergies, conflicts, discovery events, cat relationships, and hints for undiscovered interactions.

**Target entry counts (launch):**

| Tab | Target entries | Notes |
|---|---|---|
| Cats | 3 | One per cat. All unlocked at game start — no discovery required. |
| Interactions | 8–10 | Covers all named synergies, conflicts, and discovery interactions from Section 11. At least 1 requires a rare event (2% base chance) to unlock. |
| Events | 12–15 | One entry per event type from Section 13.4, plus a few unlocked only by specific furniture or relationship combos. |
| Hints | 4–6 | Hint entries point toward undiscovered interactions. They appear automatically after a cat has spent 2+ separate play sessions in the relevant room without triggering the associated interaction. |

**Session definition for hints:** A "session" is a single app-open period during which the cat spent ≥5 continuous minutes in that room. Session counts are tracked per cat per room in `cat.roomSessions` (see Section 16.4). Moving a cat to a different room resets the in-progress session timer for the original room.

**Diary entry unlock:** Interaction entries unlock when the associated event fires for the first time (for event-linked interactions) or when the synergy bonus first applies (for passive synergies). No player dismissal is required. Each entry is stored as `{ id: string, discoveredAt: timestampMs }` in `diary.interactions`. An absent entry means undiscovered — there is no `discovered: false` state. The same structure applies to `diary.events`. Hint entries are stored as `{ id: string, catId: string, roomId: string, discoveredAt: timestampMs }` in `diary.hints`.

**Completion counter visibility:** Once the player has found at least one entry in a tab, show a counter: "3 of 10 discovered." Before finding the first entry in a tab, show no counter — the total size stays hidden. This preserves mystery on first open while rewarding completionists once they're engaged.

**Undiscovered entries** are shown as locked silhouettes with a one-line hint. The hint is always visible even before the entry is unlocked — it is an invitation to experiment, not a gating mechanic.

---

## 15. Idle and Offline Progression

Offline gains are influenced by cat placement, Like/Dislike conditions before logout, room upgrades, furniture, Comfort level, active relationships, discovered synergies, and room expansion level.

### 15.1 Offline Cap

- Base: 4 hours
- Upgraded: up to 6 hours
- Late-game: up to 8 hours

### 15.2 Offline Summary

When returning, the player sees: resources earned, major events, relationship changes, mood changes, new discoveries, room performance, and upgrade opportunities.

Example summary:
> **While You Were Away**
> Miso napped undisturbed and earned extra Comfort.
> Bean found something interesting in the Living Room.
> Mochi produced extra Coins in the Kitchen.
> You earned 420 Coins and 85 Comfort.

---

## 16. Technical Specification

### 16.1 Platform and Stack

- **Platform:** Mobile (iOS and Android) and Web browser. Design mobile-first (touch targets, no hover states, small screen layouts). Web browser is an equally supported second target.
- **Tech stack:** React + Vite. Wrap in Capacitor for iOS/Android builds (same codebase, no changes required).
- **Persistence:** `localStorage` for save data. JSON format. Auto-save every 60 seconds and on `visibilitychange` event (fires when mobile app is backgrounded).
- **No server required** for launch. All logic runs client-side.
- **Responsive layout:** One breakpoint at 640px. Below 640px (mobile): single-column, diorama fills width, room panels slide up as bottom sheets. Above 640px (web): diorama on left, side panel on right.
- **Touch targets:** All interactive elements at least 44×44px. No hover interactions. Drag-to-assign must also work as tap-to-select + tap-to-place.

### 16.2 Time System

**Decision: real clock time.**

The game stores a timestamp on every save. When the player returns, it calculates elapsed time, simulates what happened up to the offline cap, and presents the result. This is the standard approach for idle games in this genre.

The game does not rely on `setInterval` accumulating — it always calculates from `Date.now() - lastTickTimestamp` on each tick and on resume. A paused interval just means the UI doesn't update; the math is correct when the player returns.

### 16.3 Game Loop and Tick System

**While the app is open:**
- A React `useEffect` sets up a `setInterval` firing every **5000ms (5 seconds)**.
- Each tick: calculate resources earned since last tick, check event triggers, update cat states, update UI via React state.
- Store `lastTickTimestamp` in save data on every tick.

**On app open (returning from offline):**
- Calculate `elapsed = Date.now() - lastTickTimestamp`.
- Cap elapsed at the offline cap (4–6 hours depending on upgrades), converted to ms.
- Run offline simulation: compress elapsed time into a series of virtual ticks. Each virtual tick = 5 minutes of real time. Each virtual tick: calculate resources, check event triggers, run state transitions. Collect all events that fired into the offline event queue. Apply final resource totals and state changes.
- Display offline summary screen.
- Set `lastTickTimestamp = Date.now()`.

**Offline simulation detail:** State changes (Resting → Sleeping, etc.) are simulated during offline time. A cat in the Bedroom as Active will transition to Sleeping during offline and produce Comfort accordingly. Pre-logout placement decisions meaningfully affect offline results.

**Sequential requirement:** Offline ticks must be evaluated strictly in order. State produced in tick N (e.g. a cat transitions to Sleeping) is the input state for tick N+1. Batching or parallelizing tick evaluation will produce incorrect results. Each tick: (1) evaluate state transitions, (2) check events, (3) update relationship scores, (4) calculate resource output. Carry full state forward before moving to the next tick.

**Event queue cap:** Collect all events that fire during simulation, but display only the 5 most notable in the offline summary. Priority order for display: (1) rare events, (2) relationship tier changes, (3) new Cat Diary entries, (4) conflict events, (5) most recent other events. Discard lower-priority overflow silently — do not tell the player events were skipped.

### 16.4 Data Schema

All game state is stored in a single JSON object under the key `catHouseIdle_save`.

```json
{
  "version": 1,
  "lastTickTimestamp": 1700000000000,
  "resources": {
    "coins": 0.0,
    "comfort": 0.0
  },
  "eventCooldowns": {},
  "cats": [
    {
      "id": "miso",
      "name": "Miso",
      "traits": ["lazy", "calm"],
      "like": "bedroom",
      "dislike": "crowded_room",
      "currentRoom": "bedroom",
      "currentState": "sleeping",
      "stateEnteredAt": 1700000000000,
      "stateTransitionDue": 1700001800000,
      "relationships": {
        "bean": { "score": 14 },
        "mochi": { "score": 3 }
      },
      "roomSessions": {
        "bedroom": 3,
        "living_room": 0
      }
    }
  ],
  "rooms": [
    {
      "id": "bedroom",
      "towerFloor": 3,
      "level": 1,
      "furniture": [],
      "unlocked": true
    },
    {
      "id": "kitchen",
      "towerFloor": 1,
      "level": 1,
      "furniture": [],
      "unlocked": true
    },
    {
      "id": "living_room",
      "towerFloor": 2,
      "level": 1,
      "furniture": [],
      "unlocked": true
    }
  ],
  "diary": {
    "interactions": [
      { "id": "nap_pile", "discoveredAt": 1700000000000 }
    ],
    "events": [
      { "id": "hidden_toy", "discoveredAt": 1700000000000 }
    ],
    "hints": [
      { "id": "miso_bedroom_hint", "catId": "miso", "roomId": "bedroom", "discoveredAt": 1700000000000 }
    ],
    "catProfiles": {
      "miso": { "like": "bedroom", "dislike": "crowded_room", "discovered": true }
    }
  },
  "offlineEventQueue": [],
  "settings": {
    "soundEnabled": true
  },
  "tutorialStep": 0
}
```

**Schema rules:**
- All timestamps are Unix ms (`Date.now()`).
- Resources are stored as floats and displayed as `Math.floor()` integers.
- `cat.relationships` stores only `score` (integer). `tier` is derived at load time from the thresholds in Section 7.4 and never stored.
- `cat.stateTransitionDue` is a Unix ms timestamp sampled once on state entry. Never reset on reload.
- `cat.roomSessions` tracks completed sessions per room (see Section 14.3 for session definition). `currentRoom: null` means the cat is unassigned and produces no output.
- `room.towerFloor` stores the room's vertical position. Higher floor numbers render above lower floor numbers. Existing saves missing this field default from `src/data/rooms.js`.
- `eventCooldowns` is a top-level map of `{ eventId: timestampMs }` marking when each event last fired. Respected during offline simulation.
- `diary.interactions` and `diary.events` entries are `{ id, discoveredAt }`. Absence = undiscovered.
- `diary.hints` entries are `{ id, catId, roomId, discoveredAt }`.
- State values match Section 7.3 (lowercase, underscore-separated).
- `like` and `dislike` are string IDs referencing a condition (room ID, `"crowded_room"`, `"grumpy_cat_nearby"`, etc.). `"crowded_room"` means the room is at its current capacity limit, only applicable to rooms with capacity > 1.
- `offlineEventQueue` is cleared when the player taps Collect on the offline summary overlay. The overlay is blocking — no house interaction is possible until collected.
- **`cat.currentRoom` is the single source of truth for room assignment.** Rooms do not store a `catsAssigned` list. Instead, derive which cats are in a room at runtime by filtering `cats` where `currentRoom === roomId`. This prevents the two lists from going out of sync. All room-assignment mutations write only to `cat.currentRoom`. At load time, any capacity violations are resolved by evicting excess cats (sorted by `stateEnteredAt` ascending — most recent assignment loses the slot) and surfacing a warning in the UI.

### 16.5 UI Layout and Screen Flow

**Visual style:** Side-view vertical tower diorama. The house is shown as a tall cutaway from the side, like a stacked dollhouse. Each room is visible as a cross-section, with higher floors above lower floors.

**Mobile layout (< 640px):** Diorama fills the full screen width. Rooms are stacked vertically by `towerFloor`, highest visible floor at the top. Tapping a room opens a bottom sheet panel with cat slots, furniture slots, and the upgrade button. Bottom tab bar: House | Cats | Diary.

**Web layout (≥ 640px):** Diorama on left (~60% width). Persistent side panel on right shows selected room detail or cat roster.

**Screen hierarchy:**

```
Main House View (default)
├── Room panel (tap a room to open)
│   ├── Cat slot cards (cat, state, current output)
│   ├── Furniture slots (placed items and empty slots)
│   └── Upgrade button
├── Cat roster button → Cat Roster Screen
├── Cat Diary button → Cat Diary Screen
├── Resource bar (top) — Coins and Comfort always visible
└── Offline summary overlay (shown on return)
```

**Room Detail Panel:**
- Room name, current level.
- Cat slot cards: portrait, name, current state, output rate. Empty slots show "Assign cat."
- Shows Like/Dislike status indicator for each assigned cat (e.g., a green heart if Like is active, a small warning if Dislike is active).
- Furniture slots: placed items with effects. Empty slots show available furniture to buy.

**Placement preview indicator (during drag or tap-to-place):**
While a cat is being dragged or held for placement, each room slot shows a tinted overlay:
- **Green** — dropping here will activate the cat's Like condition.
- **Amber** — dropping here will activate the cat's Dislike condition.
- **No tint** — neutral placement, neither Like nor Dislike active.

The indicator is shown from the very first placement (consistent with Like/Dislike being always visible). It evaluates conditions at the moment of drag: current room state, occupants, furniture present. If both Like and Dislike would activate simultaneously (edge case), show amber — Dislike takes priority per Section 12.

**Cat Roster Screen:**
- Shows all unlocked cats.
- Each cat card shows: name, portrait, current room, current state, Like, Dislike, and current mood icon.
- Tap a cat to view their full profile and relationship status.

**Cat Diary Screen:**
- Tabs: Cats | Interactions | Events | Hints.
- Undiscovered entries show as locked silhouettes with a one-line hint.

**Offline Summary Overlay:**
- Time away, resources earned, event list, new diary entries, relationship changes.
- Dismissed with a "Collect" button.

**First-run experience / Tutorial:**

On first launch all 3 cats are present but unassigned. The tutorial is a linear sequence of 5 steps tracked by a `tutorialStep` integer in save data (0 = not started, 5 = complete). Each step shows a tooltip or highlight; the player cannot be blocked — any step can be dismissed to skip the rest and jump to `tutorialStep: 5`.

| Step | What the player does | What the game shows |
|---|---|---|
| 1 | Tap Miso | Her card opens. Highlight her Like (Bedroom) and Dislike (Crowded room). |
| 2 | Drag or tap-assign Miso to the Bedroom | Miso appears in the Bedroom slot in Sleeping state immediately (tutorial skips the Active→Resting→Sleeping transition). Zzz icon appears. Comfort ticks up visibly. Tooltip: "Miso loves the Bedroom." |
| 3 | Watch Comfort tick up | Player sees Comfort increasing in the resource bar. No waiting required — Miso is already Sleeping. |
| 4 | Tap the resource bar to collect | Comfort collected. Tooltip: "Miso earns more Comfort while she sleeps here." |
| 5 | Tap the Bedroom upgrade button | Upgrade panel opens. Tutorial ends. `tutorialStep` set to 5. |

**Post-tutorial event:** On the first tick after `tutorialStep` reaches 5, force-fire the **Hidden Toy** event on Bean (regardless of normal event chance). If Bean is currently unassigned, auto-assign her to the Living Room before firing the event. Event card flavor: *"Someone was very lively last night."* Mechanical effect: small Comfort gain, first Cat Diary entry unlocked. This teaches the player that Bean generates discoveries and that events have flavor text connected to specific cats.

**After tutorial:** No further hand-holding. Hints appear in the Cat Diary and via event cards. Mochi remains unassigned after the tutorial — the player's first free decision is where to put him.

### 16.6 Interaction Priority Implementation

When calculating a cat's output for a given tick, resolve modifiers in order in code:

1. Check for Grumpy state → if true, apply ×0.5 suppressor and skip synergy checks. Return early with `(base_rate + flat_bonuses) × 0.5`.
2. Check for active Dislike condition → if true, apply ×0.6 penalty and suppress Like bonus (do not collect the Like multiplier in step 3).
3. Collect all applicable flat bonuses (furniture). Sum them: `flat = Σ furniture_bonuses`.
4. Collect all applicable multiplicative modifiers: state modifier, Like modifier (if not suppressed), synergy modifier, relationship modifier, trait modifier.
5. Compute: `multiplier = M1 × M2 × M3 …` (multiply all together).
6. Clamp: `multiplier = min(multiplier, 2.5)`.
7. Return: `(base_rate + flat) × multiplier` for this cat this tick.

### 16.7 Edge Cases

**Dislike condition and Like condition both technically active:** Dislike wins. Suppress the Like bonus entirely.

**Cat's Dislike references a cat state (e.g. "Grumpy cat nearby"):** Always check *other* cats in the room, never the cat itself. A cat's own state cannot trigger its own Dislike. Example: Miso is in the Bedroom (Like) but the room is overcrowded (Dislike) — she gets the Dislike penalty, not the Like bonus.

**All cats Grumpy:** The house runs at reduced output. No events fire. Grumpy state decays naturally. No special UI needed — the player can see the Grumpy icons on all cats.

**Cat assigned to a room at or over capacity:** The UI prevents over-assignment at the point of dragging/assigning. If save data somehow contains an over-capacity room (e.g. after a migration), evict excess cats sorted by `stateEnteredAt` ascending (most recent assignment loses the slot); displaced cats show a warning icon and produce nothing until reassigned.

**Offline time exceeds cap:** Silently cap to max offline duration. Do not show how much time was wasted.

**No cats assigned to a room:** Room produces nothing and generates no events. Valid — an empty room should not error.

**Missing fields on load:** Any field absent from a loaded save is silently initialized to its default value at load time. This handles all additive changes — new cats, new relationship entries, new settings flags — without requiring a version bump or migration function. New cats added post-launch initialize relationship entries for all existing cats as `{ tier: "neutral", score: 0 }` if not already present.

**Save data version mismatch:** Only bump `version` when changing the *shape or meaning* of existing data (e.g. renaming a field, changing a value's type, removing a field). If `version` does not match, attempt migration. If migration fails, show "Your save is from an older version. Some data may be reset." and reset only affected fields, preserving resources if possible. Purely additive changes do not require a version bump.

---

## 17. Launch Cats

### Design Note

The game launches with **3 cats**. They are chosen to cover the core strategic options from the start: an offline/comfort specialist, a discovery/social cat, and a coin-generation specialist. Each cat's Like and Dislike is visible at all times and should drive the player's first placement decisions. Together, the 3 cats exactly fill one starting room each, making the first setup obvious but not trivial.

---

### 17.1 Miso

**Role:** Offline Comfort cat.

**Traits:** Lazy, Calm.

**Like:** The Bedroom. While assigned to the Bedroom, Miso generates more Comfort (especially while Sleeping) and improves offline Comfort gains.

**Dislike:** Crowded rooms (2+ cats in a room without enough furniture). When the Dislike condition is active, Miso generates less Comfort and is more likely to become Grumpy.

**Favorite Furniture:** Heated Blanket.

**Gameplay Identity:** Miso is the house's passive foundation. She does very little while active, but left in a quiet Bedroom overnight, she quietly generates a reliable Comfort income. Pairing her with the right furniture dramatically improves offline results. She works best alone or with one trusted, calm companion.

**Flavor text:** *"Miso has never met a sunbeam she didn't trust."*

**Unlock:** Available at game start.

---

### 17.2 Bean

**Role:** Playful discovery cat.

**Traits:** Playful, Curious.

**Like:** Being in a room with at least one other cat. Bean generates more Comfort and has a higher event rate when she has company.

**Dislike:** Being the only cat in her room for an entire offline period. If Bean's room had no other cats assigned when the player closed the app, she returns with her Dislike active: reduced output and lower event rate. **Recovery is immediate** — assigning any other cat to her room clears the Dislike with no additional timer. The condition is binary and session-based: she either had company at logout or she didn't. This only applies if the offline period lasted at least one virtual tick (≥5 minutes). Brief closures under this threshold do not activate the Dislike.

**Favorite Furniture:** Toy Basket.

**Gameplay Identity:** Bean is the house's event engine. She finds things, starts things, and generates Cat Diary entries faster than anyone else. She works best in the Living Room with company. Placing her with Miso is risky — Bean's Playful trait can interrupt Miso's sleep, triggering the Interrupted Nap conflict. This is an intentional early-game tension point: the player will discover it, separate them, and feel clever for doing so.

**Flavor text:** *"Bean is technically always about to do something."*

**Unlock:** Available at game start.

---

### 17.3 Mochi

**Role:** High-output Coin cat.

**Traits:** Greedy, Territorial.

**Like:** Being alone in the Kitchen. When Mochi is the sole cat in the Kitchen, she generates significantly more Coins than any other configuration.

**Dislike:** Sharing a room with a Grumpy cat. When another cat in the same room is Grumpy, Mochi's Coin output drops and she may become Grumpy herself. A cat's Dislike condition always checks *other* cats in the room — Mochi's own Grumpy state does not trigger her Dislike. This tension is primarily a mid-game concern: the Kitchen holds only 1 cat at base, so it only activates after the Countertop Expansion upgrade (300 Coins).

**Favorite Furniture:** Extra Food Bowls.

**Gameplay Identity:** Mochi is the house's primary Coin source. She is straightforward to use — put her in the Kitchen alone and she works hard. The friction comes from her Dislike: if another cat wanders in (or if the player places one in the Kitchen before it can hold two cats comfortably), Mochi becomes difficult. Players learn quickly: the Kitchen is Mochi's space.

**Flavor text:** *"Mochi is very food-motivated and prefers not to discuss it."*

**Unlock:** Available at game start.

---

### 17.4 [PLACEHOLDER] Cat 4

**Role:** [PLACEHOLDER — suggested: harmony enforcer. Rewards conflict-free rooms.]

**Traits:** [PLACEHOLDER] *(suggested: Calm, Social)*

**Like:** [PLACEHOLDER] *(suggested: being in a room where all cats are in a positive state — Active, Relaxed, Cuddly, or Sleeping)*

**Dislike:** [PLACEHOLDER] *(suggested: any room with a Grumpy cat present)*

**Favorite Furniture:** [PLACEHOLDER]

**Gameplay Identity:** [PLACEHOLDER — this cat creates an incentive to resolve conflicts before placing them. They reward a well-managed household and punish neglect. Unlike Miso who just avoids crowding, this cat actively requires harmony.]

**Flavor text:** *[PLACEHOLDER]*

**Unlock:** [PLACEHOLDER] *(suggested: Comfort threshold — 500 Comfort, per Section 19)*

---

### 17.5 [PLACEHOLDER] Cat 5

**Role:** [PLACEHOLDER — suggested: minimalist explorer. Rewards sparse, unfurnished rooms with unique discoveries.]

**Traits:** [PLACEHOLDER] *(suggested: Curious, Territorial)*

**Like:** [PLACEHOLDER] *(suggested: rooms with 0 or 1 furniture items placed)*

**Dislike:** [PLACEHOLDER] *(suggested: fully upgraded rooms — Level 3)*

**Favorite Furniture:** [PLACEHOLDER] *(note: this cat's Like discourages furniture, so their favorite furniture should be a single high-value piece that doesn't conflict — perhaps a simple floor cushion or window perch)*

**Gameplay Identity:** [PLACEHOLDER — this cat creates a strategic axis where the player may want to keep one room intentionally sparse. Resolve the tension with their Dislike: "Dislikes fully upgraded rooms" means Level 3, not Level 2 — so the player can still upgrade without fully losing this cat's bonus.]

**Flavor text:** *[PLACEHOLDER]*

**Unlock:** [PLACEHOLDER] *(suggested: discovery unlock — appears after N Cat Diary entries recorded, per Section 19)*

---

### 17.6 [PLACEHOLDER] Cat 6

**Role:** [PLACEHOLDER]

**Traits:** [PLACEHOLDER]

**Like:** [PLACEHOLDER]

**Dislike:** [PLACEHOLDER]

**Favorite Furniture:** [PLACEHOLDER]

**Gameplay Identity:** [PLACEHOLDER]

**Flavor text:** *[PLACEHOLDER]*

**Unlock:** [PLACEHOLDER]

---

### 17.7 Interactions Between Cats

| Pair | Interaction | Notes |
|---|---|---|
| Bean + Miso | Interrupted Nap (conflict) | Bean wakes Miso; Miso becomes Grumpy. Player learns to separate them. |
| Bean + Mochi | Food Bowl Disagreement (conflict) | Mochi's Dislike (Grumpy cat nearby) can trigger if Bean becomes Grumpy first. |
| Miso + Mochi | Quiet Kitchen Bonus (synergy) | Mochi works better when the house is calm; Miso in the Bedroom contributes to this. Indirect synergy. |
| Any two cats | Shared Sunbeam (discovery) | Any two cats resting together have a chance to trigger this Comfort bonus. |
| Cat 4 + any Grumpy cat | [PLACEHOLDER — conflict] | Cat 4's Dislike activates; their output drops. Incentive to resolve Grumpy states before placing Cat 4. |
| Cat 4 + all positive cats | [PLACEHOLDER — synergy] | Cat 4's Like activates; bonus to [PLACEHOLDER]. |
| Cat 5 + sparse room | [PLACEHOLDER — discovery] | Cat 5 finds unique diary entries in low-furniture rooms. |
| Cat 5 + Cat 6 | [PLACEHOLDER] | [PLACEHOLDER] |

---

## 18. Adding More Cats Later

The cat roster is designed to grow. New cats should be added when the player has had enough time to understand the Like/Dislike system with the starting 3. Each new cat should:

- Have a **unique Like + Dislike combination** — individual Likes or Dislikes may overlap with existing cats, but the pairing must create a distinct placement identity. A cat who Likes the Bedroom (like Miso) but Dislikes being alone (unlike Miso) is a meaningfully different cat.
- Not duplicate the **primary gameplay role** of an existing cat
- Unlock through play, not purchase (see Section 19)

**Suggested 4th cat archetype:** A calm, social cat who Likes being in a room where all cats are in a positive state, and Dislikes rooms with any active conflict. This cat would encourage the player to resolve conflicts before placing them.

**Suggested 5th cat archetype:** A discovery-focused, solitary cat who Likes being in an unfurnished room (generates unique diary entries), and Dislikes rooms that are fully upgraded. This creates a new strategic axis — the player may want to keep one room "simple" for this cat.

---

## 19. Unlocking Cats

New cats should not be bought with Coins. Cat unlocks should feel like they happen because the house has changed.

- **Comfort Unlock:** A shy cat joins when the house reaches 500 Comfort.
- **Event Unlock:** A stray cat appears after repeated specific events.
- **Relationship Unlock:** A new cat appears after two cats become Bonded.
- **Discovery Unlock:** A mysterious cat appears after enough Cat Diary entries are recorded.
- **Room Unlock:** A cat connected to a specific room appears once that room is upgraded.
- **Expansion Unlock:** A cat appears after the player builds a specific new room.

---

## 20. Progression

### 20.1 Early Game (Launch Content)

3 cats, 3 rooms, 2 resources, simple upgrades, basic furniture, basic events, basic Cat Diary. Goal: teach the player that placement matters, Like/Dislike conditions are real, and rooms are worth improving.

### 20.2 Mid Game

4–6 cats, 4–5 rooms, multiple interaction types, room specialization, rare events, relationship bonuses, more furniture sets. Goal: let the player build a personalized house strategy.

### 20.3 Late Game

7–12 cats, full room set, relationship bonuses, rare event chains, seasonal room themes, advanced furniture. Goal: keep the small roster interesting through deeper combinations.

---

## 21. Art and Audio Direction

### 21.1 Pixel Art Style: Painterly HD Pixel

The game uses **painterly HD pixel art** — high-resolution pixel art that uses large palettes, fine color gradations, and deliberate dithering to simulate texture and volume. The result reads as pixel art at a glance but looks almost illustrated up close.

**Reference:** The style is comparable to Octopath Traveler, Owlboy, Sea of Stars, and Dead Cells — or the image of a fluffy ragdoll-style cat used as the style reference during design. That image is the target fidelity: dense fur texture achieved through dithering, smooth color transitions using many shades, careful dark outline around the silhouette, and expressive face detail at high resolution.

**Key characteristics:**

- **Large palettes.** Each cat uses 50–150+ colors. Fur, shading, highlights, and outlines are never the same color — they blend across many values. This is what separates painterly HD from 16-bit.
- **Dithering for texture.** Pixel-level noise across fur, fabric, and soft surfaces is deliberate dithering, not compression artifact. It simulates the visual texture of real materials (fluffy fur, worn blanket, worn wood floor). This technique is borrowed from 1-bit art but applied in full color.
- **Dark outline, interior detail without outlines.** The silhouette of each cat and piece of furniture has a clean 1–2px dark outline. Inside the silhouette, shading and detail are done purely through color transitions — no interior outlines.
- **Large sprites.** Cat diorama sprites are 128×128px or larger. This is necessary for the dithering and detail to read correctly. At 64px, the fur texture dissolves into noise; at 128px, it reads as richness.
- **Eye detail.** Cat eyes in this style are a signature feature: multiple concentric rings of color (pupil, iris highlight, specular dot) at 4–8px scale. The specular dot (a 1px white or near-white square) is what makes a cat feel alive.
- **Room backgrounds are painted, not tiled.** Rooms are full illustrated scenes rather than assembled from tileset pieces. Each room level (1, 2, 3) is a separate illustration showing the room looking progressively more cozy and furnished.

### 21.2 Visual Tone

Warm, richly textured, and alive. The game should feel like looking into a real home. Cats should feel physically present — soft, heavy, and fur-textured. Rooms should feel warm and slightly worn-in, not sterile or toy-like.

Color palette direction: warm off-whites, dusty golds, muted teals, soft pinks, deep navy shadows. Avoid pure saturated colors — everything should look slightly aged, soft, and cozy. Think warm lamp-lit rooms rather than bright cartoon colors.

The house should look meaningfully different at each upgrade level. A Level 1 Bedroom is sparse and simple. A Level 3 Bedroom has a layered, personal feeling — the blanket has texture, the window has a curtain, warm light pools on the floor.

### 21.3 Art Production Notes

Painterly HD pixel art is the most expensive pixel art style to produce. Every asset requires serious investment — either from a skilled pixel artist (who can take several hours per sprite) or from AI image generation tools with careful cleanup and palette reduction.

**Practical path for a solo developer or small team:**

AI image generation tools (Midjourney, Stable Diffusion, or similar) with a prompt like "pixel art, HD pixel, painterly pixel art, [cat description], transparent background, 128x128, no anti-aliasing" can produce usable base images. These typically need cleanup: reducing the palette manually in a tool like Aseprite, sharpening dithered regions, fixing the outline, and correcting the eye detail. Budget 30–60 minutes of cleanup per AI-generated sprite.

Do not use AI-generated art directly without cleanup. Raw AI pixel art is usually slightly blurry at the edges, has inconsistent palette count, and uses anti-aliasing that breaks the pixel aesthetic at small sizes.

**Recommended tool:** Aseprite (paid, ~$20) is the industry standard for pixel art editing. It has built-in dithering tools, palette management, and animation support. All cat sprite editing and palette reduction should happen in Aseprite.

### 21.4 Animation

For launch, **static sprites are acceptable.** State is communicated through floating icons (sleeping zzz, grumpy lightning bolt, etc.) rather than full animation. This is the right call for an MVP — animation is expensive and not required for the core loop to work.

Post-launch, consider adding 2–4 frame idle animations per cat state: a breathing loop for Sleeping, a tail-flick loop for Active, a slow blink for Resting. These can be added to Aseprite sprite sheets without changing the code — the animation system just needs to be stubbed in from the start (see Appendix A).

### 21.5 Audio Tone

Gentle background music, soft purring, tiny paw sounds, little eating sounds, toy sounds, soft reward sounds, gentle room ambience. No casino-like reward sounds. Sound design should say "cozy pet home," not "slot machine."

Music direction: lo-fi acoustic. Think fingerpicked guitar, soft piano, light percussion. Each room could have a subtle ambient layer (kitchen: faint cooking sounds under the music; bedroom: rain or crickets at night).

---

## 22. Main Design Risks

**Risk 1: The System Feels Too Hidden.** Solution: clear event logs, Cat Diary, furniture effects shown clearly, Like/Dislike always visible on cat cards.

**Risk 2: The Game Becomes Just Another Number Idle.** Solution: prioritize behavioral effects, visible cat states, relationship events, upgrades that change behavior.

**Risk 3: Room Building Feels Too Linear.** Solution: room specialization choices, cat-specific Likes, multiple expansion paths.

**Risk 4: Small Roster Limits Longevity.** Solution: relationship progression, room-specific interactions, furniture-based modifiers, rare events, Cat Diary completion goals, and a clear path to adding more cats.

**Risk 5: Too Much Simulation for Too Little Payoff.** Solution: show event summaries, animate cat states, make events specific to cats, use diary entries to explain discoveries, visually show room upgrades.

---

## 23. Open Design Questions

- Is placing cats in rooms fun after 5 minutes?
- Do players understand why events happen?
- Do players notice and use Like/Dislike conditions in placement decisions?
- Do room upgrades feel meaningful?
- Does expanding a room feel exciting?
- How many cats per room creates the best decisions?
- Should cats ever wander on their own, or only stay assigned?
- How much information should the player know before discovering an interaction?
- Should relationships be permanent, temporary, or slowly changing?
- What makes a player excited to return after one day? One week?

---

## Appendix A: Asset Guide for Claude Code

*This appendix is written for the developer (or AI coding assistant) who will implement the game. It explains what visual and audio assets the game needs, the technical specifications for the painterly HD pixel art style, and what to provide vs. what can be replaced with placeholders during prototyping.*

---

### A.1 Philosophy

Assets for an idle game of this style fall into two categories:

**Functional assets** — assets the game logic depends on. These need to exist before the game can be tested (even as placeholders). Example: a cat sprite, a room background.

**Polish assets** — assets that improve feel but are not blocking. These can be added after core logic is working. Example: particle effects, idle animations, sound effects.

**Recommended approach:** Build the game first with placeholder assets (colored rectangles, emoji, or simple SVGs). Once the core loop is working, replace placeholders with real art. This document describes both what placeholders to use and what the final assets should look like.

The painterly HD pixel style (see Section 21) is the most expensive pixel art style to produce. All the more reason to validate the core loop with placeholders before committing art time.

---

### A.2 Pixel Art Technical Specifications

All game art follows the **painterly HD pixel** style described in Section 21. The following technical rules apply to every asset produced for this game.

**Palette:** No hard limit, but aim for the minimum palette that achieves the desired fidelity. Cat sprites will typically use 60–120 colors. Room backgrounds may use 150–250. Palette-reduce in Aseprite after generating base art.

**No anti-aliasing.** All edges must be clean, hard pixels. Anti-aliased edges look blurry when the sprite is displayed at 1:1 or 2× scale and break the pixel art aesthetic. When generating art with AI tools, inspect all edges carefully and repaint any blurry or sub-pixel transitions.

**Outlines.** Every cat sprite and furniture piece has a 1px dark outline (not pure black — use a very dark, slightly warm or cool color sampled from the darkest shade of that object). Interior shading is done through color transitions only, never interior outlines.

**Dithering.** Use dithering on fur, fabric, and soft surfaces to simulate texture. Ordered dithering or manual dithering is preferred over diffusion dithering — it reads more cleanly at small sizes. Aseprite has a built-in dithering brush.

**Pixel grid.** All pixels must snap to a consistent grid. No half-pixels. If importing from AI-generated art, confirm in Aseprite that the image has no sub-pixel detail (zoom to 800%+ and inspect edges).

**Transparent background.** All cat sprites and furniture icons must have a transparent background (PNG with alpha). Room backgrounds are opaque.

**Display scale.** The game renders assets at 2× or 3× CSS scale (i.e., a 128px sprite is displayed at 256px or 384px on screen). This is standard for pixel art — it preserves sharpness. Claude Code should use `image-rendering: pixelated` in CSS for all game art elements to prevent browser interpolation from blurring the pixels.

---

### A.3 Cat Sprites

**Purpose:** Represent each cat in the diorama view and on cat cards.

**What you need per cat:**

A **portrait** (used on cat cards, roster screen, and Cat Diary). Spec: 64×64px source, displayed at 2× (128px on screen). PNG with transparent background. Shows the cat's face and upper body, facing slightly toward the viewer. This is the player's primary way of recognizing each cat — it must be expressive and immediately readable.

A **diorama sprite** (used inside the room view, where the cat sits in the room). Spec: 128×128px source, displayed at 2× (256px on screen). PNG with transparent background. Shows the cat's full body in a characteristic resting or active pose.

For launch, **one diorama sprite per cat is acceptable.** State changes (Sleeping, Grumpy, Cuddly, etc.) are communicated through floating icon overlays rather than separate sprites. Post-launch, consider per-state sprite variants.

**Style notes per cat:**

`miso.png` — a large, fluffy, light-colored longhair cat (ragdoll or similar). Round and heavy. The style reference image (a fluffy white-grey cat with point coloring) is the visual target. Palette: off-whites, warm creams, cool grey-taupe, with darker point coloring on ears, face, and tail. Pose: sitting or lying, relaxed, eyes half-open. Fur texture should be richly dithered — this cat's fur is her most distinctive visual feature.

`bean.png` — a small, lean, short-haired cat with a curious or mid-motion quality. Palette: warm orange tabby, or a distinctive pattern like tortoiseshell. Eyes: wide and bright. Pose: crouching or alert, mid-action.

`mochi.png` — a chubby, round-bodied cat. Solid or lightly patterned. Palette: warm browns, cream, or a muted calico. Expression: focused, slightly intense. Pose: sitting squarely, oriented toward food or a food bowl.

**Placeholder:** For prototyping, use a colored circle with the cat's initial (M, B, Mc) or an emoji (😺).

**How to provide to Claude Code:** Place all cat images in `/assets/cats/`. Portraits go in `/assets/cats/portraits/`, diorama sprites in `/assets/cats/sprites/`. Name files by cat ID: `miso.png`, `bean.png`, `mochi.png`. Reference in code as `"/assets/cats/portraits/{catId}.png"` and `"/assets/cats/sprites/{catId}.png"`.

---

### A.4 Room Backgrounds

**Purpose:** The diorama background for each room. Shown as a cutaway cross-section (side view, like a dollhouse).

**What you need per room:**

A room background image at each upgrade level. Spec: 640×360px source (16:9), displayed at 2× on wide screens. PNG or JPG. Room backgrounds are opaque — no transparency needed.

Each room has 3 levels. Each level is a separate image file showing the room at that stage of upgrade: Level 1 is sparse and simple; Level 2 is comfortably furnished; Level 3 is richly layered and cozy. The three levels should show visible, meaningful change — a new curtain, warm lighting added, furniture appearing.

**Style notes per room:**

`living_room_1.png` / `_2.png` / `_3.png` — warm living room, side cutaway view. Wooden or soft carpet floor. A window in the background. Level 1: bare walls, one basic seat. Level 2: sofa visible, a rug, soft lamp. Level 3: full furniture, curtains, plants, warm lamp-light pool on the floor.

`kitchen_1.png` / `_2.png` / `_3.png` — small cozy kitchen. Tile floor, countertop visible along one side. Level 1: bare counter, food bowl on floor. Level 2: treat cabinet, second bowl. Level 3: full countertop, hanging pot rack, warm lighting.

`bedroom_1.png` / `_2.png` / `_3.png` — quiet bedroom. Low ambient light. Level 1: simple bed or cushion on floor, one window. Level 2: heated blanket visible, moon visible through window. Level 3: moonlit window fully styled, quiet corner nook, soft warm-cold light contrast.

**Placeholder:** For prototyping, use a flat colored rectangle per room (muted green = Living Room, warm orange = Kitchen, soft blue = Bedroom).

**How to provide to Claude Code:** Place in `/assets/rooms/`. Name by room ID and level: `living_room_1.png`, `living_room_2.png`, etc. Reference as `"/assets/rooms/{roomId}_{level}.png"`.

---

### A.5 Furniture Icons

**Purpose:** Small icons representing furniture items. Shown in furniture slots in the room detail panel and the upgrade shop.

**Spec:** 32×32px source, displayed at 2× (64px on screen). PNG with transparent background. Each icon is a simple top-down or slight 3/4 view of the furniture item. Outlines should be clean and readable at small sizes — avoid fine detail that disappears at 64px display size.

**Launch furniture:**

| File | Item | Notes |
|---|---|---|
| `heated_blanket.png` | Heated Blanket | Folded blanket, warm amber glow |
| `toy_basket.png` | Toy Basket | Wicker basket with toys spilling out |
| `extra_food_bowls.png` | Extra Food Bowls | Two small bowls side by side |
| `soft_sofa.png` | Soft Sofa | Small side-view sofa |
| `quiet_cubby.png` | Quiet Cubby | Small enclosed box/cave shape |
| `tall_cat_tree.png` | Tall Cat Tree | Multi-level scratching post |
| `treat_cabinet.png` | Treat Cabinet | Small wooden cabinet |
| `countertop_expansion.png` | Countertop Expansion | Wide counter surface |
| `quiet_corner.png` | Quiet Corner | Corner cushion/nook |
| `moonlit_window.png` | Moonlit Window | Window with moon visible |

**Placeholder:** Use emoji or colored squares with the item name.

**How to provide to Claude Code:** Place in `/assets/furniture/`. Name by item ID (snake_case). Reference as `"/assets/furniture/{furnitureId}.png"`.

---

### A.6 UI Icons

**Purpose:** Small icons used throughout the UI for states, resources, navigation, and indicators.

**Recommendation:** Use Lucide React for all navigation and generic UI icons — this eliminates the need for custom UI icon assets for prototyping and is perfectly acceptable for launch. Only the resource icons (Coins, Comfort) and cat state indicators are game-specific and may benefit from custom pixel art icons later.

**If producing custom pixel icons,** spec is 16×16px source, displayed at 2×. No outlines needed at this size — use bold, simplified shapes only.

| Icon | Purpose | Lucide alternative |
|---|---|---|
| `coin.png` | Coins resource | `Coins` |
| `comfort.png` | Comfort resource | `Heart` |
| `state_sleeping.png` | Sleeping state | `Moon` |
| `state_grumpy.png` | Grumpy state | `CloudLightning` |
| `state_cuddly.png` | Cuddly state | `Heart` |
| `state_focused.png` | Focused state | `Zap` |
| `state_hungry.png` | Hungry state | `UtensilsCrossed` |
| `like_active.png` | Like condition active | `CheckCircle` (green) |
| `dislike_active.png` | Dislike condition active | `AlertTriangle` (amber) |
| `diary.png` | Cat Diary tab | `BookOpen` |
| `house.png` | House tab | `Home` |
| `cats.png` | Cats tab | `PawPrint` |
| `lock.png` | Locked diary entry | `Lock` |

**How to provide to Claude Code:** Use Lucide React for all icons in the prototype. Swap custom pixel icons in later by placing them in `/assets/ui/` and referencing as `"/assets/ui/{iconId}.png"`.

---

### A.7 CSS Rendering Rules for Pixel Art

Claude Code must apply the following CSS rules to all game art elements to prevent the browser from blurring pixels:

```css
.pixel-art {
  image-rendering: pixelated;
  image-rendering: crisp-edges; /* Firefox fallback */
}
```

Apply this class to every `<img>` or `<canvas>` element displaying cat sprites, room backgrounds, or furniture icons. Without this rule, browsers apply bilinear interpolation when scaling up the small source images, which destroys the pixel art aesthetic.

---

### A.8 Animation Stub

For launch, cats use static sprites. However, Claude Code should stub in an animation system from the start so it can be extended post-launch without a refactor.

The recommended approach is a **frame-index prop** on the cat sprite component:

```jsx
<CatSprite catId="miso" state="sleeping" frame={0} />
```

For launch, `frame` is always `0` and each state maps to the same static image. Post-launch, an animation loop updates `frame` on a timer and the component looks up the correct sprite sheet frame.

Sprite sheets (for post-launch animation) follow this naming convention: `miso_sleeping.png`, `miso_active.png`, etc. Each sheet is a horizontal strip of frames at 128×128px per frame.

---

### A.9 Audio Assets

**Purpose:** Background music and sound effects.

**What you need:**

| File | Purpose | Format |
|---|---|---|
| `bgm_main.mp3` | Main background music loop (lo-fi acoustic, gentle) | MP3 or OGG |
| `sfx_collect.mp3` | Resource collection tap sound | MP3 |
| `sfx_upgrade.mp3` | Room upgrade completion sound | MP3 |
| `sfx_event.mp3` | Event card appears sound | MP3 |
| `sfx_purr.mp3` | Cat settles / positive event | MP3 |
| `sfx_grumpy.mp3` | Cat becomes Grumpy | MP3 |

**Placeholder:** For prototyping, disable audio entirely and add a settings toggle stub. Audio is polish — it does not block core loop testing.

**How to provide to Claude Code:** Place in `/assets/audio/`. Reference as `"/assets/audio/{fileId}.mp3"`. Use the HTML5 `<audio>` API or Howler.js for playback.

---

### A.10 Fonts

**Purpose:** Text rendering throughout the UI.

**Recommendation:** Use a Google Font that feels cozy and readable on mobile. Good options: Nunito, Quicksand, or Baloo 2. Load via Google Fonts CDN — no file to provide.

```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
```

The UI font does not need to be pixel art — a clean, soft sans-serif contrasts well against the detailed pixel art and is more readable at small sizes.

---

### A.11 Asset Checklist for Launch Build

| Asset | Needed for prototype | Needed for launch | Style spec |
|---|---|---|---|
| Cat portraits (3 cats) | Placeholder OK | ✅ Real art | 64×64px, 2× display, painterly HD pixel |
| Cat diorama sprites (3 cats) | Placeholder OK | ✅ Real art | 128×128px, 2× display, painterly HD pixel |
| Room backgrounds (3 rooms × 3 levels) | Placeholder OK | ✅ Real art | 640×360px, painterly HD pixel |
| Furniture icons (10 items) | Placeholder OK | ✅ Real art | 32×32px, 2× display, pixel |
| UI icons | Lucide React | Lucide React or custom | — |
| `image-rendering: pixelated` CSS | ✅ Required from day 1 | ✅ Required | Applied to all game art elements |
| Background music | Skip | ✅ At launch | Lo-fi acoustic loop |
| Sound effects | Skip | ✅ At launch | Soft, cozy |
| Font | Google Font | ✅ Same | Nunito or similar |

---

### A.12 File Structure for Claude Code

When handing this project to Claude Code, provide the following folder structure:

```
/assets
  /cats
    /portraits
      miso.png
      bean.png
      mochi.png
    /sprites
      miso.png
      bean.png
      mochi.png
  /rooms
    living_room_1.png
    living_room_2.png
    living_room_3.png
    kitchen_1.png
    kitchen_2.png
    kitchen_3.png
    bedroom_1.png
    bedroom_2.png
    bedroom_3.png
  /furniture
    heated_blanket.png
    toy_basket.png
    extra_food_bowls.png
    soft_sofa.png
    quiet_cubby.png
    ... (other furniture)
  /ui
    coin.png
    comfort.png
    ... (or use Lucide React — preferred)
  /audio
    bgm_main.mp3
    sfx_collect.mp3
    ... (or skip for prototype)
/src
  /components
    CatSprite.jsx     ← renders cat sprite with frame prop stub
    RoomView.jsx      ← renders room background at correct level
    FurnitureSlot.jsx ← renders furniture icon
  /hooks
  /data
    cats.js           ← cat definitions (traits, Like, Dislike, rates)
    rooms.js          ← room definitions (capacity, event pools, upgrade paths)
    furniture.js      ← furniture definitions (effects, costs)
    events.js         ← event pool definitions
  /store
    gameState.js      ← all game state (save/load from localStorage)
  App.jsx
  main.jsx
```

The `/src/data/` files are the most important to get right first. They encode all the design decisions in this document. The rest of the code is wiring those definitions into the UI.

---

### A.13 What to Tell Claude Code

When handing this document to Claude Code, include the following prompt alongside it:

> "Here is a Game Design Document for a cozy idle game called Cat House Idle. Please implement the launch scope described in the document: 3 cats (Miso, Bean, Mochi), 3 rooms (Living Room, Kitchen, Bedroom), 2 resources (Coins and Comfort), the Like/Dislike system, the state machine from Section 7.3, the tick system from Section 16.3, the save/load schema from Section 16.4, and the UI layout from Section 16.5. Use React + Vite. Use placeholder assets (colored rectangles or emoji) for all visuals during prototyping. Apply `image-rendering: pixelated` CSS to all game art `<img>` elements so real pixel art can be swapped in later without blurring. Use Lucide React for UI icons. Stub in the animation frame prop system from Appendix A.8. Asset paths should follow the structure in Appendix A.12 so real art can be dropped in later without changing code. Do not implement Garden, Study, or any post-launch content yet."

This scopes the implementation to exactly what is specified and prevents Claude Code from inventing additional features or rooms not yet designed.

---

*End of document.*
