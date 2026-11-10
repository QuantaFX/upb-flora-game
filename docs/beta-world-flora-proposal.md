# Beta proposition — World, Flora, Assets

Scope: flora catalog, sample zone, sprite pipeline. No engine or save-format decisions here.

## 1. Stance

Plants are not collectibles with stats. Each node is an **identification** encounter: you see a shape, read a
field note, and name it. That is the only mechanic that makes a botanical setting more than a skin, and it is
what the Cordillera facts attach to.

Two rules keep the botany honest:

1. **Local names are the ones people actually use**, in the language of the community where the plant grows
   (Ibaloi, Kankanaey, Ifugao). Binomials are for the codex, never for the prompt — a prompt that says
   "Pinus kesiya" answers itself.
2. **Observation before name.** Every prompt is a thing you can check on the sprite (needle length, cone
   position, leaf arrangement), so the puzzle is solvable from the art alone.

## 2. Catalog (5)

All five grow in the Cordillera and four are visible on or around campus. None is a generic temperate filler.

| id | binomial | local | zone role | prompt gist | codex hook |
| --- | --- | --- | --- | --- | --- |
| `sp_benguet_pine` | *Pinus kesiya* | saleng (Ibaloi) | canopy, terrace risers | needles 15–20 cm, in threes; cones lateral on the branch | resined torch wood, ritual timber, watershed |
| `sp_benguet_lily` | *Lilium philippinense* | Benguet lily / *sabong ti bantay* | pathside, sunny shoulder | white trumpet, upward-facing, one stalk, grassy leaves | mountain-endemic, flowering Jun–Aug, roadside verge |
| `sp_pakpako` | *Cyathea* spp. | pakpako | shaded slope, stone wall | single trunk, croziers, fronds one plane | tree-ferns mark damp old-growth edges, spore (not seed) |
| `sp_medinilla` | *Medinilla* spp. | *malakadios* (Kankanaey) | epiphyte on trunk/hanging | leaves in whorls, berry clusters under the leaf | epiphytic on *saleng*, bird-dispersed |
| `sp_nepenthes` | *Nepenthes* (highland spp.) | *bagkong* / highland pitcher | wet stone lip, fog pocket | hanging tendril cup, lid, peristome rib | pitcher fluid, prey capture, mossy seeps |

`malakadios` and `bagkong` are the names to confirm with a local speaker before ship; mark them `needsReview` in
`data/flora.json` rather than presenting them as settled.

## 3. Sample zone — `zone_alumni_courtyard`

26 x 18 tiles, three terraces. Composition rule: one entrance, one loop, one dead-end that rewards the detour.

```
level 0  main terrace   stone path from south gate, benches, 2 pathside lily nodes
level 1  pine shelf     +1 step, saleng colonnade, medinilla epiphyte on trunk, 1 dead-end behind bench
level 2  sanctuary edge +1 step, canopy shade, pakpako on the retaining wall, 2 nepenthes on a moss seep
```

Stone paths carry the walkable route and are the only tiles with elevation transitions; grass is off-path
padding. Pine trunks are `solid`, canopy is a draw-only overlay at `elevation + 1` so the player passes under it.
Spawns sit on the terrace edge nearest the path so the approach is always readable, and the nepenthes pocket is
`spawnCondition.afterFlag = flag_met_guide` so the first visit stays short.

## 4. Sprites

No external assets. Every plant is drawn by a deterministic generator into an offscreen canvas, then cached as a
data-URI keyed `speciesId + variant + spriteSeed + elevation`. Same seed must give byte-identical output, so
sprites can be regenerated, diffed and golden-tested without shipping PNGs.

- `tools/gen-sprite.mjs <speciesId> <variant> <seed>` → `{ ok, dataUri, w, h, anchor }`, exits non-zero on
  unknown species so CI catches typos.
- Fixed silhouette per species, 48–96 px tall, 2:1-ish pixel grid at 1x, nearest-neighbour upscale for 2.5D.
- Palette per species (5–7 stops) with seeded hue jitter inside a ±6° band, so variants read as the same plant.
- Anchor is the foot point at the tile centre; the generator returns it instead of assuming it.
- Level rule: sprite bottom edge sits at `elevation * 8 px` over the tile, and is drawn with a 1 px darker
  under-edge as the contact shadow.

## 5. Play state

`hidden → spawned → found | wilted`. `found` persists in the save and survives reload; `wilted` is the
same node re-armed for a later pass after the codex entry is banked. Wilted nodes reuse the mature sprite with a
20 % desaturated palette, not a new asset.

## 6. Interfaces to the other agents

- **Engine:** asks a `FloraIndex` for nodes by zone, the sprite data-URI for a node, and calls
  `attemptIdentify(nodeId, input)`. Requires `elevation` in the player's collision model.
- **UI:** receives `{node, prompt, choices}` and returns the chosen spelling; the answer comparison and the
  codex write live here in beta, not in UI.
- **Build:** runs the schema validator over `data/zones/*.json` and the sprite golden test.

Open items: confirm both local names; decide whether `needsReview` plants ship behind the guide quest.