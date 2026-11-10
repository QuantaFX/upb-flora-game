// Game State, Quest Progression, Herbarium Journal Unlocking, Satchel Inventory, and Save/Load.

const STORAGE_KEY = 'upb_flora_quest_save_v1';

export const QUEST_DEFS = [
  {
    id: 'm1_saleng',
    code: 'M1',
    title: 'Roots of the Campus (Saleng)',
    giver: 'Prof. Mila Dulay',
    plantId: 'benguet_pine',
    locationHint: 'Oblation Ground & UPB Woods (#15, SE Entrance · Elev 0)',
    summary:
      'Meet Prof. Dulay at the Oblation Ground (SE Driveway), examine & identify the heritage Benguet Pine (Saleng) in the UPB Woods, and listen to Apo Sabado’s Cordillera lore.',
  },
  {
    id: 'm2_lagundi',
    code: 'M2',
    title: 'Ubo sa Dorm (Dormitory Cough)',
    giver: 'Paolo (Dorm Roommate)',
    plantId: 'lagundi',
    locationHint: 'Ladies Dormitory & Walk-up Compound (South Annex · Elev 0)',
    summary:
      'Your friend Paolo at the South Dormitory Compound has a dry cough from studying in the Baguio mist. Identify & harvest five-leaflet Lagundi (Dangla) in the Open Area beside the Dormitory.',
  },
  {
    id: 'm3_sambong',
    code: 'M3',
    title: 'Manong Ben’s Burden',
    giver: 'Manong Ben (Driveway Guard)',
    plantId: 'sambong',
    locationHint: 'Oblation Gate (Elev 0) → KA / CS Quad (Summit · Elev 3)',
    summary:
      'Manong Ben’s doctor advised a DOH-approved herbal diuretic for his urinary stone history and swollen ankles. Climb to the Level 3 Summit Crown and find Sambong (Subusob) on the KA/CS Quad (#12).',
  },
  {
    id: 'm4_tsaang_gubat',
    code: 'M4',
    title: 'Sakit ng Tiyan sa Balay Panganan',
    giver: 'Ate Lorna & Jun-jun',
    plantId: 'tsaang_gubat',
    locationHint: 'Balay Panganan / Cafeteria (#13, Summit North · Elev 3)',
    summary:
      'At Balay Panganan on the Summit Plateau, Ate Lorna’s son Jun-jun has stomach cramps. Identify & gather glossy Tsaang Gubat leaves beside the Student Alumni Center (#2) to pair with his ORS.',
  },
  {
    id: 'm5_takip_kuhol',
    code: 'M5',
    title: 'Gasgas sa Court A (Varsity Scrape)',
    giver: 'Kiko & Nurse Ruth',
    plantId: 'takip_kuhol',
    locationHint: 'Open Court A (#21, Middle Terrace · Elev 2)',
    summary:
      'Kiko scraped his knee during practice at Open Court A (Middle Terrace, Elev 2). After washing the wound with soap and water, find fan-leaved Takip-kuhol near the Court A steps.',
  },
  {
    id: 'm6_benguet_lily',
    code: 'M6',
    title: 'Liryo ng Kabundukan (Mountain Lily)',
    giver: 'Dr. Alangdeo (Museo Kordilyera)',
    plantId: 'benguet_lily',
    locationHint: 'Museo Kordilyera (#9, Elev 3) → Woods behind CSS (#3, Elev 2)',
    summary:
      'Document the threatened endemic Benguet Lily (Lilium philippinense) in the Woods behind CSS (#3) for the Museo Kordilyera exhibit — strictly via non-destructive photography!',
  },
  {
    id: 's1_sunflower',
    code: 'S1',
    title: 'Sunflower Season Twist (Side Quest)',
    giver: 'Bea (UPB Outcrop Photographer)',
    plantId: 'mexican_sunflower',
    locationHint: 'Kolehiyo ng Agham (KA) Quad (#12, Summit · Elev 3)',
    summary:
      'Outcrop photographer Bea on the Summit KA Quad wants to know if Baguio’s famous yellow sunflowers (Tithonia diversifolia) are truly native Cordillera plants. Examine the bush and share the truth!',
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
      ['m2_lagundi', 'lagundi', 'M2: Harvest Lagundi in South Dormitory Open Area for Paolo', 'M2: Deliver Lagundi leaves to Paolo at South Dormitory'],
      ['m3_sambong', 'sambong', 'M3: Climb to Summit KA/CS Quad (Elev 3) to find Sambong', 'M3: Bring Sambong back to Manong Ben at Oblation Gate'],
      ['m4_tsaang_gubat', 'tsaang_gubat', 'M4: Gather Tsaang Gubat beside Balay Panganan (Elev 3)', 'M4: Give Tsaang Gubat to Ate Lorna at Balay Panganan'],
      ['m5_takip_kuhol', 'takip_kuhol', 'M5: Find Takip-kuhol by Open Court A drain (Elev 2)', 'M5: Bring Takip-kuhol poultice leaves to Kiko at Court A'],
      ['m6_benguet_lily', 'benguet_lily', 'M6: Photograph Benguet Lily in Woods behind CSS (Elev 2)', 'M6: Show Benguet Lily photo to Dr. Alangdeo at Museo Kordilyera'],
      ['s1_sunflower', 'mexican_sunflower', 'S1: Examine the yellow Sunflower bush on Summit KA Quad', 'S1: Tell Bea on the KA Quad the truth about Mexican Sunflowers'],
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
