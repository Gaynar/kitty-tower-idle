import { describe, expect, it } from 'vitest';
import { previewPlacement } from '../preview.js';
import { findCat, findRoom } from '../production.js';

describe('placement previews', () => {
  it('marks a liked room as like', () => {
    expect(previewPlacement(findCat('miso'), findRoom('bedroom'), [])).toBe('like');
  });

  it('gives dislike priority when projected placement would crowd the room', () => {
    expect(previewPlacement(findCat('miso'), findRoom('living_room'), [findCat('bean')])).toBe('dislike');
  });

  it('marks company likes only when another cat is projected in the room', () => {
    expect(previewPlacement(findCat('bean'), findRoom('living_room'), [])).toBe('neutral');
    expect(previewPlacement(findCat('bean'), findRoom('living_room'), [findCat('miso')])).toBe('like');
  });

  it('marks Mochi kitchen like only when she would be alone', () => {
    expect(previewPlacement(findCat('mochi'), findRoom('kitchen'), [])).toBe('like');
    expect(previewPlacement(findCat('mochi'), findRoom('kitchen'), [findCat('bean')])).toBe('neutral');
  });
});
