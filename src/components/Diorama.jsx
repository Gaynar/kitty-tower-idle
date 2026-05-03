import { RoomView } from './RoomView.jsx';
import { rooms } from '../data/rooms.js';

const TOWER_ROOM_ORDER = [...rooms]
  .filter((room) => Number.isFinite(room.towerFloor))
  .sort((a, b) => b.towerFloor - a.towerFloor)
  .map((room) => room.id);

export function Diorama({ draggingCatId, hoveredRoomId, roomMessage, onOpenCatInfo }) {
  return (
    <main className="app-main">
      <div className="tower-shell" aria-label="Cat tower rooms">
        <div className="tower-roof" aria-hidden="true" />
        <div className="diorama">
          {TOWER_ROOM_ORDER.map((roomId) => (
            <RoomView
              key={roomId}
              roomId={roomId}
              draggingCatId={draggingCatId}
              isDragHovered={hoveredRoomId === roomId}
              message={roomMessage?.roomId === roomId ? roomMessage.text : ''}
              onOpenCatInfo={onOpenCatInfo}
            />
          ))}
        </div>
        <div className="tower-foundation" aria-hidden="true" />
      </div>
    </main>
  );
}
