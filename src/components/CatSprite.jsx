import { useState } from 'react';
import { CloudLightning, Heart, Moon, UtensilsCrossed, Zap } from 'lucide-react';
import { cats } from '../data/cats.js';
import { getCatSpriteFrame } from './catSpriteSheet.js';

const CAT_COLORS = {
  miso: '#d9b98f',
  bean: '#f0c15a',
  mochi: '#d7d4cb',
};

export function CatSprite({ catId, state = 'active', frame = 0 }) {
  const [imageMissing, setImageMissing] = useState(false);
  const cat = cats.find((entry) => entry.id === catId);
  const initial = cat?.name?.charAt(0) ?? '?';
  // TODO GDD A.8: map state-specific sprite sheets here when animated cat art ships.
  const spriteFrame = getCatSpriteFrame({ catId, state, frame });

  const StateIcon = {
    sleeping: Moon,
    grumpy: CloudLightning,
    cuddly: Heart,
    focused: Zap,
    hungry: UtensilsCrossed,
  }[state];

  return (
    <span
      className="cat-sprite"
      style={{ '--cat-color': CAT_COLORS[catId] ?? '#d7d4cb' }}
      aria-label={`${cat?.name ?? catId} is ${state}, frame ${frame}`}
    >
      {!imageMissing ? (
        <img
          className="pixel-art"
          src={`/assets/cats/sprites/${catId}.png`}
          alt=""
          data-sprite-position={spriteFrame.backgroundPosition}
          onError={() => setImageMissing(true)}
        />
      ) : (
        initial
      )}
      {StateIcon ? (
        <span className="cat-state-icon" aria-hidden="true">
          <StateIcon />
        </span>
      ) : null}
    </span>
  );
}
