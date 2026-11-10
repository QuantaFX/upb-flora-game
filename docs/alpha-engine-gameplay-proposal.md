# Alpha verdict — Engine & Gameplay Systems

Scope: engine choice, movement/collision, camera, interaction controller, FloraDex + dialogue UI.
Assumes Beta's proposal (`beta-world-flora-proposal.md`) as the content contract. All coordinates below are
Beta's *logical* grid: 26 x 18 tiles, `elevation` 0..3.

---

## 1. Verdict on the engine

**Three.js. Unanimous on the axis that matters: elevation is real, not faked.**

| Requirement (from Beta) | Three.js (ortho, 45–60°) | Phaser 3 |
| --- | --- | --- |
| `elevation` is a collision property, 0..3 with steps between | 3D terrace solids; height is a *first-class* axis. One raycast gives ground height. | Height only exists if we re-implement it; Phaser's Arcade physics is 2D, so elevation is a parallel bookkeeping layer we own and can desync. |
| Sprite foot at `elevation * 8 px`, pass under canopy | Billboards with `depth` from real Y + height; canopy is a mesh at `elev + 1`, occlusion is geometric. | Manual `setDepth()` plumbing for every object every frame; "pass under canopy" is a custom sort lane. |
| Ambient Baguio mist/fog | `scene.fog` + a handful of soft instanced quads — authentic depth falloff for free. | Overlay PNG layers scrolling at parallax speeds; fog lies about depth. |
| Deterministic data-URI sprites | `CanvasTexture` on a plane, nearest sampling. Same source, same result. | Same, plus Phaser display-list churn for no gain. |
| Effort to first playable | Medium: ortho camera, tile-flagged terrace builder, billboard pool. | Low for 2D-only; the terrace/canopy/depth work eats the head start by mid-project. |

The sprite pipeline is *already 2D bitmaps*. The only 3D is flat-shaded terrace blocks — no models, no
lightmap baking, no GLTF. That is exactly the band where Three.js stays cheap and Phaser starts fighting us.
Decision: **Three.js r16x, orthographic camera, `pixelRatio` clamped to 1, `NearestFilter` on all flora
textures.** Phaser stays a viable fallback only if the terrace builder slips past its budget (see §7).

---

## 2. Movement & collision

### 2.1 Ground model
World is a `Level` with three layers stacked in Y:

- `terrain`: typed tiles — `path` (walkable), `grass` (walkable), `riser` (**step edge**, walkable across,
  elevation-delta), `solid` (trunk, wall, bench), `void`.
- `nodes`: Beta's `FloraNode` list, mapped from tile + elevation.
- `triggers`: zone gates, flag volumes.

Each tile stores `elevation` (0..3) and a `ramp` object on `riser` tiles: `{ fromElev, toElev, stairSteps }`.
Authoring rule from Beta holds: **only stone paths carry elevation transitions**, so a riser is reachable only
where the zone file says so.

### 2.2 Player controller (grid-locked, 1 tile = 32 world units)

Input is 4-way only. Movement is tile-to-tile on a tween, not continuous velocity:

1. `readInput()` — direction, unless `interaction.state === 'prompt'`.
2. `canEnter(target)`:
   - `solid`/`void`/out-of-bounds → reject.
   - `|target.elev - current.elev| > 1` → reject (no cliff hopping, no skipped step).
   - `|delta| === 1` → allow only if `target.tileType === 'riser'` **and** the ramp is graph-connected to
     `current`; descend allowed on any riser.
3. Commit: lock input for `stepMs` (risers `stepMs * 1.6`), tween X/Y, and if `delta !== 0` also tween Y-height
   by `delta * 8` in lockstep so the foot never floats.
4. On arrival fire `tileEntered` → spawn-condition check, node-proximity refresh.
5. Diagonal input is buffered: first legal axis of `[primary, secondary]` wins; none legal = no move (no slide).

`player.elevation` is *always* `floor(playerHeight / 8)` after landing and is the value Beta's
`attemptIdentify` gate reads — it is derived, never assigned from a tween mid-flight.

Occlusion: player and flora are billboards sorted by `y`; any canopy or riser face with
`renderOrder` above the player dims the player to 70 % while overlapping. Wall-hugging gets no special case —
the riser graph already makes the wall a `solid` perimeter.

### 2.3 Camera
Ortho, frustum sized to show ~22 x 14 tiles, pitched 52°. Follows a *dead-zone* target: player position lerped
at 0.12 with a 3-tile dead zone, clamped to zone bounds inset by half a screen so terraces never crop.
On elevation change: shift camera target Y up by `delta * 8 * 2` (deterministic, not eased), so the upper terrace
is legible. No camera rotation in-zone; zone entry does a single 400 ms framing tween.

---

## 3. Interaction controller

State machine on the player: `free → nearNode → prompt → resolving → cooldown → free`. Exactly one node can be
`nearNode` (nearest by tile distance, tie-break zone author order).

- **Enter `nearNode`**: same `elevation`, orthogonal-adjacent (or on-node) tile, node `state === 'spawned'`.
  Shows a floating `[E] Examine` marker and the sprite silhouette gets a 1 px outline.
- **Examine**: sends `{nodeId, prompt, choices}` to the UI (Beta owns prompt text + answer matching).
  Input is locked; player faces the node.
- **Resolving**: UI returns a spelling → engine calls `FloraIndex.attemptIdentify(nodeId, input)`.
  `found` → desaturate, marker clears. Wrong → shake, node stays `spawned`, one retry without penalty,
  second wrong reveals the first letter of the local name.
- **Cooldown**: 250 ms to stop instant double-examine.
- Blocked while airborne on a riser (you can't stop mid-step) — closes the "examine from the stair, then take
  the prompt to the terrace above" exploit.

Back-out: `Esc` from `prompt` returns to `free`, node stays `spawned`; the retry counter persists per node until
`found`.

---

## 4. FloraDex & dialogue UI

DOM overlay above the canvas, not in-engine — text input, focus order, and screen readers are browser problems.
Both panels are focus-trapped and pause the interaction controller.

**Dialogue (examine panel).** Speaker rule: styled as a **field note**, never as NPC narration. Layout:
prompt text → species silhouette (blanked, no palette hint) → 3 chip choices from
`answerKey.accepted`, shuffled per open with `seed = hash(nodeId + attempt)` (revealed membership only; the
correct chip is not distinguishable until picked). `freeText: true` swaps chips for a one-line input with
`autocapitalize="off"` and comparison done lowercase in Beta's layer. Chip = keyboard `1/2/3`, arrows, or click.
Result state renders in-place: success shows local name + binomial and a `+ Codex` toast.

**FloraDex.** Full-screen, opened with `Tab`, grid of species cards. Each card: silhouette slot + sprite thumbnail,
local name, binomial, codex excerpt. States: `locked` (silhouette, `???`), `found` (full color, codex readable),
`wilted` (desaturated thumb, codex read-only re-read allowed). Header shows `n/5 discovered` with per-terrace
groups. Dex is read-only against the save — it never re-arms a node.

Accessibility floor: both panels are real `<button>`/`<input>`/`<dialog>` elements, `aria-live="polite"` on the
result line. UI code owns zero botany strings; everything comes from `flora.json` / the node.

---

## 5. Riser geometry & the 8 px rule

`riser` tiles render as a 1-step face at `elev * 8` tall with `stairSteps` sub-steps for the tween, and the
sprite shadow sits on the *target* elevation so the foot line reads before you commit. A riser with mismatched
neighbour elevations fails the zone validator (same build as the schema check) — a step must connect two real
terraces.

## 6. Zone data contract additions (requested from Beta)

- Per-riser `{ fromElev, toElev, stairSteps }` in the zone file; validate connectivity and reject orphans.
- `attempt` counter as runtime-only node field (never in the schema's persisted `state`).
- Explicit `solid` list for benches/walls so "walkable" is data, not decoration.

## 7. Budgets & fallback

Terrace builder + controller + camera ≤ 3 dev days to a walkable 3-terrace loop. If the builder misses by the
end of day 2, we keep the controller and camera exactly as written and swap to a flat Phaser scene with
`elevation * 8` applied as a render offset — transport cost stays one file (`world/levels.js`).