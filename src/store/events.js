import { events } from '../data/events.js';
import { rooms as roomData } from '../data/rooms.js';
import { assignCat } from './actions.js';
import { unlockEvent, unlockInteraction } from './diary.js';
import { adjustRelationship, getTier } from './relationships.js';
import { setCatState } from './transitions.js';

const EVENT_CHECK_MS = 5 * 60_000;
const COOLDOWN_MS = 30 * 60_000;

function eventChance(cat, catsInRoom, state) {
  let chance = 0.08;

  if (cat.currentState === 'curious' || cat.currentState === 'playing') {
    chance += 0.03;
  }

  catsInRoom.forEach((roomCat) => {
    if (roomCat.id === cat.id) {
      return;
    }

    const tier = getTier(state, cat.id, roomCat.id);
    if (tier === 'bonded') chance += 0.06;
    if (tier === 'friendly') chance += 0.03;
    if (tier === 'avoidant') chance -= 0.03;
    if (tier === 'rival') chance -= 0.06;
  });

  return Math.max(0.01, chance);
}

function applyRelationshipDelta(state, event, catsInRoom) {
  if (!event.relationshipDelta || catsInRoom.length < 2) {
    return state;
  }

  let nextState = state;
  for (let index = 0; index < catsInRoom.length; index += 1) {
    for (let other = index + 1; other < catsInRoom.length; other += 1) {
      nextState = adjustRelationship(nextState, catsInRoom[index].id, catsInRoom[other].id, event.relationshipDelta);
    }
  }
  return nextState;
}

function applyEventEffect(state, event, cat, catsInRoom, nowMs) {
  let nextState = unlockEvent(state, event.id, nowMs);

  if (event.id === 'hidden_toy') {
    nextState = {
      ...nextState,
      resources: { ...nextState.resources, comfort: nextState.resources.comfort + 8 },
    };
    nextState = {
      ...nextState,
      cats: nextState.cats.map((entry) => (entry.id === cat.id ? setCatState(entry, 'curious', nowMs) : entry)),
    };
  }

  if (event.id === 'stolen_snack') {
    nextState = {
      ...nextState,
      resources: { ...nextState.resources, coins: nextState.resources.coins + 12 },
    };
  }

  if (event.id === 'shared_sunbeam') {
    nextState = {
      ...nextState,
      resources: { ...nextState.resources, comfort: nextState.resources.comfort + 10 },
    };
  }

  if (event.id === 'unexpected_nap_pile') {
    nextState = unlockInteraction(nextState, 'nap_pile', nowMs);
  }

  if (event.id === 'quiet_afternoon') {
    nextState = {
      ...nextState,
      resources: { ...nextState.resources, comfort: nextState.resources.comfort + 6 },
    };
  }

  if (event.id === 'midnight_playtime') {
    nextState = {
      ...nextState,
      resources: {
        coins: nextState.resources.coins + 5,
        comfort: nextState.resources.comfort + 5,
      },
    };
  }

  nextState = applyRelationshipDelta(nextState, event, catsInRoom);

  return nextState;
}

export function forcePostTutorialEvent(state, nowMs = Date.now()) {
  let nextState = state;
  const bean = nextState.cats.find((cat) => cat.id === 'bean');

  if (!bean?.currentRoom) {
    const result = assignCat(nextState, 'bean', 'living_room', nowMs);
    if (result.ok) {
      nextState = result.state;
    }
  }

  const updatedBean = nextState.cats.find((cat) => cat.id === 'bean');
  const room = roomData.find((entry) => entry.id === updatedBean?.currentRoom);
  const catsInRoom = nextState.cats.filter((cat) => cat.currentRoom === updatedBean?.currentRoom);
  const hiddenToy = events.find((event) => event.id === 'hidden_toy');
  nextState = applyEventEffect(nextState, hiddenToy, updatedBean, catsInRoom, nowMs);

  return {
    state: {
      ...nextState,
      eventCooldowns: { ...nextState.eventCooldowns, hidden_toy: nowMs },
      pendingPostTutorialEvent: false,
      postTutorialEventFired: true,
    },
    firedEvents: [
      { id: 'hidden_toy', title: hiddenToy.title, flavor: hiddenToy.flavor, isRare: hiddenToy.isRare, at: nowMs, roomId: room?.id },
    ],
  };
}

export function processEvents(state, nowMs = Date.now(), { force = false, offline = false } = {}) {
  if (!force && state.tutorialStep < 5) {
    return { newState: state, firedEvents: [] };
  }

  const lastEventCheckAt = state.lastEventCheckAt ?? state.lastTickTimestamp ?? nowMs;
  if (!force && nowMs - lastEventCheckAt < EVENT_CHECK_MS) {
    return { newState: state, firedEvents: [] };
  }

  let nextState = { ...state, lastEventCheckAt: nowMs };
  const firedEvents = [];

  for (const room of roomData) {
    const catsInRoom = nextState.cats.filter((cat) => cat.currentRoom === room.id);
    for (const cat of catsInRoom) {
      const eligibleEvents = events.filter((event) => {
        const cooldownAt = nextState.eventCooldowns?.[event.id] ?? 0;
        const eventContextState = offline ? { ...nextState, isOfflineEventCheck: true } : nextState;
        return nowMs - cooldownAt >= COOLDOWN_MS && event.matches?.(cat, room, catsInRoom, eventContextState);
      });

      for (const event of eligibleEvents) {
        if (!force && Math.random() > eventChance(cat, catsInRoom, nextState)) {
          continue;
        }

        nextState = applyEventEffect(nextState, event, cat, catsInRoom, nowMs);
        nextState = {
          ...nextState,
          eventCooldowns: { ...nextState.eventCooldowns, [event.id]: nowMs },
        };
        firedEvents.push({ id: event.id, title: event.title, flavor: event.flavor, isRare: event.isRare, at: nowMs, offline });
        break;
      }
    }
  }

  return { newState: nextState, firedEvents };
}
