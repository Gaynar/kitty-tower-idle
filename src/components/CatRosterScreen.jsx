import { CloudLightning, Heart, Moon, UtensilsCrossed, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { cats as catData } from '../data/cats.js';
import { rooms } from '../data/rooms.js';
import { useGameState } from '../store/gameState.js';
import { CatPortrait } from './CatPortrait.jsx';
import { CatProfile } from './CatProfile.jsx';

const STATE_ICONS = {
  sleeping: Moon,
  grumpy: CloudLightning,
  cuddly: Heart,
  focused: Zap,
  hungry: UtensilsCrossed,
};

function formatLabel(value) {
  return value.replaceAll('_', ' ');
}

function CatRosterScreenContent() {
  const { state } = useGameState();
  const [activeCatId, setActiveCatId] = useState(null);

  if (activeCatId) {
    return <CatProfile catId={activeCatId} onBack={() => setActiveCatId(null)} />;
  }

  return (
    <>
      <header className="screen-header">
        <h2>Cats</h2>
        <p>{state.cats.length} unlocked</p>
      </header>
      <div className="cat-screen-grid">
        {state.cats.map((cat) => {
          const designCat = catData.find((entry) => entry.id === cat.id);
          const currentRoom = rooms.find((room) => room.id === cat.currentRoom);
          const StateIcon = STATE_ICONS[cat.currentState];

          return (
            <button className="cat-screen-card" type="button" key={cat.id} onClick={() => setActiveCatId(cat.id)}>
              <CatPortrait catId={cat.id} />
              <span className="cat-screen-copy">
                <strong>{designCat?.name ?? cat.name}</strong>
                <small>{currentRoom?.name ?? 'Roster'} · {formatLabel(cat.currentState)}</small>
                <small>Likes {formatLabel(designCat?.like ?? '')}</small>
                <small>Dislikes {formatLabel(designCat?.dislike ?? '')}</small>
              </span>
              {StateIcon ? (
                <span className="cat-screen-state" aria-hidden="true">
                  <StateIcon />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </>
  );
}

export function CatRosterScreen({ onClose, embedded = false }) {
  const content = <CatRosterScreenContent />;

  if (embedded) {
    return <aside className="cat-roster-screen embedded">{content}</aside>;
  }

  return (
    <div className="panel-backdrop" role="presentation" onClick={onClose}>
      <aside className="cat-roster-screen" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="panel-close" type="button" onClick={onClose} aria-label="Close cats">
          <X aria-hidden="true" />
        </button>
        {content}
      </aside>
    </div>
  );
}
