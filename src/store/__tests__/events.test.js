import { describe, expect, it, vi } from 'vitest';
import { createInitialState } from '../initialState.js';
import { forcePostTutorialEvent, processEvents } from '../events.js';

describe('event processing', () => {
  it('fires eligible events, applies effects, unlocks diary entries, and sets cooldowns', () => {
    const nowMs = 1_700_000_000_000;
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = {
      ...createInitialState(),
      tutorialStep: 5,
      lastTickTimestamp: nowMs - 10 * 60_000,
      lastEventCheckAt: nowMs - 10 * 60_000,
      cats: createInitialState().cats.map((cat) =>
        cat.id === 'bean' ? { ...cat, currentRoom: 'living_room', currentState: 'active' } : cat,
      ),
    };

    const result = processEvents(state, nowMs);

    expect(result.firedEvents.map((event) => event.id)).toEqual(['hidden_toy']);
    expect(result.newState.resources.comfort).toBe(8);
    expect(result.newState.eventCooldowns.hidden_toy).toBe(nowMs);
    expect(result.newState.diary.events).toEqual([{ id: 'hidden_toy', discoveredAt: nowMs }]);
    expect(result.newState.cats.find((cat) => cat.id === 'bean').currentState).toBe('curious');
  });

  it('respects event check timing and cooldowns', () => {
    const nowMs = 1_700_000_000_000;
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const baseState = {
      ...createInitialState(),
      tutorialStep: 5,
      lastTickTimestamp: nowMs - 10 * 60_000,
      lastEventCheckAt: nowMs - 1 * 60_000,
      cats: createInitialState().cats.map((cat) =>
        cat.id === 'bean' ? { ...cat, currentRoom: 'living_room', currentState: 'active' } : cat,
      ),
    };

    expect(processEvents(baseState, nowMs).firedEvents).toEqual([]);

    const cooledDownState = {
      ...baseState,
      lastEventCheckAt: nowMs - 10 * 60_000,
      eventCooldowns: { hidden_toy: nowMs - 5 * 60_000 },
    };
    expect(processEvents(cooledDownState, nowMs).firedEvents).toEqual([]);
  });

  it('force-fires the post-tutorial hidden toy event and auto-assigns Bean', () => {
    const nowMs = 1_700_000_000_000;
    const result = forcePostTutorialEvent({ ...createInitialState(), tutorialStep: 5, pendingPostTutorialEvent: true }, nowMs);

    expect(result.firedEvents).toHaveLength(1);
    expect(result.firedEvents[0]).toMatchObject({ id: 'hidden_toy', roomId: 'living_room' });
    expect(result.state.cats.find((cat) => cat.id === 'bean')).toMatchObject({
      currentRoom: 'living_room',
      currentState: 'curious',
    });
    expect(result.state.pendingPostTutorialEvent).toBe(false);
    expect(result.state.postTutorialEventFired).toBe(true);
  });
});
