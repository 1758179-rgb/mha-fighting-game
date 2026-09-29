const MHA_QUIRKS = {
  // Hero-style quirks
  oneforall: { name: 'One For All', type: 'ultimate', damage: 26, speed: 1.3, color: '#7ef9a9', cost: 0 },
  blackwhip: { name: 'Black Whip', type: 'range', damage: 18, speed: 1.2, color: '#d4d4d4', cost: 8 },
  float: { name: 'Float', type: 'mobility', damage: 7, speed: 1.5, color: '#9ae6ff', cost: 6 },
  halfcold: { name: 'Half-Cold Half-Hot', type: 'dual', damage: 20, speed: 1.1, color: '#a5f3fc', cost: 9 },
  smokescreen: { name: 'Smoke Screen', type: 'utility', damage: 8, speed: 1.0, color: '#7f8c8d', cost: 6 },
  hardness: { name: 'Hardening', type: 'shield', damage: 8, speed: 1.0, color: '#d9d9d9', cost: 7 },
  erasure: { name: 'Erasure', type: 'control', damage: 10, speed: 0.9, color: '#7e7dff', cost: 12 },
  creation: { name: 'Creation', type: 'utility', damage: 14, speed: 1.1, color: '#facc15', cost: 10 },
  explosion: { name: 'Explosion', type: 'burst', damage: 22, speed: 1.0, color: '#f97316', cost: 11 },
  entropy: { name: 'Decay', type: 'damage', damage: 17, speed: 1.2, color: '#a3e635', cost: 9 },
  magnetism: { name: 'Magnetism', type: 'control', damage: 16, speed: 1.1, color: '#93c5fd', cost: 8 },
  fire: { name: 'Fire Breath', type: 'burst', damage: 15, speed: 1.1, color: '#fb923c', cost: 8 },
  ice: { name: 'Ice', type: 'control', damage: 12, speed: 1.0, color: '#67e8f9', cost: 7 },
  speed: { name: 'Super Speed', type: 'mobility', damage: 9, speed: 1.7, color: '#f9a8d4', cost: 6 },
  strength: { name: 'Super Strength', type: 'power', damage: 18, speed: 1.0, color: '#f87171', cost: 10 },
  airblast: { name: 'Air Blast', type: 'range', damage: 15, speed: 1.2, color: '#a5d8ff', cost: 7 },
  regeneration: { name: 'Infinite Regeneration', type: 'heal', damage: 0, speed: 1.0, color: '#4ade80', cost: 0 },
  takeOver: { name: 'Take Over', type: 'ultimate', damage: 30, speed: 1.4, color: '#c084fc', cost: 15 },
  claw: { name: 'Fang', type: 'melee', damage: 13, speed: 1.1, color: '#fca5a5', cost: 7 },
  telekinesis: { name: 'Telekinesis', type: 'range', damage: 11, speed: 1.2, color: '#c4b5fd', cost: 8 },
  quake: { name: 'Quake', type: 'burst', damage: 18, speed: 0.9, color: '#fbbf24', cost: 10 },
  sonic: { name: 'Sonic Scream', type: 'range', damage: 14, speed: 1.2, color: '#fda4af', cost: 8 },
  barrier: { name: 'Barrier', type: 'shield', damage: 7, speed: 1.0, color: '#67e8f9', cost: 6 },
  acid: { name: 'Acid', type: 'damage', damage: 16, speed: 1.0, color: '#a3e635', cost: 8 },
  warp: { name: 'Warp Gate', type: 'teleport', damage: 12, speed: 1.3, color: '#a78bfa', cost: 8 },
  shock: { name: 'Shockwave', type: 'burst', damage: 19, speed: 1.0, color: '#60a5fa', cost: 9 },
  gravity: { name: 'Gravity', type: 'range', damage: 20, speed: 1.0, color: '#d8b4fe', cost: 12 }
};

const QUIRK_LIST = Object.keys(MHA_QUIRKS);

function getRandomQuirk() {
  return QUIRK_LIST[Math.floor(Math.random() * QUIRK_LIST.length)];
}

function buildComboSet() {
  const combos = [];
  for (let i = 0; i < 25; i++) {
    const q1 = getRandomQuirk();
    const q2 = getRandomQuirk();
    combos.push({ name: `${MHA_QUIRKS[q1].name} + ${MHA_QUIRKS[q2].name}`, bonus: 8 + i % 5 });
  }
  return combos;
}

function getQuirkData(id) {
  return MHA_QUIRKS[id] || MHA_QUIRKS.oneforall;
}
