import { describe, expect, it } from 'vitest';
import { createInitialState } from '../initialState.js';
import { adjustRelationship, getTier, processRelationshipTick } from '../relationships.js';

describe('cat relationships', () => {
  it('adjusts both directions and clamps relationship scores', () => {
    let state = createInitialState();

    state = adjustRelationship(state, 'miso', 'bean', 12);
    expect(getTier(state, 'miso', 'bean')).toBe('friendly');
    expect(state.cats.find((cat) => cat.id === 'miso').relationships.bean).toEqual({ score: 12 });
    expect(state.cats.find((cat) => cat.id === 'bean').relationships.miso).toEqual({ score: 12 });

    state = adjustRelationship(state, 'miso', 'bean', 100);
    expect(state.cats.find((cat) => cat.id === 'miso').relationships.bean.score).toBe(40);

    state = adjustRelationship(state, 'miso', 'bean', -100);
    expect(state.cats.find((cat) => cat.id === 'bean').relationships.miso.score).toBe(-15);
    expect(getTier(state, 'bean', 'miso')).toBe('rival');
  });

  it('updates relationships from shared room state ticks', () => {
    const state = {
      ...createInitialState(),
      cats: createInitialState().cats.map((cat) => {
        if (cat.id === 'miso') {
          return { ...cat, currentRoom: 'bedroom', currentState: 'relaxed' };
        }
        if (cat.id === 'bean') {
          return { ...cat, currentRoom: 'bedroom', currentState: 'cuddly' };
        }
        if (cat.id === 'mochi') {
          return { ...cat, currentRoom: 'kitchen', currentState: 'grumpy' };
        }
        return cat;
      }),
    };

    const positiveState = processRelationshipTick(state);
    expect(positiveState.cats.find((cat) => cat.id === 'miso').relationships.bean.score).toBe(1);

    const grumpyState = processRelationshipTick({
      ...state,
      cats: state.cats.map((cat) => (cat.id === 'mochi' ? { ...cat, currentRoom: 'bedroom' } : cat)),
    });
    expect(grumpyState.cats.find((cat) => cat.id === 'miso').relationships.mochi.score).toBe(-1);
  });
});
