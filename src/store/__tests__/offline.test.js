import { describe, expect, it, vi } from 'vitest';
import { createInitialState } from '../initialState.js';
import { simulateOffline } from '../offline.js';

describe('offline simulation', () => {
  it('skips simulation for absences under five minutes', () => {
    const nowMs = 1_700_000_000_000;
    const state = { ...createInitialState(), lastTickTimestamp: nowMs - 4 * 60_000 };

    expect(simulateOffline(state, nowMs)).toEqual({ newState: state, summary: null });
  });

  it('simulates sequential resource gains and marks Bean alone-offline dislike', () => {
    const startMs = 1_700_000_000_000;
    const state = {
      ...createInitialState(),
      tutorialStep: 5,
      lastTickTimestamp: startMs,
      lastEventCheckAt: startMs,
      cats: createInitialState().cats.map((cat) =>
        cat.id === 'bean' ? { ...cat, currentRoom: 'living_room', currentState: 'active' } : cat,
      ),
    };
    vi.spyOn(Math, 'random').mockReturnValue(1);

    const result = simulateOffline(state, startMs + 10 * 60_000);

    expect(result.summary).toMatchObject({
      elapsedMs: 10 * 60_000,
      simulatedMs: 10 * 60_000,
    });
    expect(result.summary.coinsEarned).toBeCloseTo(4.2);
    expect(result.summary.comfortEarned).toBeCloseTo(0);
    expect(result.newState.resources.coins).toBeCloseTo(4.2);
    expect(result.newState.lastTickTimestamp).toBe(startMs + 10 * 60_000);
    expect(result.newState.cats.find((cat) => cat.id === 'bean').offlineAloneDislike).toBe(true);
  });

  it('caps long absences at the base four-hour offline cap', () => {
    const startMs = 1_700_000_000_000;
    const state = {
      ...createInitialState(),
      lastTickTimestamp: startMs,
      cats: createInitialState().cats.map((cat) =>
        cat.id === 'mochi' ? { ...cat, currentRoom: 'kitchen', currentState: 'active' } : cat,
      ),
    };
    vi.spyOn(Math, 'random').mockReturnValue(1);

    const result = simulateOffline(state, startMs + 12 * 60 * 60_000);

    expect(result.summary.elapsedMs).toBe(12 * 60 * 60_000);
    expect(result.summary.simulatedMs).toBe(4 * 60 * 60_000);
    expect(result.summary.coinsEarned).toBeCloseTo(3 * 240);
  });
});
