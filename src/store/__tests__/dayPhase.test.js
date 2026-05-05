import { describe, expect, it } from 'vitest';
import { createInitialState } from '../initialState.js';
import {
  advanceDayTimer,
  DAY_DURATION_MS,
  getDayProduction,
  returnHomeFromNight,
  startDayTimer,
  startNightRun,
} from '../dayPhase.js';

describe('day phase', () => {
  it('starts idle days and advances without granting resources early', () => {
    const state = startDayTimer(createInitialState());
    const advanced = advanceDayTimer(state, 10_000);

    expect(advanced.dayPhase).toEqual({ status: 'running', elapsedMs: 10_000 });
    expect(advanced.resources).toEqual({ fishbones: 0, cannedTuna: 0 });
  });

  it('finishes the timer once and grants room preparation output', () => {
    const state = startDayTimer(createInitialState());
    const finished = advanceDayTimer(state, DAY_DURATION_MS);
    const advancedAgain = advanceDayTimer(finished, DAY_DURATION_MS);

    expect(finished.dayPhase).toMatchObject({
      status: 'ready',
      elapsedMs: DAY_DURATION_MS,
      lastGains: { fishbones: 5, cannedTuna: 1 },
    });
    expect(finished.resources).toEqual({ fishbones: 5, cannedTuna: 1 });
    expect(advancedAgain.resources).toEqual(finished.resources);
  });

  it('includes the first kitchen upgrade in day production', () => {
    const state = {
      ...createInitialState(),
      house: {
        rooms: createInitialState().house.rooms.map((room) =>
          room.id === 'kitchen' ? { ...room, upgradeTier: 1 } : room,
        ),
      },
    };

    expect(getDayProduction(state)).toEqual({ fishbones: 5, cannedTuna: 2 });
  });

  it('only starts night after the day is ready and returns home to a new idle day', () => {
    const idleState = createInitialState();
    const stillDay = startNightRun(idleState);
    const nightState = startNightRun(advanceDayTimer(startDayTimer(idleState), DAY_DURATION_MS));
    const nextDay = returnHomeFromNight(nightState);

    expect(stillDay.phase).toBe('day');
    expect(nightState.phase).toBe('night');
    expect(nightState.currentRun).toMatchObject({ level: 1, xp: 0, status: 'exploring' });
    expect(nextDay).toMatchObject({
      day: 2,
      phase: 'day',
      dayPhase: { status: 'idle', elapsedMs: 0 },
      currentRun: null,
    });
  });
});
