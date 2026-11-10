// Authentic UP Baguio Concentric Hilltop Map — EXPANDED EDITION (80x64 tiles, 4 elevation levels: 0..3)
// Modeled directly after the UP Baguio Emergency Evacuation Plan (with elevation contour rings)
// and the Outcrop "21 Democratic Spaces" 3D campus map.
//
// Generous wide walkways, plazas, and courtyards between all buildings!
// Every building carries an explicit `elev` property so its foundation and ground tiles
// are guaranteed to sit flush on the exact same terrace level (zero floating buildings).

export const MAP_W = 80;
export const MAP_H = 64;

export const BUILDINGS = [
  // --- LEVEL 0 (Outer / Lower Perimeter & South Dormitory Compound) ---
  {
    id: 'b_dorm',
    name: 'LADIES DORMITORY',
    sub: 'Breha Residence Hall',
    elev: 0,
    x: 52,
    y: 52,
    w: 7,
    d: 4,
    h: 2.6,
    wallColor: '#e9d696',
    roofColor: '#8d5b28',
    doorX: 55,
  },
  {
    id: 'b_walkup',
    name: 'WALK-UP APARTMENT',
    sub: 'Faculty & Student Housing',
    elev: 0,
    x: 62,
    y: 48,
    w: 6,
    d: 4,
    h: 2.6,
    wallColor: '#e9d696',
    roofColor: '#8d5b28',
    doorX: 65,
  },
  {
    id: 'b_guard',
    name: 'GUARDHOUSE · OBLATION GATE',
    sub: 'Driveway Entrance',
    elev: 0,
    x: 70,
    y: 38,
    w: 4,
    d: 3,
    h: 2.1,
    wallColor: '#eadbc2',
    roofColor: '#7b1113',
    doorX: 72,
  },

  // --- LEVEL 1 (Lower Concentric Terrace Ring) ---
  {
    id: 'b_cac',
    name: 'ARTS & COMMUNICATION (CAC)',
    sub: 'CAC Dap-ay & Four Pillars',
    elev: 1,
    x: 20,
    y: 44,
    w: 10,
    d: 4,
    h: 2.7,
    wallColor: '#b9c0d8',
    roofColor: '#4c5778',
    doorX: 25,
  },
  {
    id: 'b_teatro',
    name: 'TEATRO AMIANAN',
    sub: 'Performing Arts Hall',
    elev: 1,
    x: 34,
    y: 44,
    w: 7,
    d: 4,
    h: 2.7,
    wallColor: '#d99e82',
    roofColor: '#8c3b2b',
    doorX: 37,
  },
  {
    id: 'b_himnasyo',
    name: 'HIMNASYO AMIANAN & HK',
    sub: 'Human Kinetics Program',
    elev: 1,
    x: 52,
    y: 4,
    w: 8,
    d: 3,
    h: 2.7,
    wallColor: '#dcd299',
    roofColor: '#5c6632',
    doorX: 56,
  },
  {
    id: 'b_biodiv',
    name: 'BIODIVERSITY RESEARCH CTR',
    sub: 'Innovation & Biodiversity',
    elev: 1,
    x: 63,
    y: 12,
    w: 9,
    d: 3,
    h: 2.6,
    wallColor: '#c8ccd0',
    roofColor: '#4a555e',
    doorX: 67,
  },

  // --- LEVEL 2 (Middle Concentric Terrace Ring) ---
  {
    id: 'b_css',
    name: 'COLLEGE OF SOCIAL SCIENCES',
    sub: 'CSS & Cordillera Studies Ctr',
    elev: 2,
    x: 15,
    y: 28,
    w: 8,
    d: 4,
    h: 2.9,
    wallColor: '#b6bed8',
    roofColor: '#465170',
    doorX: 19,
  },
  {
    id: 'b_library',
    name: 'UP BAGUIO LIBRARY',
    sub: 'University Library & Archives',
    elev: 2,
    x: 28,
    y: 34,
    w: 11,
    d: 4,
    h: 3.0,
    wallColor: '#d8a58e',
    roofColor: '#7b1113',
    doorX: 33,
  },
  {
    id: 'b_juanluna',
    name: 'BULWAGANG JUAN LUNA',
    sub: 'Cultural Hub & Auditorium',
    elev: 2,
    x: 26,
    y: 24,
    w: 11,
    d: 3,
    h: 2.7,
    wallColor: '#bdbdbd',
    roofColor: '#525252',
    doorX: 31,
  },

  // --- LEVEL 3 (Summit Crown Plateau — Highest Elevation) ---
  {
    id: 'b_alumni',
    name: 'STUDENT ALUMNI CENTER',
    sub: 'Alum Lobby & CL Office',
    elev: 3,
    x: 21,
    y: 10,
    w: 6,
    d: 3,
    h: 2.6,
    wallColor: '#d5dde6',
    roofColor: '#4c6278',
    doorX: 24,
  },
  {
    id: 'b_canteen',
    name: 'BALAY PANGANAN',
    sub: 'UPB Cafeteria',
    elev: 3,
    x: 29,
    y: 8,
    w: 7,
    d: 3,
    h: 2.4,
    wallColor: '#f3e5cc',
    roofColor: '#a63429',
    doorX: 32,
  },
  {
    id: 'b_uhs',
    name: 'BALAY SALUN-AT (UHS)',
    sub: 'University Health Service',
    elev: 3,
    x: 38,
    y: 8,
    w: 6,
    d: 3,
    h: 2.4,
    wallColor: '#e8f4ea',
    roofColor: '#2d6e46',
    doorX: 41,
  },
  {
    id: 'b_ka',
    name: 'KOLEHIYO NG AGHAM (KA)',
    sub: 'Science Research Center',
    elev: 3,
    x: 46,
    y: 8,
    w: 10,
    d: 3,
    h: 3.0,
    wallColor: '#dce4ec',
    roofColor: '#7b1113',
    doorX: 51,
  },
  {
    id: 'b_museo',
    name: 'MUSEO KORDILYERA',
    sub: 'Ethnographic Museum',
    elev: 3,
    x: 21,
    y: 16,
    w: 6,
    d: 3,
    h: 3.0,
    wallColor: '#d9c5a9',
    roofColor: '#3e2515',
    doorX: 24,
  },
  {
    id: 'b_im',
    name: 'INSTITUTE OF MANAGEMENT',
    sub: 'Isabelo delos Reyes Bldg',
    elev: 3,
    x: 30,
    y: 15,
    w: 7,
    d: 3,
    h: 2.9,
    wallColor: '#dce3ec',
    roofColor: '#546880',
    doorX: 33,
  },
  {
    id: 'b_ib',
    name: 'ISKOLAR NG BAYAN BLDG',
    sub: 'IB Lobby & Inang Laya',
    elev: 3,
    x: 39,
    y: 15,
    w: 9,
    d: 3,
    h: 3.0,
    wallColor: '#e4eaf0',
    roofColor: '#7b1113',
    doorX: 43,
  },
  {
    id: 'b_cs',
    name: 'COLLEGE OF SCIENCE',
    sub: 'East Science Wing & Herbarium',
    elev: 3,
    x: 50,
    y: 15,
    w: 7,
    d: 3,
    h: 3.0,
    wallColor: '#f2e8d5',
    roofColor: '#7b1113',
    doorX: 53,
  },
];

export const NPCS = [
  {
    id: 'prof_dulay',
    name: 'Prof. Mila Dulay',
    role: 'Department of Biology · Project Saleng Lead',
    sprite: 'Princess',
    x: 64,
    y: 34,
    dir: 'down',
  },
  {
    id: 'apo_sabado',
    name: 'Apo Sabado',
    role: 'Ibaloi Community Elder & Forester',
    sprite: 'OldMan3',
    x: 61,
    y: 29,
    dir: 'right',
  },
  {
    id: 'manong_ben',
    name: 'Manong Ben',
    role: 'Oblation Driveway Guard',
    sprite: 'Inspector',
    x: 69,
    y: 40,
    dir: 'left',
  },
  {
    id: 'paolo',
    name: 'Paolo',
    role: 'Dormitory Resident Student',
    sprite: 'Villager5',
    x: 55,
    y: 58,
    dir: 'up',
  },
  {
    id: 'kiko',
    name: 'Kiko',
    role: 'Court A Varsity Basketball Player',
    sprite: 'Boy',
    x: 53,
    y: 30,
    dir: 'left',
  },
  {
    id: 'ate_lorna',
    name: 'Ate Lorna',
    role: 'Balay Panganan Cafeteria Vendor',
    sprite: 'Villager4',
    x: 32,
    y: 12,
    dir: 'down',
  },
  {
    id: 'junjun',
    name: 'Jun-jun',
    role: 'Ate Lorna’s Son',
    sprite: 'Child',
    x: 34,
    y: 12,
    dir: 'left',
  },
  {
    id: 'nurse_ruth',
    name: 'Nurse Ruth',
    role: 'Balay Salun-at (UHS Clinic)',
    sprite: 'Woman',
    x: 41,
    y: 12,
    dir: 'down',
  },
  {
    id: 'curator',
    name: 'Dr. Alangdeo (Curator)',
    role: 'Museo Kordilyera Curator',
    sprite: 'Samurai',
    x: 24,
    y: 20,
    dir: 'down',
  },
  {
    id: 'bea',
    name: 'Bea',
    role: 'UPB Outcrop Student Photographer',
    sprite: 'Village6',
    x: 49,
    y: 13,
    dir: 'down',
  },
];

export const PLANT_NODES = [
  {
    id: 'node_saleng_plaza',
    plantId: 'benguet_pine',
    x: 60,
    y: 27,
    scale: 2.35,
    questHint: 'Heritage Saleng (Benguet Pine) in the UPB Woods beside Oblation Ground (#15)',
  },
  {
    id: 'node_lagundi_dorm',
    plantId: 'lagundi',
    x: 47,
    y: 54,
    scale: 1.5,
    questHint: 'Aromatic 5-leaflet Lagundi shrub in the Open Area beside the Dormitory',
  },
  {
    id: 'node_sambong_cs',
    plantId: 'sambong',
    x: 56,
    y: 13,
    scale: 1.5,
    questHint: 'Camphor-scented Sambong herb on the Summit KA / College of Science Quad (#12)',
  },
  {
    id: 'node_tsaang_gubat_canteen',
    plantId: 'tsaang_gubat',
    x: 28,
    y: 12,
    scale: 1.45,
    questHint: 'Glossy Tsaang Gubat shrub by Balay Panganan (Cafeteria #13) & Alum Lobby',
  },
  {
    id: 'node_takip_kuhol_court',
    plantId: 'takip_kuhol',
    x: 54,
    y: 27,
    scale: 1.3,
    questHint: 'Low fan-leaved Takip-kuhol along the Open Court (Court A #21) drain',
  },
  {
    id: 'node_benguet_lily_hill',
    plantId: 'benguet_lily',
    x: 15,
    y: 17,
    scale: 1.55,
    questHint: 'Endemic white Benguet Lily in the Woods behind CSS (#3) & Museo Kordilyera',
  },
  {
    id: 'node_tree_fern_seep',
    plantId: 'tree_fern',
    x: 63,
    y: 18,
    scale: 2.25,
    questHint: 'Protected Tibanglan Tree Fern along the Lower KA / Biodiversity slope (#14)',
  },
  {
    id: 'node_sunflower_terrace',
    plantId: 'mexican_sunflower',
    x: 47,
    y: 13,
    scale: 1.6,
    questHint: 'Blooming Mirassol (Mexican Sunflower) on the Kolehiyo ng Agham Quad (#12)',
  },
  {
    id: 'node_sapinit_hill',
    plantId: 'sapinit',
    x: 15,
    y: 41,
    scale: 1.45,
    questHint: 'Wild Sapinit raspberry bramble near CAC Dap-ay (#6) & Former Court B (#5)',
  },
];

export const SIGNS = [
  {
    x: 67,
    y: 35,
    title: 'Oblation Ground & Driveway (Elev 0)',
    text: 'Welcome to UP Baguio! Look up the terraced hill: Level 1 (Driveway/CAC), Level 2 (Open Court A & Library), and Level 3 Summit (IB, KA, CS, Balay Panganan, Balay Salun-at & Museo Kordilyera).',
  },
  {
    x: 54,
    y: 32,
    title: 'Open Court A (#21) & Inang Laya Steps (#20)',
    text: 'Middle Terrace (Elevation 2). West ← : UPB Library (#7), Bulwagang Juan Luna & CSS (#4).\nNorth ↑ : Climb the Court A Steps (#20) to the Summit Crown (Elevation 3)!',
  },
  {
    x: 43,
    y: 20,
    title: 'Inang Laya Grounds (#18) & IB Lobby (#11)',
    text: 'Summit Plateau (Elevation 3). North ↑ : Balay Panganan (Cafeteria #13), Balay Salun-at (UHS), and Kolehiyo ng Agham (#12).\nWest ← : Institute of Management & Museo Kordilyera (#9).',
  },
  {
    x: 27,
    y: 42,
    title: 'Four Pillars, CAC (#6) & Teatro Amianan',
    text: 'Southwest Terrace (Elevation 1). Home of the College of Arts and Communication, CAC Dap-ay, and Napoleon Abueva’s Four Pillars.',
  },
  {
    x: 52,
    y: 49,
    title: 'South Dormitory Compound & Open Area',
    text: 'Government Center Road Annex (Elevation 0): Ladies Dormitory (Breha), Walk-up Apartment, and Power Substation.',
  },
];

export function createCampusMap() {
  const tiles = [];

  // Expanded 80x64 concentric elevation contours:
  //   Level 3 (Summit Crown): x=19..59, y=6..21
  //   Level 2 (Middle Ring):  x=12..56, y=5..39 (surrounding Level 3)
  //   Level 1 (Outer Ring):   x=8..74,  y=3..49 (surrounding Level 2, excluding SE Oblation cutout)
  //   Level 0 (Base Ground):  Oblation Ground (SE), Fil-Jap Park (SW), Gov Pack Rd (W), Dormitory Compound (S)
  function computeBaseElevation(x, y) {
    // Cutout for Oblation Ground & SE Driveway at Level 0
    if (x >= 59 && y >= 26) {
      return 0;
    }

    // Level 3 Summit Plateau
    if (x >= 19 && x <= 59 && y >= 6 && y <= 21) {
      return 3;
    }

    // Level 2 Middle Ring (CSS, Library, Cultural Hub, Open Court A)
    if (x >= 12 && x <= 56 && y >= 5 && y <= 39) {
      return 2;
    }

    // Level 1 Outer Ring (CAC, Teatro Amianan, Himnasyo Amianan, Biodiversity Center, Upper Driveway)
    if (x >= 8 && x <= 74 && y >= 3 && y <= 49) {
      if (x <= 48 || y <= 39) {
        return 1;
      }
    }

    return 0;
  }

  for (let y = 0; y < MAP_H; y += 1) {
    const row = [];
    for (let x = 0; x < MAP_W; x += 1) {
      const elev = computeBaseElevation(x, y);
      row.push({
        x,
        y,
        elev,
        type: 'grass',
        solid: false,
        stairDir: null,
        zone: getZoneName(x, y, elev),
      });
    }
    tiles.push(row);
  }

  const setTile = (x, y, patch) => {
    if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) {
      Object.assign(tiles[y][x], patch);
      tiles[y][x].zone = getZoneName(x, y, tiles[y][x].elev);
    }
  };

  const fillRect = (x0, y0, x1, y1, patch) => {
    for (let y = y0; y <= y1; y += 1) {
      for (let x = x0; x <= x1; x += 1) {
        setTile(x, y, patch);
      }
    }
  };

  // 1. Roads framing the campus (Governor Pack Rd on West, Harrison Rd on NE, Government Center Rd on South)
  fillRect(0, 0, 3, MAP_H - 1, { type: 'road', solid: true, elev: 0 }); // Governor Pack Road
  fillRect(70, 0, MAP_W - 1, 4, { type: 'road', solid: true, elev: 0 }); // Harrison Road NE
  fillRect(4, 60, 46, 63, { type: 'road', solid: true, elev: 0 }); // Government Center Road South

  // Outer boundaries solid
  for (let y = 0; y < MAP_H; y += 1) {
    setTile(0, y, { solid: true });
    setTile(MAP_W - 1, y, { solid: true });
  }
  for (let x = 0; x < MAP_W; x += 1) {
    setTile(x, 0, { solid: true });
    setTile(x, MAP_H - 1, { solid: true });
  }

  // 2. Oblation Ground & V-Driveway (SE, Level 0: x=60..69, y=30..40)
  fillRect(60, 30, 69, 40, { type: 'plaza', elev: 0, solid: false });
  // Oblation Statue Pedestal at (64..65, 32)
  fillRect(64, 32, 65, 32, { type: 'plaza', elev: 0, solid: true });

  // Wide walkway from Oblation Ground South to Government Center Rd & Dormitory Compound (Level 0)
  fillRect(55, 40, 64, 46, { type: 'path', elev: 0, solid: false });
  fillRect(53, 46, 58, 59, { type: 'path', elev: 0, solid: false });

  // Fil-Jap Friendship Park (SW triangle, Level 0)
  fillRect(6, 51, 18, 57, { type: 'plaza', elev: 0, solid: false });

  // 3. Stair Transitions Between the 4 Concentric Elevation Rings (Wide 3-tile staircases!)
  // --- STAIR A (Level 0 -> Level 1): Driveway Steps West of Oblation Ground at x=56..58, y=40 ---
  fillRect(56, 41, 61, 43, { type: 'path', elev: 0, solid: false });
  fillRect(56, 40, 58, 40, { type: 'stair', elev: 0.5, stairDir: 'north', solid: false });
  fillRect(49, 36, 58, 39, { type: 'path', elev: 1, solid: false });

  // --- STAIR B (Level 0 -> Level 1): South CAC Gate Steps at x=30..32, y=50 ---
  fillRect(30, 51, 56, 53, { type: 'path', elev: 0, solid: false }); // Connects Dormitory & CAC South Gate
  fillRect(30, 50, 32, 50, { type: 'stair', elev: 0.5, stairDir: 'north', solid: false });
  fillRect(18, 41, 43, 43, { type: 'path', elev: 1, solid: false }); // Wide CAC & Teatro promenade
  fillRect(30, 43, 32, 49, { type: 'path', elev: 1, solid: false });

  // --- STAIR C (Level 1 -> Level 2): Driveway to Open Court A at x=50..52, y=39 ---
  fillRect(50, 40, 55, 40, { type: 'path', elev: 1, solid: false });
  fillRect(50, 39, 52, 39, { type: 'stair', elev: 1.5, stairDir: 'north', solid: false });

  // --- STAIR D (Level 1 -> Level 2): Southwest CAC-to-Library/CSS Steps at x=24..26, y=39 ---
  fillRect(24, 40, 26, 41, { type: 'path', elev: 1, solid: false });
  fillRect(24, 39, 26, 39, { type: 'stair', elev: 1.5, stairDir: 'north', solid: false });

  // 4. Level 2 Wide Paths & Open Court (Court A #21)
  // Open Court A at x=43..51, y=26..34
  fillRect(43, 26, 51, 34, { type: 'court', elev: 2, solid: false });
  // Level 2 Wide Academic Corridors connecting CSS, Bulwagang Juan Luna, Library, and Open Court A
  fillRect(15, 32, 27, 36, { type: 'path', elev: 2, solid: false });
  fillRect(24, 28, 54, 31, { type: 'path', elev: 2, solid: false });
  fillRect(40, 31, 54, 38, { type: 'path', elev: 2, solid: false });

  // --- STAIR E (Level 2 -> Level 3 Summit): Court A Steps (#20) / Inang Laya Steps at x=42..44, y=21 ---
  fillRect(42, 22, 44, 28, { type: 'path', elev: 2, solid: false });
  fillRect(42, 21, 44, 21, { type: 'stair', elev: 2.5, stairDir: 'north', solid: false });

  // --- STAIR F (Level 2 -> Level 3 Summit): West Museo Kordilyera Steps at x=23..25, y=21 ---
  fillRect(23, 22, 25, 28, { type: 'path', elev: 2, solid: false });
  fillRect(23, 21, 25, 21, { type: 'stair', elev: 2.5, stairDir: 'north', solid: false });

  // 5. Level 3 Summit Plateau Spacious Promenades (IB Parking, KA Quad, Balay Panganan, UHS, Museo, Alumni Ctr)
  fillRect(20, 19, 57, 20, { type: 'path', elev: 3, solid: false }); // South Summit Rim Promenade
  fillRect(21, 12, 57, 14, { type: 'path', elev: 3, solid: false }); // Wide Central Summit Quad (3 tiles deep!)
  fillRect(28, 12, 29, 20, { type: 'path', elev: 3, solid: false }); // Museo / IM avenue
  fillRect(37, 12, 38, 20, { type: 'path', elev: 3, solid: false }); // IM / IB avenue
  fillRect(48, 12, 49, 20, { type: 'path', elev: 3, solid: false }); // IB / CS KA Quad avenue

  // --- STAIR G (Level 1 -> Level 2 NE): Trail from Himnasyo Amianan & Biodiversity Center up to Level 2 at x=54..55, y=24 ---
  fillRect(54, 25, 55, 28, { type: 'path', elev: 2, solid: false });
  fillRect(54, 24, 55, 24, { type: 'stair', elev: 1.5, stairDir: 'south', solid: false });
  fillRect(54, 8, 61, 23, { type: 'path', elev: 1, solid: false }); // Wide NE Level 1 trail to Himnasyo & Biodiversity

  // 6. Tall Grass Patches (Wild Flora Encounters in authentic green zones)
  fillRect(14, 14, 17, 20, { type: 'tall_grass', elev: 2 }); // #3 Woods behind CSS
  fillRect(58, 23, 61, 25, { type: 'tall_grass', elev: 1 }); // #15 UPB Woods above Oblation
  fillRect(45, 53, 50, 57, { type: 'tall_grass', elev: 0 }); // Dormitory Open Area
  fillRect(63, 17, 68, 21, { type: 'tall_grass', elev: 1 }); // #14 Lower KA / Biodiversity slope

  // 7. Stamp Building Footprints AND a 1-tile foundation apron around each building to its exact `b.elev`
  // so no building ever straddles a cliff edge or floats!
  for (const b of BUILDINGS) {
    for (let y = b.y - 1; y <= b.y + b.d; y += 1) {
      for (let x = b.x - 1; x <= b.x + b.w; x += 1) {
        const t = tiles[y]?.[x];
        if (t && t.type !== 'stair') {
          t.elev = b.elev;
        }
      }
    }
    for (let y = b.y; y < b.y + b.d; y += 1) {
      for (let x = b.x; x < b.x + b.w; x += 1) {
        setTile(x, y, { elev: b.elev, solid: true });
      }
    }
  }

  // 8. Decorative Cordillera Pines, Sunflowers, and Benches
  const props = [];
  const addProp = (kind, x, y) => {
    const t = tiles[y]?.[x];
    if (t && !t.solid && t.type !== 'stair') {
      if (kind === 'pine' || kind === 'bench') {
        t.solid = true;
      }
      props.push({ kind, x, y, elev: t.elev });
    }
  };

  // Pine trees in UPB Woods (#15), Woods behind CSS (#3), Sunshine Park, and Dormitory Open Area
  const pineCoords = [
    [13, 11], [16, 10], [13, 22], [15, 24], // Woods behind CSS (#3)
    [59, 28], [63, 25], [66, 26], [68, 28], // UPB Woods (#15) & Grounds beside Court A (#17)
    [48, 3], [64, 6], [69, 9], [71, 18], // Sunshine Park & NE woods
    [10, 45], [15, 48], [10, 53], // Fil-Jap Friendship Park pines
    [45, 50], [48, 58], [66, 55], // Dormitory Open Area pines
    [35, 6], [57, 6], // Summit northern rim pines
  ];
  for (const [x, y] of pineCoords) addProp('pine', x, y);

  // Wild Baguio Sunflowers along terrace edges
  const sunflowerCoords = [
    [46, 13], [52, 13], [40, 22], [53, 28], [61, 32], [22, 40], [50, 54],
  ];
  for (const [x, y] of sunflowerCoords) addProp('sunflower_deco', x, y);

  // Campus Tambayan Benches
  const benchCoords = [
    [62, 36], [67, 36], // Oblation Plaza benches
    [40, 32], [40, 35], // Library & Court A benches
    [36, 19], [46, 19], // Summit IB & KA Quad benches
  ];
  for (const [x, y] of benchCoords) addProp('bench', x, y);

  // Mark Signs, Plant Nodes, and NPCs solid
  for (const s of SIGNS) setTile(s.x, s.y, { solid: true });
  for (const p of PLANT_NODES) setTile(p.x, p.y, { solid: true });
  for (const n of NPCS) setTile(n.x, n.y, { solid: true });

  function tileAt(x, y) {
    if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return null;
    return tiles[y][x];
  }

  function canStep(fromX, fromY, toX, toY) {
    const a = tileAt(fromX, fromY);
    const b = tileAt(toX, toY);
    if (!a || !b || b.solid) return false;
    if (a.type === 'stair' || b.type === 'stair') {
      return Math.abs(a.elev - b.elev) <= 1.01;
    }
    return Math.abs(a.elev - b.elev) < 0.1;
  }

  return {
    w: MAP_W,
    h: MAP_H,
    tiles,
    props,
    spawn: { x: 64, y: 37, dir: 'up' },
    tileAt,
    canStep,
  };
}

function getZoneName(x, y, elev) {
  const e = Math.round(elev);
  if (y >= 46 && x >= 45) return 'South Annex · Ladies Dormitory & Open Area (Elev 0)';
  if (x >= 59 && y >= 26) return 'Oblation Ground & Driveway Entrance (Elev 0)';
  if (x <= 19 && y >= 48) return 'Fil-Jap Friendship Park · Gov. Pack Rd (Elev 0)';
  if (e === 3) {
    if (x <= 28) return 'Summit West · Museo Kordilyera & Alumni Ctr (Elev 3)';
    if (y <= 13) return 'Summit North · Balay Panganan, UHS & KA (Elev 3)';
    return 'Summit Crown · Iskolar ng Bayan, IM & CS (Elev 3)';
  }
  if (e === 2) {
    if (x >= 41) return 'Middle Terrace · Open Court A & Steps (Elev 2)';
    if (y >= 32) return 'Middle Terrace · UPB Library & Archives (Elev 2)';
    return 'Middle Terrace · CSS & Bulwagang Juan Luna (Elev 2)';
  }
  if (e === 1) {
    if (x >= 50 && y <= 24) return 'NE Terrace · Himnasyo Amianan & Biodiversity Ctr (Elev 1)';
    if (x >= 48) return 'Upper Driveway & UPB Woods (Elev 1)';
    return 'SW Terrace · CAC Dap-ay & Teatro Amianan (Elev 1)';
  }
  return 'UP Baguio Perimeter · Governor Pack Road (Elev 0)';
}
