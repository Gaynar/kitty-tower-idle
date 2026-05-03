export const rooms = [
  {
    id: 'living_room',
    name: 'Living Room',
    towerFloor: 2,
    baseCapacity: 2,
    maxCapacity: 3,
    produces: ['coins', 'comfort'],
    baseRates: {
      bean_with_company: { coins: 0.7, comfort: 0.8 },
      calm_cat: { coins: 0.7, comfort: 0.4 },
      default: { coins: 0.7, comfort: 0 },
    },
    furnitureSlots: { 1: 1, 2: 2, 3: 3 },
    upgradeCosts: {
      2: { coins: 1200, comfort: 150 },
      3: { coins: 2700, comfort: 360 },
    },
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    towerFloor: 1,
    baseCapacity: 1,
    maxCapacity: 2,
    produces: ['coins'],
    baseRates: {
      mochi_alone: { coins: 2, comfort: 0 },
      default: { coins: 0.8, comfort: 0 },
    },
    furnitureSlots: { 1: 1, 2: 2, 3: 3 },
    upgradeCosts: {
      2: { coins: 1200, comfort: 150 },
      3: { coins: 2700, comfort: 360 },
    },
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    towerFloor: 3,
    baseCapacity: 2,
    maxCapacity: 3,
    produces: ['comfort'],
    baseRates: {
      miso_sleeping: { coins: 0.2, comfort: 1.5 },
      default: { coins: 0.2, comfort: 0.4 },
    },
    furnitureSlots: { 1: 1, 2: 2, 3: 3 },
    upgradeCosts: {
      2: { coins: 1200, comfort: 150 },
      3: { coins: 2700, comfort: 360 },
    },
  },
];

export default rooms;
