# Cat House Idle — Build Plan

This plan breaks the implementation of [cat-house-idle-gdd-v4.md](cat-house-idle-gdd-v4.md) into self-contained steps. Each step can be picked up cold by a fresh agent. Steps 1–6 deliver a **Playable MVP** (assign cats → watch resources tick). Steps 7+ layer in depth (states, furniture, events, diary, offline, tutorial).

## How to use this plan

- **Each step is an executable unit.** Read the step, the listed GDD sections, and any files marked under "Inputs". Then implement only what the step describes.
- **No skipping ahead.** If the step says "stub the diary", do not also build the diary screen. That comes later.
- **Acceptance criteria are the contract.** A step is done when those bullets pass — not when the code "looks right".
- **Stack & rules locked in [memory/project_cat_house_idle.md](.claude/projects/-home-niels-van-welzen-projects-tiny-cat-house/memory/project_cat_house_idle.md).** Stack: React + Vite, localStorage save key `catHouseIdle_save`, Lucide React icons, Nunito font, `image-rendering: pixelated` on all game art. No audio, no Garden/Study, no room specialization.
- **Always work from the GDD.** When in doubt, the GDD is the source of truth. Memory captures resolved ambiguities — don't re-litigate them.
- **Don't invent features.** If something isn't in the step or GDD, leave it out.

---

# PHASE 1 — Playable MVP (Steps 1–6)

Goal: a player opens the page, sees a cutaway cat tower with 3 stacked rooms, drags 3 cats into rooms, and watches Coins + Comfort tick up correctly per the GDD's production formula. No states, no furniture, no events, no diary, no tutorial. Save/load works.

---

## Step 1 — Project scaffolding

**Goal:** A fresh Vite + React project that boots, renders an empty page with the Nunito font loaded, and has the asset folder structure in place.

**Inputs:** GDD Appendix A.12 (file structure), A.10 (font), A.7 (pixel CSS rules), Section 16.1 (stack).

**Do:**
1. Initialize a Vite + React (JavaScript, not TypeScript — match GDD examples) project at the repo root. Use `npm create vite@latest . -- --template react`.
2. Install dependencies: `react`, `react-dom`, `lucide-react`. (Vite installs the rest.)
3. Add the Nunito Google Font link to `index.html` (`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap">`). Set `body { font-family: 'Nunito', sans-serif; }` in the base CSS.
4. Create global CSS rule `.pixel-art { image-rendering: pixelated; image-rendering: crisp-edges; }`.
5. Create the empty asset folder structure under `public/assets/` (so paths resolve at `/assets/...` in dev): `cats/portraits/`, `cats/sprites/`, `cats/full-art/`, `rooms/`, `furniture/`, `ui/`, `audio/`. Drop a `.gitkeep` in each.
6. Create the `src/` subfolders: `components/`, `hooks/`, `data/`, `store/`. Empty for now.
7. Replace the default Vite `App.jsx` with a minimal "Cat House Idle" placeholder heading so we can see the font rendering.
8. Add a `.gitignore` covering `node_modules/`, `dist/`, `.DS_Store`.

**Acceptance:**
- `npm run dev` starts; visiting localhost shows "Cat House Idle" in Nunito.
- Folder structure matches GDD A.12 (under `src/` and `public/assets/`).
- `.pixel-art` class is defined globally.

---

## Step 2 — Static data files

**Goal:** All design constants from the GDD live in `src/data/` as plain JS modules. No game logic yet — just the data the rest of the game will read.

**Inputs:** GDD Sections 6.2 (rates), 6.3 (costs), 7.2 (traits), 7.3 (states & transitions), 8.1–8.3 (rooms), 10 (capacity), 11 (interactions), 13.4 (events), 17.1–17.3 (cat definitions). Memory: launch scope (3 cats, 3 rooms, 2 resources only).

**Do:** Create the following files with `export const` / `export default` data structures. No functions.

1. **`src/data/cats.js`** — array of the 3 launch cats (Miso, Bean, Mochi). Each entry: `id`, `name`, `traits` (array), `like` (string id), `dislike` (string id), `favoriteFurniture` (id), `flavorText`, `role`. Use the IDs `miso`, `bean`, `mochi`. Likes per Section 17 (e.g. Miso `"bedroom"`, Bean `"company"`, Mochi `"alone_kitchen"`). Dislikes: Miso `"crowded_room"`, Bean `"alone_offline"`, Mochi `"grumpy_cat_nearby"`.
2. **`src/data/rooms.js`** — array of the 3 launch rooms. Each: `id`, `name`, `towerFloor` (Kitchen = 1, Living Room = 2, Bedroom = 3), `baseCapacity`, `maxCapacity`, `produces` (array of `"coins"`/`"comfort"`), `baseRates` (object mapping condition → `{coins, comfort}` per minute, encoding the tables in Section 6.2). E.g. `kitchen.baseRates = { mochi_alone: { coins: 2, comfort: 0 }, default: { coins: 0.8, comfort: 0 } }`. Add `furnitureSlots` per level (1 slot at L1, 2 at L2, 3 at L3 — pick a sensible number; the GDD doesn't pin this, so use 1/2/3).
3. **`src/data/furniture.js`** — array of the 10 launch furniture items from Section 6.3 + GDD A.5. Each: `id`, `name`, `roomId` (which room it belongs to), `cost` (`{coins, comfort}`), `effect` (object describing the bonus, e.g. `{ type: 'flat_comfort', value: 1, appliesTo: 'lazy' }`). Encode the costs from Section 6.3 exactly. Capture the special effects called out in Section 11 / Section 7.3 (e.g. Quiet Corner removes Grumpy after 8 min flat).
4. **`src/data/states.js`** — exports `STATES` (array of state ids matching Section 7.3), `STATE_EFFECTS` (the table in Section 7.3 mapping state → `{coinsMod, comfortMod, notes}`), `TRANSITIONS` (the transition table from Section 7.3, each entry `{from, to, trigger: 'time'|'event', condition, durationMinutes: [min,max] | null}`).
5. **`src/data/events.js`** — array of the 8 launch events from Section 13.4 + the synergies/conflicts/discoveries in Section 11. Each: `id`, `title`, `flavor`, `triggerCondition` (descriptive object — actual matching logic comes later), `effect` (descriptive), `cooldownMinutes: 30` (Section 13.3), `isRare: false` (true for the 1+ rare entries the diary needs).
6. **`src/data/modifiers.js`** — exports the modifier table from Section 6.2 as constants: `LIKE_MULT = 1.5`, `SYNERGY_MULT = 1.25`, `DISLIKE_MULT = 0.6`, `GRUMPY_MULT = 0.5`, `POSITIVE_STATE_MULT = 1.2`, `MULTIPLIER_CAP = 2.5`, `FURNITURE_FLAT_COINS = 2`, `FURNITURE_FLAT_COMFORT = 1`.
7. **`src/data/relationships.js`** — exports `RELATIONSHIP_THRESHOLDS` (the table from Section 7.4) and a pure function `tierFromScore(score) → 'rival'|'avoidant'|'neutral'|'friendly'|'bonded'`. Plus `SCORE_FLOOR = -15`, `SCORE_CEILING = 40`.

**Acceptance:**
- All files import cleanly (`import { cats } from './data/cats.js'` works in `App.jsx`).
- Numeric values match the GDD exactly. No invented values; if the GDD is silent, use the closest specified default and add a one-line comment naming the GDD section.
- No game logic in `data/` — data files only.

---

## Step 3 — Game state store + save/load

**Goal:** A central game state with a defined initial value, save to localStorage, and load on boot. No UI wired up yet — verify via console.

**Inputs:** GDD Section 16.4 (data schema — read carefully, this is the contract), 16.7 (edge cases — missing fields default silently), Section 16.1 (auto-save every 60s + on `visibilitychange`). Memory: schema additions vs v3 (eventCooldowns top-level, stateTransitionDue per cat, roomSessions, relationships as `{score}` only, currentRoom can be null, diary entries as `{id, discoveredAt}`, resources are floats, save key `catHouseIdle_save`).

**Do:**
1. **`src/store/initialState.js`** — exports `createInitialState()` returning the starter save object matching Section 16.4. Resources start at `0.0`. `lastTickTimestamp = Date.now()`. All 3 cats present with `currentRoom: null`, `currentState: 'active'`, `stateEnteredAt: Date.now()`, `stateTransitionDue: null`, empty `relationships` map seeded with all other cat ids at `{score: 0}`, empty `roomSessions: {}`. All 3 rooms unlocked at level 1 with `towerFloor` copied from `src/data/rooms.js`, no furniture. Empty `diary.interactions/events/hints`. `diary.catProfiles` seeded with each cat's known like/dislike from the data files. `tutorialStep: 0`. `eventCooldowns: {}`. `offlineEventQueue: []`. `version: 1`.
2. **`src/store/persistence.js`** — exports `saveGame(state)` (writes JSON to `localStorage['catHouseIdle_save']`) and `loadGame()` (reads, parses, deep-merges over `createInitialState()` so missing fields default silently per Section 16.7; returns the merged state, or fresh state if absent / parse fails).
3. **`src/store/gameState.js`** — exports a React context `GameStateContext` and a `GameStateProvider` component. Provider holds state with `useState`, calls `loadGame()` on mount. Auto-save: a `useEffect` that calls `saveGame(state)` every 60s with `setInterval`, and one that listens to `document.visibilitychange` and saves immediately when the page becomes hidden. Provides `{state, setState}` (or a small action API — your call, but keep it minimal for now).
4. Wire `<GameStateProvider>` into `App.jsx`. In `App.jsx`, render the current `coins` and `comfort` (as `Math.floor`) just to prove the state plumbing works.
5. Add a "Reset save" debug button somewhere visible during dev that wipes localStorage and reloads. Helpful while iterating.

**Acceptance:**
- Loading the page once creates a fresh save; reloading reads the same save back.
- Editing localStorage manually and reloading preserves changes.
- Auto-save fires every 60s (verify by watching `lastTickTimestamp` change in DevTools).
- Switching tabs (`visibilitychange` to hidden) triggers an immediate save.
- Resources display as integers via `Math.floor`.

---

## Step 4 — Diorama shell + resource bar

**Goal:** The visible tower — a side-cutaway diorama with 3 stacked rooms (placeholder colored backgrounds) and a top resource bar showing Coins + Comfort. No interaction yet.

**Inputs:** GDD Section 16.5 (UI layout), Appendix A.4 (room style notes, placeholder colors: muted green = Living Room, warm orange = Kitchen, soft blue = Bedroom). Memory: web layout breakpoint at 640px (do mobile-first single-column for now; responsive comes in Step 17).

**Do:**
1. **`src/components/ResourceBar.jsx`** — sticky top bar showing Coins (Lucide `Coins` icon) and Comfort (Lucide `Heart` icon) with `Math.floor()` values from state.
2. **`src/components/Diorama.jsx`** — vertical stack of 3 `<RoomView>` components sorted by `towerFloor` descending, so Bedroom (3F) renders above Living Room (2F), which renders above Kitchen (1F). Add simple tower framing such as a roof/foundation so the rooms read as one vertical structure.
3. **`src/components/RoomView.jsx`** — renders one room. Props: `roomId`. Shows a placeholder-colored rectangle (per A.4 colors) sized 16:9. Background should attempt to load `/assets/rooms/{roomId}_{level}.png` and fall back to the colored rectangle if the image is missing (use `onError`). Apply `.pixel-art` class to the `<img>`. Show the room name and floor label.
4. Update `App.jsx` to render `<ResourceBar />` and `<Diorama />`.

**Acceptance:**
- 3 rooms visible, stacked vertically by floor, each labeled.
- Resource bar shows current Coins/Comfort and updates if you mutate state in DevTools.
- Missing image files don't break the layout (fallback colors render).
- `.pixel-art` class applied to room background `<img>` elements.

---

## Step 5 — Cat assignment (drag-to-place + cat info)

**Goal:** A cat roster row showing the 3 cats. Player can drag a cat directly onto a room to assign them, without a click-to-select placement step. Clicking/tapping a cat opens a cat info panel instead. Cats appear in the room they're assigned to. Capacity is enforced.

**Inputs:** GDD Section 16.5 (room detail panel, placement UI, 44×44px touch targets), Section 16.7 (over-capacity prevented at point of assignment), Appendix A.3 (cat sprite paths + placeholder = colored circle with cat initial). Memory: `cat.currentRoom` is the single source of truth; rooms do not store catsAssigned. Product update: cat click/tap is reserved for cat information; room assignment uses drag-and-drop.

**Do:**
1. **`src/components/CatSprite.jsx`** — props: `catId`, `state` (default `'active'`), `frame` (default `0`, unused for now — stub per A.8). Loads `/assets/cats/sprites/{catId}.png`, falls back to a colored circle with the cat's initial. Apply `.pixel-art`.
2. **`src/components/CatPortrait.jsx`** — same idea but loads `/assets/cats/portraits/{catId}.png` at 64px. Used in roster and info panels.
3. **`src/components/CatFullArt.jsx`** — loads `/assets/cats/full-art/{catId}.png` into a large framed area for future pixel full-body art. If missing, render a tasteful pixel placeholder using the cat's color/initial. Apply `.pixel-art`.
4. **`src/components/CatInfoPanel.jsx`** — opens when the player clicks/taps a cat in the roster or a placed cat in a room. Shows `CatFullArt`, portrait/name, traits, role, flavor text, known like/dislike, favorite furniture, current room, and current per-minute output if assigned. This panel is UI state only; do not store it in the save.
5. **`src/components/CatRoster.jsx`** — horizontal row at the bottom (or wherever sensible) showing each unassigned cat. Each cat card:
   - Starts a drag on pointer/touch movement, with a visible drag ghost or lifted-card state.
   - Opens `CatInfoPanel` on click/tap when there was no meaningful drag movement.
   - Keeps touch targets reasonably finger-sized (~44px).
   Use a small UI state in `App.jsx` or a hook such as `useCatDrag` for `draggingCatId` / pointer coordinates. Do not put drag state in the save.
6. **`src/components/RoomView.jsx`** — extend as a drop target. While a cat is being dragged, show a "drop here" affordance overlay and highlight the room under the pointer. Dropping calls an action that sets `cat.currentRoom = roomId` (only if room is below capacity). If at capacity, show a brief inline message and don't assign. Render any cats currently in the room as `<CatSprite>` instances inside the room.
7. Add a "remove from room" affordance that does not conflict with cat info. Use a small explicit button/icon on a placed cat (for example Lucide `X`) to set `currentRoom: null`; clicking the cat body still opens `CatInfoPanel`.
8. Action helpers go in `src/store/actions.js` if you make one (e.g. `assignCat(state, catId, roomId)`, `unassignCat(state, catId)`). Keep them as pure `state → newState` functions.

**Acceptance:**
- All 3 cats start in the roster (none assigned).
- Drag cat → drop on room → cat moves to that room and disappears from roster.
- Clicking/tapping a cat without dragging opens the cat info panel instead of selecting the cat for placement.
- The cat info panel includes a large full-art area that attempts to load `/assets/cats/full-art/{catId}.png` and falls back cleanly while those assets do not exist.
- Kitchen blocks the 2nd cat (capacity 1). Living Room and Bedroom block the 3rd (capacity 2).
- Clicking/tapping an assigned cat in a room opens the cat info panel.
- Using the explicit remove affordance on an assigned cat returns it to the roster.
- Touch targets are reasonably finger-sized (~44px).
- Save persists assignments across reload.

---

## Step 6 — Tick loop + production calculation

**Goal:** While the page is open, every 5s a tick fires that adds resources based on the current placement. Production correctly applies Like/Dislike modifiers. This is the MVP-completing step.

**Inputs:** GDD Section 16.3 (tick system: 5000ms `setInterval`, calculate from `Date.now() - lastTickTimestamp`), 6.2 (rates + modifier formula), 12 + 16.6 (priority order in code: Grumpy → Dislike → flat → multipliers → cap at ×2.5). For MVP, ignore states (treat all cats as Active), ignore Grumpy, ignore furniture (none placed yet), ignore relationships and synergies. Just: base rate × Like (×1.5) or × Dislike (×0.6).

**Do:**
1. **`src/store/production.js`** — pure function `calculateCatOutput(cat, room, allCatsInRoom, allCats, allRooms)` returning `{coins, comfort}` per minute. Implement only:
   - Look up the base rate for the cat in this room (using the conditions in Section 6.2 — Mochi alone in Kitchen gets the higher rate, Bean with company gets the higher Living Room comfort, Miso in Bedroom uses base, etc.). All cats default to "Active" state for now (no state effects yet).
   - Detect Like active: `cat.like === 'bedroom'` and `room.id === 'bedroom'`; `cat.like === 'company'` and `allCatsInRoom.length >= 2`; `cat.like === 'alone_kitchen'` and `room.id === 'kitchen'` and `allCatsInRoom.length === 1`.
   - Detect Dislike active: `cat.dislike === 'crowded_room'` and `allCatsInRoom.length === room.baseCapacity` and `room.baseCapacity > 1`. (Ignore `alone_offline` and `grumpy_cat_nearby` for MVP — no offline yet, no Grumpy yet.)
   - If Dislike active: apply ×0.6 and skip Like multiplier.
   - Else if Like active: apply ×1.5.
   - Cap final multiplier at ×2.5 (trivially satisfied here).
2. **`src/store/tick.js`** — pure function `runTick(state, nowMs)`:
   - `elapsedMs = nowMs - state.lastTickTimestamp`
   - For each room, for each cat in that room, call `calculateCatOutput`, multiply per-minute rates by `elapsedMs / 60000` to get this-tick gain, add to `resources.coins` / `resources.comfort` (as floats).
   - Update `lastTickTimestamp = nowMs`.
   - Return new state.
3. **`src/hooks/useGameTick.js`** — `useEffect` that `setInterval(() => setState(s => runTick(s, Date.now())), 5000)`. Cleanup on unmount.
4. Wire `useGameTick()` into the `GameStateProvider`.
5. Optional but useful: in each room, render the current per-minute output (sum across cats in room) as a small text label so the player can see what each room is generating. Not in the GDD but invaluable for testing.

**Acceptance:** **(this is the MVP gate)**
- Open the page with no cats assigned → resources do not change.
- Place Miso in the Bedroom → Comfort starts ticking up at ~0.4/min × Like ×1.5 = 0.6/min ≈ 0.05 per 5s tick.
- Place Mochi alone in the Kitchen → Coins ticks up at 2/min × Like ×1.5 = 3/min ≈ 0.25 per 5s tick.
- Place Bean in the Living Room with another cat → Comfort uses the "Bean with another cat" rate (0.8/min) plus Like ×1.5.
- Place a 2nd cat in the Bedroom with Miso → Miso's Dislike (`crowded_room`) activates, output drops to base × 0.6.
- Reload the page → resources persist; ticks continue from where they left off (within the open window — true offline simulation is later).

✅ **Playable MVP complete.** A player can place cats, see them tick up resources, and the Like/Dislike system mechanically affects output. From here, every step adds depth without breaking the loop.

---

# PHASE 2 — Depth (Steps 7–14)

Each step here can be done independently against the MVP. Pick the order that maximizes value or matches what you want to test first. Suggested order is listed but flexible.

---

## Step 7 — Cat states + transitions

**Goal:** Cats move through Active/Resting/Sleeping/Hungry/Grumpy/etc. over time, sampled deadlines stored in save. State affects production via the modifier table. Floating state icons appear on cat sprites.

**Inputs:** GDD Section 7.3 (states, transitions, durations, sampled `stateTransitionDue`, trait modifiers), 16.3 (offline simulation must be sequential — relevant once Step 13 lands but design with this in mind), 16.4 (`stateEnteredAt`, `stateTransitionDue` per cat, never reset on reload), Appendix A.6 (Lucide icons per state). Memory: state transition timing (sample once on entry, store as Unix ms, never reset on reload).

**Do:**
1. **`src/store/transitions.js`** — pure functions:
   - `sampleTransitionDue(fromState, cat) → timestampMs | null`. Looks up the time-based transition rule(s) for this state, samples a duration from the range, applies trait modifiers (Lazy ×0.6 to reach Sleeping; Calm ×0.5 to Grumpy duration), returns `Date.now() + sampledMs`. Returns `null` if no time-based outgoing transition.
   - `processStateTransitions(state, nowMs) → newState`. For each cat, if `nowMs >= cat.stateTransitionDue`, transition them: update `currentState`, set `stateEnteredAt = nowMs`, sample new `stateTransitionDue`. Handle the chain (Active → Resting → Sleeping → Active).
   - `setCatState(cat, newState, nowMs) → newCat`. Used by event-triggered transitions later.
2. Update `src/store/tick.js` `runTick` to call `processStateTransitions` first, then production.
3. Update `src/store/production.js` `calculateCatOutput` to apply state modifiers per the Section 7.3 table (Sleeping ×0.3 coins / ×1.5 comfort, Lazy cats Sleeping ×1.8 comfort, Grumpy ×0.5 both & suppress synergies, etc.). Apply modifiers in the order specified by Section 16.6.
4. When a cat is assigned to a new room, set `currentState = 'active'`, `stateEnteredAt = now`, sample `stateTransitionDue`. When unassigned, clear state to active and `stateTransitionDue = null`.
5. **`src/components/CatSprite.jsx`** — overlay a state icon (Lucide per A.6 — `Moon` for sleeping, `CloudLightning` for grumpy, `Heart` for cuddly, `Zap` for focused, `UtensilsCrossed` for hungry). For active/resting, no icon.

**Acceptance:**
- A cat placed in a room is Active. After 20–30 minutes (test by mutating `stateTransitionDue` to a recent past time in DevTools), they transition to Resting.
- A Lazy cat (Miso) reaches Sleeping faster than non-Lazy cats.
- Sleeping Miso's Comfort/min jumps (×1.5 base, ×1.8 if Lazy + Sleeping per state effects).
- `stateTransitionDue` survives page reload and is not reset.
- State icons render over cat sprites.

---

## Step 8 — Like/Dislike drag preview indicators + room detail panel

**Goal:** While a cat is being dragged for placement, each room shows green (Like will activate) / amber (Dislike will activate) tint. Tapping an already-occupied room opens a room detail panel showing each assigned cat's status, output, and Like/Dislike indicator.

**Inputs:** GDD Section 16.5 (placement preview indicator: green/amber/no tint, Dislike priority on ambiguous), 14.1 (always-visible info), 16.7 (Dislike wins on conflict).

**Do:**
1. **`src/store/preview.js`** — pure function `previewPlacement(cat, room, currentCatsInRoom) → 'like'|'dislike'|'neutral'`. Evaluates whether placing this cat here would activate Like or Dislike. Dislike wins ties.
2. Update `src/components/RoomView.jsx`: while a cat is being dragged, render a tinted overlay (`rgba(0,200,80,0.25)` for like, `rgba(220,160,40,0.30)` for dislike, none for neutral). Use `previewPlacement`.
3. **`src/components/RoomDetailPanel.jsx`** — opens on room tap (when no cat drag is active). Shows: room name + level, list of assigned cat slot cards (portrait, name, current state, current per-minute output, like/dislike status icon — Lucide `CheckCircle` green or `AlertTriangle` amber), empty slot placeholders. Mobile: bottom sheet. For now web layout can be a modal / inline panel — full responsive lands in Step 17.
4. Wire the panel: tap a room when no cat drag is active → open panel; tap outside → close. Clicking/tapping a cat inside the room still opens the cat info panel from Step 5, so keep room-panel taps scoped to the room background/label area.

**Acceptance:**
- Drag Miso → Bedroom tints green, all other rooms tint neutral (or amber if she'd be crowded).
- Drag Bean → Living Room tints green if at least 1 cat is already there, neutral otherwise.
- Drag Mochi → Kitchen tints green only if Kitchen is empty.
- Tap an occupied room → detail panel shows each cat with their current status.

---

## Step 9 — Furniture + room upgrades

**Goal:** Player can spend Coins/Comfort to add furniture to rooms or upgrade room level. Furniture provides flat bonuses (per Section 6.2). Upgraded rooms have higher capacity and more furniture slots.

**Inputs:** GDD Section 6.3 (costs), 9.3 (furniture as room identity), 10 (capacity scaling), 6.2 (furniture flat bonus values). Memory: room specialization is post-launch.

**Do:**
1. **`src/store/upgrades.js`** — actions:
   - `purchaseFurniture(state, roomId, furnitureId) → newState | null` (returns null if unaffordable or no slot). Subtracts cost, appends to `room.furniture` array.
   - `upgradeRoom(state, roomId) → newState | null`. Looks up cost from `data/rooms.js`, subtracts, increments `room.level`. (Cost source: GDD 6.3 has the L2/L3 universal expansion costs.)
2. Update `src/store/production.js` to apply furniture flat bonuses. A furniture item with `effect.type === 'flat_coins'` adds `effect.value` to base coins; `flat_comfort` adds to base comfort. Trait-targeted furniture (e.g. Heated Blanket targets Lazy) only applies if the cat has the matching trait.
3. Capacity: `effectiveCapacity(room) = baseCapacity + (room.level - 1)` capped at `maxCapacity`. Update assignment + crowded_room checks to use this.
4. Extend `src/components/RoomDetailPanel.jsx`: render furniture slots (placed items show name + icon, empty slots show "Buy: [furniture] — Cost"). Add an "Upgrade Room" button at the bottom showing cost. Disable if unaffordable.
5. **`src/components/FurnitureSlot.jsx`** — renders a furniture slot. Loads `/assets/furniture/{id}.png`, falls back to text label.

**Acceptance:**
- Buying Heated Blanket (270 Coins, 30 Comfort) deducts cost and adds the item to Bedroom.
- Miso in Bedroom with Heated Blanket gets +1 flat Comfort/min (since she's Lazy and the blanket targets Lazy).
- Upgrading Bedroom to Level 2 costs 1200 Coins / 150 Comfort, increases capacity to 3 (bedroom max is 3 per Section 10).
- Cannot buy if unaffordable (button disabled).
- Cannot place furniture if no empty slots remain at this level.

---

## Step 10 — Event system

**Goal:** Every 5 minutes (real time, not the 5-second tick), check each cat for events. Eligible events fire based on conditions, respect 30-min cooldowns, and surface as event cards. Cooldowns persist across sessions.

**Inputs:** GDD Section 13 (event design, 5-min tick rate, base chances by condition, cooldowns in `eventCooldowns`), 13.4 (event examples), 16.4 (`eventCooldowns` schema). Memory: cooldowns respected during offline simulation.

**Do:**
1. Add to `src/data/events.js`: a `matches(cat, room, allCatsInRoom, state) → bool` function per event. Encode the trigger conditions from Section 11/13.4. E.g. Hidden Toy: Playful cat in active (non-Sleeping/Grumpy) room. Shared Sunbeam: 2 cats both Resting/Sleeping in same room.
2. **`src/store/events.js`** — pure function `processEvents(state, nowMs) → {newState, firedEvents: []}`:
   - Check if at least 5 real minutes have passed since the last event check (track `lastEventCheckAt` in state — add to schema, default to `lastTickTimestamp`).
   - For each cat in a room, compute the per-tick chance per Section 13.3 (default 8%, +modifiers for Like/trait/relationship, etc.).
   - For each event whose `matches()` returns true and whose `eventCooldowns[eventId]` is older than 30 min ago (or absent): roll against the chance. On hit: update cooldown, apply mechanical effect, push to `firedEvents`.
3. Wire into `runTick`: call `processEvents` after state transitions, before production. Append fired events to a UI-only event queue (not the offline queue — that's separate).
4. **`src/components/EventCardStack.jsx`** — renders fired events as dismissible cards (title, flavor text, mechanical effect summary). Cards auto-dismiss after 8s or on tap.

**Acceptance:**
- Bean (Playful) in an active room sometimes fires Hidden Toy. Same event won't refire for Bean within 30 min.
- Mochi alone in Kitchen sometimes fires Stolen Snack.
- Two cats Resting in the same room can fire Shared Sunbeam.
- `eventCooldowns` is updated and persists across reload.
- Events render as cards; mechanical effects apply (Comfort gain, state changes, etc.).

---

## Step 11 — Cat Diary

**Goal:** A diary screen with 4 tabs (Cats, Interactions, Events, Hints). Discovered entries are unlocked; undiscovered shown as silhouettes with hint text. A counter appears once at least 1 entry is found in a tab. Hint entries auto-unlock after a cat has had 2+ sessions in a relevant room.

**Inputs:** GDD Section 14.3 (diary structure, target counts, session definition for hints, completion counter rules), 16.4 (entry shape `{id, discoveredAt}` for interactions/events, `{id, catId, roomId, discoveredAt}` for hints). Memory: diary unlock is automatic on event fire / synergy first apply, no dismissal required.

**Do:**
1. **`src/store/diary.js`** — actions:
   - `unlockInteraction(state, id, nowMs)` — append to `diary.interactions` if not present.
   - `unlockEvent(state, id, nowMs)` — same for `diary.events`.
   - `unlockHint(state, id, catId, roomId, nowMs)` — same for `diary.hints`.
2. Wire event firing (Step 10) to call `unlockEvent` when an event fires for the first time. Wire synergy detection in production (when a synergy multiplier first applies for a cat) to call `unlockInteraction`.
3. **Room sessions:** track per-cat in-room time. Add `currentRoomEnteredAt` to each cat (set when they're assigned to a room). On a tick, if a cat has been continuously in their room for ≥5 minutes and the session hasn't been counted yet, increment `cat.roomSessions[roomId]`. On unassignment, reset the counter.
4. **Hint generation:** on each tick, for each `(cat, room)` where `cat.roomSessions[roomId] >= 2` and there's an undiscovered interaction tied to that pairing, unlock the corresponding hint.
5. **`src/components/CatDiary.jsx`** — full-screen modal with 4 tabs. Each tab lists entries from a static catalog (define the catalog inline or in `data/diaryCatalog.js`). Discovered entries show full info; undiscovered show a lock icon + the hint line. Counter shown only after first unlock in that tab. Open from a "Diary" button in the main UI (Lucide `BookOpen`).

**Acceptance:**
- Diary screen opens; all entries start undiscovered (just hint silhouettes, no counter).
- Firing Hidden Toy unlocks the Hidden Toy event entry. Counter appears: "1 of 12 discovered".
- Achieving the Nap Pile synergy (2 Lazy/Calm cats in Bedroom) unlocks the Nap Pile interaction.
- Leaving Miso in the Bedroom for 2 separate ≥5-min sessions unlocks the Bedroom-related hint.
- All unlocks persist in save.

---

## Step 12 — Relationships

**Goal:** Score-based pairwise relationships between cats. Score updates on shared events/states (per Section 7.4 table). Tier derived at load time, never stored. Bonded pairs get +6% event rate, etc.

**Inputs:** GDD Section 7.4 (full table, score floor/ceiling, reversibility), 16.4 (`relationships[id] = {score}` only). Memory: tier never persisted, only score; clamp after every update; no passive decay.

**Do:**
1. **`src/store/relationships.js`** — pure functions:
   - `adjustRelationship(state, catA, catB, delta) → newState` — applies delta to both directions, clamps to `[SCORE_FLOOR, SCORE_CEILING]`.
   - `getTier(state, catA, catB) → tier` — uses `tierFromScore` from `data/relationships.js`.
2. Wire in:
   - Each tick: for every pair of cats in the same room, if either is Grumpy → `adjustRelationship(-1)`. If both are in a positive state (Relaxed/Cuddly/Focused) → `adjustRelationship(+1)`. (Per the Section 7.4 "per 5-min tick" rule — gate on `lastEventCheckAt` like events.)
   - When a positive shared event fires involving 2+ cats: +2.
   - When a synergy interaction involving a pair fires: +3.
   - When a conflict involving a pair fires: -3.
3. Update `src/store/events.js` `processEvents`: apply Section 13.3 relationship modifier (+6% for Bonded, +3% Friendly, -3% Avoidant, -6% Rival) when computing event chance for cats sharing a room.
4. Update `src/store/production.js`: Bonded/Friendly pair in same room contributes synergy multiplier per Section 12 priority order. Rival suppresses synergies.
5. Surface in the cat detail / roster screen: list each relationship with the other cat as `[name] — [tier]` (text only for now).

**Acceptance:**
- Two cats in the same room with Miso Grumpy → relationship score drops by 1 each event tick.
- Two cats sharing a room and both in Relaxed/Cuddly → score climbs by 1 each event tick.
- Crossing thresholds (e.g. score → 10) updates the displayed tier on the next render. No stored `tier` field exists in save data.
- Score never exceeds 40 or drops below -15.

---

## Step 13 — Offline simulation + summary overlay

**Goal:** When the player returns after the page was closed, simulate the elapsed time as a series of 5-minute virtual ticks (capped at the offline cap), display a blocking summary overlay showing resources earned + top 5 events. Tapping Collect clears the queue and unblocks interaction.

**Inputs:** GDD Section 15 (offline summary), 16.3 (offline cap, virtual tick logic, sequential requirement, event queue cap of 5 with priority order), 6.4 (cap values: 4h base, 5h with Cozy Bedroom, 6h with Moonlit Window). Memory: offline summary is blocking, queue cleared on Collect, Bean's Dislike only triggers if offline ≥1 virtual tick (≥5 min).

**Do:**
1. **`src/store/offline.js`** — pure function `simulateOffline(state, nowMs) → {newState, summary}`:
   - `elapsedMs = nowMs - state.lastTickTimestamp`. If < 5 min, skip (no offline).
   - Compute offline cap from upgrades (Moonlit Window furniture in Bedroom → 6h, Cozy/L2 Bedroom → 5h, else 4h). Cap `elapsedMs`.
   - Loop in 5-min virtual ticks. Each tick (in order, never parallel): process state transitions → process events → update relationships → calculate resource gains. Carry full state forward.
   - Collect all fired events. Priority-sort per Section 16.3 (rare → tier changes → new diary → conflicts → recent). Take top 5.
   - Resolve Bean's `alone_offline` Dislike: if Bean was in a room with no other cats throughout the offline period (and the period was ≥5 min), set a flag on Bean indicating dislike-active. Cleared next time another cat shares her room.
   - Return new state + `{coinsEarned, comfortEarned, events: top5, relationshipChanges: [], newDiaryEntries: []}`.
2. Wire into `GameStateProvider` mount: on initial load, call `simulateOffline(loadedState, Date.now())`. If a summary is produced, push it to a "pending summary" UI state.
3. **`src/components/OfflineSummaryOverlay.jsx`** — fullscreen blocking overlay (z-index above everything). Shows "While you were away" header, time away, resources earned, event list, diary unlocks, relationship changes. Single Collect button. On Collect: clear `state.offlineEventQueue`, clear pending summary, return to game.
4. Block all `RoomView` / `CatRoster` / `RoomDetailPanel` interaction while overlay is shown (the overlay itself stops pointer events on the rest of the UI).

**Acceptance:**
- Close the page for 10 minutes (or simulate by setting `lastTickTimestamp` 10 min into the past in DevTools, then reload). Summary overlay appears with ~10 min of resource gains.
- Close the page for 12 hours → resources cap at 4h equivalent (base) silently.
- Bean alone in her room when closing → returns with her Dislike flag active. Add another cat → flag clears.
- Up to 5 events shown, prioritized correctly.
- Cannot interact with the house until Collect is tapped.

---

## Step 14 — Tutorial

**Goal:** First-launch sequence: 5 linear steps walking the player through dragging Miso into the Bedroom (in Sleeping state immediately, skipping transitions), watching Comfort tick, collecting, and tapping the upgrade button. After completion, force-fire Hidden Toy on Bean.

**Inputs:** GDD Section 16.5 (tutorial steps table, post-tutorial event, dismissable to skip). Memory: Step 2 places Miso directly in Sleeping (skip transition); post-tutorial Bean event auto-assigns Bean to Living Room if unassigned.

**Do:**
1. **`src/components/Tutorial.jsx`** — reads `state.tutorialStep`, renders a tooltip/spotlight for the current step. Each step listens for the appropriate user action and advances `tutorialStep`. A dismiss button on every tooltip jumps `tutorialStep` to 5.
2. Implement the 5 steps per Section 16.5, adapted for drag-to-place. Step 2: when the assignment fires for Miso → Bedroom during the tutorial, override the normal flow to set `currentState: 'sleeping'`, `stateEnteredAt: now`, sample new `stateTransitionDue` for the Sleeping → Active transition.
3. **Post-tutorial event:** in `runTick`, after `tutorialStep` reaches 5, on the very next tick, force-fire Hidden Toy on Bean. If Bean is unassigned, auto-assign her to Living Room first. Mark this with a one-shot flag (e.g. `state.pendingPostTutorialEvent = true`) to ensure it only fires once.
4. Suppress organic event firing during the tutorial (steps 0–4) so the tooltips aren't drowned out.

**Acceptance:**
- Fresh save → tutorial step 1 spotlight on Miso.
- Following the steps in order advances `tutorialStep` 1 → 5.
- Skipping at any step jumps directly to 5.
- After tutorial, Bean fires Hidden Toy on the next tick (auto-assigned to Living Room if needed).
- After the post-tutorial event, no further tutorial UI ever appears.

---

# PHASE 3 — Polish (Steps 15–18)

These can land in any order after Phase 2 and don't affect game logic.

---

## Step 15 — Cat roster screen + cat profile detail

**Goal:** A full-screen Cats tab showing all unlocked cats with rich profile detail on tap.

**Inputs:** GDD Section 16.5 (Cat Roster Screen). Memory: relationships derived not stored.

**Do:** Build `src/components/CatRosterScreen.jsx` and `src/components/CatProfile.jsx`. Roster: grid of cards (portrait, name, current room, state, like/dislike, mood icon). Profile: full info incl. all relationships with derived tiers, traits, flavor text, favorite furniture. Wire to a "Cats" button in the main UI.

**Acceptance:** Tapping the Cats button opens roster; tapping a cat opens their profile; relationships shown by tier.

---

## Step 16 — Animation frame stub

**Goal:** Future-proof the sprite system per GDD A.8 so animation can drop in without a refactor.

**Inputs:** GDD A.8.

**Do:** `<CatSprite>` already accepts a `frame` prop (Step 5). Add a sprite-sheet lookup helper that, given `catId + state + frame`, computes a `background-position` offset. For launch, all states map to `frame: 0` of the same image. Stub the helper but don't wire any animation loop. Add a TODO comment pointing to A.8.

**Acceptance:** No visible change; `<CatSprite catId="miso" state="sleeping" frame={0} />` works; helper is in place.

---

## Step 17 — Mobile responsive layout

**Goal:** Match the GDD's 640px breakpoint behavior. Below 640px: single-column, room panels open as bottom sheets. Above 640px: diorama left (~60%), persistent side panel right.

**Inputs:** GDD Section 16.1, 16.5.

**Do:** Use a single CSS media query at `max-width: 640px`. Mobile: stack diorama vertically, room detail opens as a sliding bottom sheet. Web: split-view with diorama on left, side panel on right that swaps between selected room detail and cat roster. Bottom tab bar on mobile (House | Cats | Diary).

**Acceptance:** Resizing the browser past 640px swaps layouts. Touch targets ≥44px on mobile.

---

## Step 18 — Capacitor wrap

**Goal:** Build iOS + Android shells via Capacitor without changing game code.

**Inputs:** GDD Section 16.1.

**Do:** `npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android`. `npx cap init "Cat House Idle" "com.example.cathouseidle"`. Configure `webDir: 'dist'`. `npm run build && npx cap sync`. Document the platform-add commands (`npx cap add ios` / `add android`) and how to open in Xcode / Android Studio.

**Acceptance:** `npx cap sync` succeeds. Documentation lists the build + open commands. Game runs in iOS simulator and Android emulator (verify if you have the toolchains; otherwise just document the steps).

---

## Out of scope (post-launch, do not build)

Per memory and GDD: Garden, Study, Bathroom, Hallway, Porch, Sunroom, Playroom, Library Nook. Cats 4–6. Room specialization paths. Audio. Per-state cat sprite variants. Idle animations. Any of the placeholder rooms/cats marked `[PLACEHOLDER]` in the GDD.
