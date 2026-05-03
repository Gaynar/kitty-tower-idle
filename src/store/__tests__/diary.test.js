import { describe, expect, it } from 'vitest';
import { createInitialState } from '../initialState.js';
import { processRoomSessions, unlockEvent, unlockHint, unlockInteraction } from '../diary.js';

describe('diary unlocks and room sessions', () => {
  it('adds diary entries once with discovery timestamps', () => {
    const nowMs = 1_700_000_000_000;
    let state = createInitialState();

    state = unlockInteraction(state, 'nap_pile', nowMs);
    state = unlockInteraction(state, 'nap_pile', nowMs + 1);
    state = unlockEvent(state, 'hidden_toy', nowMs);
    state = unlockHint(state, 'miso_bedroom_hint', 'miso', 'bedroom', nowMs);

    expect(state.diary.interactions).toEqual([{ id: 'nap_pile', discoveredAt: nowMs }]);
    expect(state.diary.events).toEqual([{ id: 'hidden_toy', discoveredAt: nowMs }]);
    expect(state.diary.hints).toEqual([{ id: 'miso_bedroom_hint', catId: 'miso', roomId: 'bedroom', discoveredAt: nowMs }]);
  });

  it('counts five-minute room sessions and unlocks hints after repeated sessions', () => {
    const startMs = 1_700_000_000_000;
    const firstSessionState = {
      ...createInitialState(),
      cats: createInitialState().cats.map((cat) =>
        cat.id === 'miso'
          ? {
              ...cat,
              currentRoom: 'bedroom',
              currentRoomEnteredAt: startMs,
              currentSessionCounted: false,
            }
          : cat,
      ),
    };

    const afterFirstSession = processRoomSessions(firstSessionState, startMs + 5 * 60_000);
    const afterReassigned = {
      ...afterFirstSession,
      cats: afterFirstSession.cats.map((cat) =>
        cat.id === 'miso'
          ? {
              ...cat,
              currentRoomEnteredAt: startMs + 6 * 60_000,
              currentSessionCounted: false,
            }
          : cat,
      ),
    };
    const afterSecondSession = processRoomSessions(afterReassigned, startMs + 11 * 60_000);
    const miso = afterSecondSession.cats.find((cat) => cat.id === 'miso');

    expect(miso.roomSessions.bedroom).toBe(2);
    expect(afterSecondSession.diary.hints).toEqual([
      {
        id: 'miso_bedroom_hint',
        catId: 'miso',
        roomId: 'bedroom',
        discoveredAt: startMs + 11 * 60_000,
      },
    ]);
  });
});
