// Game State, Quest Progression, Herbarium Journal Unlocking, Satchel Inventory, and Save/Load.

const STORAGE_KEY = 'upb_flora_quest_save_v1';

export const QUEST_DEFS = [
  {
    id: 'm1_saleng',
    code: 'M1',
    title: 'Roots of the Campus (Saleng)',
    giver: 'Prof. Mila Dulay',
    plantId: 'benguet_pine',
    locationHint: 'Oblation Plaza (Lower Campus)',
    summary:
      'Meet Prof. Dulay at the Oblation Plaza, examine & identify the heritage Benguet Pine (Saleng), and listen to Apo Sabado’s Cordillera lore.',
  },
  {
    id: 'm2_lagundi',
    code: 'M2',
    title: 'Ubo sa Dorm (Dormitory Cough)',
    giver: 'Paolo (Dorm Roommate)',
    plantId: 'lagundi',
    locationHint: 'Breha Residence Hall (West Campus)',
    summary:
      'Your roommate Paolo has a dry cough from studying in the cold Baguio mist. Identify & harvest five-leaflet Lagundi (Dangla) from the dorm garden for a DOH-approved cough decoction.',
  },
  {
    id: 'm3_sambong',
    code: 'M3',
    title: 'Manong Ben’s Burden',
    giver: 'Manong Ben (Gate Guard)',
    plantId: 'sambong',
    locationHint: 'Main Gate & College of Science Terrace',
    summary:
      'Manong Ben’s doctor advised a DOH-approved herbal diuretic for his urinary stone history and swollen ankles. Find velvety camphor-scented Sambong (Subusob) beside the College of Science.',
  },
  {
    id: 'm4_tsaang_gubat',
    code: 'M4',
    title: 'Sakit ng Tiyan sa Canteen',
    giver: 'Ate Lorna & Jun-jun',
    plantId: 'tsaang_gubat',
    locationHint: 'UPB Student Canteen (Southwest Campus)',
    summary:
      'Ate Lorna’s son Jun-jun has stomach cramps. Identify & gather glossy Tsaang Gubat leaves from the canteen hedge to pair with his Oral Rehydration Salts (ORS).',
  },
  {
    id: 'm5_takip_kuhol',
    code: 'M5',
    title: 'Gasgas sa Court (Varsity Scrape)',
    giver: 'Kiko & Nurse Ruth',
    plantId: 'takip_kuhol',
    locationHint: 'Basketball Court & UHS Clinic (East Campus)',
    summary:
      'Kiko scraped his knee during intramurals practice. After washing the wound with clean water, find fan-leaved Takip-kuhol (Centella asiatica) near the court drain for a soothing poultice.',
  },
  {
    id: 'm6_benguet_lily',
    code: 'M6',
    title: 'Liryo ng Kabundukan (Mountain Lily)',
    giver: 'Dr. Alangdeo (Museo Kordilyera)',
    plantId: 'benguet_lily',
    locationHint: 'Museo Kordilyera & Upper Pine Hill (Level 2)',
    summary:
      'Document the threatened endemic Benguet Lily (Lilium philippinense) on Upper Pine Hill for the Museo Kordilyera exhibit — strictly via non-destructive photography!',
  },
  {
    id: 's1_sunflower',
    code: 'S1',
    title: 'Sunflower Season Twist (Side Quest)',
    giver: 'Bea (Campus Photographer)',
    plantId: 'mexican_sunflower',
    locationHint: 'College of Science Lawn (Level 1)',
    summary:
      'Bea wants to know if Baguio’s famous yellow sunflowers (Tithonia diversifolia) are truly native Cordillera plants. Examine the bush and share the botanical truth!',
  },
];

export function createInitialState() {
  return {
    playerName: 'Isko',
    started: false,
    // Quest status: 'locked' | 'available' | 'active' | 'completed'
    quests: {
      m1_saleng: 'available',
      m2_lagundi: 'locked',
      m3_sambong: 'locked',
      m4_tsaang_gubat: 'locked',
      m5_takip_kuhol: 'locked',
      m6_benguet_lily: 'locked',
      s1_sunflower: 'available',
    },
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
    // Unlock M2..M5 when M1 is completed
    if (questId === 'm1_saleng' && status === 'completed') {
      for (const q of ['m2_lagundi', 'm3_sambong', 'm4_tsaang_gubat', 'm5_takip_kuhol']) {
        if (this.data.quests[q] === 'locked') {
          this.data.quests[q] = 'available';
        }
      }
      if (this.data.quests.m6_benguet_lily === 'locked') {
        this.data.quests.m6_benguet_lily = 'available';
      }
    }
    this.notify();
  }

  setFlag(key, val = true) {
    this.data.flags[key] = val;
    this.notify();
  }

  getActiveHeadline() {
    const q = this.data.quests;
    if (this.data.flags.finale_complete) {
      return `🎉 Project Saleng Complete! (${this.data.identifiedPlants.length}/9 Flora Documented)`;
    }
    if (q.m1_saleng === 'available') {
      return 'M1: Talk to Prof. Dulay at the Oblation Plaza';
    }
    if (q.m1_saleng === 'active') {
      if (!this.hasCollected('benguet_pine')) {
        return 'M1: Examine & document the Benguet Pine (Saleng) at the Plaza';
      }
      if (!this.data.flags.talked_apo_sabado) {
        return 'M1: Ask Apo Sabado about traditional Saleng lore';
      }
      return 'M1: Report back to Prof. Dulay at the Oblation Plaza';
    }

    // Check active medicinal quests first
    const activeOrder = [
      ['m2_lagundi', 'lagundi', 'M2: Harvest Lagundi in Dorm Garden for Paolo’s cough', 'M2: Deliver Lagundi leaves to Paolo at Breha Dorm'],
      ['m3_sambong', 'sambong', 'M3: Find Sambong beside College of Science for Manong Ben', 'M3: Bring Sambong leaves back to Manong Ben at Main Gate'],
      ['m4_tsaang_gubat', 'tsaang_gubat', 'M4: Gather Tsaang Gubat by Canteen hedge for Jun-jun', 'M4: Give Tsaang Gubat leaves to Ate Lorna at the Canteen'],
      ['m5_takip_kuhol', 'takip_kuhol', 'M5: Find Takip-kuhol near Basketball Court drain for Kiko', 'M5: Bring Takip-kuhol poultice leaves to Kiko at the Court'],
      ['m6_benguet_lily', 'benguet_lily', 'M6: Photograph the endemic Benguet Lily on Upper Pine Hill', 'M6: Show Benguet Lily photo to Dr. Alangdeo at Museo Kordilyera'],
      ['s1_sunflower', 'mexican_sunflower', 'S1: Examine the yellow Sunflower bush on the CS Lawn', 'S1: Tell Bea the truth about Mexican Sunflowers'],
    ];

    for (const [id, plantId, findMsg, returnMsg] of activeOrder) {
      if (q[id] === 'active') {
        return this.hasCollected(plantId) ? returnMsg : findMsg;
      }
    }

    // Count completed core missions
    const coreDone = ['m2_lagundi', 'm3_sambong', 'm4_tsaang_gubat', 'm5_takip_kuhol'].filter(
      (k) => q[k] === 'completed',
    ).length;

    if (coreDone < 4) {
      return `Campus Herbal Missions (${coreDone}/4 healed) — Look for ! bubbles on NPCs`;
    }
    if (q.m6_benguet_lily !== 'completed') {
      return 'M6: Visit Dr. Alangdeo at Museo Kordilyera (East Terrace)';
    }
    return 'Finale: Return to Prof. Dulay at the Oblation Plaza!';
  }
}
