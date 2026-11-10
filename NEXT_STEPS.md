# UP Baguio Flora Quest: Next Steps (handoff)

Last updated: 2026-11-10, 20:38

## 1. Current state

- **Old prototype archived.** It is in `archive/v0/` (old `src/`, `index.html`, `scripts/`). It ran, but it had no story and the visuals were rough. Treat it as reference only.
- **New, empty folders are ready.** `src/world`, `src/game`, `src/data`, `src/ui`, `scripts/`. Stack stays the same: Vite + Three.js (`npm run dev`). Playwright is installed for screenshot tests.
- **Generated plant art is done.**
  - Source JPGs (magenta background) are in `art-src/`.
  - Processed PNGs with transparency are in `public/game/plants/`:
    - `<id>.png`: battle/journal portrait, about 128 px.
    - `<id>_world.png`: small overworld sprite.
  - IDs: `benguet_pine, lagundi, sambong, tsaang_gubat, takip_kuhol, benguet_lily, tree_fern, mexican_sunflower, sapinit`.
  - Title backdrop: `public/game/title_bg.jpg`.
  - To regenerate: `node tools/process-art.mjs` (each plant has its own downscale factor and outline flag).
- **Asset pack (CC0).** The Ninja Adventure pack is already copied to `public/assets/Ninja Adventure - Asset Pack/`. URL-encode the spaces in paths.
- **Missing:** `index.html` and every file in `src/`. These are the next things to write.

## 2. Files to create (planned architecture)

```
index.html              canvas host + DOM UI layers (title, dialog, encounter, journal, HUD)
src/main.js             boot: load assets -> title screen -> game loop
src/assets.js           image loader, tile slicing, sprite-sheet helpers
src/style.css           pixel UI (font: Ui/Font/NormalFont.ttf, cream panel + orange border like Ui/Dialog/DialogBox.png)
src/world/map.js        ASCII-layer map: tiles, elevation 0-2, stairs, buildings, props, NPC + plant spots, tall grass
src/world/terrain.js    one BufferGeometry: textured tile tops (ground canvas atlas) + cliff walls + stair ramps
src/world/props.js      billboard sprites (trees, bushes, signs) + 3D box buildings with canvas-painted facades/sign text + gable roofs
src/world/actor.js      character billboard, Pokemon-style grid movement (tap = turn, hold = walk, Shift = run), 4-frame walk
src/game/state.js       flags, inventory, journal, quest states, localStorage save
src/game/dialog.js      typewriter dialog box with faceset, choices, click/E/Space to advance
src/game/quests.js      quest definitions + state machine + NPC emotes (! available, ? in progress, heart done)
src/game/encounter.js   Pokemon-style plant encounter screen
src/game/journal.js     Field Journal (Floradex): 9 entries, silhouettes "???" until identified
src/data/plants.js      plant facts (section 5)
src/data/story.js       NPC dialog scripts per quest state
src/audio.js            music + sfx from Audio/
```

## 3. Rendering and engine decisions

- **Scale.** 1 tile = 1 world unit (16 px). One elevation level = 1 unit tall.
- **Camera.** `PerspectiveCamera`, field of view about 30°, pitched about 50° down, distance about 22, following the player. Shows roughly 15×20 tiles, like Pokemon Black/White.
- **Materials.** `MeshBasicMaterial`, `NearestFilter`, `alphaTest: 0.5` so sprites need no sorting. Bake shading into vertex colors (walls darker). Add fog plus drifting mist quads for the Baguio atmosphere.
- **Ground.** Paint the whole map onto one canvas (W×16 by H×16) and UV-map each tile top to its cell.
- **Sprites.** Vertical planes facing +Z, height scaled by about 1/cos(pitch). Put a blob shadow under each one.
- **Buildings.** 3D boxes with a procedurally painted pixel facade (windows, door, sign such as "COLLEGE OF SCIENCE") and a prism roof.

## 4. Asset coordinates (tile = 16 px, given as column,row)

**`Backgrounds/Tilesets/TilesetFloor.png`** (light grass block)
- Plain grass: (0,12). Grass tuft variants: (1..4,12).
- Dirt path autotile, 4-neighbour mask:
  - Corners: top-left (0,7), top-right (2,7), bottom-left (0,9), bottom-right (2,9).
  - Edges: top (1,7), left (0,8), right (2,8), bottom (1,9). Center: (1,8).
  - Vertical strip: top end (3,7), middle (3,8), bottom end (3,9).
  - Horizontal strip: left end (0,10), middle (1,10), right end (2,10).
  - Single isolated tile: (3,10).
- Darker grass variant: same layout shifted +11 columns.
- Blue and orange plaza patterns: rows 21–25.

**`TilesetRelief.png`**
- Grey-green stone cliff: (5,1).
- Brown cliff: (5,6).

**`TilesetNature.png`**
- Round bush: (0,0) 32×32. Conifer: (2,0) 32×32.
- Small bushes: row 10.
- Row 11: sunflowers (0,11) and (1,11), red flower (3,11), ferns (4,11) and (5,11), daisy (6,11), **tall grass (7,11)**.
- Round green tree: (3..5, 18..20), 48×48.
- Rocks: right side of the sheet.

**Other tilesets**
- `TilesetElement.png`: sign (0,2), stairs pieces (6..9, 11..12), bench and stall in the top rows.
- `TilesetHouse.png`: small houses at (0..3, 0..2), 64×48. Roofs can be sampled for textures.

**Characters** (`Actor/Character/<Name>/SpriteSheet.png`, 64×112)
- Columns: down, up, left, right. Rows 0–3: walk frames.
- `Child` and `OldWoman` sheets are only 64×32 (2 frames).
- Each character also has a `Faceset.png` (38×38).

**UI and audio**
- Emotes (`Ui/Emote/emoteN.png`, 14×13): 22 = red !, 25 = red ?, 27 = heart, 12 = sick, 20 = "...".
- Music (`Audio/Musics`): "33 - Calm Village" (overworld), "22 - Dream" or "13 - Mystical" (encounter), "6 - Story" (intro), "8 - End Theme" (ending). Jingles are in `Audio/Jingles`; menu sfx in `Audio/Sounds/Menu`.

## 5. Cast

| NPC | Sprite | Role |
|---|---|---|
| Player (named on the title screen) | Villager3 | Freshman BS Biology student |
| Prof. Mila Dulay | Princess | Botanist, runs "Project Saleng" (campus native-plant digital herbarium) |
| Apo Sabado | OldMan3 | Ibaloi elder, shares saleng lore |
| Paolo | Villager5 | Roommate with a cough (dorm) |
| Manong Ben | Inspector | Gate guard, history of kidney stones, swollen feet |
| Ate Lorna + Jun-jun | Villager4 + Child | Canteen vendor and her son with a stomach ache |
| Kiko | Boy | Scraped his knee at the basketball court |
| Nurse Ruth | Woman | University Health Service; safety reminders |
| Curator | Samurai | Museo Kordilyera |
| Bea | Village6 | Photography student (sunflower side quest) |

## 6. Missions (story-driven, each tied to a real plant use)

| # | Mission | Giver | Plant |
|---|---|---|---|
| M1 | Roots of the Campus (tutorial) | Prof. Dulay | Benguet Pine |
| M2 | Ubo sa Dorm | Paolo | Lagundi |
| M3 | Manong Ben's Burden | Manong Ben | Sambong |
| M4 | Sakit ng Tiyan | Ate Lorna | Tsaang Gubat |
| M5 | Gasgas sa Court | Kiko | Takip-kuhol |
| M6 | Liryo ng Kabundukan | Curator | Benguet Lily |
| M7 | Finale | Prof. Dulay | (all) |
| S1 | Sunflower Season (side) | Bea | Mexican sunflower |
| (journal filler) | none | n/a | Sapinit, tree fern |

- **M1:** Prof. Dulay gives you the Field Journal and asks you to identify the old Benguet pine. Apo Sabado then tells the saleng lore. Finishing M1 unlocks M2–M5.
- **M2:** Find lagundi in the dorm garden and return it to Paolo. Message: lagundi relieves cough; see a doctor if it lasts more than 2 weeks.
- **M3:** Find sambong in the College of Science side garden. Message: it is a diuretic that helps pass kidney stones and eases swelling.
- **M4:** Find tsaang gubat by the hedge near the canteen. Message: it helps with stomach ache and diarrhea; also give ORS (oral rehydration salts).
- **M5:** Find takip-kuhol on damp ground near the court drain. Message: wash the wound first, then apply a poultice.
- **M6:** Unlocks after M2–M5. Find the Benguet lily on the north pine-hill slope. It is protected: you can only **photograph** it, never pick it.
- **M7:** Return to Prof. Dulay for the "Project Saleng: Demo Complete" ending and credits.
- **S1:** Bea asks whether the sunflowers are native. Identifying Tithonia reveals the twist: it is **not native**.

## 7. Encounter mechanics (Pokemon homage)

- **Triggers:**
  - Visible quest plants (marked with a sparkle): interact by facing them.
  - Tall grass: about 8% chance per step of a wild encounter drawn from the zone's plant list.
- **Transition:** flash, then the plant portrait slides in on a platform while the player's back sprite slides in on the left.
- **Menu (2×2):**
  - **OBSERVE:** pick Leaves / Flowers & Fruit / Smell & Touch / Habitat to reveal that clue.
  - **IDENTIFY:** choose from 4 names. A wrong pick costs 1 of 3 Focus. At 0 Focus the plant "blends in" and you leave (you can retry).
  - **COLLECT:** only allowed after identification ("never harvest a plant you can't name"). Normal plants give a sustainable harvest item. Protected plants give a PHOTO instead.
  - **LEAVE.**
- **Rewards:** a correct identification plays a jingle and unlocks the journal entry (lore, uses, caution).

## 8. Plant facts (verified via web/StuartXchange)

1. **Benguet Pine** (*Pinus kesiya*)
   - Status: native to the Cordillera.
   - Identification: needles in bundles of 3; egg-shaped woody cones; resinous sap; dry, sunny slopes.
   - Uses: "saleng" is its resin-rich heartwood, a traditional kindling/torch; watershed protection; "City of Pines".
   - Caution: cutting pines in Baguio is regulated; use fallen wood only.
2. **Lagundi** (*Vitex negundo*)
   - Local name: Ilocano *dangla*.
   - Identification: 5 narrow leaflets (sometimes 3), pale underneath; lavender flower spikes; peppery smell.
   - Uses: DOH-approved for cough, asthma and colds (leaf decoction).
3. **Sambong** (*Blumea balsamifera*)
   - Local name: Ilocano *subusob*.
   - Identification: large hairy toothed silvery leaves; yellow fluffy flower heads; strong camphor smell.
   - Uses: DOH-approved diuretic; helps pass urinary stones; eases edema.
4. **Tsaang Gubat** (*Ehretia microphylla*, also known as *Carmona retusa*)
   - Identification: tiny glossy leaves with white dots, toothed tips; white star flowers; yellow-to-red berries; grows in hedges.
   - Uses: DOH-approved for stomach ache and diarrhea.
5. **Takip-kuhol** (*Centella asiatica*, gotu kola)
   - Local name: Ilocano *tapingan-daga* (not yet verified).
   - Identification: round scalloped kidney-shaped leaves on long stalks; runners; damp shade.
   - Uses: traditional wound-healing poultice.
6. **Benguet Lily** (*Lilium philippinense*)
   - Status: **endemic** to the Cordillera and threatened by over-collection.
   - Identification: grass-like leaves on one stem; white trumpet flowers tinged purple outside; blooms in the rainy season (May–Aug). In November, show dry seed capsules instead.
   - Rule: **do not pick or dig.**
7. **Tree fern** (*Cyathea contaminans* / *Sphaeropteris*)
   - Local name: *tibanglan* (Benguet).
   - Status: trunks are overharvested as orchid mounts; tree ferns are CITES Appendix II, so treat as protected.
8. **Mexican sunflower** (*Tithonia diversifolia*)
   - Status: **introduced** from Mexico/Central America.
   - Notes: iconic November–December Baguio bloom; used as green manure; invasive tendencies.
9. **Sapinit** (*Rubus rosifolius*)
   - Status: native wild raspberry.
   - Uses: edible berries and jam.
   - Caution: eat only berries you have positively identified.

Every medicinal entry should end with: *"Herbal remedies support, but don't replace, a doctor's care."*

## 9. Map plan (about 44×36 tiles; north = up; camera looks north)

| Area | Location (tiles) | Elevation | Contents |
|---|---|---|---|
| Road + main gate | y 33–35 | 0 | Gov. Pack Road (not walkable), fence, gate at x 20–23, guard house with Manong Ben at (24–25, 31–32) |
| Entrance plaza | x 14–29, y 26–32 | 0 | Statue, old Benguet pine at (16,25) with Apo Sabado and Prof. Dulay |
| West | y 24–28 (canteen), y 15–21 (dorm) | 0 | Canteen, tsaang gubat hedge at (11,27), dormitory with lagundi garden at (4,22) |
| East | y 25–29 (clinic), y 17–22 (court) | 0 | Health Service, basketball court, takip-kuhol by the drain at (31,23) |
| Central terrace | y 10–21 | 1 | College of Science, Library/Admin, sambong at (24,17); stairs from the plaza at x 21–22, y 22 |
| Museum | x 33–40, y 9–13 | 1 | Museo Kordilyera |
| Pine Hill | y 1–8 | 2 | Pine forest; stairs at (12,9); Benguet lily slope at (6,2); tree fern by the creek at (26,3) |

Tall-grass patches (wild encounters) go near the dorm, on Pine Hill, and east of the court. Scatter sunflowers everywhere.

## 10. Verification

- Write `scripts/smoke.mjs` (Playwright). It should start the dev server, walk through M1, and take screenshots into `shots/`.
- Run `npm run build` to confirm the production build works.

## 11. Suggested build order

1. `index.html`, `style.css`, `assets.js`, `map.js`, `terrain.js`: get a walkable campus on screen.
2. `actor.js`: player movement, collision, stairs, camera.
3. `props.js`: trees, buildings, signs.
4. `dialog.js`, `state.js`, `story.js`, `quests.js`: NPCs and M1.
5. `encounter.js`, `journal.js`, `plants.js`: the full loop.
6. M2–M7 plus S1, audio, title screen and ending.
7. Smoke test and build.
