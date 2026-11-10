// Game State, Quest Progression, Herbarium Journal Unlocking, Satchel Inventory, and Save/Load.

import { PLANTS } from '../data/plants.js';
const STORAGE_KEY = 'upb_flora_quest_save_v2'; // Keep the old story save intact.

export const QUEST_DEFS = [
  {
    "id": "field_benguet_pine",
    "code": "M1",
    "title": "Roots of the Campus",
    "giver": "Prof. Racquel Barcelo",
    "npcId": "prof_barcelo",
    "plantId": "benguet_pine",
    "locationHint": "Left of Inang Laya",
    "summary": "Identify and photograph Pine Tree (Pinus kesiya). Left of Inang Laya. Return to Prof. Racquel Barcelo with your observations."
  },
  {
    "id": "field_tri_vein_fern",
    "code": "M2",
    "title": "Fronds at Inang Laya",
    "giver": "Paolo",
    "npcId": "paolo",
    "plantId": "tri_vein_fern",
    "locationHint": "In front of Inang Laya",
    "summary": "Identify and photograph Tri-vein Fern (Christella parasitica). In front of Inang Laya. Return to Paolo with your observations."
  },
  {
    "id": "field_gipas",
    "code": "M3",
    "title": "The Gipas Stair Garden",
    "giver": "Nurse Ruth",
    "npcId": "nurse_ruth",
    "plantId": "gipas",
    "locationHint": "Beside the north stairs, between KA and HKP",
    "summary": "Identify and photograph Gipas (Sarcandra glabra). Beside the north stairs, between KA and HKP. Return to Nurse Ruth with your observations."
  },
  {
    "id": "field_kamantigi",
    "code": "M4",
    "title": "Flowers on the Steps",
    "giver": "Ate Lorna",
    "npcId": "ate_lorna",
    "plantId": "kamantigi",
    "locationHint": "Beside the north stairs",
    "summary": "Identify and photograph Kamantigi (Impatiens balsamina). Beside the north stairs. Return to Ate Lorna with your observations."
  },
  {
    "id": "field_fishtail_fern",
    "code": "M5",
    "title": "A Fern Without Flowers",
    "giver": "Kiko",
    "npcId": "kiko",
    "plantId": "fishtail_fern",
    "locationHint": "Between KA and HKP",
    "summary": "Identify and photograph Fishtail Fern (Microsorum punctatum). Between KA and HKP. Return to Kiko with your observations."
  },
  {
    "id": "field_moclame",
    "code": "M6",
    "title": "The Moclame Canopy",
    "giver": "Dr. Alangdeo",
    "npcId": "curator",
    "plantId": "moclame",
    "locationHint": "Between KA and HKP",
    "summary": "Identify and photograph Moclame (Ficus microcarpa). Between KA and HKP. Return to Dr. Alangdeo with your observations."
  },
  {
    "id": "field_agoho",
    "code": "M7",
    "title": "Agoho or Pine?",
    "giver": "Bea",
    "npcId": "bea",
    "plantId": "agoho",
    "locationHint": "Near the College of Science AVR",
    "summary": "Identify and photograph Agoho (Casuarina equisetifolia). Near the College of Science AVR. Return to Bea with your observations."
  }
];

export function createInitialState() {
  return {
    playerName: 'Isko',
    character: 'male',
    started: false,
    // Quest status: 'locked' | 'available' | 'active' | 'completed'
    quests: Object.fromEntries(QUEST_DEFS.map((q,i) => [q.id, i === 0 ? 'available' : 'locked'])),
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
    if (questId === 'field_benguet_pine' && status === 'completed') {
      for (const q of QUEST_DEFS.slice(1)) if (this.data.quests[q.id] === 'locked') this.data.quests[q.id] = 'available';
    }
    this.notify();
  }

  setFlag(key, val = true) {
    this.data.flags[key] = val;
    this.notify();
  }

  getActiveHeadline() {
    if (this.data.flags.finale_complete) return `Ex-Flora-Tive complete! (${this.data.identifiedPlants.length}/${PLANTS.length} documented)`;
    const active = QUEST_DEFS.find(q => this.getQuestStatus(q.id) === 'active');
    if (active) return this.hasCollected(active.plantId) ? `${active.code}: Return to ${active.giver}` : `${active.code}: ${active.locationHint}`;
    const available = QUEST_DEFS.find(q => this.getQuestStatus(q.id) === 'available');
    return available ? `${available.code}: Talk to ${available.giver}` : 'Return to Prof. Barcelo at the Oblation for your fieldwork review';
  }
}
