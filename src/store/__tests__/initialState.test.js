import { describe, expect, it } from 'vitest';
import { createInitialState } from '../initialState.js';

describe('createInitialState', () => {
  it('creates the Hector adventure save contract', () => {
    const state = createInitialState();

    expect(state).toMatchObject({
      version: 1,
      day: 1,
      phase: 'day',
      dayPhase: {
        status: 'idle',
        elapsedMs: 0,
      },
      resources: {
        fishbones: 0,
        cannedTuna: 0,
      },
      currentRun: null,
      settings: {
        soundEnabled: false,
      },
    });
  });

  it('starts Hector as the only playable character', () => {
    const state = createInitialState();

    expect(state.hector).toMatchObject({
      id: 'hector',
      name: 'Hector',
      classId: 'fighter',
      stats: {
        maxHp: 30,
        maxMp: 10,
        attack: 5,
        defense: 2,
        speed: 4,
        luck: 3,
      },
    });
    expect(state).not.toHaveProperty('cats');
  });

  it('creates the fixed five-room terraced house', () => {
    const state = createInitialState();

    expect(state.house.rooms.map((room) => room.id)).toEqual([
      'attic',
      'bedroom',
      'storage_washing_room',
      'living_room',
      'kitchen',
    ]);
    expect(state.house.rooms.every((room) => room.unlocked)).toBe(true);
    expect(state.house.rooms.every((room) => room.upgradeTier === 0)).toBe(true);
  });
});
