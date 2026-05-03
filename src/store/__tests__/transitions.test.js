import { describe, expect, it, vi } from 'vitest';
import { createInitialState } from '../initialState.js';
import { processStateTransitions, sampleTransitionDue, setCatState } from '../transitions.js';

describe('state transitions', () => {
  it('samples active transition deadlines from the configured range', () => {
    const nowMs = 1_700_000_000_000;
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const due = sampleTransitionDue('active', { id: 'bean', traits: ['playful'] }, nowMs);

    expect(due).toBe(nowMs + 25 * 60_000);
  });

  it('applies trait modifiers when sampling transition deadlines', () => {
    const nowMs = 1_700_000_000_000;

    expect(sampleTransitionDue('resting', { id: 'miso', traits: ['lazy'] }, nowMs)).toBe(nowMs + 9 * 60_000);
    expect(sampleTransitionDue('grumpy', { id: 'miso', traits: ['calm'] }, nowMs)).toBe(nowMs + 7.5 * 60_000);
    expect(sampleTransitionDue('curious', { id: 'bean', traits: ['playful'] }, nowMs)).toBeNull();
  });

  it('moves cats whose stored transition deadline has passed', () => {
    const nowMs = 1_700_000_000_000;
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = {
      ...createInitialState(),
      cats: createInitialState().cats.map((cat) =>
        cat.id === 'miso'
          ? {
              ...cat,
              currentRoom: 'bedroom',
              currentState: 'active',
              stateTransitionDue: nowMs - 1,
            }
          : cat,
      ),
    };

    const nextState = processStateTransitions(state, nowMs);
    const miso = nextState.cats.find((cat) => cat.id === 'miso');

    expect(miso.currentState).toBe('resting');
    expect(miso.stateEnteredAt).toBe(nowMs);
    expect(miso.stateTransitionDue).toBe(nowMs + 9 * 60_000);
  });

  it('does not sample transition deadlines for unassigned cats', () => {
    const nowMs = 1_700_000_000_000;

    expect(setCatState({ id: 'bean', currentRoom: null, traits: ['playful'] }, 'active', nowMs)).toMatchObject({
      currentState: 'active',
      stateEnteredAt: nowMs,
      stateTransitionDue: null,
    });
  });
});
