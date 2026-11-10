import { Actor } from './actor.js';

const VISITORS = [
  {
    id: 'visitor_aya',
    name: 'Aya',
    sprite: 'Villager6',
    x: 25,
    y: 49,
    lines: [
      'Happy Native Plants Week! Have you filled your herbarium yet?',
      'The library walk is my favorite place to take a break.',
    ],
  },
  {
    id: 'visitor_luis',
    name: 'Luis',
    sprite: 'Villager2',
    x: 29,
    y: 48,
    lines: [
      'Seven plants, seven stories. I still have three to find!',
      'A photo lasts longer than a picked flower.',
    ],
  },
  {
    id: 'visitor_mai',
    name: 'Mai',
    sprite: 'Woman',
    x: 44,
    y: 31,
    lines: [
      'The fern near Inang Laya is easy to miss. Look closely!',
      'Please leave the garden beds for the plants.',
    ],
  },
  {
    id: 'visitor_nico',
    name: 'Nico',
    sprite: 'Villager',
    x: 49,
    y: 28,
    lines: [
      'The bunting looks lovely against the pine trees.',
      'See you at the celebration by Court A!',
    ],
  },
  {
    id: 'visitor_sam',
    name: 'Sam',
    sprite: 'Villager5',
    x: 68,
    y: 33,
    lines: [
      'Welcome! Professor Barcelo can help you get started.',
      'Keep your camera ready. There is a lot growing here.',
    ],
  },
  {
    id: 'visitor_jo',
    name: 'Jo',
    sprite: 'Villager4',
    x: 47,
    y: 44,
    lines: [
      'A little shade, a bench, and a good book. Perfect.',
      'Have you met the campus cats and dogs yet? They love being petted!',
    ],
  },
  {
    id: 'visitor_ren',
    name: 'Ren',
    sprite: 'Boy',
    x: 45,
    y: 40,
    lines: [
      'We are taking a break from the game to explore the plants.',
      'Enjoy the festival! Watch your step on the terraces.',
    ],
  },
  {
    id: 'visitor_toni',
    name: 'Toni',
    sprite: 'Village6',
    x: 42,
    y: 9,
    lines: [
      'The north gardens are full of little surprises.',
      'Take your time. Plants reward a closer look.',
    ],
  },
  {
    id: 'visitor_carlo',
    name: 'Carlo',
    sprite: 'Villager3',
    x: 61,
    y: 25,
    lines: [
      'I just climbed up from the Oblation driveway — what a view!',
      'The pine breeze on the eastern steps feels so refreshing.',
    ],
  },
  {
    id: 'visitor_trisha',
    name: 'Trisha',
    sprite: 'Princess',
    x: 42,
    y: 27,
    lines: [
      'We are sketching the ferns and wildflowers around Inang Laya.',
      'Even the campus birds seem excited for Native Plants Week!',
    ],
  },
  {
    id: 'visitor_mark',
    name: 'Mark',
    sprite: 'Villager2',
    x: 20,
    y: 23,
    lines: [
      'Walking from the Alumni Center down to CSS is my daily leg workout!',
      'Check out the pine grove behind CSS when you head west.',
    ],
  },
  {
    id: 'visitor_cheska',
    name: 'Cheska',
    sprite: 'Villager6',
    x: 11,
    y: 27,
    lines: [
      'The CSS courtyard is so peaceful in the morning mist.',
      'There is a friendly dog napping near the CAC walkway!',
    ],
  },
  {
    id: 'visitor_paulo',
    name: 'Paulo',
    sprite: 'Boy',
    x: 56,
    y: 35,
    lines: [
      'You can walk all the way from the Summit Quad down to Court A via the side stairs.',
      'Have you spotted the blue mountain birds near the pines?',
    ],
  },
  {
    id: 'visitor_elena',
    name: 'Elena',
    sprite: 'Villager4',
    x: 35,
    y: 44,
    lines: [
      'I love how green the campus is this week.',
      'There are plenty of benches if you want to rest between missions.',
    ],
  },
  {
    id: 'visitor_dan',
    name: 'Dan',
    sprite: 'Villager',
    x: 47,
    y: 16,
    lines: [
      'The walkway behind Kolehiyo ng Agham overlooks the northern woods.',
      'Watch out for the ferns along the terrace slope!',
    ],
  },
  {
    id: 'visitor_lia',
    name: 'Lia',
    sprite: 'Child',
    x: 15,
    y: 47,
    lines: [
      'I petted three cats and two dogs on campus today!',
      'Look at all the little flowers growing in the grass!',
    ],
  },
];

export const PETS = [
  // Campus Cats
  {
    id: 'pet_mingming',
    name: 'Mingming',
    species: 'Campus Cat',
    sprite: 'cat_orange',
    scale: 0.82,
    x: 66,
    y: 31,
    sound: 'Purrrr~',
    lines: [
      '*Purrrr~* Mingming rubs her warm orange cheek against your hand and curls her tail happily!',
      '*Mrow~* Mingming kneads the sun-warmed stone pavers and blinks slowly at you.',
    ],
  },
  {
    id: 'pet_siopao',
    name: 'Siopao',
    species: 'Library Cat',
    sprite: 'cat_white',
    scale: 0.82,
    x: 21,
    y: 48,
    sound: 'Meow~',
    lines: [
      '*Meow~* Siopao rolls onto his back outside the UPB Library for a gentle chin scratch!',
      '*Purrrr~* Siopao nuzzles your palm and stretches out in the cool Baguio breeze.',
    ],
  },
  {
    id: 'pet_uling',
    name: 'Uling',
    species: 'Summit Quad Cat',
    sprite: 'cat_black',
    scale: 0.82,
    x: 40,
    y: 28,
    sound: 'Mrrr-ow!',
    lines: [
      '*Mrrr-ow!* Uling arches his sleek black back into your hand and purrs like a tiny motor!',
      '*Purrrr~* Uling chirps happily and follows your footsteps across the quad.',
    ],
  },
  {
    id: 'pet_luya',
    name: 'Luya',
    species: 'Cafeteria Cat',
    sprite: 'cat_ginger',
    scale: 0.82,
    x: 27,
    y: 21,
    sound: 'Mew~',
    lines: [
      '*Mew~* Luya leans into your ear scratches near Balay Panganan and purrs contentedly!',
      '*Purrrr~* Luya flicks her ginger tail with joy after a good petting session.',
    ],
  },

  // Campus Dogs
  {
    id: 'pet_bantay',
    name: 'Bantay',
    species: 'Oblation Gate Dog',
    sprite: 'dog_brown',
    scale: 0.88,
    x: 75,
    y: 32,
    sound: 'Arf arf!',
    lines: [
      '*Arf arf!* Bantay wags his whole body with excitement as you pat his head!',
      '*Woof!* Bantay gives your hand a friendly lick and thumps his tail on the driveway.',
    ],
  },
  {
    id: 'pet_sagada',
    name: 'Sagada',
    species: 'Court A Trail Dog',
    sprite: 'dog_orange',
    scale: 0.88,
    x: 46,
    y: 43,
    sound: 'Woof!',
    lines: [
      '*Woof!* Sagada leans happily against your leg as you scratch behind her floppy ears!',
      '*Arf!* Sagada does a happy little play-bow on the promenade!',
    ],
  },
  {
    id: 'pet_kubo',
    name: 'Kubo',
    species: 'Science Quad Dog',
    sprite: 'dog_spotted',
    scale: 0.88,
    x: 52,
    y: 27,
    sound: 'Arf!',
    lines: [
      '*Arf!* Kubo wags his spotted tail nonstop as you give him belly and neck rubs!',
      '*Woof woof!* Kubo trots in a happy circle around you on the College of Science quad.',
    ],
  },
  {
    id: 'pet_chico',
    name: 'Chico',
    species: 'CSS Courtyard Dog',
    sprite: 'dog_yellow',
    scale: 0.88,
    x: 11,
    y: 46,
    sound: 'Woof~',
    lines: [
      '*Woof~* Chico tilts his golden head into your hand for extra ear scratches!',
      '*Arf arf!* Chico wags his tail cheerfully outside the College of Social Sciences.',
    ],
  },

  // Campus Birds
  {
    id: 'pet_pipit',
    name: 'Pipit',
    species: 'Cordillera Bluebird',
    sprite: 'bird_blue',
    scale: 0.72,
    x: 68,
    y: 26,
    sound: 'Tweet-tweet!',
    lines: [
      '*Tweet-tweet!* Pipit fluffs its bright blue feathers as you gently stroke its crest!',
      '*Chirp~* Pipit hops playfully onto the garden edge and sings a sweet highland note.',
    ],
  },
  {
    id: 'pet_maya',
    name: 'Maya',
    species: 'Campus Sparrow',
    sprite: 'bird_sparrow',
    scale: 0.72,
    x: 34,
    y: 47,
    sound: 'Chirp chirp!',
    lines: [
      '*Chirp chirp!* Maya leans into your gentle finger-boop and flutters her wings happily!',
      '*Tweet~* Maya pecks affectionately at your sleeve and chirps a cheerful tune.',
    ],
  },
  {
    id: 'pet_paloma',
    name: 'Paloma',
    species: 'Quad White Dove',
    sprite: 'bird_dove',
    scale: 0.72,
    x: 46,
    y: 30,
    sound: 'Coo-coo~',
    lines: [
      '*Coo-coo~* Paloma coos softly as you gently pet her snowy white feathers!',
      '*Coo~* Paloma bobs her head happily in the sunny Inang Laya quad.',
    ],
  },
  {
    id: 'pet_siklab',
    name: 'Siklab',
    species: 'Scarlet Sunbird',
    sprite: 'bird_red',
    scale: 0.72,
    x: 45,
    y: 9,
    sound: 'Tiririt!',
    lines: [
      '*Tiririt!* Siklab trills a bright melody as you gently stroke its crimson plumage!',
      '*Chirp-tweet!* Siklab hops twice in delight along the northern garden walk.',
    ],
  },
];

export function buildVisitors(scene, map, assets, onMove) {
  const entries = new Map();
  for (const [index, def] of VISITORS.entries()) {
    if (map.tileAt(def.x, def.y)?.solid) throw new Error(`Blocked visitor start: ${def.id}`);
    const actor = new Actor(scene, map, assets.characters[def.sprite], { ...def, dir: 'down' });
    actor.onStepComplete = onMove;
    entries.set(def.id, {
      def,
      actor,
      nextMove: 0.5 + (index % 5) * 0.25,
      turn: index,
      line: 0,
      dir: ['down', 'left', 'up', 'right'][index % 4],
    });
  }

  const pets = new Map();
  for (const [index, def] of PETS.entries()) {
    const animalAsset = assets.animals?.[def.sprite];
    if (!animalAsset) continue;
    const actor = new Actor(scene, map, animalAsset, {
      ...def,
      dir: index % 2 === 0 ? 'right' : 'left',
      scale: def.scale || 0.8,
    });
    actor.onStepComplete = onMove;
    pets.set(def.id, {
      def,
      actor,
      nextMove: 0.8 + (index % 6) * 0.3,
      turn: index,
      line: 0,
      heartUntil: 0,
      dir: ['right', 'left', 'down', 'up'][index % 4],
    });
  }

  const dirVec = {
    down: [0, 1],
    right: [1, 0],
    up: [0, -1],
    left: [-1, 0],
  };
  const allDirs = ['down', 'right', 'up', 'left'];
  const walkTypes = new Set(['path', 'plaza', 'road', 'court', 'court_stage', 'stair', 'grass']);

  function stepRoamer(entry, time, player, maxRadius, fast) {
    const { actor, def } = entry;
    if (actor.locked || actor.moving || time < entry.nextMove) return;

    entry.turn += 1;
    // Brief pause every 7 steps so people occasionally admire plants, otherwise brisk walking
    const pause = entry.turn % 7 === 0 ? 0.95 : 0;
    entry.nextMove = time + (fast ? 0.28 : 0.48) + (entry.turn % 3) * 0.14 + pause;

    // Prefer keeping current direction (70% of steps) so visitors walk along corridors and stairs naturally
    const candidateDirs = [
      entry.dir,
      allDirs[(entry.turn * 3 + 1) % 4],
      allDirs[(entry.turn * 3 + 2) % 4],
      allDirs[(entry.turn * 3 + 3) % 4],
    ];

    // Two-pass selection: Pass 0 prefers paved walkways/plazas/stairs; Pass 1 also allows open grass lawns
    for (let pass = 0; pass < 2; pass += 1) {
      for (const dir of candidateDirs) {
        const [dx, dy] = dirVec[dir];
        const x = actor.tileX + dx;
        const y = actor.tileY + dy;
        if (Math.abs(x - def.x) > maxRadius || Math.abs(y - def.y) > maxRadius) continue;
        if (x === player.tileX && y === player.tileY) continue;
        const t = map.tileAt(x, y);
        if (!t || !walkTypes.has(t.type)) continue;
        if (pass === 0 && t.type === 'grass') continue;
        if (actor.tryStep(dir)) {
          entry.dir = dir;
          return;
        }
      }
    }
  }

  function update(dt, time, paused, player) {
    for (const entry of entries.values()) {
      entry.actor.update(dt, time);
      if (!paused) {
        stepRoamer(entry, time, player, 28, true);
      }
    }
    for (const pet of pets.values()) {
      pet.actor.update(dt, time);
      if (pet.heartUntil > 0 && time > pet.heartUntil) {
        pet.heartUntil = 0;
        pet.actor.setEmote(null);
      }
      if (!paused) {
        stepRoamer(pet, time, player, 10, false);
      }
    }
  }

  // Visitors and campus pets never set tile.solid, so they never block paths.
  return { entries, pets, update };
}
