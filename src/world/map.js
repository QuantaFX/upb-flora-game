// UP Baguio Campus Map Definition (44x36 tiles, 3 elevation terraces).
//
// Coordinates:
//   x: 0..43 (West to East)
//   y: 0..35 (North to South; y=0 is top of Pine Hill, y=35 is Gov. Pack Road)
//   elev: 0 (Lower Campus Plaza/Dorm/Canteen/Clinic/Court)
//         1 (Middle Terrace: College of Science, Library/Admin, Museo Kordilyera)
//         2 (Upper Pine Hill Sanctuary)

export const MAP_W = 44;
export const MAP_H = 36;

export const BUILDINGS = [
  {
    id: 'b_guard',
    name: 'MAIN GATE GUARDHOUSE',
    sub: 'Campus Security',
    x: 25,
    y: 30,
    w: 3,
    d: 2,
    h: 2.1,
    wallColor: '#eadbc2',
    roofColor: '#7b1113',
    doorX: 26,
  },
  {
    id: 'b_canteen',
    name: 'UPB STUDENT CANTEEN',
    sub: 'Tambayan & Meals',
    x: 4,
    y: 25,
    w: 7,
    d: 3,
    h: 2.5,
    wallColor: '#f3e5cc',
    roofColor: '#a63429',
    doorX: 7,
  },
  {
    id: 'b_dorm',
    name: 'BREHA RESIDENCE HALL',
    sub: 'Student Dormitory',
    x: 3,
    y: 15,
    w: 7,
    d: 3,
    h: 2.8,
    wallColor: '#e8d7be',
    roofColor: '#6d3d22',
    doorX: 6,
  },
  {
    id: 'b_uhs',
    name: 'UNIV. HEALTH SERVICE',
    sub: 'Campus Clinic (UHS)',
    x: 33,
    y: 26,
    w: 8,
    d: 3,
    h: 2.5,
    wallColor: '#eef5f0',
    roofColor: '#2d6e46',
    doorX: 36,
  },
  {
    id: 'b_science',
    name: 'COLLEGE OF SCIENCE',
    sub: 'Kolehiyo ng Agham · Herbarium',
    x: 14,
    y: 11,
    w: 9,
    d: 3,
    h: 3.1,
    wallColor: '#f2e8d5',
    roofColor: '#7b1113',
    doorX: 18,
  },
  {
    id: 'b_library',
    name: 'UPB LIBRARY & ADMIN',
    sub: 'Cordillera Archives',
    x: 24,
    y: 11,
    w: 7,
    d: 3,
    h: 3.0,
    wallColor: '#ebe0cc',
    roofColor: '#7b1113',
    doorX: 27,
  },
  {
    id: 'b_museo',
    name: 'MUSEO KORDILYERA',
    sub: 'Ethnographic Museum',
    x: 33,
    y: 10,
    w: 8,
    d: 3,
    h: 3.1,
    wallColor: '#d9c5a9',
    roofColor: '#4a2b18',
    doorX: 36,
  },
];

export const NPCS = [
  {
    id: 'prof_dulay',
    name: 'Prof. Mila Dulay',
    role: 'Department of Biology · Project Saleng Lead',
    sprite: 'Princess',
    x: 19,
    y: 27,
    dir: 'down',
  },
  {
    id: 'apo_sabado',
    name: 'Apo Sabado',
    role: 'Ibaloi Community Elder & Forester',
    sprite: 'OldMan3',
    x: 15,
    y: 26,
    dir: 'right',
  },
  {
    id: 'manong_ben',
    name: 'Manong Ben',
    role: 'UP Baguio Main Gate Guard',
    sprite: 'Inspector',
    x: 24,
    y: 31,
    dir: 'left',
  },
  {
    id: 'ate_lorna',
    name: 'Ate Lorna',
    role: 'Student Canteen Vendor',
    sprite: 'Villager4',
    x: 8,
    y: 29,
    dir: 'down',
  },
  {
    id: 'junjun',
    name: 'Jun-jun',
    role: 'Ate Lorna’s Son',
    sprite: 'Child',
    x: 9,
    y: 29,
    dir: 'left',
  },
  {
    id: 'paolo',
    name: 'Paolo',
    role: 'BS Biology Dorm Roommate',
    sprite: 'Villager5',
    x: 8,
    y: 20,
    dir: 'down',
  },
  {
    id: 'kiko',
    name: 'Kiko',
    role: 'UPB Intramurals Varsity Player',
    sprite: 'Boy',
    x: 33,
    y: 22,
    dir: 'left',
  },
  {
    id: 'nurse_ruth',
    name: 'Nurse Ruth',
    role: 'University Health Service (UHS)',
    sprite: 'Woman',
    x: 36,
    y: 30,
    dir: 'down',
  },
  {
    id: 'curator',
    name: 'Dr. Alangdeo (Curator)',
    role: 'Museo Kordilyera Curator',
    sprite: 'Samurai',
    x: 35,
    y: 14,
    dir: 'down',
  },
  {
    id: 'bea',
    name: 'Bea',
    role: 'BA Communication Campus Photographer',
    sprite: 'Village6',
    x: 19,
    y: 16,
    dir: 'down',
  },
];

export const PLANT_NODES = [
  {
    id: 'node_saleng_plaza',
    plantId: 'benguet_pine',
    x: 16,
    y: 25,
    scale: 2.3,
    questHint: 'Heritage Saleng (Benguet Pine) by the Oblation Plaza',
  },
  {
    id: 'node_lagundi_dorm',
    plantId: 'lagundi',
    x: 4,
    y: 21,
    scale: 1.45,
    questHint: 'Aromatic 5-leaflet shrub in the Dormitory Herbal Plot',
  },
  {
    id: 'node_sambong_cs',
    plantId: 'sambong',
    x: 24,
    y: 16,
    scale: 1.45,
    questHint: 'Velvety camphor-scented herb beside the College of Science',
  },
  {
    id: 'node_tsaang_gubat_canteen',
    plantId: 'tsaang_gubat',
    x: 12,
    y: 27,
    scale: 1.4,
    questHint: 'Glossy small-leaved hedge shrub near the Student Canteen',
  },
  {
    id: 'node_takip_kuhol_court',
    plantId: 'takip_kuhol',
    x: 31,
    y: 22,
    scale: 1.2,
    questHint: 'Low fan-leaved groundcover along the Basketball Court drain',
  },
  {
    id: 'node_benguet_lily_hill',
    plantId: 'benguet_lily',
    x: 7,
    y: 3,
    scale: 1.5,
    questHint: 'Rare white trumpet flower on Upper Pine Hill',
  },
  {
    id: 'node_tree_fern_seep',
    plantId: 'tree_fern',
    x: 28,
    y: 3,
    scale: 2.2,
    questHint: 'Giant Tibanglan tree fern in the misty northeastern gully',
  },
  {
    id: 'node_sunflower_terrace',
    plantId: 'mexican_sunflower',
    x: 16,
    y: 16,
    scale: 1.55,
    questHint: 'Golden blooming Mirassol bush on the College of Science lawn',
  },
  {
    id: 'node_sapinit_hill',
    plantId: 'sapinit',
    x: 19,
    y: 4,
    scale: 1.4,
    questHint: 'Wild thorny raspberry bramble on Pine Hill trail',
  },
];

export const SIGNS = [
  {
    x: 19,
    y: 31,
    title: 'University of the Philippines Baguio',
    text: 'Welcome to UP Baguio (Gov. Pack Road)! Home of the Oblation Plaza, Kolehiyo ng Agham, and Museo Kordilyera.',
  },
  {
    x: 20,
    y: 23,
    title: 'Academic Terrace Steps',
    text: 'North ↑ : College of Science, Library & Museo Kordilyera (Terrace Level 1).\nSouth ↓ : Oblation Plaza & Main Gate.',
  },
  {
    x: 11,
    y: 20,
    title: 'West Campus Path',
    text: 'North ↑ : Breha Student Dormitory & Herbal Garden.\nSouth ↓ : Student Canteen.',
  },
  {
    x: 32,
    y: 24,
    title: 'East Campus Path',
    text: 'North ↑ : Varsity Basketball Court.\nSouth ↓ : University Health Service (UHS Clinic).',
  },
  {
    x: 14,
    y: 9,
    title: 'Pine Hill Sanctuary Trail',
    text: 'Upper Cordillera Montane Reserve (Level 2). Protected Benguet Lily & Tibanglan Tree Fern habitat — Photograph only!',
  },
];

export function createCampusMap() {
  const tiles = [];

  for (let y = 0; y < MAP_H; y += 1) {
    const row = [];
    for (let x = 0; x < MAP_W; x += 1) {
      let elev = 0;
      if (y <= 7) {
        elev = 2;
      } else if (y === 8) {
        elev = x >= 11 && x <= 13 ? 1 : 2;
      } else if (y >= 9 && y <= 21) {
        if (x >= 11 && x <= 41 && y <= 19) elev = 1;
        else if (x >= 13 && x <= 30 && y <= 21) elev = 1;
        else elev = 0;
      } else {
        elev = 0;
      }

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
    }
  };

  const fillRect = (x0, y0, x1, y1, patch) => {
    for (let y = y0; y <= y1; y += 1) {
      for (let x = x0; x <= x1; x += 1) {
        setTile(x, y, patch);
      }
    }
  };

  // 1. Governor Pack Road at bottom (y=34..35) + Gate entrance
  fillRect(0, 34, MAP_W - 1, 35, { type: 'road', solid: true, elev: 0 });
  fillRect(20, 32, 23, 35, { type: 'path', solid: false, elev: 0 }); // Main Gate entrance

  // Perimeter fence along y=33 except gate (20..23)
  for (let x = 0; x < MAP_W; x += 1) {
    if (x < 20 || x > 23) {
      setTile(x, 33, { type: 'plaza', solid: true });
    }
  }
  // Map outer borders solid
  for (let y = 0; y < MAP_H; y += 1) {
    setTile(0, y, { solid: true });
    setTile(MAP_W - 1, y, { solid: true });
  }
  for (let x = 0; x < MAP_W; x += 1) {
    setTile(x, 0, { solid: true });
  }

  // 2. Oblation Plaza (x=17..26, y=25..31)
  fillRect(17, 25, 26, 31, { type: 'plaza', elev: 0 });
  // Oblation Statue pedestal at (21..22, 27)
  fillRect(21, 27, 22, 27, { type: 'plaza', solid: true, elev: 0 });

  // 3. Lower Campus Paths
  fillRect(20, 23, 23, 25, { type: 'path', elev: 0 }); // Plaza to central stairs
  fillRect(6, 28, 17, 29, { type: 'path', elev: 0 }); // West path to Canteen
  fillRect(6, 18, 8, 28, { type: 'path', elev: 0 }); // Path up to Dormitory
  fillRect(26, 28, 37, 29, { type: 'path', elev: 0 }); // East path to UHS Clinic
  fillRect(31, 20, 33, 28, { type: 'path', elev: 0 }); // Path to Basketball Court

  // Basketball Court (x=34..40, y=18..23)
  fillRect(34, 18, 40, 23, { type: 'court', elev: 0 });

  // 4. Stairs from Lower Plaza (elev 0) to Central Academic Terrace (elev 1)
  // At x=21..22, y=22
  fillRect(21, 22, 22, 22, { type: 'stair', elev: 0.5, stairDir: 'north', solid: false });

  // 5. Central Terrace Paths (elev 1)
  fillRect(15, 14, 37, 15, { type: 'path', elev: 1 }); // Main academic promenade
  fillRect(21, 15, 22, 21, { type: 'path', elev: 1 }); // Spine down to stairs
  fillRect(12, 9, 15, 15, { type: 'path', elev: 1 }); // Connector to Pine Hill stairs

  // 6. Stairs from Central Terrace (elev 1) to Pine Hill (elev 2)
  // At x=12..13, y=8
  fillRect(12, 8, 13, 8, { type: 'stair', elev: 1.5, stairDir: 'north', solid: false });

  // 7. Upper Pine Hill Paths (elev 2)
  fillRect(12, 4, 13, 7, { type: 'path', elev: 2 });
  fillRect(7, 4, 27, 5, { type: 'path', elev: 2 });

  // 8. Tall Grass patches (wild encounters)
  fillRect(3, 22, 5, 24, { type: 'tall_grass', elev: 0 }); // Dorm garden patch
  fillRect(27, 16, 30, 18, { type: 'tall_grass', elev: 1 }); // East of CS terrace
  fillRect(8, 2, 11, 3, { type: 'tall_grass', elev: 2 }); // Pine Hill west
  fillRect(21, 2, 25, 4, { type: 'tall_grass', elev: 2 }); // Pine Hill east

  // 9. Stamp Building Footprints as solid
  for (const b of BUILDINGS) {
    for (let y = b.y; y < b.y + b.d; y += 1) {
      for (let x = b.x; x < b.x + b.w; x += 1) {
        setTile(x, y, { solid: true });
      }
    }
  }

  // 10. Decorative Trees & Props list (non-quest pines, bushes, benches, sunflowers)
  const props = [];
  const addProp = (kind, x, y) => {
    if (tiles[y]?.[x] && !tiles[y][x].solid) {
      if (kind === 'pine' || kind === 'round_tree' || kind === 'bench' || kind === 'rock') {
        tiles[y][x].solid = true;
      }
      props.push({ kind, x, y, elev: tiles[y][x].elev });
    }
  };

  // Pine trees framing the campus
  const pineCoords = [
    [2, 2], [4, 2], [15, 2], [18, 2], [26, 2], [31, 2], [35, 3], [39, 3],
    [3, 6], [16, 6], [23, 6], [32, 6], [38, 6],
    [12, 11], [23, 12], [31, 12], [40, 14],
    [2, 14], [10, 15], [2, 20], [2, 27], [14, 24], [28, 24], [41, 25], [41, 30],
  ];
  for (const [x, y] of pineCoords) addProp('pine', x, y);

  // Decorative sunflowers (Tithonia)
  const sunflowerCoords = [
    [15, 28], [27, 27], [14, 17], [15, 17], [20, 17], [10, 6], [15, 6], [30, 5],
  ];
  for (const [x, y] of sunflowerCoords) addProp('sunflower_deco', x, y);

  // Campus benches
  const benchCoords = [
    [18, 29], [25, 29], [17, 13], [28, 13],
  ];
  for (const [x, y] of benchCoords) addProp('bench', x, y);

  // Mark Sign tiles solid
  for (const s of SIGNS) {
    setTile(s.x, s.y, { solid: true });
  }

  // Mark Quest Plant tiles solid (so player walks up & faces them to examine)
  for (const p of PLANT_NODES) {
    setTile(p.x, p.y, { solid: true });
  }

  // Mark NPC tiles solid
  for (const n of NPCS) {
    setTile(n.x, n.y, { solid: true });
  }

  function tileAt(x, y) {
    if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return null;
    return tiles[y][x];
  }

  function canStep(fromX, fromY, toX, toY) {
    const a = tileAt(fromX, fromY);
    const b = tileAt(toX, toY);
    if (!a || !b || b.solid) return false;
    // Moving onto or off a stair tile allows up to 1.0 elevation transition
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
    spawn: { x: 21, y: 31, dir: 'up' },
    tileAt,
    canStep,
  };
}

function getZoneName(x, y, elev) {
  if (y >= 32) return 'Main Gate · Gov. Pack Road';
  if (elev === 2) return 'Upper Pine Hill Sanctuary';
  if (elev === 1) {
    if (x >= 32) return 'Museo Kordilyera Terrace';
    return 'Kolehiyo ng Agham & Library Terrace';
  }
  if (x <= 13 && y <= 23) return 'Breha Residence Hall & Herbal Plot';
  if (x <= 13 && y > 23) return 'UPB Student Canteen';
  if (x >= 31 && y <= 24) return 'Campus Basketball Court';
  if (x >= 31 && y > 24) return 'University Health Service (UHS)';
  return 'Oblation Plaza & Alumni Courtyard';
}
