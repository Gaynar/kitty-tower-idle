import { describe, expect, it } from 'vitest';
import { getCatSpriteFrame } from '../catSpriteSheet.js';

describe('getCatSpriteFrame', () => {
  it('defaults to frame 0 of the active state with no args', () => {
    const result = getCatSpriteFrame();
    expect(result).toEqual({
      catId: null,
      state: 'active',
      frame: 0,
      frameWidth: 128,
      frameHeight: 128,
      backgroundPosition: '-0px 0px',
    });
  });

  it('passes through catId, state, and frame', () => {
    const result = getCatSpriteFrame({ catId: 'miso', state: 'sleeping', frame: 2 });
    expect(result.catId).toBe('miso');
    expect(result.state).toBe('sleeping');
    expect(result.frame).toBe(2);
    expect(result.backgroundPosition).toBe('-256px 0px');
  });

  it('floors fractional frames and clamps negatives to 0', () => {
    expect(getCatSpriteFrame({ frame: 1.8 }).frame).toBe(1);
    expect(getCatSpriteFrame({ frame: -3 }).frame).toBe(0);
  });

  it('falls back to frame 0 for non-finite frame values', () => {
    expect(getCatSpriteFrame({ frame: Number.NaN }).frame).toBe(0);
    expect(getCatSpriteFrame({ frame: Number.POSITIVE_INFINITY }).frame).toBe(0);
  });
});
