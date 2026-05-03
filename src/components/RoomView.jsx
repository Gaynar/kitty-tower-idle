import { useState } from 'react';
import { X } from 'lucide-react';
import { rooms } from '../data/rooms.js';
import { roomCapacity, unassignCat } from '../store/actions.js';
import { useGameState } from '../store/gameState.js';
import { calculateRoomOutput } from '../store/production.js';
import { CatSprite } from './CatSprite.jsx';

const ROOM_COLORS = {
  living_room: '#94b49f',
  kitchen: '#d99356',
  bedroom: '#8eb0d6',
};

export function RoomView({ roomId, draggingCatId, isDragHovered, message, onOpenCatInfo }) {
  const { state, setState } = useGameState();
  const [imageMissing, setImageMissing] = useState(false);
  const room = rooms.find((entry) => entry.id === roomId);
  const savedRoom = state.rooms.find((entry) => entry.id === roomId);
  const level = savedRoom?.level ?? 1;
  const towerFloor = savedRoom?.towerFloor ?? room.towerFloor;
  const assignedCats = state.cats.filter((cat) => cat.currentRoom === roomId);
  const output = calculateRoomOutput(state, roomId);

  function handleUnassignCat(catId) {
    setState((currentState) => unassignCat(currentState, catId, Date.now()));
  }

  return (
    <section
      className={`room-view ${isDragHovered ? 'drag-hovered' : ''}`}
      data-room-id={roomId}
      style={{ '--room-color': ROOM_COLORS[roomId] }}
      aria-label={`${room.name}, floor ${towerFloor}, level ${level}, ${assignedCats.length} of ${roomCapacity(roomId)} cats`}
    >
      {!imageMissing ? (
        <img
          className="room-bg pixel-art"
          src={`/assets/rooms/${roomId}_${level}.png`}
          alt=""
          onError={() => setImageMissing(true)}
        />
      ) : (
        <div className="room-fallback" aria-hidden="true" />
      )}
      <div className="room-floor" aria-hidden="true" />
      <div className="room-label">
        <span className="room-floor-badge">{towerFloor}F</span>
        {room.name}
      </div>
      <div className="room-output">
        {output.coins.toFixed(1)} coin/min · {output.comfort.toFixed(1)} comfort/min
      </div>
      <div className="room-cats">
        {assignedCats.map((cat) => (
          <div className="placed-cat" key={cat.id}>
            <button
              className="cat-sprite-button"
              type="button"
              onClick={() => onOpenCatInfo(cat.id)}
              aria-label={`Open ${cat.name} info`}
            >
              <CatSprite catId={cat.id} state={cat.currentState} />
            </button>
            <button
              className="cat-remove-button"
              type="button"
              onClick={() => handleUnassignCat(cat.id)}
              aria-label={`Return ${cat.name} to roster`}
            >
              <X aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      {draggingCatId ? (
        <div className="place-overlay" aria-hidden="true">
          Drop here
        </div>
      ) : null}
      {message ? <div className="room-capacity-message">{message}</div> : null}
    </section>
  );
}
