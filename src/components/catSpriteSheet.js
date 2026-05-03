const FRAME_SIZE = 128;

export function getCatSpriteFrame({ catId = null, state = 'active', frame = 0 } = {}) {
  const normalizedFrame = Number.isFinite(frame) ? Math.max(0, Math.floor(frame)) : 0;

  return {
    catId,
    state,
    frame: normalizedFrame,
    frameWidth: FRAME_SIZE,
    frameHeight: FRAME_SIZE,
    backgroundPosition: `-${normalizedFrame * FRAME_SIZE}px 0px`,
  };
}
