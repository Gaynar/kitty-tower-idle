import { hector } from '../data/hector.js';
import { houseRooms } from '../data/houseRooms.js';
import { createDayPhaseState } from './dayPhase.js';

export function createInitialState() {
  return {
    version: 1,
    day: 1,
    phase: 'day',
    dayPhase: createDayPhaseState(),
    resources: {
      fishbones: 0,
      cannedTuna: 0,
    },
    house: {
      rooms: houseRooms.map((room) => ({
        ...room,
        unlocked: true,
        upgradeTier: 0,
      })),
    },
    hector: {
      id: hector.id,
      name: hector.name,
      classId: hector.classId,
      className: hector.className,
      summary: hector.summary,
      stats: { ...hector.startingStats },
    },
    currentRun: null,
    settings: {
      soundEnabled: false,
    },
  };
}
