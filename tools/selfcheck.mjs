/**
 * Generator self-check. Run: node tools/selfcheck.mjs
 * Covers every kit/variant pair, determinism, PNG round-trip and the data files.
 */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { catalog, decodePng, generate } from './gen-sprite.mjs';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const failures = [];
const check = (name, fn) => {
  try {
    fn();
    console.log(`ok   ${name}`);
  } catch (err) {
    failures.push(`${name}: ${err.message}`);
    console.log(`FAIL ${name}: ${err.message}`);
  }
};

const cat = catalog();
const all = [
  ...Object.entries(cat.plants).flatMap(([k, vs]) => vs.map((v) => [k, v])),
  ...cat.player.map((f) => ['player', f]),
  ...cat.tiles.map((t) => [t, t.slice(5)]),
];

check('every kit/variant renders with a valid PNG', () => {
  for (const [kit, variant] of all) {
    const r = generate(kit, variant, 3);
    const img = decodePng(r.png);
    assert.equal(img.width, r.width);
    assert.equal(img.height, r.height);
    let opaque = 0;
    for (let i = 3; i < img.rgba.length; i += 4) if (img.rgba[i] > 0) opaque += 1;
    assert.ok(opaque > 100, `${kit}/${variant} too empty (${opaque}px)`);
  }
});

check('same seed is byte-identical, different seed jitters', () => {
  for (const [kit, variant] of all) {
    assert.ok(generate(kit, variant, 9).png.equals(generate(kit, variant, 9).png), `${kit}/${variant} not deterministic`);
  }
  assert.ok(!generate('sp_benguet_lily', 'mature', 1).png.equals(generate('sp_benguet_lily', 'mature', 2).png));
});

check('unknown kit and variant exit non-zero via CLI contract', async () => {
  assert.throws(() => generate('sp_nope', 'mature', 1), /unknown kit/);
  assert.throws(() => generate('sp_benguet_lily', 'glowing', 1), /unknown variant/);
});

check('anchor sits at the foot point', () => {
  const r = generate('sp_medinilla', 'mature', 0);
  assert.deepEqual(r.anchor, { x: 28, y: 95 });
  const t = generate('tile', 'grass', 0);
  assert.deepEqual(t.anchor, { x: 8, y: 15 });
});

check('wilted is desaturated relative to mature', () => {
  const sat = (uri) => {
    const img = decodePng(Buffer.from(uri.split(',')[1], 'base64'));
    let sum = 0;
    for (let i = 0; i < img.rgba.length; i += 4) {
      const [r, g, b] = [img.rgba[i], img.rgba[i + 1], img.rgba[i + 2]];
      sum += Math.max(r, g, b) - Math.min(r, g, b);
    }
    return sum;
  };
  for (const id of Object.keys(cat.plants)) {
    assert.ok(sat(generate(id, 'wilted', 4).dataUri) < sat(generate(id, 'mature', 4).dataUri), `${id} wilted not desaturated`);
  }
});

const flora = JSON.parse(readFileSync(join(root, 'data', 'flora.json'), 'utf8'));
const speciesIds = new Set(flora.species.map((s) => s.id));

check('flora catalog has the five targeted species', () => {
  assert.deepEqual([...speciesIds].sort(), ['sp_benguet_lily', 'sp_benguet_pine', 'sp_medinilla', 'sp_nepenthes', 'sp_pakpako']);
});

const zonesDir = join(root, 'data', 'zones');
for (const file of readdirSync(zonesDir).filter((f) => f.startsWith('zone_') && f.endsWith('.json') && f !== 'zone-file.schema.json')) {
  const zone = JSON.parse(readFileSync(join(zonesDir, file), 'utf8'));
  check(`${file}: grid is ${zone.width}x${zone.height}`, () => {
    assert.equal(zone.terrain.length, zone.height);
    for (const row of [...zone.terrain, ...zone.props]) assert.equal(row.length, zone.width);
  });
  check(`${file}: ids in flora.json, tiles and props in legends`, () => {
    for (const n of zone.nodes) assert.ok(speciesIds.has(n.speciesId), n.id);
    for (const row of zone.terrain) for (const c of row) assert.ok(zone.tileLegend[c], `tile char ${c}`);
    for (const row of zone.props) for (const c of row) assert.ok(c === '.' || zone.propLegend[c], `prop char ${c}`);
  });
  check(`${file}: nodes in bounds, unique, standing on their own terrace`, () => {
    const ids = new Set();
    for (const n of zone.nodes) {
      assert.ok(!ids.has(n.id));
      ids.add(n.id);
      assert.ok(n.tile.x < zone.width && n.tile.y < zone.height, n.id);
      assert.equal(zone.tileLegend[zone.terrain[n.tile.y][n.tile.x]].elevation, n.elevation, `${n.id} elevation`);
      assert.equal(zone.props[n.tile.y][n.tile.x], '.', `${n.id} under a prop`);
      assert.match(n.discoveryPrompt, /\?$/);
      for (const a of [...n.answerKey.accepted, ...flora.species.find((s) => s.id === n.speciesId).localNames.map((l) => l.name)]) {
        assert.ok(!n.discoveryPrompt.toLowerCase().includes(a), `${n.id} prompt leaks "${a}"`);
      }
    }
  });
  check(`${file}: entry on an open same-level tile`, () => {
    for (const e of zone.entries) {
      assert.equal(zone.tileLegend[zone.terrain[e.tile.y][e.tile.x]].elevation, e.elevation);
      assert.equal(zone.props[e.tile.y][e.tile.x], '.');
    }
  });
}

if (failures.length) {
  console.error(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log('\nall checks passed');