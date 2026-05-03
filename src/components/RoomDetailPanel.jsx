import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { cats as catData } from '../data/cats.js';
import { furniture } from '../data/furniture.js';
import { rooms } from '../data/rooms.js';
import { roomCapacity } from '../store/actions.js';
import { canAfford, furnitureSlotsFor, purchaseFurniture, upgradeRoom } from '../store/upgrades.js';
import { useGameState } from '../store/gameState.js';
import { calculateCatOutput, isDislikeActive, isLikeActive } from '../store/production.js';
import { CatPortrait } from './CatPortrait.jsx';
import { FurnitureSlot } from './FurnitureSlot.jsx';

export function RoomDetailPanel({ roomId, onClose, onOpenCatInfo, embedded = false }) {
  const { state, setState } = useGameState();
  const room = rooms.find((entry) => entry.id === roomId);
  const savedRoom = state.rooms.find((entry) => entry.id === roomId);
  const assignedCats = state.cats.filter((cat) => cat.currentRoom === roomId);
  const slots = furnitureSlotsFor(savedRoom);
  const roomFurniture = furniture.filter((item) => item.roomId === roomId);
  const ownedFurniture = savedRoom?.furniture ?? [];
  const nextFurniture = roomFurniture.find((item) => !ownedFurniture.includes(item.id));
  const nextLevel = (savedRoom?.level ?? 1) + 1;
  const upgradeCost = room?.upgradeCosts?.[nextLevel];

  if (!room || !savedRoom) {
    return null;
  }

  function buyFurniture(item) {
    setState((currentState) => purchaseFurniture(currentState, roomId, item.id) ?? currentState);
  }

  function buyUpgrade() {
    setState((currentState) => {
      const upgraded = upgradeRoom(currentState, roomId) ?? currentState;
      if (upgraded !== currentState && upgraded.tutorialStep === 4) {
        return { ...upgraded, tutorialStep: 5, pendingPostTutorialEvent: !upgraded.postTutorialEventFired };
      }
      return upgraded;
    });
  }

  const content = (
    <aside
      className={`room-detail-panel ${embedded ? 'embedded' : ''}`}
      role={embedded ? 'region' : 'dialog'}
      aria-modal={embedded ? undefined : 'true'}
      onClick={(event) => event.stopPropagation()}
    >
      {onClose ? (
        <button className="panel-close" type="button" onClick={onClose} aria-label="Close room detail">
          <X aria-hidden="true" />
        </button>
      ) : null}
        <header>
          <h2>{room.name}</h2>
          <p>
            Level {savedRoom.level} · {assignedCats.length}/{roomCapacity(roomId, state)} cats
          </p>
        </header>
        <div className="room-detail-cats">
          {assignedCats.map((cat) => {
            const designCat = catData.find((entry) => entry.id === cat.id);
            const output = calculateCatOutput(cat, { ...room, ...savedRoom }, assignedCats, state.cats, state.rooms, state);
            const dislikes = isDislikeActive(cat, { ...room, ...savedRoom }, assignedCats);
            const likes = !dislikes && isLikeActive(cat, { ...room, ...savedRoom }, assignedCats);
            const Icon = dislikes ? AlertTriangle : CheckCircle;

            return (
              <button className="room-cat-card" type="button" key={cat.id} onClick={() => onOpenCatInfo(cat.id)}>
                <CatPortrait catId={cat.id} />
                <span>
                  <strong>{designCat?.name ?? cat.name}</strong>
                  <small>{cat.currentState}</small>
                  <small>{output.coins.toFixed(1)} coin/min · {output.comfort.toFixed(1)} comfort/min</small>
                </span>
                {likes || dislikes ? <Icon className={dislikes ? 'status-bad' : 'status-good'} aria-hidden="true" /> : null}
              </button>
            );
          })}
          {Array.from({ length: Math.max(0, roomCapacity(roomId, state) - assignedCats.length) }).map((_, index) => (
            <div className="room-cat-card empty" key={`empty-${index}`}>Empty slot</div>
          ))}
        </div>
        <h3>Furniture</h3>
        <div className="furniture-grid">
          {ownedFurniture.map((id) => (
            <FurnitureSlot item={furniture.find((entry) => entry.id === id)} key={id} />
          ))}
          {Array.from({ length: Math.max(0, slots - ownedFurniture.length) }).map((_, index) => (
            <FurnitureSlot
              key={`buy-${index}`}
              item={index === 0 ? nextFurniture : null}
              disabled={!nextFurniture || !canAfford(state.resources, nextFurniture.cost)}
              onBuy={nextFurniture && index === 0 ? () => buyFurniture(nextFurniture) : undefined}
            />
          ))}
        </div>
        {upgradeCost ? (
          <button
            className="upgrade-button"
            type="button"
            data-tutorial-target="upgrade-button"
            disabled={!canAfford(state.resources, upgradeCost)}
            onClick={buyUpgrade}
          >
            Upgrade Room · {upgradeCost.coins} coins / {upgradeCost.comfort} comfort
          </button>
        ) : null}
      </aside>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="panel-backdrop" role="presentation" onClick={onClose}>
      {content}
    </div>
  );
}
