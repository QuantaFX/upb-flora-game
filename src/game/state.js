// Game State, Quest Progression, Herbarium Journal Unlocking, Satchel Inventory, and Save/Load.

import { PLANTS } from '../data/plants.js';
const STORAGE_KEY = 'upb_flora_quest_save_v5'; // Bumped for 100% Native 10-species curriculum (Co's Digital Flora & POWO verified).

export const QUEST_DEFS = [
  {
    id: 'field_benguet_pine',
    code: 'M1',
    title: 'Roots of the Campus',
    giver: 'Prof. Racquel Barcelo',
    npcId: 'prof_barcelo',
    plantId: 'benguet_pine',
    locationHint: 'Left side of Inang Laya',
    summary: 'Identify and photograph Pine Tree (Pinus kesiya) on the left side of Inang Laya. Return to Prof. Racquel Barcelo with your observations.',
  },
  {
    id: 'field_philippine_azalea',
    code: 'M2',
    title: 'Endemic Highland Blossoms',
    giver: 'Paolo',
    npcId: 'paolo',
    plantId: 'philippine_azalea',
    locationHint: 'Near Teatro Amianan and in front of CAC',
    summary: 'Identify and photograph the endemic Philippine Azalea (Rhododendron subsessile) between CAC and Teatro Amianan. Return to Paolo in the CAC courtyard.',
  },
  {
    id: 'field_fishtail_fern',
    code: 'M3',
    title: 'A Fern Without Flowers',
    giver: 'Kiko',
    npcId: 'kiko',
    plantId: 'fishtail_fern',
    locationHint: 'Between KA and HKP',
    summary: 'Identify and photograph Fishtail Fern (Microsorum punctatum) between KA and HKP. Return to Kiko at Open Court A.',
  },
  {
    id: 'field_agubangbang',
    code: 'M4',
    title: 'Chandeliers of the Cloud Forest',
    giver: 'Apo Sabado',
    npcId: 'apo_sabado',
    plantId: 'agubangbang',
    locationHint: 'Near HKP (Human Kinetics Program)',
    summary: 'Identify and photograph the endemic Agubangbang (Medinilla pendula) near the Human Kinetics Program. Return to Apo Sabado by the woods.',
  },
  {
    id: 'field_gipas',
    code: 'M5',
    title: 'The Gipas Stair Garden',
    giver: 'Nurse Ruth',
    npcId: 'nurse_ruth',
    plantId: 'gipas',
    locationHint: 'Abortion Stairs, between KA and HKP',
    summary: 'Identify and photograph Gipas (Sarcandra glabra) along the Abortion Stairs between KA and HKP. Return to Nurse Ruth at Balay Salun-at.',
  },
  {
    id: 'field_mayana',
    code: 'M6',
    title: 'Painted Leaves Behind KA',
    giver: 'Ate Lorna',
    npcId: 'ate_lorna',
    plantId: 'mayana',
    locationHint: 'Back of KA Building (Kolehiyo ng Agham)',
    summary: 'Identify and photograph Mayana (Coleus scutellarioides) at the back of the KA Building. Return to Ate Lorna outside Balay Panganan.',
  },
  {
    id: 'field_agoho',
    code: 'M7',
    title: 'Agoho or Pine?',
    giver: 'Bea',
    npcId: 'bea',
    plantId: 'agoho',
    locationHint: 'Near CS AVR, along gate pathway',
    summary: 'Identify and photograph Agoho (Casuarina equisetifolia) near the College of Science AVR along the gate pathway. Return to Bea in front of KA.',
  },
  {
    id: 'field_kamantigi',
    code: 'M8',
    title: 'Blossoms Along the Steps',
    giver: 'Dr. Alangdeo',
    npcId: 'curator',
    plantId: 'kamantigi',
    locationHint: 'Along Abortion Stairs',
    summary: 'Identify and photograph Kamantigi (Impatiens platypetala) along the Abortion Stairs. Return to Dr. Alangdeo beside Museo Kordilyera.',
  },
  {
    id: 'field_fishbone_fern',
    code: 'M9',
    title: 'Bayabang by the Theater',
    giver: 'Manong Ben',
    npcId: 'manong_ben',
    plantId: 'fishbone_fern',
    locationHint: 'Teatro Amianan',
    summary: 'Identify and photograph Fishbone Fern (Nephrolepis cordifolia) beside Teatro Amianan. Return to Manong Ben at the guardhouse.',
  },
  {
    id: 'field_ground_orchid',
    code: 'M10',
    title: 'Orchids Beside the Clinic',
    giver: 'Prof. Racquel Barcelo',
    npcId: 'prof_barcelo',
    plantId: 'ground_orchid',
    locationHint: 'Beside HSO / Balay Salun-at (UHS)',
    summary: 'Identify and photograph Philippine Ground Orchid (Spathoglottis plicata) beside Balay Salun-at (HSO). Return to Prof. Racquel Barcelo beside the Oblation.',
  },
];

export const NPC_LOCATIONS = {
  prof_barcelo: 'beside the Oblation, east driveway',
  paolo: 'CAC courtyard, southwest of the Library',
  nurse_ruth: 'outside Balay Salun-at, west of KA',
  ate_lorna: 'outside Balay Panganan, northwest terrace',
  kiko: 'Open Court A, below the IB building',
  curator: 'beside Museo Kordilyera, west of IB',
  bea: 'in front of KA, north of IB',
  manong_ben: 'Oblation driveway guardhouse, east entrance',
  apo_sabado: 'east woodland trail beside Open Court A',
};

export function createInitialState() {
  return {
    playerName: 'Isko',
    character: 'male',
    started: false,
    // Quest status: 'locked' | 'available' | 'active' | 'completed'
    quests: Object.fromEntries(QUEST_DEFS.map((q, i) => [q.id, i === 0 ? 'available' : 'locked'])),
    flags: {
      talked_prof_intro: false,
      talked_apo_sabado: false,
      finale_complete: false,
    },
    // Set of plantIds identified in encounters
    identifiedPlants: [],
    // Set of plantIds whose item/photo has been collected into satchel
    collectedPlants: [],
    // Revealed clues per plantId: { [plantId]: ['leaves', 'flowers', ...] }
    revealedClues: {},
  };
}

export class GameState {
  constructor() {
    this.data = createInitialState();
    this.listeners = new Set();
    this.load();
    this.normalizeQuestOrder();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    this.save();
    for (const fn of this.listeners) fn(this.data);
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // ignore storage errors
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.data = {
          ...createInitialState(),
          ...parsed,
          quests: { ...createInitialState().quests, ...(parsed.quests || {}) },
          flags: { ...createInitialState().flags, ...(parsed.flags || {}) },
        };
      }
    } catch {
      this.data = createInitialState();
    }
  }

  // Preserve earned records and completed missions from older free-order saves.
  normalizeQuestOrder() {
    let nextFound = false;
    for (const q of QUEST_DEFS) {
      if (this.data.quests[q.id] === 'completed') continue;
      if (!nextFound) {
        if (this.data.quests[q.id] !== 'active') this.data.quests[q.id] = 'available';
        nextFound = true;
      } else {
        this.data.quests[q.id] = 'locked';
      }
    }
  }

  reset() {
    this.data = createInitialState();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    this.notify();
  }

  setPlayerName(name) {
    this.data.playerName = (name || 'Isko').trim().slice(0, 16) || 'Isko';
    this.data.started = true;
    this.notify();
  }

  setCharacter(character) {
    this.data.character = character === 'female' ? 'female' : 'male';
    this.notify();
  }

  isIdentified(plantId) {
    return this.data.identifiedPlants.includes(plantId);
  }

  hasCollected(plantId) {
    return this.data.collectedPlants.includes(plantId);
  }

  revealClue(plantId, clueKey) {
    if (!this.data.revealedClues[plantId]) {
      this.data.revealedClues[plantId] = [];
    }
    if (!this.data.revealedClues[plantId].includes(clueKey)) {
      this.data.revealedClues[plantId].push(clueKey);
      this.notify();
    }
  }

  getRevealedClues(plantId) {
    return this.data.revealedClues[plantId] || [];
  }

  markIdentified(plantId) {
    if (!this.isIdentified(plantId)) {
      this.data.identifiedPlants.push(plantId);
      this.notify();
    }
  }

  markCollected(plantId) {
    this.markIdentified(plantId);
    if (!this.hasCollected(plantId)) {
      this.data.collectedPlants.push(plantId);
      this.notify();
    }
  }

  getQuestStatus(questId) {
    return this.data.quests[questId] || 'locked';
  }

  setQuestStatus(questId, status) {
    this.data.quests[questId] = status;
    if (status === 'completed') this.normalizeQuestOrder();
    this.notify();
  }

  setFlag(key, val = true) {
    this.data.flags[key] = val;
    this.notify();
  }

  getActiveHeadline() {
    if (this.data.flags.finale_complete) return `Ex-Flora-Tive complete! (${this.data.identifiedPlants.length}/${PLANTS.length} documented)`;
    const active = QUEST_DEFS.find((q) => this.getQuestStatus(q.id) === 'active');
    if (active) return this.hasCollected(active.plantId) ? `${active.code}: Return to ${active.giver} · ${NPC_LOCATIONS[active.npcId]}` : `${active.code}: ${active.locationHint}`;
    const available = QUEST_DEFS.find((q) => this.getQuestStatus(q.id) === 'available');
    return available ? `${available.code}: Talk to ${available.giver} · ${NPC_LOCATIONS[available.npcId]}` : 'Return to Prof. Barcelo at the Oblation for your fieldwork review';
  }
}
