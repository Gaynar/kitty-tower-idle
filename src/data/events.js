function isActive(cat) {
  return cat.currentState !== 'sleeping' && cat.currentState !== 'grumpy';
}

function hasTrait(cat, trait) {
  return cat.traits?.includes(trait);
}

function roomHasStates(catsInRoom, states, minCats) {
  return catsInRoom.filter((cat) => states.includes(cat.currentState)).length >= minCats;
}

export const events = [
  {
    id: 'hidden_toy',
    title: 'Hidden Toy',
    flavor: 'Someone was very lively last night.',
    triggerCondition: { type: 'trait_in_active_room', trait: 'playful' },
    effect: { type: 'comfort_gain', diaryEntry: 'hidden_toy' },
    cooldownMinutes: 30,
    isRare: false,
    matches: (cat) => hasTrait(cat, 'playful') && isActive(cat),
  },
  {
    id: 'unexpected_nap_pile',
    title: 'Unexpected Nap Pile',
    flavor: 'Some cats sleep better when they trust each other.',
    triggerCondition: { type: 'traits_in_room', roomId: 'bedroom', traits: ['lazy', 'calm'], minCats: 2 },
    effect: { type: 'offline_comfort_bonus', diaryEntry: 'nap_pile' },
    relationshipDelta: 3,
    cooldownMinutes: 30,
    isRare: false,
    matches: (_cat, room, catsInRoom) =>
      room.id === 'bedroom' &&
      catsInRoom.length >= 2 &&
      catsInRoom.some((cat) => hasTrait(cat, 'lazy')) &&
      catsInRoom.some((cat) => hasTrait(cat, 'calm')),
  },
  {
    id: 'food_bowl_disagreement',
    title: 'Food Bowl Disagreement',
    flavor: 'The bowls became a subject of intense negotiation.',
    triggerCondition: { type: 'cat_with_company_in_room', catId: 'mochi', roomId: 'kitchen' },
    effect: { type: 'coins_gain_and_grumpy_risk', conflict: 'food_bowl_disagreement' },
    relationshipDelta: -3,
    cooldownMinutes: 30,
    isRare: false,
    matches: (cat, room, catsInRoom) => cat.id === 'mochi' && room.id === 'kitchen' && catsInRoom.length >= 2,
  },
  {
    id: 'midnight_playtime',
    title: 'Midnight Playtime',
    flavor: 'Tiny paws found something to do after dark.',
    triggerCondition: { type: 'offline_trait_check', trait: 'playful' },
    effect: { type: 'coins_or_comfort_gain', diaryEntry: 'midnight_playtime' },
    cooldownMinutes: 30,
    isRare: true,
    matches: (cat, _room, _catsInRoom, state) => Boolean(state.isOfflineEventCheck) && hasTrait(cat, 'playful'),
  },
  {
    id: 'quiet_afternoon',
    title: 'Quiet Afternoon',
    flavor: 'The Living Room settled into a gentle rhythm.',
    triggerCondition: { type: 'trait_in_room', trait: 'calm', roomId: 'living_room' },
    effect: { type: 'comfort_gain_and_relationship_progress' },
    relationshipDelta: 2,
    cooldownMinutes: 30,
    isRare: false,
    matches: (cat, room) => room.id === 'living_room' && hasTrait(cat, 'calm'),
  },
  {
    id: 'new_favorite_spot',
    title: 'New Favorite Spot',
    flavor: 'A familiar room suddenly felt just right.',
    triggerCondition: { type: 'repeated_time_in_furnished_room' },
    effect: { type: 'preference_bonus_and_diary_hint' },
    cooldownMinutes: 30,
    isRare: false,
    matches: (cat, room, _catsInRoom, state) => {
      const savedRoom = state.rooms.find((entry) => entry.id === room.id);
      return (savedRoom?.furniture?.length ?? 0) > 0 && (cat.roomSessions?.[room.id] ?? 0) >= 1;
    },
  },
  {
    id: 'shared_sunbeam',
    title: 'Shared Sunbeam',
    flavor: 'Two sleepy cats found the same warm patch.',
    triggerCondition: { type: 'states_in_same_room', states: ['resting', 'sleeping'], minCats: 2 },
    effect: { type: 'comfort_gain_and_bond_progress' },
    relationshipDelta: 2,
    cooldownMinutes: 30,
    isRare: false,
    matches: (_cat, _room, catsInRoom) => roomHasStates(catsInRoom, ['resting', 'sleeping'], 2),
  },
  {
    id: 'stolen_snack',
    title: 'Stolen Snack',
    flavor: 'Mochi insists this was quality assurance.',
    triggerCondition: { type: 'cat_in_room', catId: 'mochi', roomId: 'kitchen' },
    effect: { type: 'coins_gain_grumpy_risk_and_kitchen_hint' },
    cooldownMinutes: 30,
    isRare: false,
    matches: (cat, room, catsInRoom) => cat.id === 'mochi' && room.id === 'kitchen' && catsInRoom.length === 1,
  },
];

export default events;
