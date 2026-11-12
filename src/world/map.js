// Authentic UP Baguio Campus Map — Strict Orthogonal Grid Edition (80 x 60 tiles)
//
// Directly modeled on the user's strict grid layout + UP Baguio Emergency Evacuation Plan
// and the 21 Democratic Spaces map:
//   - 4 nested rectangular elevation terraces (Elev 0 outer light-green -> Elev 1 -> Elev 2 -> Elev 3 Summit Quad)
//   - North Row (Elev 0): Himnasyo Amianan & HK (left) + Himnasyo Amianan (right),
//     connected by a white horizontal walkway and central stairs climbing south into the Summit Quad.
//   - NW Cluster: Student Alumni Center (#2, Elev 1) with grey courtyard & long west staircase down to CSS (#4),
//     plus east stairs up to Balay Panganan / Cafeteria (#13, Elev 2).
//   - Summit Crown Quad (Elev 3): Institute of Management (#10), Balay Salun-at (UHS), Kolehiyo ng Agham (#12),
//     College of Science, Iskolar ng Bayan Building (#11 & #18), and Museo Kordilyera (#9) around the white central quad.
//   - Open Court A (#21, Elev 0) & North Bleachers/Stage (#20, Elev 1): Lowered by 1 level so the dark-grey
//     basketball court is flush with the South Promenade (Elev 0), flanked by the West Staircase & East Zigzag Staircase.
//   - East Parallel Driveway Corridors: Two horizontal white driveway/stair corridors (y=25..26 and y=32..33)
//     stepping down from Elev 2 -> Elev 1 -> Elev 0, with the UP Oblation Statue right in the middle between the two stairs!
//   - West & South Perimeter (Elev 0): Bulwagang Juan Luna (Elev 1), UPB Library (#7, Elev 0), tall vertical CSS (#4, Elev 0),
//     L-shaped CAC (#6, Elev 0), and Teatro Amianan (Elev 0) connected by the exact stepped white path from the grid diagram.

export const MAP_W = 80;
export const MAP_H = 60;
export const CAMPUS_BOUNDS = { minX: 3, maxX: 78, minY: 2, maxY: 56 };

export function insideCampus(x, y) {
  return x >= CAMPUS_BOUNDS.minX && x <= CAMPUS_BOUNDS.maxX
    && y >= CAMPUS_BOUNDS.minY && y <= CAMPUS_BOUNDS.maxY;
}

// Player starts on the Lower East Driveway Landing (Elev 1), looking straight north at Prof. Barcelo
// and the UP Oblation Statue right in the middle between the two East Driveway staircases!
export const PLAYER_SPAWN = { x: 67, y: 32, dir: 'up' };
// Garden terrace between Iskolar ng Bayan and the court's north bleachers.
export const INANG_LAYA = { x: 43, y: 33 };

export const BUILDINGS = [
  // --- NORTH LOWLAND ROW (Elevation 0 — Sunshine Park / Harrison Rd Edge) ---
  {
    id: 'b_himnasyo',
    name: 'HUMAN KINETICS PROGRAM',
    sub: 'Human Kinetics Program (North Lower Campus)',
    elev: 0,
    x: 38,
    y: 3,
    w: 12,
    d: 5,
    h: 2.8,
    wallColor: '#e2d6b5',
    roofColor: '#8c6d2c',
    doorX: 44,
  },
  {
    id: 'b_gym',
    name: 'HIMNASYO AMIANAN',
    sub: 'Himnasyo Amianan',
    elev: 0,
    x: 52,
    y: 3,
    w: 13,
    d: 7,
    h: 2.8,
    wallColor: '#cfd6dc',
    roofColor: '#4a5866',
    doorX: 58,
  },

  // --- NORTHWEST CLUSTER (Student Alumni Center @ Elev 1, Balay Panganan @ Elev 2) ---
  {
    id: 'b_alumni',
    name: 'STUDENT ALUMNI CENTER',
    sub: 'CL Office (#1) & Alum Lobby (#2)',
    elev: 1,
    x: 16,
    y: 15,
    w: 7,
    d: 5,
    h: 2.6,
    wallColor: '#d5dde6',
    roofColor: '#4c6278',
    doorX: 19,
  },
  {
    id: 'b_canteen',
    name: 'BALAY PANGANAN',
    sub: 'UPB Cafeteria (#13)',
    elev: 3,
    x: 25,
    y: 13,
    w: 6,
    d: 5,
    h: 2.5,
    wallColor: '#f3e5cc',
    roofColor: '#a63429',
    doorX: 28,
  },

  // --- SUMMIT CROWN PLATEAU (Elevation 3 — Main Academic Quad) ---
  {
    id: 'b_im',
    name: 'INSTITUTE OF MANAGEMENT',
    sub: 'Isabelo delos Reyes Bldg (#10)',
    elev: 3,
    x: 26,
    y: 20,
    w: 5,
    d: 3,
    h: 2.8,
    wallColor: '#dce3ec',
    roofColor: '#546880',
    doorX: 28,
  },
  {
    id: 'b_uhs',
    name: 'BALAY SALUN-AT (UHS)',
    sub: 'University Health Service',
    elev: 3,
    x: 32,
    y: 20,
    w: 3,
    d: 2,
    h: 2.4,
    wallColor: '#e8f4ea',
    roofColor: '#2d6e46',
    doorX: 33,
  },
  {
    id: 'b_ka',
    name: 'KOLEHIYO NG AGHAM (KA)',
    sub: 'Science Research Center (#12)',
    elev: 3,
    x: 38,
    y: 17,
    w: 14,
    d: 3,
    h: 3.0,
    wallColor: '#dce4ec',
    roofColor: '#7b1113',
    doorX: 45,
  },
  {
    id: 'b_cs',
    name: 'COLLEGE OF SCIENCE',
    sub: 'East Science Wing & Herbarium',
    elev: 3,
    x: 53,
    y: 20,
    w: 5,
    d: 6,
    h: 3.0,
    wallColor: '#f2e8d5',
    roofColor: '#7b1113',
    doorX: 55,
  },
  {
    id: 'b_ib_north',
    name: 'ISKOLAR NG BAYAN BLDG',
    sub: 'Main Academic Wing (#11)',
    elev: 3,
    x: 36,
    y: 23,
    w: 15,
    d: 3,
    h: 3.1,
    wallColor: '#f3ead8',
    roofColor: '#7b1113',
    doorX: 43,
  },
  {
    id: 'b_ib_west',
    name: 'IB LOBBY',
    sub: 'Southwest Wing (#11)',
    elev: 3,
    x: 33,
    y: 26,
    w: 5,
    d: 4,
    h: 2.9,
    wallColor: '#efe5d2',
    roofColor: '#7b1113',
    doorX: 35,
  },
  {
    id: 'b_museo',
    name: 'MUSEO KORDILYERA',
    sub: 'Ethnographic Museum (#9)',
    elev: 3,
    x: 25,
    y: 26,
    w: 4,
    d: 5,
    h: 2.9,
    wallColor: '#e6ded2',
    roofColor: '#593a28',
    doorX: 27,
  },

  // --- WEST & SOUTH PERIMETER BUILDINGS ---
  {
    id: 'b_juanluna',
    name: 'BULWAGANG JUAN LUNA',
    sub: 'Cultural Hub & Auditorium (#8)',
    elev: 1,
    x: 20,
    y: 33,
    w: 16,
    d: 5,
    h: 2.8,
    wallColor: '#d4d8dc',
    roofColor: '#596068',
    doorX: 28,
  },
  {
    id: 'b_library',
    name: 'UP BAGUIO LIBRARY',
    sub: 'Main University Library (#7)',
    elev: 0,
    x: 20,
    y: 42,
    w: 14,
    d: 6,
    h: 3.0,
    wallColor: '#e5b89b',
    roofColor: '#8c3b2b',
    doorX: 27,
  },
  {
    id: 'b_css',
    name: 'COLLEGE OF SOCIAL SCIENCES',
    sub: 'CSS & Cordillera Studies Center (#4)',
    elev: 0,
    x: 6,
    y: 29,
    w: 8,
    d: 17,
    h: 2.9,
    wallColor: '#c5cde0',
    roofColor: '#485470',
    doorX: 10,
  },
  {
    id: 'b_cac',
    name: 'ARTS & COMMUNICATION (CAC)',
    sub: 'CAC & Dap-ay (#6)',
    elev: 0,
    x: 10,
    y: 51,
    w: 15,
    d: 4,
    h: 2.8,
    wallColor: '#c5cde0',
    roofColor: '#485470',
    doorX: 18,
  },
  {
    id: 'b_cac_wing',
    name: 'CAC WEST WING',
    sub: 'Fine Arts Studio',
    elev: 0,
    x: 10,
    y: 49,
    w: 5,
    d: 2,
    h: 2.8,
    wallColor: '#c5cde0',
    roofColor: '#485470',
    doorX: 12,
    noSign: true,
  },
  {
    id: 'b_teatro',
    name: 'TEATRO AMIANAN',
    sub: 'Performing Arts Hall',
    elev: 0,
    x: 27,
    y: 51,
    w: 11,
    d: 4,
    h: 2.7,
    wallColor: '#d99e82',
    roofColor: '#8c3b2b',
    doorX: 32,
  },
  {
    id: 'b_kiosk',
    name: 'MANANG MANI KIOSK',
    sub: 'Driveway Kiosk (#16)',
    elev: 1,
    x: 66,
    y: 20,
    w: 3,
    d: 3,
    h: 2.1,
    wallColor: '#eadbc2',
    roofColor: '#8d5b28',
    doorX: 67,
  },
  {
    id: 'b_guard',
    name: 'OBLATION GATE GUARDHOUSE',
    sub: 'Main Driveway Entrance',
    elev: 0,
    x: 74,
    y: 20,
    w: 4,
    d: 3,
    h: 2.1,
    wallColor: '#eadbc2',
    roofColor: '#7b1113',
    doorX: 76,
  },
];

export const NPCS = [
  {
    id: 'prof_barcelo',
    name: 'Prof. Racquel Barcelo',
    role: 'Department of Biology · Native Plants Week Lead',
    sprite: 'Princess',
    x: 67,
    y: 30,
    dir: 'down',
  },
  {
    id: 'apo_sabado',
    name: 'Apo Sabado',
    role: 'Ibaloi Community Elder & Forester',
    sprite: 'OldMan3',
    x: 59,
    y: 39,
    dir: 'right',
  },
  {
    id: 'manong_ben',
    name: 'Manong Ben',
    role: 'Oblation Driveway Guard',
    sprite: 'Inspector',
    x: 76,
    y: 24,
    dir: 'down',
  },
  {
    id: 'paolo',
    name: 'Paolo',
    role: 'BA Communication Student · CAC Courtyard',
    sprite: 'Villager5',
    x: 22,
    y: 49,
    dir: 'up',
  },
  {
    id: 'kiko',
    name: 'Kiko',
    role: 'Court A Varsity Basketball Player',
    sprite: 'Boy',
    x: 46,
    y: 40,
    dir: 'up',
  },
  {
    id: 'ate_lorna',
    name: 'Ate Lorna',
    role: 'Balay Panganan Cafeteria Vendor',
    sprite: 'Villager4',
    x: 28,
    y: 19,
    dir: 'down',
  },
  {
    id: 'junjun',
    name: 'Jun-jun',
    role: 'Ate Lorna’s Son',
    sprite: 'Child',
    x: 30,
    y: 19,
    dir: 'left',
  },
  {
    id: 'nurse_ruth',
    name: 'Nurse Ruth',
    role: 'Balay Salun-at (UHS Clinic)',
    sprite: 'Woman',
    x: 34,
    y: 23,
    dir: 'down',
  },
  {
    id: 'curator',
    name: 'Dr. Alangdeo (Curator)',
    role: 'Museo Kordilyera Curator',
    sprite: 'Samurai',
    x: 30,
    y: 29,
    dir: 'down',
  },
  {
    id: 'bea',
    name: 'Bea',
    role: 'UPB Outcrop Student Photographer',
    sprite: 'Village6',
    x: 45,
    y: 21,
    dir: 'down',
  },
];

export const PLANT_NODES = [
  {
    id: 'node_benguet_pine',
    plantId: 'benguet_pine',
    x: 40,
    y: 33,
    scale: 2.35,
    questHint: 'Pine Tree on the left side of Inang Laya',
  },
  {
    id: 'node_tri_vein_fern',
    plantId: 'tri_vein_fern',
    x: 43,
    y: 34,
    scale: 1.2,
    questHint: 'Tri-vein Fern in front of Inang Laya',
  },
  {
    id: 'node_gipas',
    plantId: 'gipas',
    x: 44,
    y: 13,
    scale: 1.5,
    questHint: 'Gipas along the Abortion Stairs between KA and HKP',
  },
  {
    id: 'node_kamantigi',
    plantId: 'kamantigi',
    x: 49,
    y: 12,
    scale: 1.4,
    questHint: 'Kamantigi along the Abortion Stairs',
  },
  {
    id: 'node_fishtail_fern',
    plantId: 'fishtail_fern',
    x: 50,
    y: 14,
    scale: 1.3,
    questHint: 'Fishtail Fern between KA and HKP',
  },
  {
    id: 'node_ti_plant',
    plantId: 'ti_plant',
    x: 66,
    y: 24,
    scale: 1.55,
    questHint: 'Ti Plant along the upper terrace walkway near the Oblation',
  },
  {
    id: 'node_agoho',
    plantId: 'agoho',
    x: 58,
    y: 22,
    scale: 2.6,
    questHint: 'Agoho near the College of Science AVR along the gate pathway',
  },
  {
    id: 'node_dwarf_lilyturf',
    plantId: 'dwarf_lilyturf',
    x: 65,
    y: 28,
    scale: 1.2,
    questHint: 'Dwarf Lilyturf bordering the Oblation Grounds',
  },
  {
    id: 'node_red_lip',
    plantId: 'red_lip',
    x: 69,
    y: 24,
    scale: 1.5,
    questHint: 'Red Lip hedge at the Oblation Plaza driveway',
  },
  {
    id: 'node_gold_dust_croton',
    plantId: 'gold_dust_croton',
    x: 65,
    y: 30,
    scale: 1.45,
    questHint: 'Gold Dust Croton at the Oblation Grounds',
  },
  {
    id: 'node_philippine_azalea',
    plantId: 'philippine_azalea',
    x: 16,
    y: 50,
    scale: 1.5,
    questHint: 'Philippine Azalea near Teatro Amianan and in front of CAC',
  },
  {
    id: 'node_fishbone_fern',
    plantId: 'fishbone_fern',
    x: 38,
    y: 49,
    scale: 1.35,
    questHint: 'Fishbone Fern beside Teatro Amianan',
  },
  {
    id: 'node_agubangbang',
    plantId: 'agubangbang',
    x: 37,
    y: 8,
    scale: 1.55,
    questHint: 'Agubangbang near the Human Kinetics Program (HKP)',
  },
  {
    id: 'node_mayana',
    plantId: 'mayana',
    x: 54,
    y: 15,
    scale: 1.35,
    questHint: 'Mayana at the back of the KA Building',
  },
  {
    id: 'node_ground_orchid',
    plantId: 'ground_orchid',
    x: 35,
    y: 20,
    scale: 1.35,
    questHint: 'Philippine Ground Orchid beside Balay Salun-at (HSO)',
  },
];

export const SIGNS = [
  {
    x: 69,
    y: 28,
    title: 'Oblation Ground (Between East Driveway Stairs · Elev 1)',
    text: 'East Campus Entrance: The UP Oblation stands between the Upper and Lower Driveway stairs. Follow either corridor west to climb into the Summit Quad (Elev 3) or Open Court A (Elev 0).',
  },
  {
    x: 42,
    y: 42,
    title: 'Open Court A (#21 · Elev 0) & Summit Stairs (#20)',
    text: 'North ↑ : Climb the west or east stairs up to the Iskolar ng Bayan & College of Science Summit Quad (Elev 3).\nWest ← : UPB Library (#7), CAC (#6), Teatro Amianan, and CSS (#4).',
  },
  {
    x: 41,
    y: 29,
    title: 'Iskolar ng Bayan Quad & Inang Laya (#18)',
    text: 'Inang Laya stands in the garden terrace south of Iskolar ng Bayan, above the court bleachers. Use the stairs on either side of the court. The pine is to her left; the fern is in front.',
  },
  {
    x: 18,
    y: 23,
    title: 'Student Alumni Center (#2) & CSS Trail',
    text: 'West ← : Step down the west stairs to the College of Social Sciences (CSS #4) and Woods behind CSS (#3).\nEast → : Climb up to Balay Panganan (#13) and the Summit Quad.',
  },
  {
    x: 26,
    y: 49,
    title: 'UPB Library (#7), CAC Dap-ay (#6) & Teatro Promenade',
    text: 'North ↑ : UP Baguio Main Library (#7).\nSouth ↓ : College of Arts & Communication (CAC #6) and Teatro Amianan.\nWest ← : College of Social Sciences (CSS #4).',
  },
];

export function createCampusMap() {
  const tiles = [];

  // Strict Orthogonal Nested Rectangular Terraces:
  //   - Elevation 0 (Outer light green): North row, CSS, Library (lowered to Elev 0), CAC, Teatro, Open Court A floor (lowered to Elev 0), South Promenade
  //   - Elevation 1 (Medium green): Student Alumni Center, Bulwagang Juan Luna, Open Court A North Bleachers, UPB Woods (#15/#17), Oblation Island (x=66..69)
  //   - Elevation 2 (Darker green): Balay Panganan, North KA Rim, Upper Walkway above Court A Bleachers (y=33..35), East CS Spine
  //   - Elevation 3 (Darkest green Summit Crown): x=25..59, y=17..32 (Main Summit Academic Quad)
  function computeGridElevation(x, y) {
    // Open Court A floor (x=39..52, y=38..42) is lowered by 1 level to Elevation 0!
    if (x >= 39 && x <= 52 && y >= 38 && y <= 42) {
      return 0;
    }

    // Open Court A north bleachers/stage (x=39..52, y=36..37) is lowered by 1 level to Elevation 1!
    if (x >= 39 && x <= 52 && y >= 36 && y <= 37) {
      return 1;
    }

    // Balay Panganan / Cafeteria plateau (x=24..34, y=12..17) is placed 1 level higher at Elevation 3!
    if (x >= 24 && x <= 34 && y >= 12 && y <= 17) {
      return 3;
    }

    // Level 3: Summit Crown Quad (IM, Balay Salun-at, KA, CS, IB, Museo Kordilyera)
    if (x >= 25 && x <= 59 && y >= 17 && y <= 32) {
      return 3;
    }

    // Level 2: Upper-Middle Rectangular Terrace (Balay Panganan, North KA Rim, Upper Walkway y=33..35, East CS Spine)
    if (x >= 25 && x <= 61 && y >= 13 && y <= 35) {
      return 2;
    }

    // Library (x=20..33, y=42..47) and its east/south walkways are lowered by 1 level to Elevation 0!
    if (x >= 19 && x <= 38 && y >= 41) {
      return 0;
    }

    // Level 1: Outer-Middle Rectangular Terrace (Alumni Center, Bulwagang Juan Luna, UPB Woods #15/#17, Oblation Island)
    if (x >= 15 && x <= 69 && y >= 10 && y <= 42) {
      return 1;
    }

    return 0;
  }

  for (let y = 0; y < MAP_H; y += 1) {
    const row = [];
    for (let x = 0; x < MAP_W; x += 1) {
      const elev = computeGridElevation(x, y);
      row.push({
        x,
        y,
        elev,
        type: 'grass', // grass | path | plaza | court | court_stage | road | stair | tall_grass
        solid: false,
        stairDir: null,
        zone: getZoneName(x, y, elev),
      });
    }
    tiles.push(row);
  }

  const setTile = (x, y, props) => {
    if (y >= 0 && y < MAP_H && x >= 0 && x < MAP_W) {
      Object.assign(tiles[y][x], props);
    }
  };

  const fillRect = (x0, y0, x1, y1, props) => {
    for (let y = y0; y <= y1; y += 1) {
      for (let x = x0; x <= x1; x += 1) {
        setTile(x, y, props);
      }
    }
  };

  // Helper to create a smooth multi-tile staircase ramp between `lowElev` and `highElev`
  // `dir` is the direction pointing toward `highElev`: 'north' | 'south' | 'east' | 'west'
  const buildStairRamp = (x0, y0, x1, y1, lowElev, highElev, dir) => {
    const spanX = x1 - x0 + 1;
    const spanY = y1 - y0 + 1;
    const steps = dir === 'north' || dir === 'south' ? spanY : spanX;
    for (let y = y0; y <= y1; y += 1) {
      for (let x = x0; x <= x1; x += 1) {
        let t = 0.5;
        if (dir === 'north') {
          t = (y1 - y + 0.5) / steps;
        } else if (dir === 'south') {
          t = (y - y0 + 0.5) / steps;
        } else if (dir === 'west') {
          t = (x1 - x + 0.5) / steps;
        } else if (dir === 'east') {
          t = (x - x0 + 0.5) / steps;
        }
        const elev = lowElev + (highElev - lowElev) * t;
        const stepH = (highElev - lowElev) / steps;
        setTile(x, y, {
          type: 'stair',
          elev,
          stairStepH: stepH,
          stairDir: dir,
          solid: false,
        });
      }
    }
  };

  // 1. NORTH ROW WALKWAYS & CENTRAL NORTH STAIRCASE (Himnasyo Amianan & Himnasyo Amianan)
  fillRect(38, 8, 51, 9, { type: 'path', elev: 0, solid: false });
  // Central North Staircase climbing South from North Row (y=8..9, Elev 0) up to North KA Rim (y=16, Elev 2)
  buildStairRamp(46, 10, 47, 12, 0, 1, 'south');
  buildStairRamp(46, 13, 47, 15, 1, 2, 'south');
  // Long horizontal white walkway along North Rim of Kolehiyo ng Agham (x=36..61, y=16, Elev 2)
  fillRect(36, 16, 61, 16, { type: 'path', elev: 2, solid: false });
  // North-East connector walkway from Biodiversity South Door (x=60..61, y=10..15) climbing south
  fillRect(58, 10, 61, 11, { type: 'path', elev: 0, solid: false });
  fillRect(60, 12, 61, 13, { type: 'path', elev: 1, solid: false });
  buildStairRamp(60, 12, 61, 13, 0, 1, 'south');
  buildStairRamp(60, 14, 61, 15, 1, 2, 'south');

  // 2. SUMMIT CROWN QUAD (Elevation 3 — Main White Academic Courtyard x=25..59, y=18..32)
  fillRect(25, 18, 35, 19, { type: 'path', elev: 3, solid: false });
  fillRect(25, 18, 59, 32, { type: 'plaza', elev: 3, solid: false });
  // Staircase connecting North KA Rim (x=36..37, y=16, Elev 2) up into Summit Quad (y=17..20, Elev 3)
  buildStairRamp(36, 17, 37, 19, 2, 3, 'south');
  fillRect(33, 18, 35, 19, { type: 'path', elev: 3, solid: false });

  // 3. NORTHWEST TERRACE: STUDENT ALUMNI CENTER, GREY COURTYARD, & WEST STAIRS TO CSS
  // Short stairs east of Student Alumni Center (x=23..24, y=18..19) climbing from Elev 1 -> Elev 2/3
  fillRect(21, 21, 22, 22, { type: 'path', elev: 1, solid: false });
  buildStairRamp(23, 21, 24, 22, 1, 3, 'east');
  fillRect(25, 21, 25, 22, { type: 'path', elev: 3, solid: false });
  // Grey Courtyard south of Student Alumni Center (x=19..21, y=20..25, Elev 1)
  fillRect(19, 20, 21, 25, { type: 'road', elev: 1, solid: false });
  // Long West Staircase descending from Alumni Grey Courtyard (x=18, Elev 1) to CSS North Landing (x=13, Elev 0)
  buildStairRamp(13, 24, 18, 25, 0, 1, 'east');
  // White square landing pad north of CSS (x=9..12, y=24..28, Elev 0)
  fillRect(9, 24, 12, 28, { type: 'path', elev: 0, solid: false });

  // 4. EAST VERTICAL SPINE, TWO PARALLEL DRIVEWAY STAIR CORRIDORS, & OBLATION STATUE IN THE MIDDLE
  // Vertical spine east of College of Science (x=60..61, y=17..33)
  fillRect(60, 17, 61, 18, { type: 'path', elev: 2, solid: false });
  fillRect(60, 19, 61, 33, { type: 'path', elev: 2, solid: false });
  // Bridges from Summit Quad (x=59) to East Spine (x=60..61) aligned with the two driveway corridors
  buildStairRamp(59, 25, 59, 26, 2, 3, 'west');
  buildStairRamp(59, 31, 59, 32, 2, 3, 'west');

  // Upper East Horizontal Driveway Corridor (y=25..26, x=62..78) descending Eastward from Elev 2 -> 1 -> 0
  buildStairRamp(62, 25, 65, 26, 1, 2, 'west');
  fillRect(66, 25, 69, 26, { type: 'path', elev: 1, solid: false });
  buildStairRamp(70, 25, 73, 26, 0, 1, 'west');
  fillRect(74, 25, 78, 26, { type: 'path', elev: 0, solid: false });

  // Lower East Horizontal Driveway Corridor (y=32..33, x=62..78) descending Eastward from Elev 2 -> 1 -> 0
  buildStairRamp(62, 32, 65, 33, 1, 2, 'west');
  fillRect(66, 32, 69, 33, { type: 'path', elev: 1, solid: false });
  buildStairRamp(70, 32, 73, 33, 0, 1, 'west');
  fillRect(74, 32, 78, 33, { type: 'path', elev: 0, solid: false });

  // UP OBLATION PLAZA & STATUE RIGHT IN THE MIDDLE BETWEEN THE TWO DRIVEWAY STAIRS (x=66..69, y=27..31, Elev 1)!
  fillRect(66, 27, 69, 31, { type: 'plaza', elev: 1, solid: false });
  fillRect(67, 28, 68, 28, { type: 'plaza', elev: 1, solid: true }); // Oblation Pedestal in the middle of the two stairs

  // Vertical white walkway connecting Lower East Driveway down to the Main South Promenade (x=74..75, y=34..44, Elev 0)
  fillRect(74, 34, 75, 44, { type: 'path', elev: 0, solid: false });

  // Zigzag Eastern Staircase descending from East Spine (x=60..61, y=34..37) to (x=62..63, y=37..42) down to South Promenade (y=43, Elev 0)
  buildStairRamp(60, 34, 61, 36, 1, 2, 'north');
  fillRect(60, 37, 63, 38, { type: 'path', elev: 1, solid: false });
  buildStairRamp(62, 39, 63, 42, 0, 1, 'north');

  // 5. OPEN COURT A (LOWERED BY 1 LEVEL: Floor @ Elev 0, North Bleachers/Stage @ Elev 1) & FLANKING STAIRS
  // Blue-grey bleachers/stage at north edge of Open Court A (x=39..52, y=36..37, Elev 1)
  fillRect(39, 36, 52, 37, { type: 'court_stage', elev: 1, solid: false });
  // Dark grey Open Court A basketball floor (x=39..52, y=38..42, Elev 0 — flush with South Promenade!)
  fillRect(39, 38, 52, 42, { type: 'court', elev: 0, solid: false });

  // White walkway above the bleachers (x=39..57, y=35, Elev 2) with short stairs up to Summit Quad (x=56..57, y=33..34)
  fillRect(39, 35, 57, 35, { type: 'path', elev: 2, solid: false });
  buildStairRamp(56, 33, 57, 34, 2, 3, 'north');

  // Long West Staircase alongside Open Court A (x=37..38, y=33..42) connecting Summit Quad (y=32, Elev 3) down to South Promenade (y=43, Elev 0)!
  buildStairRamp(37, 33, 38, 34, 2, 3, 'north');
  fillRect(37, 35, 38, 35, { type: 'path', elev: 2, solid: false });
  buildStairRamp(37, 36, 38, 37, 1, 2, 'north');
  fillRect(37, 38, 38, 38, { type: 'path', elev: 1, solid: false });
  buildStairRamp(37, 39, 38, 41, 0, 1, 'north');
  fillRect(37, 42, 38, 42, { type: 'path', elev: 0, solid: false });

  // 6. SOUTH PROMENADE & STEPPED WHITE PATH AROUND CSS, LIBRARY (Elev 0), CAC, & TEATRO AMIANAN
  // Long horizontal South Promenade below Open Court A (x=34..75, y=43..44, Elev 0)
  fillRect(34, 43, 75, 44, { type: 'path', elev: 0, solid: false });

  // Exact stepped white path inside the green circle (all at Elev 0, flush with Library, CSS, CAC, and Teatro):
  // - Wide vertical white path along East side of Library (x=34..37, y=42..50, Elev 0)
  fillRect(34, 42, 37, 50, { type: 'path', elev: 0, solid: false });
  // - Horizontal white corridor between Library (y=42..47) and CAC / Teatro (y=51..54): x=15..37, y=48..50 (Elev 0)
  fillRect(15, 48, 37, 50, { type: 'path', elev: 0, solid: false });
  // - Upper-left white plaza directly under CSS (x=6..13, y=29..45) and above CAC's NW wing (x=10..14, y=49..50): x=6..17, y=46..48 (Elev 0)
  fillRect(6, 46, 17, 48, { type: 'path', elev: 0, solid: false });
  // - Left vertical white path along the west edge of CAC (x=6..9, y=46..54, Elev 0)
  fillRect(6, 46, 9, 54, { type: 'path', elev: 0, solid: false });

  fillRect(14, 27, 15, 48, { type: 'path', elev: 0, solid: false });
  fillRect(12, 27, 15, 28, { type: 'path', elev: 0, solid: false });

  // 7. Tall Grass Patches (Wild Flora Encounters in the green terrace pockets)
  fillRect(10, 18, 13, 22, { type: 'tall_grass', elev: 0 }); // Woods behind CSS (#3)
  fillRect(54, 36, 58, 39, { type: 'tall_grass', elev: 1 }); // UPB Woods beside Court A (#15 / #17)
  fillRect(16, 42, 18, 45, { type: 'tall_grass', elev: 0 }); // CSS & Library herbal slope (Lagundi)
  fillRect(63, 12, 66, 16, { type: 'tall_grass', elev: 1 }); // Lower KA / Biodiversity slope (#14)

  // 8. Stamp Building Footprints AND a 1-tile foundation apron around each building to its exact `b.elev`
  // so no building ever straddles a cliff edge or floats!
  for (const b of BUILDINGS) {
    for (let y = b.y - 1; y <= b.y + b.d; y += 1) {
      for (let x = b.x - 1; x <= b.x + b.w; x += 1) {
        const t = tiles[y]?.[x];
        if (t && ['grass', 'tall_grass'].includes(t.type)) {
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

  // Inang Laya and its specimens occupy the garden, leaving the y=35 path clear.
  fillRect(40, 33, 44, 34, { type: 'grass', elev: 2, solid: false });
  setTile(INANG_LAYA.x, INANG_LAYA.y, { solid: true });
  fillRect(58, 20, 58, 23, { type: 'grass' });
  // Reference specimens elsewhere occupy the existing terrace gardens.
  for (const p of PLANT_NODES) setTile(p.x, p.y, { type: 'grass' });

  // 9. Decorative Cordillera Pines, Sunflowers, Fallen Wood, Rocks, and Noticeboards
  const props = [];
  const addProp = (kind, x, y) => {
    const t = tiles[y]?.[x];
    if (t && !t.solid && (kind === 'noticeboard' || ['grass', 'tall_grass'].includes(t.type))
      && ![INANG_LAYA, ...PLANT_NODES, ...NPCS, ...SIGNS].some(p => Math.abs(p.x-x) <= 1 && Math.abs(p.y-y) <= 1)) {
      if (['pine', 'rock', 'wood'].includes(kind)) {
        t.solid = true;
      }
      props.push({ kind, x, y, elev: t.elev });
    }
  };

  const pineCoords = [
    [9, 14], [12, 15], [8, 20], [6, 18], [12, 10], // Woods behind CSS (#3)
    [55, 38], [58, 40], [65, 36], [56, 41], [67, 39], // UPB Woods (#15 / #17)
    [34, 5], [67, 6], [66, 14], [28, 7], [71, 12], // North HK / Biodiversity woods
    [16, 39], [45, 48], [60, 48], [52, 50], [68, 50],
  ];
  for (const [x, y] of pineCoords) addProp('pine', x, y);

  const woodCoords = [
    [10, 15], [7, 21], [14, 19], // Woods behind CSS (#3)
    [54, 40], [64, 38], [66, 41], // UPB Woods (#15 / #17)
    [18, 39], [20, 39], // Slope between Juan Luna and Library
    [64, 15], [69, 13], [32, 8], // North & Biodiversity slopes
    [41, 47], [55, 48], [66, 48], // South Promenade woodland edge
  ];
  for (const [x, y] of woodCoords) addProp('wood', x, y);

  const rockCoords = [
    [11, 13], [8, 17], [15, 22], // Woods behind CSS (#3)
    [57, 39], [65, 40], [68, 37], // UPB Woods (#15 / #17)
    [22, 39], [17, 41], // Slope near CSS & Library
    [64, 13], [70, 15], [35, 8], // North & Biodiversity rock outcrops
    [46, 33], [53, 33], // Green terrace strip above Court A bleachers
    [48, 47], [62, 47], [72, 47], // South Promenade rock outcrops
  ];
  for (const [x, y] of rockCoords) addProp('rock', x, y);

  const sunflowerCoords = [
    [40, 21], [49, 21], [31, 29], [53, 39], [64, 29], [16, 43],
    [11, 21], [57, 37], [65, 15], [22, 13], [42, 47], [58, 47],
  ];
  for (const [x, y] of sunflowerCoords) addProp('sunflower_deco', x, y);

  for (const [x, y] of [[42, 31], [24, 50], [70, 29]]) addProp('noticeboard', x, y);

  // Dense deterministic woodland, bush, fallen wood, and rock placement on even grid coordinates, leaving odd rows/cols open for walking.
  for (let y = 4; y < MAP_H - 3; y += 2) {
    for (let x = 4; x < MAP_W - 3; x += 2) {
      const hash = (x * 37 + y * 71) % 19;
      if (hash > 14) continue;
      const t = tiles[y][x];
      const clear = [-1, 0, 1].every((dy) =>
        [-1, 0, 1].every((dx) => {
          const n = tiles[y + dy]?.[x + dx];
          return n && !n.solid && ['grass', 'tall_grass'].includes(n.type) && n.elev === t.elev;
        }),
      );
      if (clear) {
        const kind =
          hash < 4 ? 'pine' : hash < 10 ? 'understory' : hash < 12 ? 'wood' : 'rock';
        addProp(kind, x, y);
      }
    }
  }

  // Stationary people and modeled plants occupy a tile; only visitors wander
  // through paths without reserving tiles. Ground grass remains walkable.
  for (const entity of [...NPCS, ...PLANT_NODES, ...SIGNS, ...props]) {
    setTile(entity.x, entity.y, { solid: true });
  }
  // Four Pillars monument on the west CAC promenade leaves both side lanes open.
  setTile(7, 50, { solid: true });
  setTile(8, 50, { solid: true });

  return {
    w: MAP_W,
    bounds: CAMPUS_BOUNDS,
    h: MAP_H,
    spawn: PLAYER_SPAWN,
    tiles,
    buildings: BUILDINGS,
    npcs: NPCS,
    plantNodes: PLANT_NODES,
    signs: SIGNS,
    props,
    tileAt(x, y) {
      if (y < 0 || y >= MAP_H || x < 0 || x >= MAP_W) return null;
      return tiles[y][x];
    },
    canStep(fromX, fromY, toX, toY) {
      if (!insideCampus(toX, toY)) return false;
      const a = this.tileAt(fromX, fromY);
      const b = this.tileAt(toX, toY);
      if (!a || !b || b.solid) return false;
      if (a.type === 'stair' || b.type === 'stair') {
        return Math.abs(a.elev - b.elev) <= 1.05;
      }
      return Math.abs(a.elev - b.elev) <= 0.45;
    },
  };
}

function getZoneName(x, y, elev) {
  if (y <= 11 && x >= 36 && x <= 66) return 'North Campus · Himnasyo Amianan & Human Kinetics Program (Elev 0)';
  if (x >= 60 && y >= 20 && y <= 35) return 'East Driveway Stairs & Oblation Ground (Elev 0–2)';
  if (x >= 37 && x <= 55 && y >= 35 && y <= 44) return 'Open Court A (#21 · Elev 0) & North Bleachers (Elev 1)';
  if (x >= 53 && x <= 68 && y >= 35 && y <= 43) return 'UPB Woods (#15 / #17 · Elev 1)';
  if (x <= 15 && y >= 24 && y <= 46) return 'College of Social Sciences (CSS #4) & Woods (#3) (Elev 0)';
  if (x >= 6 && x <= 38 && y >= 41) return 'UPB Library (#7), CAC Dap-ay (#6) & Teatro Amianan (Elev 0)';
  if (x >= 15 && x <= 31 && y >= 12 && y <= 25) return 'NW Terrace · Student Alumni Ctr & Balay Panganan (Elev 1–2)';
  if (elev >= 3) return 'Summit Quad · Iskolar ng Bayan, KA & CS (Elev 3)';
  if (elev === 2) return 'Upper Terrace · Balay Panganan & KA North Rim (Elev 2)';
  if (elev === 1) return 'Middle Terrace · Bulwagang Juan Luna & Alumni Ctr (Elev 1)';
  return 'UP Baguio Campus Grounds (Elev 0)';
}
