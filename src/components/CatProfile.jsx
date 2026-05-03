import { ArrowLeft, CloudLightning, Heart, Moon, UtensilsCrossed, Zap } from 'lucide-react';
import { cats as catData } from '../data/cats.js';
import { furniture } from '../data/furniture.js';
import { rooms } from '../data/rooms.js';
import { useGameState } from '../store/gameState.js';
import { calculateCatOutput } from '../store/production.js';
import { getTier } from '../store/relationships.js';
import { CatFullArt } from './CatFullArt.jsx';
import { CatPortrait } from './CatPortrait.jsx';

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

export function CatProfile({ catId, onBack }) {
  const { state } = useGameState();
  const savedCat = state.cats.find((cat) => cat.id === catId);
  const designCat = catData.find((cat) => cat.id === catId);
  const currentRoom = rooms.find((room) => room.id === savedCat?.currentRoom);
  const catsInRoom = state.cats.filter((cat) => cat.currentRoom === savedCat?.currentRoom);
  const favoriteFurniture = furniture.find((item) => item.id === designCat?.favoriteFurniture);
  const output =
    savedCat && currentRoom ? calculateCatOutput(savedCat, currentRoom, catsInRoom, state.cats, state.rooms, state) : null;
  const StateIcon = STATE_ICONS[savedCat?.currentState];

  if (!savedCat || !designCat) {
    return null;
  }

  return (
    <section className="cat-profile" aria-labelledby="cat-profile-title">
      <button className="back-button" type="button" onClick={onBack} aria-label="Back to cats">
        <ArrowLeft aria-hidden="true" />
      </button>
      <CatFullArt catId={catId} />
      <header className="cat-profile-header">
        <CatPortrait catId={catId} />
        <div>
          <h3 id="cat-profile-title">{designCat.name}</h3>
          <p>{designCat.role}</p>
        </div>
        {StateIcon ? (
          <span className="profile-state-icon" title={savedCat.currentState}>
            <StateIcon aria-hidden="true" />
          </span>
        ) : null}
      </header>
      <p className="cat-info-flavor">{designCat.flavorText}</p>
      <dl className="cat-info-stats">
        <div>
          <dt>Traits</dt>
          <dd>{designCat.traits.map(formatLabel).join(', ')}</dd>
        </div>
        <div>
          <dt>State</dt>
          <dd>{formatLabel(savedCat.currentState)}</dd>
        </div>
        <div>
          <dt>Room</dt>
          <dd>{currentRoom?.name ?? 'Roster'}</dd>
        </div>
        <div>
          <dt>Likes</dt>
          <dd>{formatLabel(designCat.like)}</dd>
        </div>
        <div>
          <dt>Dislikes</dt>
          <dd>{formatLabel(designCat.dislike)}</dd>
        </div>
        <div>
          <dt>Favorite</dt>
          <dd>{favoriteFurniture?.name ?? formatLabel(designCat.favoriteFurniture)}</dd>
        </div>
        <div>
          <dt>Output</dt>
          <dd>{output ? `${output.coins.toFixed(1)} coin/min, ${output.comfort.toFixed(1)} comfort/min` : 'Idle'}</dd>
        </div>
      </dl>
      <h4>Relationships</h4>
      <div className="profile-relationships">
        {state.cats
          .filter((cat) => cat.id !== catId)
          .map((cat) => (
            <div className="relationship-row" key={cat.id}>
              <span>{cat.name}</span>
              <strong>{getTier(state, catId, cat.id)}</strong>
            </div>
          ))}
      </div>
    </section>
  );
}
