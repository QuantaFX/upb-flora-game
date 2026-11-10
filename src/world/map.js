// Authentic UP Baguio Concentric Hilltop Map (52x42 tiles, 4 elevation levels: 0..3)
// Modeled directly after the UP Baguio Emergency Evacuation Plan (with elevation contour rings)
// and the Outcrop "21 Democratic Spaces" 3D campus map.
//
// Orientation (North = Up, y=0; South = Down, y=41):
//   - West border: Governor Pack Road
//   - Northeast border: Harrison Road / Sunshine Park / HK / Himnasyo Amianan / Biodiversity Center
//   - Southeast entrance: Oblation Ground & V-shaped Driveway off Government Center Road
//   - South Annex: Ladies Dormitory (Breha), Walk-up Apartment, Power Substation
//   - Level 1 Ring (Outer/Lower Terrace): CAC, Teatro Amianan, Four Pillars, Himnasyo Amianan, Biodiversity Center
//   - Level 2 Ring (Middle Terrace): CSS, UPB Library, Cultural Hub (Bulwagang Juan Luna), Open Court (Court A)
//   - Level 3 Crown (Summit Plateau): Student Alumni Center, Balay Panganan (Cafeteria), Balay Salun-at (UHS),
//     Museo Kordilyera, Isabelo delos Reyes (IM), Iskolar ng Bayan (IB) Building, Kolehiyo ng Agham (KA),
//     Science Research Center (SRC), and College of Science (CS).

export const MAP_W = 52;
export const MAP_H = 42;

export const BUILDINGS = [
  // --- LEVEL 0 (Outer / Lower Perimeter & South Dormitory Compound) ---
  {
    id: 'b_dorm',
    name: 'LADIES DORMITORY',
    sub: 'Breha Residence Hall',
    x: 35,
    y: 34,
    w: 5,
    d: 3,
    h: 2.5,
    wallColor: '#e9d696',
    roofColor: '#8d5b28',
    doorX: 37,
  },
  {
    id: 'b_walkup',
    name: 'WALK-UP APARTMENT',
    sub: 'Faculty & Student Housing',
    x: 41,
    y: 31,
    w: 5,
    d: 3,
    h: 2.5,
    wallColor: '#e9d696',
    roofColor: '#8d5b28',
    doorX: 43,
  },
  {
    id: 'b_guard',
    name: 'GUARDHOUSE · OBLATION GATE',
    sub: 'Driveway Entrance',
    x: 46,
    y: 25,
    w: 3,
    d: 2,
    h: 2.0,
    wallColor: '#eadbc2',
    roofColor: '#7b1113',
    doorX: 47,
  },

  // --- LEVEL 1 (Lower Concentric Terrace Ring) ---
  {
    id: 'b_cac',
    name: 'ARTS & COMMUNICATION (CAC)',
    sub: 'CAC Dap-ay & Four Pillars',
    x: 15,
    y: 28,
    w: 8,
    d: 3,
    h: 2.6,
    wallColor: '#b9c0d8',
    roofColor: '#4c5778',
    doorX: 18,
  },
  {
    id: 'b_teatro',
    name: 'TEATRO AMIANAN',
    sub: 'Performing Arts Hall',
    x: 24,
    y: 28,
    w: 5,
    d: 3,
    h: 2.6,
    wallColor: '#d99e82',
    roofColor: '#8c3b2b',
    doorX: 26,
  },
  {
    id: 'b_himnasyo',
    name: 'HIMNASYO AMIANAN & HK',
    sub: 'Human Kinetics Program',
    x: 34,
    y: 3,
    w: 6,
    d: 3,
    h: 2.6,
    wallColor: '#dcd299',
    roofColor: '#5c6632',
    doorX: 36,
  },
  {
    id: 'b_biodiv',
    name: 'BIODIVERSITY RESEARCH CTR',
    sub: 'Innovation & Biodiversity',
    x: 41,
    y: 8,
    w: 7,
    d: 3,
    h: 2.5,
    wallColor: '#c8ccd0',
    roofColor: '#4a555e',
    doorX: 44,
  },

  // --- LEVEL 2 (Middle Concentric Terrace Ring) ---
  {
    id: 'b_css',
    name: 'COLLEGE OF SOCIAL SCIENCES',
    sub: 'CSS & Cordillera Studies Ctr',
    x: 11,
    y: 19,
    w: 6,
    d: 3,
    h: 2.8,
    wallColor: '#b6bed8',
    roofColor: '#465170',
    doorX: 13,
  },
  {
    id: 'b_library',
    name: 'UP BAGUIO LIBRARY',
    sub: 'University Library & Archives',
    x: 20,
    y: 22,
    w: 8,
    d: 3,
    h: 2.9,
    wallColor: '#d8a58e',
    roofColor: '#7b1113',
    doorX: 23,
  },
  {
    id: 'b_juanluna',
    name: 'BULWAGANG JUAN LUNA',
    sub: 'Cultural Hub & Auditorium',
    x: 18,
    y: 16,
    w: 8,
    d: 2,
    h: 2.6,
    wallColor: '#bdbdbd',
    roofColor: '#525252',
    doorX: 21,
  },

  // --- LEVEL 3 (Summit Crown Plateau — Highest Elevation) ---
  {
    id: 'b_alumni',
    name: 'STUDENT ALUMNI CENTER',
    sub: 'Alum Lobby & CL Office',
    x: 15,
    y: 8,
    w: 4,
    d: 2,
    h: 2.5,
    wallColor: '#d5dde6',
    roofColor: '#4c6278',
    doorX: 16,
  },
  {
    id: 'b_canteen',
    name: 'BALAY PANGANAN',
    sub: 'UPB Cafeteria',
    x: 20,
    y: 6,
    w: 5,
    d: 2,
    h: 2.3,
    wallColor: '#f3e5cc',
    roofColor: '#a63429',
    doorX: 22,
  },
  {
    id: 'b_uhs',
    name: 'BALAY SALUN-AT (UHS)',
    sub: 'University Health Service',
    x: 26,
    y: 6,
    w: 4,
    d: 2,
    h: 2.3,
    wallColor: '#e8f4ea',
    roofColor: '#2d6e46',
    doorX: 27,
  },
  {
    id: 'b_ka',
    name: 'KOLEHIYO NG AGHAM (KA)',
    sub: 'Science Research Center',
    x: 31,
    y: 6,
    w: 7,
    d: 2,
    h: 2.9,
    wallColor: '#dce4ec',
    roofColor: '#7b1113',
    doorX: 34,
  },
  {
    id: 'b_museo',
    name: 'MUSEO KORDILYERA',
    sub: 'Ethnographic Museum',
    x: 16,
    y: 11,
    w: 4,
    d: 2,
    h: 2.9,
    wallColor: '#d9c5a9',
    roofColor: '#3e2515',
    doorX: 17,
  },
  {
    id: 'b_im',
    name: 'INSTITUTE OF MANAGEMENT',
    sub: 'Isabelo delos Reyes Bldg',
    x: 21,
    y: 9,
    w: 5,
    d: 2,
    h: 2.8,
    wallColor: '#dce3ec',
    roofColor: '#546880',
    doorX: 23,
  },
  {
    id: 'b_ib',
    name: 'ISKOLAR NG BAYAN BLDG',
    sub: 'IB Lobby & Inang Laya',
    x: 27,
    y: 10,
    w: 7,
    d: 2,
    h: 2.9,
    wallColor: '#e4eaf0',
    roofColor: '#7b1113',
    doorX: 30,
  },
  {
    id: 'b_cs',
    name: 'COLLEGE OF SCIENCE',
    sub: 'East Science Wing & Herbarium',
    x: 35,
    y: 10,
    w: 5,
    d: 2,
    h: 2.9,
    wallColor: '#f2e8d5',
    roofColor: '#7b1113',
    doorX: 37,
  },
];

export const NPCS = [
  {
    id: 'prof_dulay',
    name: 'Prof. Mila Dulay',
    role: 'Department of Biology · Project Saleng Lead',
    sprite: 'Princess',
    x: 42,
    y: 22,
    dir: 'down',
  },
  {
    id: 'apo_sabado',
    name: 'Apo Sabado',
    role: 'Ibaloi Community Elder & Forester',
    sprite: 'OldMan3',
    x: 40,
    y: 19,
    dir: 'right',
  },
  {
    id: 'manong_ben',
    name: 'Manong Ben',
    role: 'Oblation Driveway Guard',
    sprite: 'Inspector',
    x: 45,
    y: 26,
    dir: 'left',
  },
  {
    id: 'paolo',
    name: 'Paolo',
    role: 'Dormitory Resident Student',
    sprite: 'Villager5',
    x: 37,
    y: 38,
    dir: 'up',
  },
  {
    id: 'kiko',
    name: 'Kiko',
    role: 'Court A Varsity Basketball Player',
    sprite: 'Boy',
    x: 35,
    y: 20,
    dir: 'left',
  },
  {
    id: 'ate_lorna',
    name: 'Ate Lorna',
    role: 'Balay Panganan Cafeteria Vendor',
    sprite: 'Villager4',
    x: 22,
    y: 8,
    dir: 'down',
  },
  {
    id: 'junjun',
    name: 'Jun-jun',
    role: 'Ate Lorna’s Son',
    sprite: 'Child',
    x: 23,
    y: 8,
    dir: 'left',
  },
  {
    id: 'nurse_ruth',
    name: 'Nurse Ruth',
    role: 'Balay Salun-at (UHS Clinic)',
    sprite: 'Woman',
    x: 28,
    y: 8,
    dir: 'down',
  },
  {
    id: 'curator',
    name: 'Dr. Alangdeo (Curator)',
    role: 'Museo Kordilyera Curator',
    sprite: 'Samurai',
    x: 18,
    y: 13,
    dir: 'down',
  },
  {
    id: 'bea',
    name: 'Bea',
    role: 'UPB Outcrop Student Photographer',
    sprite: 'Village6',
    x: 34,
    y: 9,
    dir: 'down',
  },
];

export const PLANT_NODES = [
  {
    id: 'node_saleng_plaza',
    plantId: 'benguet_pine',
    x: 39,
    y: 18,
    scale: 2.3,
    questHint: 'Heritage Saleng (Benguet Pine) in the UPB Woods beside Oblation Ground (#15)',
  },
  {
    id: 'node_lagundi_dorm',
    plantId: 'lagundi',
    x: 32,
    y: 35,
    scale: 1.45,
    questHint: 'Aromatic 5-leaflet Lagundi shrub in the Open Area beside the Dormitory',
  },
  {
    id: 'node_sambong_cs',
    plantId: 'sambong',
    x: 39,
    y: 9,
    scale: 1.45,
    questHint: 'Camphor-scented Sambong herb on the Summit KA / College of Science Quad (#12)',
  },
  {
    id: 'node_tsaang_gubat_canteen',
    plantId: 'tsaang_gubat',
    x: 19,
    y: 7,
    scale: 1.4,
    questHint: 'Glossy Tsaang Gubat shrub by Balay Panganan (Cafeteria #13) & Alum Lobby',
  },
  {
    id: 'node_takip_kuhol_court',
    plantId: 'takip_kuhol',
    x: 36,
    y: 18,
    scale: 1.25,
    questHint: 'Low fan-leaved Takip-kuhol along the Open Court (Court A #21) drain',
  },
  {
    id: 'node_benguet_lily_hill',
    plantId: 'benguet_lily',
    x: 10,
    y: 11,
    scale: 1.5,
    questHint: 'Endemic white Benguet Lily in the Woods behind CSS (#3) & Museo Kordilyera',
  },
  {
    id: 'node_tree_fern_seep',
    plantId: 'tree_fern',
    x: 41,
    y: 13,
    scale: 2.2,
    questHint: 'Protected Tibanglan Tree Fern along the Lower KA / Biodiversity slope (#14)',
  },
  {
    id: 'node_sunflower_terrace',
    plantId: 'mexican_sunflower',
    x: 33,
    y: 9,
    scale: 1.55,
    questHint: 'Blooming Mirassol (Mexican Sunflower) on the Kolehiyo ng Agham Quad (#12)',
  },
  {
    id: 'node_sapinit_hill',
    plantId: 'sapinit',
    x: 11,
    y: 26,
    scale: 1.4,
    questHint: 'Wild Sapinit raspberry bramble near CAC Dap-ay (#6) & Former Court B (#5)',
  },
];

export const SIGNS = [
  {
    x: 44,
    y: 23,
    title: 'Oblation Ground & Driveway (Elev 0)',
    text: 'Welcome to UP Baguio! Look up the terraced hill: Level 1 (Driveway/CAC), Level 2 (Open Court A & Library), and Level 3 Summit (IB, KA, CS, Balay Panganan, Balay Salun-at & Museo Kordilyera).',
  },
  {
    x: 36,
    y: 21,
    title: 'Open Court A (#21) & Inang Laya Steps (#20)',
    text: 'Middle Terrace (Elevation 2). West ← : UPB Library (#7), Bulwagang Juan Luna & CSS (#4).\nNorth ↑ : Climb the Court A Steps (#20) to the Summit Crown (Elevation 3)!',
  },
  {
    x: 29,
    y: 13,
    title: 'Inang Laya Grounds (#18) & IB Lobby (#11)',
    text: 'Summit Plateau (Elevation 3). North ↑ : Balay Panganan (Cafeteria #13), Balay Salun-at (UHS), and Kolehiyo ng Agham (#12).\nWest ← : Institute of Management & Museo Kordilyera (#9).',
  },
  {
    x: 19,
    y: 26,
    title: 'Four Pillars, CAC (#6) & Teatro Amianan',
    text: 'Southwest Terrace (Elevation 1). Home of the College of Arts and Communication, CAC Dap-ay, and Napoleon Abueva’s Four Pillars.',
  },
  {
    x: 35,
    y: 32,
    title: 'South Dormitory Compound & Open Area',
    text: 'Government Center Road Annex (Elevation 0): Ladies Dormitory (Breha), Walk-up Apartment, and Power Substation.',
  },
];

export function createCampusMap() {
  const tiles = [];

  // Concentric elevation assignment matching the black contour lines in the Evacuation Plan:
  //   Level 3 (Summit Crown): x=14..40, y=5..13
  //   Level 2 (Middle Ring):  x=9..37,  y=4..25 (surrounding Level 3)
  //   Level 1 (Outer Ring):   x=6..48,  y=2..31 (surrounding Level 2, excluding SE Oblation cutout)
  //   Level 0 (Base Ground):  Oblation Ground (SE), Fil-Jap Park (SW), Gov Pack Rd (W), Dormitory Compound (S)
  function computeBaseElevation(x, y) {
    // Cutout for Oblation Ground & SE Driveway at Level 0
    if (x >= 39 && y >= 18) {
      if (x + y >= 61) return 0;
    }

    // Level 3 Summit Plateau
    if (x >= 14 && x <= 40 && y >= 5 && y <= 13) {
      // Taper corners slightly like the octagonal contour
      if (x + y >= 21 && (40 - x) + y >= 7) {
        return 3;
      }
    }

    // Level 2 Middle Ring (CSS, Library, Cultural Hub, Open Court A)
    if (x >= 9 && x <= 37 && y >= 4 && y <= 25) {
      if (x + y >= 16 && (37 - x) + (25 - y) >= 3) {
        return 2;
      }
    }

    // Level 1 Outer Ring (CAC, Teatro Amianan, Himnasyo Amianan, Biodiversity Center, Upper Driveway)
    if (x >= 6 && x <= 48 && y >= 2 && y <= 31) {
      if (x + y >= 13 && (x <= 32 || y <= 22)) {
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
        type: 'grass', // grass | path | plaza | court | road | stair | tall_grass
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

  // 1. Roads framing the campus (Governor Pack Rd on West, Harrison Rd on NE, Government Center Rd on South/SE)
  fillRect(0, 0, 2, MAP_H - 1, { type: 'road', solid: true, elev: 0 }); // Governor Pack Road
  fillRect(46, 0, MAP_W - 1, 3, { type: 'road', solid: true, elev: 0 }); // Harrison Road NE
  fillRect(3, 39, 30, 41, { type: 'road', solid: true, elev: 0 }); // Government Center Road South

  // Outer boundaries solid
  for (let y = 0; y < MAP_H; y += 1) {
    setTile(0, y, { solid: true });
    setTile(MAP_W - 1, y, { solid: true });
  }
  for (let x = 0; x < MAP_W; x += 1) {
    setTile(x, 0, { solid: true });
    setTile(x, MAP_H - 1, { solid: true });
  }

  // 2. Oblation Ground & V-Driveway (SE, Level 0: x=40..46, y=20..26)
  fillRect(40, 20, 45, 26, { type: 'plaza', elev: 0, solid: false });
  // Oblation Statue Pedestal at (42..43, 21)
  fillRect(42, 21, 43, 21, { type: 'plaza', elev: 0, solid: true });

  // Walkway from Oblation Ground South to Government Center Rd & Dormitory Compound (Level 0)
  fillRect(37, 26, 42, 30, { type: 'path', elev: 0, solid: false });
  fillRect(36, 30, 39, 38, { type: 'path', elev: 0, solid: false });

  // Fil-Jap Friendship Park (SW triangle, Level 0)
  fillRect(4, 32, 11, 36, { type: 'plaza', elev: 0, solid: false });

  // 3. Stair Transitions Between the 4 Concentric Elevation Rings!
  // --- STAIR A (Level 0 -> Level 1): Driveway Steps South of Oblation Ground at x=37..38, y=26 ---
  fillRect(37, 27, 42, 28, { type: 'path', elev: 0, solid: false });
  fillRect(37, 26, 38, 26, { type: 'stair', elev: 0.5, stairDir: 'north', solid: false });
  fillRect(33, 25, 38, 25, { type: 'path', elev: 1, solid: false });

  // --- STAIR B (Level 0 -> Level 1): South CAC Gate Steps at x=21..22, y=32 ---
  fillRect(21, 32, 22, 32, { type: 'stair', elev: 0.5, stairDir: 'north', solid: false });
  fillRect(21, 33, 37, 34, { type: 'path', elev: 0, solid: false }); // Connects Dormitory & CAC South Gate!
  fillRect(16, 26, 28, 27, { type: 'path', elev: 1, solid: false }); // CAC & Teatro promenade
  fillRect(21, 31, 22, 31, { type: 'path', elev: 1, solid: false });

  // --- STAIR C (Level 1 -> Level 2): Driveway to Open Court A at x=33..34, y=24 ---
  fillRect(33, 24, 34, 24, { type: 'stair', elev: 1.5, stairDir: 'north', solid: false });

  // --- STAIR D (Level 1 -> Level 2): Southwest CAC-to-Library/CSS Steps at x=18..19, y=25 ---
  fillRect(18, 25, 19, 25, { type: 'stair', elev: 1.5, stairDir: 'north', solid: false });

  // 4. Level 2 Paths & Open Court (Court A #21)
  // Open Court A at x=29..34, y=18..23
  fillRect(29, 18, 34, 23, { type: 'court', elev: 2, solid: false });
  // Level 2 Academic Corridor connecting CSS, Bulwagang Juan Luna, Library, and Open Court A
  fillRect(12, 22, 19, 24, { type: 'path', elev: 2, solid: false });
  fillRect(17, 19, 35, 20, { type: 'path', elev: 2, solid: false });
  fillRect(28, 20, 35, 23, { type: 'path', elev: 2, solid: false });

  // --- STAIR E (Level 2 -> Level 3 Summit): Court A Steps (#20) / Inang Laya Steps at x=29..30, y=14 ---
  fillRect(29, 14, 30, 14, { type: 'stair', elev: 2.5, stairDir: 'north', solid: false });
  fillRect(29, 15, 30, 18, { type: 'path', elev: 2, solid: false });

  // --- STAIR F (Level 2 -> Level 3 Summit): West Museo Kordilyera Steps at x=17..18, y=14 ---
  fillRect(17, 14, 18, 14, { type: 'stair', elev: 2.5, stairDir: 'north', solid: false });
  fillRect(17, 15, 18, 15, { type: 'path', elev: 2, solid: false });

  // 5. Level 3 Summit Plateau Paths (IB Parking, KA Quad, Balay Panganan, Balay Salun-at, Museo, Alumni Ctr)
  fillRect(15, 13, 39, 13, { type: 'path', elev: 3, solid: false }); // South Summit Rim Promenade
  fillRect(19, 8, 39, 9, { type: 'path', elev: 3, solid: false }); // North Summit Quad (Cafeteria, UHS, KA, CS)
  fillRect(26, 8, 26, 13, { type: 'path', elev: 3, solid: false }); // IB / IM connector
  fillRect(34, 8, 34, 13, { type: 'path', elev: 3, solid: false }); // KA / CS Quad connector
  fillRect(15, 10, 20, 10, { type: 'path', elev: 3, solid: false }); // Alumni Center to Museo

  // --- STAIR G (Level 1 -> Level 2 NE): Trail from Himnasyo Amianan & Biodiversity Center up to Level 2 at x=36..37, y=17 ---
  fillRect(36, 17, 37, 17, { type: 'stair', elev: 1.5, stairDir: 'south', solid: false });
  fillRect(36, 18, 37, 20, { type: 'path', elev: 2, solid: false });
  fillRect(36, 6, 40, 16, { type: 'path', elev: 1, solid: false }); // NE Level 1 trail to Himnasyo & Biodiversity

  // 6. Tall Grass Patches (Wild Flora Encounters in authentic green zones)
  fillRect(10, 9, 12, 13, { type: 'tall_grass', elev: 2 }); // #3 Woods behind CSS
  fillRect(37, 16, 40, 17, { type: 'tall_grass', elev: 1 }); // #15 UPB Woods above Oblation
  fillRect(31, 35, 34, 37, { type: 'tall_grass', elev: 0 }); // Dormitory Open Area
  fillRect(42, 12, 45, 14, { type: 'tall_grass', elev: 1 }); // #14 Lower KA / Biodiversity slope

  // 7. Stamp Building Footprints as solid
  for (const b of BUILDINGS) {
    for (let y = b.y; y < b.y + b.d; y += 1) {
      for (let x = b.x; x < b.x + b.w; x += 1) {
        setTile(x, y, { solid: true });
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
    [9, 8], [11, 7], [13, 6], [9, 14], [10, 16], // Woods behind CSS (#3)
    [38, 19], [41, 17], [43, 16], [45, 18], // UPB Woods (#15) & Grounds beside Court A (#17)
    [31, 3], [42, 4], [45, 6], [47, 13], // Sunshine Park & NE woods
    [8, 28], [12, 30], [7, 34], // Fil-Jap Friendship Park pines
    [31, 33], [33, 38], [44, 36], // Dormitory Open Area pines
    [25, 5], [39, 5], // Summit northern rim pines
  ];
  for (const [x, y] of pineCoords) addProp('pine', x, y);

  // Wild Baguio Sunflowers along terrace edges
  const sunflowerCoords = [
    [32, 9], [36, 9], [28, 15], [35, 19], [40, 21], [15, 25], [34, 35],
  ];
  for (const [x, y] of sunflowerCoords) addProp('sunflower_deco', x, y);

  // Campus Tambayan Benches
  const benchCoords = [
    [41, 24], [44, 24], // Oblation Plaza benches
    [27, 21], [27, 23], // Library & Court A benches
    [25, 12], [32, 12], // Summit IB & KA Quad benches
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
    spawn: { x: 42, y: 24, dir: 'up' },
    tileAt,
    canStep,
  };
}

function getZoneName(x, y, elev) {
  const e = Math.round(elev);
  if (y >= 31 && x >= 30) return 'South Annex · Ladies Dormitory & Open Area (Elev 0)';
  if (x >= 39 && y >= 18) return 'Oblation Ground & Driveway Entrance (Elev 0)';
  if (x <= 13 && y >= 30) return 'Fil-Jap Friendship Park · Gov. Pack Rd (Elev 0)';
  if (e === 3) {
    if (x <= 20) return 'Summit West · Museo Kordilyera & Alumni Ctr (Elev 3)';
    if (y <= 9) return 'Summit North · Balay Panganan, UHS & KA (Elev 3)';
    return 'Summit Crown · Iskolar ng Bayan, IM & CS (Elev 3)';
  }
  if (e === 2) {
    if (x >= 28) return 'Middle Terrace · Open Court A & Steps (Elev 2)';
    if (y >= 21) return 'Middle Terrace · UPB Library & Archives (Elev 2)';
    return 'Middle Terrace · CSS & Bulwagang Juan Luna (Elev 2)';
  }
  if (e === 1) {
    if (x >= 33 && y <= 16) return 'NE Terrace · Himnasyo Amianan & Biodiversity Ctr (Elev 1)';
    if (x >= 33) return 'Upper Driveway & UPB Woods (Elev 1)';
    return 'SW Terrace · CAC Dap-ay & Teatro Amianan (Elev 1)';
  }
  return 'UP Baguio Perimeter · Governor Pack Road (Elev 0)';
}
