export const DAY_DURATION_MS = 30_000;

export function createDayPhaseState() {
  return {
    status: 'idle',
    elapsedMs: 0,
  };
}

function addResources(resources, gains) {
  return Object.fromEntries(
    Object.entries(resources).map(([resourceId, currentValue]) => [
      resourceId,
      currentValue + (gains[resourceId] ?? 0),
    ]),
  );
}

export function getDayProduction(state) {
  return state.house.rooms.reduce(
    (totals, room) => {
      if (!room.unlocked) {
        return totals;
      }

      const roomOutput = room.baseDayOutput ?? {};
      const nextTotals = {
        fishbones: totals.fishbones + (roomOutput.fishbones ?? 0),
        cannedTuna: totals.cannedTuna + (roomOutput.cannedTuna ?? 0),
      };

      if (room.id === 'kitchen' && room.upgradeTier >= 1) {
        nextTotals.cannedTuna += 1;
      }

      return nextTotals;
    },
    { fishbones: 0, cannedTuna: 0 },
  );
}

export function startDayTimer(state) {
  if (state.phase !== 'day' || state.dayPhase?.status === 'running' || state.dayPhase?.status === 'ready') {
    return state;
  }

  return {
    ...state,
    dayPhase: {
      status: 'running',
      elapsedMs: state.dayPhase?.elapsedMs ?? 0,
    },
  };
}

export function advanceDayTimer(state, elapsedMs) {
  if (state.phase !== 'day' || state.dayPhase?.status !== 'running' || elapsedMs <= 0) {
    return state;
  }

  const nextElapsedMs = Math.min(DAY_DURATION_MS, (state.dayPhase.elapsedMs ?? 0) + elapsedMs);

  if (nextElapsedMs < DAY_DURATION_MS) {
    return {
      ...state,
      dayPhase: {
        status: 'running',
        elapsedMs: nextElapsedMs,
      },
    };
  }

  const gains = getDayProduction(state);

  return {
    ...state,
    resources: addResources(state.resources, gains),
    dayPhase: {
      status: 'ready',
      elapsedMs: DAY_DURATION_MS,
      lastGains: gains,
    },
  };
}

export function startNightRun(state) {
  if (state.phase !== 'day' || state.dayPhase?.status !== 'ready') {
    return state;
  }

  return {
    ...state,
    phase: 'night',
    currentRun: {
      level: 1,
      xp: 0,
      hp: state.hector.stats.maxHp,
      mp: state.hector.stats.maxMp,
      abilities: [],
      items: [],
      map: [],
      currentNodeId: null,
      completedNodeIds: [],
      status: 'exploring',
    },
  };
}

export function returnHomeFromNight(state) {
  if (state.phase !== 'night') {
    return state;
  }

  return {
    ...state,
    day: state.day + 1,
    phase: 'day',
    dayPhase: createDayPhaseState(),
    currentRun: null,
  };
}
