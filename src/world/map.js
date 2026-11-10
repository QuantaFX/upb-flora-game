// Strict Orthogonal Grid UP Baguio Campus Map (80x64 tiles, 4 elevation terraces: 0..3)
// Faithfully follows the user's strict grid blueprint (relative building rectangles, white walkways,
// staircase connectors, Open Court A with stage/bleachers, and nested green elevation terraces),
// cross-referenced with the UP Baguio Emergency Evacuation Plan & 21 Democratic Spaces labels.

export const MAP_W = 80;
export const MAP_H = 64;

export const BUILDINGS = [
  // --- NORTH ROW (Elevation 0 — Human Kinetics / Himnasyo Amianan & Biodiversity Research Center) ---
  {
    id: 'b_himnasyo',
    name: 'HIMNASYO AMIANAN & HK',
    sub: 'Human Kinetics Program',
    elev: 0,
    x: 38,
    y: 3,
    w: 12,
    d: 5,
    h: 2.7,
    wallColor: '#dcd299',
    roofColor: '#5c6632',
    doorX: 44,
  },
  {
    id: 'b_biodiv',
    name: 'BIODIVERSITY RESEARCH CTR',
    sub: 'Innovation & Biodiversity',
    elev: 0,
    x: 52,
    y: 3,
    w: 13,
    d: 7,
    h: 2.7,
    wallColor: '#c8ccd0',
    roofColor: '#4a555e',
    doorX: 58,
  },

  // --- NORTHWEST CLUSTER (Elevation 1 & 2 — Student Alumni Center & Balay Panganan) ---
  {
    id: 'b_alumni',
    name: 'STUDENT ALUMNI CENTER',
    sub: 'Alum Lobby & CL Office (#1–2)',
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
    elev: 2,
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
    sub: 'IB North Wing & Parking',
    elev: 3,
    x: 36,
    y: 23,
    w: 15,
    d: 3,
    h: 2.9,
    wallColor: '#e4eaf0',
    roofColor: '#7b1113',
    doorX: 43,
  },
  {
    id: 'b_ib_west',
    name: 'IB LOBBY & INANG LAYA',
    sub: 'Iskolar ng Bayan Hall (#11, #18)',
    elev: 3,
    x: 33,
    y: 26,
    w: 5,
    d: 4,
    h: 2.9,
    wallColor: '#e4eaf0',
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
    h: 3.0,
    wallColor: '#d9c5a9',
    roofColor: '#3e2515',
    doorX: 27,
  },

  // --- MIDDLE / WEST TERRACE (Elevation 1 — Cultural Hub, Library, CSS) ---
  {
    id: 'b_juanluna',
    name: 'BULWAGANG JUAN LUNA',
    sub: 'Cultural Hub & Auditorium',
    elev: 1,
    x: 20,
    y: 33,
    w: 16,
    d: 5,
    h: 2.7,
    wallColor: '#bdbdbd',
    roofColor: '#525252',
    doorX: 28,
  },
  {
    id: 'b_library',
    name: 'UP BAGUIO LIBRARY',
    sub: 'University Library & Archives (#7)',
    elev: 1,
    x: 20,
    y: 43,
    w: 14,
    d: 6,
    h: 2.9,
    wallColor: '#d8a58e',
    roofColor: '#7b1113',
    doorX: 27,
  },

  // --- OUTER / LOWER PERIMETER (Elevation 0 — CSS, CAC, Teatro Amianan, Kiosk, Guardhouse, Dorms) ---
  {
    id: 'b_css',
    name: 'COLLEGE OF SOCIAL SCIENCES',
    sub: 'CSS Courtyard & CSC (#4)',
    elev: 0,
    x: 6,
    y: 29,
    w: 7,
    d: 16,
    h: 2.8,
    wallColor: '#b6bed8',
    roofColor: '#465170',
    doorX: 9,
  },
  {
    id: 'b_cac',
    name: 'ARTS & COMMUNICATION (CAC)',
    sub: 'CAC Dap-ay & Four Pillars (#6)',
    elev: 0,
    x: 10,
    y: 49,
    w: 14,
    d: 5,
    h: 2.7,
    wallColor: '#b9c0d8',
    roofColor: '#4c5778',
    doorX: 17,
  },
  {
    id: 'b_teatro',
    name: 'TEATRO AMIANAN',
    sub: 'Performing Arts Hall',
    elev: 0,
    x: 27,
    y: 50,
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
    y: 22,
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
    y: 22,
    w: 4,
    d: 3,
    h: 2.1,
    wallColor: '#eadbc2',
    roofColor: '#7b1113',
    doorX: 76,
  },
  {
    id: 'b_dorm',
    name: 'LADIES DORMITORY (BREHA)',
    sub: 'South Annex Residence Hall',
    elev: 0,
    x: 46,
    y: 55,
    w: 11,
    d: 4,
    h: 2.6,
    wallColor: '#e9d696',
    roofColor: '#8d5b28',
    doorX: 51,
  },
  {
    id: 'b_walkup',
    name: 'WALK-UP APARTMENT',
    sub: 'South Annex Housing',
    elev: 0,
    x: 61,
    y: 55,
    w: 9,
    d: 4,
    h: 2.6,
    wallColor: '#e9d696',
    roofColor: '#8d5b28',
    doorX: 65,
  },
];

export const NPCS = [
  {
    id: 'prof_dulay',
    name: 'Prof. Mila Dulay',
    role: 'Department of Biology · Project Saleng Lead',
    sprite: 'Princess',
    x: 67,
    y: 35,
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
    x: 75,
    y: 26,
    dir: 'down',
  },
  {
    id: 'paolo',
    name: 'Paolo',
    role: 'Dormitory Resident Student',
    sprite: 'Villager5',
    x: 51,
    y: 53,
    dir: 'up',
  },
  {
    id: 'kiko',
    name: 'Kiko',
    role: 'Court A Varsity Basketball Player',
    sprite: 'Boy',
    x: 46,
    y: 41,
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
    id: 'node_saleng_plaza',
    plantId: 'benguet_pine',
    x: 57,
    y: 38,
    scale: 2.35,
    questHint: 'Heritage Saleng (Benguet Pine) in the UPB Woods (#15 / #17 beside Court A)',
  },
  {
    id: 'node_lagundi_dorm',
    plantId: 'lagundi',
    x: 43,
    y: 52,
    scale: 1.5,
    questHint: 'Aromatic 5-leaflet Lagundi shrub in the South Dormitory Open Area',
  },
  {
    id: 'node_sambong_cs',
    plantId: 'sambong',
    x: 51,
    y: 21,
    scale: 1.5,
    questHint: 'Camphor-scented Sambong herb on the Summit KA / College of Science Quad (#12)',
  },
  {
    id: 'node_tsaang_gubat_canteen',
    plantId: 'tsaang_gubat',
    x: 25,
    y: 19,
    scale: 1.45,
    questHint: 'Glossy Tsaang Gubat shrub between Balay Panganan (#13) & Student Alumni Center',
  },
  {
    id: 'node_takip_kuhol_court',
    plantId: 'takip_kuhol',
    x: 54,
    y: 40,
    scale: 1.3,
    questHint: 'Low fan-leaved Takip-kuhol along the east drain of Open Court A (#21)',
  },
  {
    id: 'node_benguet_lily_hill',
    plantId: 'benguet_lily',
    x: 11,
    y: 20,
    scale: 1.55,
    questHint: 'Endemic white Benguet Lily in the Woods behind CSS (#3)',
  },
  {
    id: 'node_tree_fern_seep',
    plantId: 'tree_fern',
    x: 62,
    y: 13,
    scale: 2.25,
    questHint: 'Protected Tibanglan Tree Fern along Lower KA & Biodiversity Research Center (#14)',
  },
  {
    id: 'node_sunflower_terrace',
    plantId: 'mexican_sunflower',
    x: 42,
    y: 21,
    scale: 1.6,
    questHint: 'Blooming Mirassol (Mexican Sunflower) on the Kolehiyo ng Agham Quad (#12)',
  },
  {
    id: 'node_sapinit_hill',
    plantId: 'sapinit',
    x: 17,
    y: 46,
    scale: 1.45,
    questHint: 'Wild Sapinit raspberry bramble near CAC Dap-ay (#6) & Library',
  },
];

export const SIGNS = [
  {
    x: 69,
    y: 33,
    title: 'Oblation Ground & Driveway Corridor (Elev 1)',
    text: 'East Campus Entrance: Follow the Upper or Lower Driveway corridors west to climb into the Summit Quad (Elev 3), Open Court A (Elev 1), or head south to the Dormitory & Library.',
  },
  {
    x: 42,
    y: 42,
    title: 'Open Court A (#21) & Summit Stairs (#20)',
    text: 'North ↑ : Climb the west or east stairs up to the Iskolar ng Bayan & College of Science Summit Quad (Elev 3).\nWest ← : UPB Library (#7), Bulwagang Juan Luna & CSS.',
  },
  {
    x: 41,
    y: 29,
    title: 'Iskolar ng Bayan Quad & Inang Laya (#18)',
    text: 'Summit Plateau (Elevation 3): Surrounded by IB Building (#11), Kolehiyo ng Agham (#12), College of Science, Institute of Management (#10), Balay Salun-at (UHS), and Museo Kordilyera (#9).',
  },
  {
    x: 18,
    y: 23,
    title: 'Student Alumni Center (#2) & CSS Trail',
    text: 'West ← : Step down the west stairs to the College of Social Sciences (CSS #4) and Woods behind CSS (#3).\nEast → : Climb up to Balay Panganan (#13) and the Summit Quad.',
  },
  {
    x: 48,
    y: 50,
    title: 'South Dormitory Annex & CAC Promenade',
    text: 'South ↓ : Ladies Dormitory (Breha) & Walk-up Apartment.\nWest ← : UP Baguio Library (#7), CAC (#6), and Teatro Amianan.',
  },
];

export function createCampusMap() {
  const tiles = [];

  // Strict Orthogonal Nested Rectangular Terraces (matching the shades of green in the user's grid map):
  //   - Elevation 0 (Outer light green): x=0..79, y=0..63
  //   - Elevation 1 (Medium green rectangle): x=15..68, y=10..44 (except the SE white plaza/courtyard below y=43)
  //   - Elevation 2 (Darker green rectangle): x=25..62, y=13..37 (wrapping Balay Panganan, Summit & Court A stage)
  //   - Elevation 3 (Darkest green Summit Crown): x=25..59, y=17..32 (Main Summit Academic Quad)
  function computeGridElevation(x, y) {
    // Open Court A (x=39..52, y=38..42) sits in the lower basin at Elevation 1,
    // with its north stage/bleachers (y=36..37) at Elevation 2!
    if (x >= 39 && x <= 52 && y >= 38 && y <= 42) {
      return 1;
    }

    // Level 3: Summit Crown Quad (IM, Balay Salun-at, KA, CS, IB, Museo Kordilyera)
    if (x >= 25 && x <= 59 && y >= 17 && y <= 32) {
      return 3;
    }

    // Level 2: Upper-Middle Rectangular Terrace (Balay Panganan, North KA Rim, Court A Bleachers, East CS Walk)
    if (x >= 25 && x <= 62 && y >= 13 && y <= 37) {
      return 2;
    }

    // Level 1: Outer-Middle Rectangular Terrace (Alumni Center, Bulwagang Juan Luna, Library, East Woods)
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

  // Helper to build a multi-tile staircase ramp between any two elevations
  // dir = 'north' (climbs toward -y), 'south' (climbs toward +y), 'west' (climbs toward -x), 'east' (climbs toward +x)
  function buildStairRamp(x0, y0, x1, y1, fromElev, toElev, dir) {
    const steps =
      dir === 'north' || dir === 'south' ? Math.abs(y1 - y0) + 1 : Math.abs(x1 - x0) + 1;
    for (let y = y0; y <= y1; y += 1) {
      for (let x = x0; x <= x1; x += 1) {
        let idx = 0;
        if (dir === 'north') idx = y1 - y;
        else if (dir === 'south') idx = y - y0;
        else if (dir === 'west') idx = x1 - x;
        else if (dir === 'east') idx = x - x0;
        const frac = (idx + 0.5) / steps;
        const elev = fromElev + (toElev - fromElev) * frac;
        setTile(x, y, {
          type: 'stair',
          elev,
          stairStepH: Math.abs(toElev - fromElev) / steps,
          stairDir: dir,
          solid: false,
        });
      }
    }
  }

  // Outer Map Border Solid
  for (let y = 0; y < MAP_H; y += 1) {
    setTile(0, y, { solid: true });
    setTile(MAP_W - 1, y, { solid: true });
  }
  for (let x = 0; x < MAP_W; x += 1) {
    setTile(x, 0, { solid: true });
    setTile(x, MAP_H - 1, { solid: true });
  }

  // =========================================================================
  // WHITE ORTHOGONAL WALKWAYS & PLAZAS (Directly matching the user's grid map)
  // =========================================================================

  // 1. NORTH WALKWAY (under Himnasyo Amianan & Biodiversity Research Center, Elev 0)
  fillRect(38, 8, 51, 9, { type: 'path', elev: 0, solid: false });
  // Vertical path on East edge from Biodiversity Research Center down into East Spine
  fillRect(60, 10, 61, 16, { type: 'path', elev: 1, solid: false });
  buildStairRamp(60, 10, 61, 10, 0, 1, 'south'); // Step up from Biodiversity (Elev 0) to Elev 1

  // Staircase going SOUTH from Himnasyo Walkway (x=46..47, y=10..15) climbing Elev 0 -> 1 -> 2 -> 3!
  buildStairRamp(46, 10, 47, 15, 0, 3, 'south');

  // 2. SUMMIT CROWN WHITE COURTYARD & PROMENADES (Elevation 3)
  // Main white summit courtyard rectangle: x=25..58, y=19..32
  fillRect(25, 19, 58, 32, { type: 'plaza', elev: 3, solid: false });
  // Narrow white walkway along the North side of KA (x=35..61, y=16)
  fillRect(35, 16, 59, 16, { type: 'path', elev: 3, solid: false });
  // Staircase between Balay Panganan (Elev 2) and Summit Quad (Elev 3) at x=35..36, y=17..19
  fillRect(25, 18, 34, 19, { type: 'path', elev: 2, solid: false }); // Balay Panganan south apron
  buildStairRamp(35, 18, 35, 19, 2, 3, 'east');

  // 3. NORTHWEST ALUMNI CENTER & CSS STAIRS
  // Staircase between Alumni Center (Elev 1) and Summit Quad (Elev 3) at x=23..24, y=19..20
  buildStairRamp(23, 19, 24, 20, 1, 3, 'east');
  // Grey/white courtyard south of Student Alumni Center (x=19..21, y=20..25, Elev 1)
  fillRect(19, 20, 21, 25, { type: 'plaza', elev: 1, solid: false });
  // Long horizontal staircase going WEST from Alumni Courtyard down to CSS north landing (x=12..18, y=24..25)
  buildStairRamp(12, 24, 18, 25, 0, 1, 'east');
  // White landing north of CSS (x=9..11, y=24..28, Elev 0)
  fillRect(9, 24, 11, 28, { type: 'path', elev: 0, solid: false });

  // 4. EAST VERTICAL SPINE & TWO PARALLEL DRIVEWAY STAIR CORRIDORS
  // Vertical spine east of College of Science (x=60..61, y=16..34)
  buildStairRamp(60, 17, 61, 18, 1, 2, 'south');
  fillRect(60, 19, 61, 26, { type: 'path', elev: 2, solid: false });
  // Bridge from Summit Quad (x=59, y=26..27) to East Spine (x=60..61)
  buildStairRamp(59, 26, 59, 27, 2, 3, 'west');
  fillRect(60, 27, 61, 32, { type: 'path', elev: 2, solid: false });

  // Upper East Horizontal Driveway Corridor (y=26..27, x=62..79) descending Eastward from Elev 2 -> 1 -> 0
  buildStairRamp(62, 26, 65, 27, 1, 2, 'west');
  fillRect(66, 26, 69, 27, { type: 'path', elev: 1, solid: false });
  buildStairRamp(70, 26, 73, 27, 0, 1, 'west');
  fillRect(74, 26, 78, 27, { type: 'path', elev: 0, solid: false });

  // Lower East Horizontal Driveway Corridor (y=31..32, x=62..79) descending Eastward from Elev 2 -> 1 -> 0
  buildStairRamp(62, 31, 65, 32, 1, 2, 'west');
  fillRect(66, 31, 69, 32, { type: 'path', elev: 1, solid: false });
  buildStairRamp(70, 31, 73, 32, 0, 1, 'west');
  fillRect(74, 31, 78, 32, { type: 'path', elev: 0, solid: false });

  // Vertical white walkway connecting Lower East Driveway down to the Main South Promenade (x=74..75, y=33..44, Elev 0)
  fillRect(74, 33, 75, 44, { type: 'path', elev: 0, solid: false });

  // Zigzag Eastern Staircase descending from East Spine (x=60..61, y=33..37) to (x=62..63, y=37..42) down to South Promenade (y=43, Elev 0)
  buildStairRamp(60, 33, 61, 36, 1, 2, 'north');
  fillRect(60, 37, 63, 38, { type: 'path', elev: 1, solid: false });
  buildStairRamp(62, 39, 63, 42, 0, 1, 'north');

  // 5. OPEN COURT A (Dark Grey Court + Blue-Grey North Bleachers/Stage) & FLANKING STAIRS
  // Blue-grey bleachers/stage at north edge of Open Court A (x=39..52, y=36..37, Elev 2)
  fillRect(39, 36, 52, 37, { type: 'court_stage', elev: 2, solid: false });
  // Dark grey Open Court A floor (x=39..52, y=38..42, Elev 1)
  fillRect(39, 38, 52, 42, { type: 'court', elev: 1, solid: false });

  // White walkway above the bleachers (x=39..57, y=35, Elev 2) with short stairs up to Summit Quad (x=56..57, y=33..34)
  fillRect(39, 35, 57, 35, { type: 'path', elev: 2, solid: false });
  buildStairRamp(56, 33, 57, 34, 2, 3, 'north');

  // Long West Staircase alongside Open Court A (x=37..38, y=33..42) connecting Summit Quad (y=32, Elev 3) down to South Promenade (y=43, Elev 0)!
  buildStairRamp(37, 33, 38, 34, 2, 3, 'north');
  fillRect(37, 35, 38, 35, { type: 'path', elev: 2, solid: false });
  buildStairRamp(37, 36, 38, 38, 1, 2, 'north');
  fillRect(37, 39, 38, 40, { type: 'path', elev: 1, solid: false });
  buildStairRamp(37, 41, 38, 42, 0, 1, 'north');

  // Connect Open Court A (Elev 1) into the West Stair landing at (37..38, 39..40)
  fillRect(39, 39, 39, 40, { type: 'court', elev: 1, solid: false });

  // 6. SOUTH PROMENADE, LIBRARY / CAC / TEATRO COURTYARDS, & OBLATION / DORMITORY PLAZA (Elevation 0 & 1)
  // Long horizontal South Promenade below Open Court A (x=34..75, y=43..44, Elev 0)
  fillRect(34, 43, 75, 44, { type: 'path', elev: 0, solid: false });

  // Step up from South Promenade (x=34..36, y=43, Elev 0) to Library East Apron (Elev 1)
  buildStairRamp(34, 42, 35, 42, 0, 1, 'north');
  fillRect(19, 39, 35, 41, { type: 'path', elev: 1, solid: false }); // Walkway between Bulwagang Juan Luna & Library

  // Southwest White Walkways wrapping CSS, Library, CAC, and Teatro Amianan (Elev 0)
  fillRect(6, 45, 18, 48, { type: 'path', elev: 0, solid: false }); // South of CSS, North of CAC
  fillRect(6, 49, 9, 54, { type: 'path', elev: 0, solid: false }); // West of CAC
  fillRect(18, 47, 37, 49, { type: 'path', elev: 0, solid: false }); // Corridor between Library (N) and CAC/Teatro (S)
  fillRect(34, 44, 37, 49, { type: 'path', elev: 0, solid: false }); // East of Library connecting to South Promenade

  // Large White Oblation & South Annex Plaza in the Southeast (x=40..77, y=46..61, Elev 0)
  fillRect(40, 46, 76, 61, { type: 'plaza', elev: 0, solid: false });
  // Connector between South Promenade (y=44) and SE Plaza (y=46)
  fillRect(48, 44, 54, 46, { type: 'path', elev: 0, solid: false });
  fillRect(72, 44, 75, 46, { type: 'path', elev: 0, solid: false });

  // Iconic UP Oblation Monument Pedestal at (67..68, 33) on the Elev 1 Driveway Plaza!
  fillRect(65, 33, 69, 37, { type: 'plaza', elev: 1, solid: false });
  fillRect(67, 33, 68, 33, { type: 'plaza', elev: 1, solid: true });

  // 7. Tall Grass Patches (Wild Flora Encounters in the green terrace pockets)
  fillRect(10, 18, 13, 22, { type: 'tall_grass', elev: 0 }); // Woods behind CSS (#3)
  fillRect(54, 36, 58, 39, { type: 'tall_grass', elev: 1 }); // UPB Woods beside Court A (#15 / #17)
  fillRect(41, 51, 44, 55, { type: 'tall_grass', elev: 0 }); // South Dormitory Open Area
  fillRect(63, 12, 66, 16, { type: 'tall_grass', elev: 1 }); // Lower KA / Biodiversity slope (#14)

  // 8. Stamp Building Footprints AND a 1-tile foundation apron around each building to its exact `b.elev`
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

  // 9. Decorative Cordillera Pines, Sunflowers, and Benches
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

  const pineCoords = [
    [9, 14], [12, 15], [8, 20], // Woods behind CSS (#3)
    [55, 38], [58, 40], [65, 38], // UPB Woods (#15 / #17)
    [34, 5], [67, 6], [66, 14], // North HK / Biodiversity woods
    [16, 40], [42, 49], [74, 50],
  ];
  for (const [x, y] of pineCoords) addProp('pine', x, y);

  const sunflowerCoords = [
    [40, 21], [49, 21], [31, 29], [53, 39], [65, 35], [16, 45], [44, 54],
  ];
  for (const [x, y] of sunflowerCoords) addProp('sunflower_deco', x, y);

  const benchCoords = [
    [65, 34], [69, 34], // Oblation Plaza benches
    [41, 30], [48, 30], // Summit IB Quad benches
    [25, 41], [31, 41], // Library Courtyard benches
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
      return Math.abs(a.elev - b.elev) <= 1.05;
    }
    return Math.abs(a.elev - b.elev) < 0.15;
  }

  return {
    w: MAP_W,
    h: MAP_H,
    tiles,
    props,
    spawn: { x: 67, y: 37, dir: 'up' },
    tileAt,
    canStep,
  };
}

function getZoneName(x, y, elev) {
  const e = Math.round(elev);
  if (y <= 11 && x >= 36) return 'North Campus · Himnasyo Amianan & Biodiversity Ctr (Elev 0)';
  if (y >= 46 && x >= 40) return 'Southeast Plaza & Dormitory Annex (Elev 0)';
  if (x >= 62 && y >= 21 && y <= 38) return 'East Driveway Corridors & Oblation Ground (Elev 0–1)';
  if (x >= 37 && x <= 55 && y >= 35 && y <= 43) return 'Open Court A (#21) & Bleachers (Elev 1–2)';
  if (e === 3) {
    if (x <= 31) return 'Summit West · Museo Kordilyera & IM (Elev 3)';
    if (y <= 22) return 'Summit North · KA, Balay Salun-at & CS (Elev 3)';
    return 'Summit Quad · Iskolar ng Bayan & Inang Laya (Elev 3)';
  }
  if (x <= 32 && y <= 25) return 'NW Terrace · Student Alumni Ctr & Balay Panganan (Elev 1–2)';
  if (x <= 15 && y >= 25) return 'West Perimeter · College of Social Sciences (CSS · Elev 0)';
  if (y >= 45 && x <= 39) return 'SW Promenade · CAC Dap-ay & Teatro Amianan (Elev 0)';
  if (x >= 18 && x <= 37 && y >= 32) return 'Middle Terrace · Bulwagang Juan Luna & Library (Elev 1)';
  return 'UP Baguio Terraced Grounds';
}
