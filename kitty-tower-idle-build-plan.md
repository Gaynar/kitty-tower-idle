# Hector's Adventure - Build Plan

This plan replaces the old Kitty Tower Idle build plan. New implementation should follow [hector-roguelike-gdd.md](hector-roguelike-gdd.md). The previous [kitty-tower-idle-gdd-v4.md](kitty-tower-idle-gdd-v4.md) is historical reference only.

The current repository already contains a React + Vite app with many tower-idle systems. Treat those systems as legacy unless a step explicitly keeps them.

## How To Use This Plan

- Each step is an executable unit.
- Read the listed GDD sections before implementing the step.
- Keep changes scoped to the step. Do not rebuild future systems early.
- Keep user-facing systems simple until the full day/night loop is playable.
- Preserve useful project infrastructure: React + Vite, JavaScript, Vitest, localStorage, Lucide React, and `.pixel-art`.
- Use the new save key `hectorsAdventure_save`.
- Do not reuse `kittyTowerIdle_save`.

## Current Progress

- Step 1 is implemented: the app boots as Hector's Adventure, uses `hectorsAdventure_save`, starts from a clean Hector save shape, and includes a development reset-save button.
- Step 2 is implemented: static Hector data now exists under `src/data/` for resources, house rooms, room upgrades, Hector, Fighter abilities, enemies, statuses, node types, and Back Alley events.
- Step 3 is implemented: the app shell, resource bar, phase indicator, and Day/Night flow exist. Day must finish before Start Night appears, and returning home starts the next day.
- Step 4 is implemented as a first pass: the house renders as a fixed five-room cutaway with Hector activity placeholders, room tiers, effects, and day-output labels.
- Step 5 is partially implemented: the 30-second day timer runs while the app is open, stores progress in the save, grants simple room preparation output once at completion, and unlocks night. Room output tuning can continue alongside Step 6 upgrades.
- Legacy tower tests still exist and fail against the new Hector save shape. Rewrite or remove them during Step 16 instead of preserving old cat roster, relationship, furniture, tower, and offline systems.

---

# Phase 1 - Pivot Foundation

Goal: retire the visible Kitty Tower Idle identity and establish Hector's Adventure data, state, and navigation skeleton.

## Step 1 - Rename App Identity And Save Contract

**Goal:** The app boots as Hector's Adventure and uses a clean save schema.

**Inputs:** GDD Sections 1, 3, 15, 17.

**Do:**

1. Replace visible "Kitty Tower Idle" branding with "Hector's Adventure".
2. Change the app save key to `hectorsAdventure_save`.
3. Create a new initial state shape:
   - `version`
   - `day`
   - `phase: 'day' | 'night'`
   - `resources: { fishbones, cannedTuna }`
   - `house`
   - `hector`
   - `currentRun: null | object`
   - `settings`
4. Remove save assumptions tied to Coins, Comfort, Miso, Bean, Mochi, relationships, cat roster assignment, room production formulas, and offline progress.
5. Keep load fallback behavior: corrupt or missing saves should create a fresh Hector save.
6. Add a visible reset-save debug button while the game is in development.

**Acceptance:**

- App loads without depending on legacy cat data.
- localStorage uses `hectorsAdventure_save`.
- Reset save clears only the new save key.
- Refreshing preserves Hector resources and day count.

## Step 2 - Static Game Data

**Goal:** Core Hector data exists as plain JS modules.

**Inputs:** GDD Sections 5, 6, 8, 9, 10, 12, 13.

**Do:**

Create data files under `src/data/`:

1. `resources.js` - Fishbones and Canned Tuna metadata.
2. `houseRooms.js` - Living Room, Kitchen, Bedroom, Storage/Washing Room, Attic.
3. `roomUpgrades.js` - first upgrade tier for each room.
4. `hector.js` - starting stats and Fighter class reference.
5. `abilities.js` - 10 Fighter ability definitions.
6. `enemies.js` - Alley Rat, Bold Pigeon, Tiny Dog, Rival Tabby, Bin Baron.
7. `statuses.js` - Wet, Hungry, Spooked.
8. `nodes.js` - Combat, Event, Rest, Shop, Elite, Boss.
9. `events.js` - 4 to 6 simple Back Alley events.

**Acceptance:**

- All data files import cleanly.
- Miso, Bean, and Mochi are no longer required by the app.
- Bin Baron is represented as a boss using 3x HP and 1.5x damage against a base enemy profile.

## Step 3 - App Shell And Phase Navigation

**Goal:** The player can see the current phase and switch through the intended MVP flow.

**Inputs:** GDD Sections 4, 6, 7, 8.

**Do:**

1. Build a simple app shell with:
   - top resource bar
   - day/night phase indicator
   - main content area
   - debug reset button
2. Add phase actions:
   - day phase can start or advance the day timer
   - completed day can start a night run
   - night run can return home
3. Keep the UI functional, not decorative.

**Acceptance:**

- The player can move from Day to Night and back.
- The day count increments when a new day begins.
- Resources are shown as Fishbones and Canned Tuna.

---

# Phase 2 - Day Phase

Goal: the house becomes a useful preparation layer for night runs.

## Step 4 - Fixed Cutaway House

**Goal:** Show the terraced house with five fixed rooms.

**Inputs:** GDD Sections 6.2, 6.3.

**Do:**

1. Replace tower room rendering with a fixed dollhouse layout:
   - Floor 3: Attic
   - Floor 2: Bedroom and Storage/Washing Room
   - Floor 1: Living Room and Kitchen
2. Each room shows:
   - room name
   - activity label
   - upgrade tier
   - current effect
3. Show Hector activity placeholders in unlocked rooms.
4. Keep `.pixel-art` support for future art.

**Acceptance:**

- All five rooms are visible.
- No room requires cat drag/drop assignment.
- The house reads as a side-cutaway structure.

## Step 5 - 30-Second Day Timer

**Goal:** Day phase progresses while the app is open and produces preparation resources.

**Inputs:** GDD Sections 5, 6.1, 6.3.

**Do:**

1. Add a 30-second day timer.
2. While the timer runs, rooms produce simple MVP resources:
   - Kitchen can produce Canned Tuna.
   - Other rooms can produce small Fishbones or preparation effects.
3. No offline progress.
4. At the end of the timer, mark the day as ready for night.

**Acceptance:**

- Timer advances only while the app is open.
- At day end, the player can start the night.
- Refreshing preserves timer state well enough for development.

## Step 6 - Room Upgrades

**Goal:** The player can spend Fishbones on permanent room upgrades that affect future runs.

**Inputs:** GDD Sections 5, 6.4.

**Do:**

1. Add room upgrade actions.
2. Implement first-tier effects:
   - Living Room: +1 Attack
   - Kitchen: +1 Canned Tuna per day or start run with 1 Tuna Snack
   - Bedroom: +5 Max HP
   - Storage/Washing Room: +1 Luck
   - Attic: placeholder for later storage
3. Show affordability and disabled states.

**Acceptance:**

- Upgrades persist across reload.
- Upgrades modify Hector's derived run stats or starting supplies.
- The player cannot buy unaffordable upgrades.

---

# Phase 3 - Night Map

Goal: the player can start a generated Back Alley run and choose visible nodes.

## Step 7 - Run State And Map Generation

**Goal:** Starting a night creates a fresh map and current run state.

**Inputs:** GDD Sections 8, 14, 16.

**Do:**

1. Define `currentRun`:
   - `level`
   - `xp`
   - `hp`
   - `mp`
   - `abilities`
   - `items`
   - `map`
   - `currentNodeId`
   - `completedNodeIds`
   - `status`
2. Generate a visible Back Alley map with around 8 nodes before a Boss node.
3. Include Combat, Event, Rest, Elite, and Boss nodes.
4. Keep Shop disabled or placeholder until later.

**Acceptance:**

- Each night starts with a fresh map.
- Node types are visible before choosing.
- Boss is always the final objective.

## Step 8 - Map UI And Node Selection

**Goal:** The player can move through the night map.

**Inputs:** GDD Sections 8.1, 8.2.

**Do:**

1. Render the map as a branching or lane-based node view.
2. Allow selecting only reachable next nodes.
3. Mark completed nodes.
4. Add an "Abandon Run" action that returns Hector home and keeps gathered resources.

**Acceptance:**

- Player can progress from start toward boss.
- Completed and available nodes are visually distinct.
- Abandoning clears run state and returns to day/home.

---

# Phase 4 - Combat MVP

Goal: combat is playable enough to complete or lose a run.

## Step 9 - Turn-Based Combat Engine

**Goal:** Implement pure combat logic for Hector vs 1 to 5 enemies.

**Inputs:** GDD Sections 9, 13.

**Do:**

1. Create pure combat functions for:
   - start combat
   - player Attack
   - player Defend
   - player Ability
   - player Item
   - player Flee
   - enemy turn resolution
2. Use HP, MP, Attack, Defense, Speed, Luck.
3. Implement enemy intent.
4. Implement win and loss outcomes.

**Acceptance:**

- Normal combat can be won or lost.
- Enemy intent appears before enemy actions resolve.
- Defend reduces incoming damage.
- Flee works only outside boss fights.

## Step 10 - Combat UI

**Goal:** The player can fight through a node using visible controls.

**Inputs:** GDD Sections 9.1 through 9.5.

**Do:**

1. Show Hector HP/MP/status.
2. Show enemies, HP, and intent.
3. Add buttons for Attack, Ability, Item, Defend, Flee.
4. Show a concise combat log.
5. Return to map after victory.
6. Return home after defeat.

**Acceptance:**

- Combat is usable by mouse/touch.
- The player can understand what happened last turn.
- Defeat resets run level, abilities, and items but keeps gathered resources.

## Step 11 - Status Effects

**Goal:** Add first-pass Wet, Hungry, and Spooked effects.

**Inputs:** GDD Section 9.5.

**Do:**

1. Implement status storage on combatants.
2. Add simple effects:
   - Wet: reduce Speed
   - Hungry: reduce Attack
   - Spooked: chance to miss
3. Add enemy intents that apply statuses.
4. Display status icons or labels.

**Acceptance:**

- Status effects apply and expire or clear.
- Statuses are visible.
- Statuses affect combat calculations.

---

# Phase 5 - Run Progression

Goal: runs gain temporary shape through XP, levels, abilities, and rewards.

## Step 12 - XP And Level Ups

**Goal:** Hector levels during a run and chooses temporary Fighter abilities.

**Inputs:** GDD Sections 10.1, 10.2, 14.

**Do:**

1. Award XP from combat and elite nodes.
2. Define level thresholds.
3. On level up, show 2 to 3 ability choices from the Fighter tree.
4. Add selected abilities to the current run only.
5. Reset level and abilities at run end.

**Acceptance:**

- Hector starts each run at level 1.
- Level-up choices affect the current run.
- Reloading preserves the current run if one is active.
- Returning home clears temporary progression.

## Step 13 - Events, Rest, Elite, And Boss

**Goal:** All MVP node types have behavior.

**Inputs:** GDD Sections 8.2, 11, 12, 13, 14.

**Do:**

1. Event nodes offer simple choices or outcomes.
2. Rest nodes restore HP or MP.
3. Elite nodes run harder combat with better rewards.
4. Boss node starts the Bin Baron fight.
5. Boss win returns Hector home with rewards and increments a boss-win count.
6. Boss scaling can use a small multiplier based on prior wins.

**Acceptance:**

- A full run from map start to boss can be completed.
- Boss is harder than normal enemies.
- Boss victory and defeat both return to the house correctly.

---

# Phase 6 - Polish And Validation

Goal: make the MVP coherent enough to play repeatedly.

## Step 14 - Balance Pass

**Goal:** Tune the first playable loop.

**Inputs:** GDD Sections 4, 5, 6, 9, 10, 16.

**Do:**

1. Tune day resource output.
2. Tune room upgrade costs.
3. Tune Hector starting stats.
4. Tune enemy stats and XP.
5. Tune Canned Tuna healing.
6. Ensure normal battles last about 3 to 6 turns and boss fights about 10 turns.

**Acceptance:**

- First room upgrade is reachable in a reasonable early session.
- First boss is beatable after learning and a few upgrades.
- Defeat feels recoverable, not punishing.

## Step 15 - Visual Pass

**Goal:** Replace rough layouts with clear, game-like presentation.

**Inputs:** GDD Sections 2, 6.2, 17.

**Do:**

1. Improve house layout spacing and room readability.
2. Improve map node visuals.
3. Improve combat layout.
4. Add simple Hector placeholders or art hooks.
5. Keep UI practical and compact.

**Acceptance:**

- Day and night feel visually distinct.
- Text does not overlap at mobile or desktop sizes.
- Important controls are easy to find.

## Step 16 - Test Coverage

**Goal:** Protect the new core logic.

**Inputs:** All MVP systems.

**Do:**

Add Vitest coverage for:

1. initial state
2. persistence fallback
3. day timer/resource production
4. room upgrades
5. map generation
6. combat damage and defense
7. enemy intent
8. run defeat/victory cleanup
9. XP and temporary ability reset

**Acceptance:**

- `npm test` passes.
- Core pure logic has tests.
- Legacy tower tests are removed or rewritten for Hector systems.

---

# MVP Complete

The MVP is complete when:

- The app is branded as Hector's Adventure.
- Hector has a fixed five-room house.
- A 30-second day prepares resources.
- Room upgrades permanently improve future runs.
- Night starts a generated Back Alley map.
- Combat is playable with visible enemy intent.
- Hector can level up and choose temporary abilities.
- Hector can defeat or lose to the Bin Baron.
- Returning home resets run-only progress and keeps home resources.
