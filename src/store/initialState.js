import { cats as catData } from '../data/cats.js';
import { rooms as roomData } from '../data/rooms.js';

function relationshipsFor(catId) {
  return Object.fromEntries(
    catData.filter((cat) => cat.id !== catId).map((cat) => [cat.id, { score: 0 }]),
  );
}

function roomSessions() {
  return Object.fromEntries(roomData.map((room) => [room.id, 0]));
}

export function createInitialState() {
  const now = Date.now();

  return {
    version: 1,
    lastTickTimestamp: now,
    resources: {
      coins: 0.0,
      comfort: 0.0,
    },
    eventCooldowns: {},
    cats: catData.map((cat) => ({
      id: cat.id,
      name: cat.name,
      traits: cat.traits,
      like: cat.like,
      dislike: cat.dislike,
      currentRoom: null,
      currentState: 'active',
      stateEnteredAt: now,
      stateTransitionDue: null,
      relationships: relationshipsFor(cat.id),
      roomSessions: roomSessions(),
    })),
    rooms: roomData.map((room) => ({
      id: room.id,
      towerFloor: room.towerFloor,
      level: 1,
      furniture: [],
      unlocked: true,
    })),
    diary: {
      interactions: [],
      events: [],
      hints: [],
      catProfiles: Object.fromEntries(
        catData.map((cat) => [
          cat.id,
          { like: cat.like, dislike: cat.dislike, discovered: true },
        ]),
      ),
    },
    offlineEventQueue: [],
    settings: {
      soundEnabled: false,
    },
    tutorialStep: 0,
  };
}
