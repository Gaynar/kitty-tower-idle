import { describe, expect, it } from 'vitest';
import { roomCapacity } from '../actions.js';
import { createInitialState } from '../initialState.js';
import { canAfford, furnitureSlotsFor, purchaseFurniture, upgradeRoom } from '../upgrades.js';

describe('room upgrades and furniture purchases', () => {
  it('checks resource affordability against both currencies', () => {
    expect(canAfford({ coins: 270, comfort: 30 }, { coins: 270, comfort: 30 })).toBe(true);
    expect(canAfford({ coins: 269, comfort: 30 }, { coins: 270, comfort: 30 })).toBe(false);
    expect(canAfford({ coins: 270, comfort: 29 }, { coins: 270, comfort: 30 })).toBe(false);
  });

  it('purchases furniture, deducts its cost, and fills a room slot', () => {
    const state = {
      ...createInitialState(),
      resources: { coins: 300, comfort: 40 },
    };

    const nextState = purchaseFurniture(state, 'bedroom', 'heated_blanket');

    expect(nextState.resources).toEqual({ coins: 30, comfort: 10 });
    expect(nextState.rooms.find((room) => room.id === 'bedroom').furniture).toEqual(['heated_blanket']);
    expect(purchaseFurniture(nextState, 'bedroom', 'quiet_corner')).toBeNull();
    expect(purchaseFurniture(nextState, 'bedroom', 'heated_blanket')).toBeNull();
  });

  it('rejects unaffordable or wrong-room furniture purchases', () => {
    const state = {
      ...createInitialState(),
      resources: { coins: 1000, comfort: 1000 },
    };

    expect(purchaseFurniture({ ...state, resources: { coins: 100, comfort: 100 } }, 'bedroom', 'heated_blanket')).toBeNull();
    expect(purchaseFurniture(state, 'kitchen', 'heated_blanket')).toBeNull();
  });

  it('upgrades room level, deducts cost, and increases effective capacity', () => {
    const state = {
      ...createInitialState(),
      resources: { coins: 1300, comfort: 200 },
    };

    const nextState = upgradeRoom(state, 'bedroom');
    const bedroom = nextState.rooms.find((room) => room.id === 'bedroom');

    expect(nextState.resources).toEqual({ coins: 100, comfort: 50 });
    expect(bedroom.level).toBe(2);
    expect(roomCapacity('bedroom', nextState)).toBe(3);
    expect(furnitureSlotsFor(bedroom)).toBe(2);
    expect(upgradeRoom(nextState, 'bedroom')).toBeNull();
  });
});
