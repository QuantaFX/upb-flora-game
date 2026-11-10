#!/usr/bin/env node

/**
 * Procedural, deterministic pixel-art sprite generator.
 *
 *   node tools/gen-sprite.mjs <kit> <variant> <seed> [--scale N] [--png <file>]
 *   kit = sp_benguet_pine | sp_benguet_lily | sp_pakpako | sp_medinilla | sp_nepenthes
 *       | player | tile
 *   variant = mature | flowering | wilted | seedling | juvenile
 *           | down | up | left | right
 *           | grass | path_stone | stairs_up | stairs_down | wall_stone | moss
 *           | pine_trunk | bench | gate | guide | pc
 *
 * Prints { ok, kit, variant, seed, width, height, anchor, palette, dataUri } to stdout.
 * With no <seed> it prints the catalog of kits/variants. Exits 2 on unknown kit or variant.
 *
 * Sprites are built as packed RGBA matrices and encoded to PNG (zlib from node core),
 * so the same input gives byte-identical output. Every kit draws through the same
 * seeded PRNG for jitter only: column lists, silhouette, palette schedule are fixed.
 */

import { deflateSync, inflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// PRNG and math helpers. Jitter only; bridges draw in a fixed column list.
// ---------------------------------------------------------------------------

/** mulberry32: small, fast, well-behaved. */
export function rngFor(seed) {
  let a = (seed >>> 0) || 0x9e3779b9;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const hashString = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

// ---------------------------------------------------------------------------
// Color: HSL with seeded hue jitter (+-6 degrees, inside the species band).
// ---------------------------------------------------------------------------

export function hsl(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255), 255];
}

const shade = (c, dl, ds = 0) => hsl(rgbToHsl(c).h, rgbToHsl(c).s + ds, rgbToHsl(c).l + dl);
const desaturate = (c, amount) => {
  const { h, s, l } = rgbToHsl(c);
  return hsl(h, s * (1 - amount), l);
};

function rgbToHsl(c) {
  const r = c[0] / 255;
  const g = c[1] / 255;
  const b = c[2] / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;
  return { h, s: s * 100, l: l * 100 };
}

/** Fixed role lamps. Same schedule, different hue per species: variants read as one plant. */
const ROLE_LIGHT = {
  base: { dl: 0, ds: 0 },
  light: { dl: 18, ds: -6 },
  hi: { dl: 30, ds: -14 },
  shadow: { dl: -14, ds: 10 },
  deep: { dl: -26, ds: 14 },
};
const ROLE_RATIO = [0.42, 0.16, 0.1, 0.22, 0.1];
const ROLE_ORDER = ['base', 'light', 'hi', 'shadow', 'deep'];

function buildPalette({ name, hue, sat, lightness, ramp }) {
  const base = hsl(hue[0], sat[0], lightness[0]);
  const light = hsl(hue[1], sat[1], lightness[1]);
  const perRole = {
    base: ramp.map(() => base),
    light: ramp.map(() => light),
    hi: ramp.map(() => shade(light, ROLE_LIGHT.hi.dl, ROLE_LIGHT.hi.ds)),
    shadow: ramp.map(() => shade(base, ROLE_LIGHT.shadow.dl, ROLE_LIGHT.shadow.ds)),
    deep: ramp.map(() => shade(base, ROLE_LIGHT.deep.dl, ROLE_LIGHT.deep.ds)),
  };
  // Each role is a ramp; palettes.R.base[0] is the flat tone, palettes.R.deep[0] the darkest.
  const palette = { name, ...perRole, ramp };
  palette.pick = (random) => {
    let r = random();
    for (let i = 0; i < ROLE_ORDER.length; i += 1) {
      r -= ROLE_RATIO[i];
      if (r <= 0) return perRole[ROLE_ORDER[i]][Math.floor(random() * ramp.length)];
    }
    return perRole.base[0];
  };
  return palette;
}

function meta(hue, sat, lightness) {
  return { hue: [hue, hue + 6], sat: [sat, sat + 4], lightness: [lightness, lightness + 5] };
}

const PALETTE_SPECS = {
  stem: { name: 'stem', ...meta(46, 24, 26), ramp: [0, -7, -14, -100] },
  ladder: { name: 'ladder', ...meta(30, 34, 22), ramp: [0, -6, -12] },
  'resin': { name: 'resin', ...meta(34, 52, 38), ramp: [0, -7, -14] },
  stone: { name: 'stone', ...meta(38, 24, 63), ramp: [0, -7, -14, -100] },
  'stone-step': { name: 'stone-step', ...meta(37, 23, 59), ramp: [0, -7, -14, -100] },
  'grass-floor': { name: 'grass-floor', ...meta(96, 39, 42), ramp: [0, -6, -12, -100, 9] },
  'grass-lip': { name: 'grass-lip', ...meta(94, 37, 39), ramp: [0, -6, -12, -100, 9] },
  moss: { name: 'moss', ...meta(85, 42, 38), ramp: [0, -6, -12, -100, 8] },
  bark: { name: 'bark', ...meta(28, 32, 33), ramp: [0, 7, 14, -8, -16] },
  'bench-wood': { name: 'bench-wood', ...meta(27, 42, 42), ramp: [0, 8, 16, -8, -16] },
  'bench-iron': { name: 'bench-iron', ...meta(210, 10, 34), ramp: [0, 9, 17] },
  'pine-needle': { name: 'pine-needle', ...meta(92, 26, 42), ramp: [0, -7, -13, 7, -20] },
  pine: { name: 'pine', ...meta(93, 25, 41), ramp: [0, -8, -15, 8, -22] },
  'lily-leaf': { name: 'lily-leaf', ...meta(104, 27, 40), ramp: [0, -7, -13, 8] },
  lily: { name: 'lily', ...meta(102, 26, 39), ramp: [0, -9, -16, 9, -22] },
  'pakpako-trunk': { name: 'pakpako-trunk', ...meta(33, 26, 36), ramp: [0, 7, 14] },
  'pakpako-leaf': { name: 'pakpako-leaf', ...meta(133, 28, 42), ramp: [0, -8, -15, 8] },
  pakpako: { name: 'pakpako', ...meta(131, 27, 41), ramp: [0, -8, -15, 8, -20] },
  crozier: { name: 'crozier', ...meta(72, 38, 55), ramp: [0, -8, -16] },
  'medinilla-leaf': { name: 'medinilla-leaf', ...meta(147, 24, 36), ramp: [0, -7, -14, 7] },
  medinilla: { name: 'medinilla', ...meta(146, 24, 37), ramp: [0, -7, -14, 7, -18] },
  bract: { name: 'bract', ...meta(335, 46, 64), ramp: [0, 7, 15, -9, -16] },
  berry: { name: 'berry', ...meta(328, 42, 47), ramp: [0, -7, -14] },
  'nepenthes-cup': { name: 'nepenthes-cup', ...meta(18, 42, 45), ramp: [0, 8, 16, -9, -16] },
  'nepenthes-leaf': { name: 'nepenthes-leaf', ...meta(129, 28, 44), ramp: [0, -7, -14, 7] },
  peristome: { name: 'peristome', ...meta(357, 50, 46), ramp: [0, 9, 17, -9] },
  'tendril-green': { name: 'tendril-green', ...meta(122, 24, 38), ramp: [0, -7, -14] },
  petal: { name: 'petal', ...meta(80, 9, 97), ramp: [0, -3, -6, -9, -12] },
  anther: { name: 'anther', ...meta(44, 62, 57), ramp: [0, -6, -12] },
  skin: { name: 'skin', ...meta(25, 38, 69), ramp: [0, 7, -7] },
  hair: { name: 'hair', ...meta(26, 24, 25), ramp: [0, 9, 17] },
  jumper: { name: 'jumper', ...meta(9, 47, 48), ramp: [0, 7, 15, -8, -15] },
  trousers: { name: 'trousers', ...meta(211, 22, 33), ramp: [0, 9, 17] },
  boots: { name: 'boots', ...meta(25, 18, 24), ramp: [0, 10, 18] },
  satchel: { name: 'satchel', ...meta(30, 30, 40), ramp: [0, 8, 16] },
  steel: { name: 'steel', ...meta(208, 8, 66), ramp: [0, -8, -15] },
  paper: { name: 'paper', ...meta(46, 23, 91), ramp: [0, -4, -8] },
  ink: { name: 'ink', ...meta(215, 24, 24), ramp: [0, 15] },
  outline: { name: 'outline', ...meta(220, 16, 20), ramp: [0, 0] },
  uniform: { name: 'uniform', ...meta(148, 20, 36), ramp: [0, 9, 17, -9] },
  'uniform-dark': { name: 'uniform-dark', ...meta(150, 22, 26), ramp: [0, 9] },
  cap: { name: 'cap', ...meta(146, 21, 33), ramp: [0, 9, 17] },
  'hat-band': { name: 'hat-band', ...meta(34, 30, 34), ramp: [0, 9] },
  'cap-ember': { name: 'cap-ember', ...meta(12, 52, 52), ramp: [0, 9, 17] },
};

/** Resolve draw-side palette names to palette specs through each kit's alias table. */
function paletteFor(colors, seed, aliases = {}) {
  const random = rngFor(seed ^ 0xc0ffee);
  const hueShift = (Math.floor(random() * 13) - 6) * 0.6;
  const lightShift = (random() * 4 - 2) * 0.6;
  const out = {};
  for (const name of colors) {
    const spec = PALETTE_SPECS[aliases[name] ?? name];
    if (!spec) throw new Error(`no palette "${name}"`);
    out[name] = buildPalette({
      name,
      hue: spec.hue.map((h) => h + hueShift),
      sat: spec.sat,
      lightness: spec.lightness.map((l) => l + lightShift),
      ramp: spec.ramp,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Matrix helpers. Packed RGBA, top-down rows, transparent = 0.
// ---------------------------------------------------------------------------

const pack = (color) => (color[0] | (color[1] << 8) | (color[2] << 16) | (color[3] << 24)) >>> 0;
const emptyMatrix = (w, h) => new Uint32Array(w * h);

function put(m, p, x, y, color) {
  if (!color || x < 0 || y < 0 || x >= p.rw || y >= p.rh) return;
  m[y * p.rw + x] = pack(color);
}

function rect(m, p, x, y, w, h, palette, random, light) {
  for (let dy = 0; dy < h; dy += 1) for (let dx = 0; dx < w; dx += 1) put(m, p, x + dx, y + dy, light ? palette.hi?.[0] : palette.pick(random));
}

const inside = (p, x, y) => x >= 0 && y >= 0 && x < p.rw && y < p.rh;
const isSet = (m, p, x, y) => inside(p, x, y) && m[y * p.rw + x] !== 0;

/** 1 px outline around the silhouette, using a role of a palette. */
function outline(m, p, palette) {
  const src = m.slice();
  for (let y = 0; y < p.rh; y += 1) {
    for (let x = 0; x < p.rw; x += 1) {
      if (src[y * p.rw + x]) continue;
      if (isSet(src, p, x - 1, y) || isSet(src, p, x + 1, y) || isSet(src, p, x, y - 1) || isSet(src, p, x, y + 1)) {
        m[y * p.rw + x] = pack(palette.deep[0]);
      }
    }
  }
}

/** 1 px darker under-edge for contact shadow on the bottom half of the silhouette. */
function underEdge(m, p, palettes) {
  const src = m.slice();
  for (let x = 0; x < p.rw; x += 1) {
    let y = p.rh - 1;
    while (y >= 0 && !src[y * p.rw + x]) y -= 1;
    if (y < 0) continue;
    m[y * p.rw + x] = pack(palettes.deep[0]);
    if (src[y * p.rw + x]) {
      const below = y + 1 < p.rh ? src[(y + 1) * p.rw + x] : 0;
      if (below) m[(y + 1) * p.rw + x] = pack(palettes.deep[0]);
    }
  }
}

/** Draw a plant as < and > branches stepping up the left and right lists. */
function branches(m, p, palettes, random, left, right, step = 0.55) {
  const height = left.length - 1;
  const yOf = (pct) => p.yb - Math.round(pct * height);
  left.forEach((start, i) => {
    const x0 = p.cx - start;
    const y0 = yOf(i / height);
    for (let k = 0; k < start; k += 1) {
      const y = y0 - Math.floor(k * step);
      if (x0 + k < p.cx - 1) put(m, p, x0 + k, y, palettes.leaf.pick(random));
      if (left[i + 1] !== undefined && k === Math.ceil(start * 0.5)) {
        put(m, p, x0 + k, y - 1, palettes.leaf.hi[0]);
      }
    }
  });
  right.forEach((start, i) => {
    const x0 = p.cx + start;
    const y0 = yOf(i / height);
    for (let k = 0; k < start; k += 1) {
      const y = y0 - Math.floor(k * step);
      if (x0 - k > p.cx + 1) put(m, p, x0 - k, y, palettes.leaf.pick(random));
      if (right[i + 1] !== undefined && k === Math.ceil(start * 0.5)) {
        put(m, p, x0 - k, y - 1, palettes.leaf.hi[0]);
      }
    }
  });
}

function stemLine(m, p, palettes, top, curve = 0) {
  for (let y = top; y <= p.yb; y += 1) {
    put(m, p, p.cx, y, palettes.stem.pick(rngFor(1)));
    if (curve) put(m, p, p.cx + curve, y, palettes.stem.pick(rngFor(2)));
  }
}

const ANTHER_TICKS = [[-1, 0], [1, 0], [0, 1]];
const SIZES = { w: 56, h: 96, foot: [28, 95], top: [28, 32] };

// ---------------------------------------------------------------------------
// Plant kits
// ---------------------------------------------------------------------------

function drawPine(p, palettes, random, stage) {
  const m = emptyMatrix(p.rw, p.rh);
  const h = stage.factor * 78;
  const top = Math.round(p.yb - h);
  const trunkTop = Math.round(p.yb - h * 0.92);
  // Resin trunk: thick and pale with fresh crack marks, bare for the bottom two thirds.
  for (let y = trunkTop; y <= p.yb - 1; y += 1) {
    const t = (y - trunkTop) / (h * 0.92);
    const half = Math.round(0.6 + t * 2.1);
    for (let x = p.cx - half; x <= p.cx + half; x += 1) {
      const lit = x < p.cx;
      put(m, p, x, y, lit ? palettes.bark.light[0] : palettes.bark.pick(random));
    }
    if (random() < 0.35) put(m, p, p.cx, y, palettes.resin.hi[0]);
  }
  for (let x = p.cx - 3; x <= p.cx + 3; x += 1) put(m, p, x, p.yb - 1, palettes.bark.deep[0]);
  const needle = palettes.needle;
  const tiers = stage.bare ? 0 : 4;
  for (let tier = 0; tier < tiers; tier += 1) {
    const tierTop = trunkTop + tier * (h * 0.46 / tiers);
    const tierBase = tierTop + h * 0.3;
    const tierHalf = 7 + tier * 2.6;
    for (let y = Math.round(tierTop); y <= Math.round(tierBase); y += 1) {
      const s = (y - tierTop) / (tierBase - tierTop);
      const half = tierHalf * (0.32 + s * 0.68);
      for (let x = Math.round(p.cx - half); x <= Math.round(p.cx + half); x += 1) {
        const edge = Math.abs(x - p.cx) / half;
        if (edge > 0.88 && random() < 0.5) continue;
        put(m, p, x, y, edge < 0.3 ? needle.pick(random) : random() < 0.5 ? needle.base[0] : needle.pick(random));
      }
    }
    for (let k = 0; k < Math.round(tierHalf * 0.6); k += 1) {
      put(m, p, p.cx + 1 - k, Math.round(tierTop) - 1 + (k % 2), needle.pick(random));
    }
  }
  // Cones sit sideways on the top third of the trunk, half-buried in the needles.
  if (stage.cones) {
    for (const [dx, dy] of [[5, 4], [6, 8], [-5, 6], [-6, 10]]) {
      const x = Math.round(p.cx + dx);
      const y = Math.round(trunkTop + dy);
      for (let c = 0; c < 3; c += 1) {
        put(m, p, x + (c === 0 ? 0 : 1), y, palettes.resin.pick(random));
        put(m, p, x + 1, y - 1, palettes.resin.pick(random));
        put(m, p, x, y - 2, palettes.resin.shadow[0]);
        put(m, p, x + 1, y - 2, palettes.resin.shadow[0]);
      }
    }
  }
  return m;
}

function drawLily(p, palettes, random, stage) {
  const m = emptyMatrix(p.rw, p.rh);
  const h = stage.factor * 45;
  const top = Math.round(p.yb - h);
  stemLine(m, p, palettes, top);
  for (let i = 0; i < 6; i += 1) {
    const y = Math.round(p.yb - 3 - i * h * 0.09);
    const len = 3 + Math.floor(random() * 4);
    const left = i % 2 === 0;
    for (let k = 1; k <= len; k += 1) {
      put(m, p, p.cx + (left ? -k : k), y - Math.floor(k * 0.4), palettes.leaf.pick(random));
      if (k === 1) put(m, p, p.cx + (left ? -k : k), y - 1, palettes.leaf.hi[0]);
    }
  }
  if (stage.flowers) {
    const n = stage.flowers;
    for (let i = 0; i < n; i += 1) {
      const x = p.cx + (i === 0 ? 0 : i % 2 === 1 ? -2 : 2);
      const y = top + (i === 0 ? 0 : i) - 2;
      for (let dy = 0; dy < 5; dy += 1) {
        const half = [1, 2, 3, 2, 1][dy];
        for (let dx = -half; dx <= half; dx += 1) {
          const edge = Math.abs(dx) === half;
          put(m, p, x + dx, y + dy, edge ? palettes.petal.shadow[0] : palettes.petal.pick(random));
        }
      }
      put(m, p, x, y, palettes.petal.hi[0]);
      for (const [sx, sy] of ANTHER_TICKS) put(m, p, x + sx, y + 2 + sy, palettes.anther.hi[0]);
      put(m, p, x, y + 4, palettes.anther.base[0]);
    }
  } else if (stage.bud) {
    rect(m, p, p.cx - 1, top - 1, 2, 4, palettes.leaf, random);
  } else if (stage.bare) {
    put(m, p, p.cx, top, palettes.stem.deep[0]);
    put(m, p, p.cx, top + 1, palettes.stem.deep[0]);
  }
  return m;
}

function drawTreeFern(p, palettes, random, stage) {
  const m = emptyMatrix(p.rw, p.rh);
  const h = stage.factor * 52;
  const top = Math.round(p.yb - h);
  for (let y = top; y < p.yb; y += 1) {
    const half = y > p.yb - 6 ? 2 : 1;
    for (let x = p.cx - half; x <= p.cx + half; x += 1) put(m, p, x, y, x < p.cx ? palettes["pakpako-trunk"].light[0] : palettes["pakpako-trunk"].pick(random));
  }
  const fronds = (stage.fronds || 0) * 2;
  const crown = top + 4;
  for (let i = 0; i < fronds; i += 1) {
    const side = i % 2 === 0 ? -1 : 1;
    const front = Math.floor(i / 2);
    const spread = 9 + front * 5;
    const rise = 12 - front * 2;
    for (let k = 0; k <= spread; k += 1) {
      const x = p.cx + side * k;
      const y = crown - Math.round((rise * k) / spread);
      if (side === -1 && x > p.cx - 2) continue;
      put(m, p, x, y, palettes.leaf.pick(random));
      if (k < spread - 1) put(m, p, x, y + 1, palettes.leaf.shadow[0]);
    }
  }
  for (let c = 0; c < (stage.croziers || 0); c += 1) {
    const side = c % 2 === 0 ? 1 : -1;
    const x0 = p.cx + side * 2;
    const y0 = crown + 2;
    for (let k = 0; k < 5; k += 1) put(m, p, x0 + Math.round(Math.sin(k * 0.9) * 1.5), y0 - k, palettes.crozier.base[0]);
    put(m, p, x0, y0 - 5, palettes.crozier.hi[0]);
  }
  return m;
}

function drawMedinilla(p, palettes, random, stage) {
  const m = emptyMatrix(p.rw, p.rh);
  const base = p.yb - 4;
  for (let y = base - 18; y <= base; y += 1) put(m, p, p.cx, y, palettes.leaf.shadow[0]);
  const whorls = stage.whorls ? 3 : 2;
  for (let w = 0; w < whorls; w += 1) {
    const y = base - 6 - w * 6;
    const len = 8 - w;
    for (let side = -1; side <= 1; side += 2) {
      for (let k = 1; k <= len; k += 1) {
        const x = p.cx + side * k;
        const dy = Math.round(k * 0.55);
        put(m, p, x, y + dy, palettes.leaf.pick(random));
        put(m, p, x, y + dy - 1, palettes.leaf.light[0]);
        if (k === Math.floor(len / 2)) put(m, p, x, y + dy - 2, palettes.leaf.hi[0]);
      }
      for (let n = 1; n < len; n += 2) {
        put(m, p, p.cx + side * n, y + Math.round(n * 0.55), palettes.leaf.deep[0]);
      }
    }
  }
  // Bracts hang in sprays beneath the lowest whorl, with berries swelling below them.
  if (stage.flowers) {
    for (const dx of [-4, -2, 0, 2, 4]) {
      const x = p.cx + dx;
      const y = base - 2;
      for (let k = 0; k < 3; k += 1) put(m, p, x, y - k, palettes.stem.base[0]);
      put(m, p, x, y + 1, palettes.bract.light[0]);
      put(m, p, x, y + 2, palettes.bract.pick(random));
      put(m, p, x + 1, y + 2, palettes.bract.base[0]);
      put(m, p, x, y + 3, palettes.bract.deep[0]);
    }
  }
  if (stage.berries) {
    for (const [dx, dy] of [[-3, 4], [-1, 5], [1, 5], [3, 4], [0, 7]]) {
      put(m, p, p.cx + dx, base + dy, palettes.berry.pick(random));
      put(m, p, p.cx + dx, base + dy - 1, palettes.berry.light[0]);
      if (dx) put(m, p, p.cx + dx, base + dy + 1, palettes.berry.deep[0]);
    }
  }
  if (stage.dry) {
    for (let b = 0; b < 4; b += 1) put(m, p, p.cx - 4 + b * 2, base + 6, palettes.berry.deep[0]);
  }
  return m;
}

function drawNepenthes(p, palettes, random, stage) {
  const m = emptyMatrix(p.rw, p.rh);
  const tendrilTop = 14;
  for (let y = tendrilTop; y < Math.round(p.yb - 6); y += 1) put(m, p, p.cx, y, palettes.tendril.pick(random));
  for (const [dx, dy] of [[-4, 6], [4, 12], [5, 18]]) {
    for (let k = 0; k < 3; k += 1) put(m, p, p.cx + dx + k, p.yb - 20 + dy - k, palettes.leaf.pick(random));
  }
  const mouths = () => [10, 8, 6];
  if (stage.cups) {
    for (let i = 0; i < Math.min(stage.cups, 2); i += 1) {
      const cupX = p.cx + (i === 0 ? 3 : -2);
      const cupTop = p.yb - 34 + i * 6;
      const heights = mouths();
      for (let row = 0; row < 7; row += 1) {
        const half = Math.round((heights[Math.min(row, heights.length - 1)] * (1 - row / 9)) / 2);
        for (let dx = -half; dx <= half; dx += 1) {
          const edge = Math.abs(dx) === half;
          put(m, p, cupX + dx, cupTop + row, edge ? palettes.cup.deep[0] : dx < 0 ? palettes.cup.light[0] : palettes.cup.pick(random));
        }
      }
      for (let dx = -4; dx <= 4; dx += 1) put(m, p, cupX + dx, cupTop - 1, dx % 2 ? palettes.peristome.base[0] : palettes.peristome.hi[0]);
      for (let dx = -3; dx <= 3; dx += 1) put(m, p, cupX + dx, cupTop + 1, palettes.peristome.pick(random));
      for (let dx = -3; dx <= 3; dx += 1) put(m, p, cupX + dx, cupTop - 3, palettes.leaf.base[0]);
      if (stage.dry) put(m, p, cupX, cupTop - 2, palettes.leaf.deep[0]);
    }
  } else {
    for (let k = 0; k < 3; k += 1) put(m, p, p.cx + 2 + k, p.yb - 12 - k, palettes.tendril.deep[0]);
  }
  return m;
}

const PLANT_KITS = {
  sp_benguet_pine: {
    colors: ['outline', 'stem', 'bark', 'resin', 'needle'],
    aliases: { needle: 'pine-needle', leaf: 'pine-needle' },
    size: SIZES,
    draw: drawPine,
    anchor: [28, 95],
    variants: {
      mature: { cones: true },
      flowering: { cones: true, flowers: true },
      wilted: { cones: true, bare: true, desat: 0.2 },
    },
  },
  sp_benguet_lily: {
    colors: ['outline', 'stem', 'leaf', 'petal', 'anther'],
    aliases: { leaf: 'lily-leaf' },
    size: SIZES,
    draw: drawLily,
    anchor: [28, 95],
    variants: {
      mature: { flowers: 1 },
      flowering: { flowers: 3 },
      wilted: { bare: true, desat: 0.2 },
    },
  },
  sp_pakpako: {
colors: ['outline', 'stem', 'pakpako-trunk', 'leaf', 'crozier'],
    aliases: { leaf: 'pakpako-leaf' },
    size: SIZES,
    draw: drawTreeFern,
    anchor: [28, 95],
    variants: {
      mature: { fronds: 3, croziers: 1 },
      flowering: { fronds: 4, croziers: 2, flowers: true },
      wilted: { fronds: 2, desat: 0.2 },
    },
  },
  sp_medinilla: {
    colors: ['outline', 'stem', 'leaf', 'bract', 'berry'],
    aliases: { leaf: 'medinilla-leaf' },
    size: SIZES,
    draw: drawMedinilla,
    anchor: [28, 95],
    variants: {
      mature: { whorls: true },
      flowering: { whorls: true, flowers: true },
      wilted: { whorls: true, dry: true, desat: 0.2 },
    },
  },
  sp_nepenthes: {
    colors: ['outline', 'stem', 'tendril', 'cup', 'peristome'],
    aliases: { tendril: 'tendril-green', cup: 'nepenthes-cup', leaf: 'nepenthes-leaf' },
    size: SIZES,
    draw: drawNepenthes,
    anchor: [28, 95],
    variants: {
      mature: { cups: 1 },
      flowering: { cups: 2 },
      wilted: { cups: 1, dry: true, desat: 0.2 },
    },
  },
};

// ---------------------------------------------------------------------------
// Player kit: 4 facings, small Naranja-style figure with a field satchel.
// ---------------------------------------------------------------------------

function drawPlayer(p, palettes, random, facing) {
  const m = emptyMatrix(p.rw, p.rh);
  const back = facing === 'up';
  const side = facing === 'left' || facing === 'right';
  const flip = (x) => (facing === 'left' ? p.rw - 1 - x : x);
  const R = (x, y, w, h, pal) => {
    for (let dy = 0; dy < h; dy += 1) {
      for (let dx = 0; dx < w; dx += 1) put(m, p, flip(x + dx), y + dy, pal.pick(random));
    }
  };
  const shoe = [16, 18, 2, 2];
  if (!side) shoe[0] = 17;
  if (facing === 'up') shoe[0] = 15;
  R(shoe[0], shoe[1], shoe[2], shoe[3], palettes.boots);
  R(17, 15, 3, 3, palettes.trousers);
  R(15, 9, 7, 7, palettes.jumper);
  R(19, 10, 4, 3, palettes.satchel);
  R(20, 9, 1, 5, palettes.satchel.shadow);
  const headY = back ? 0 : 0;
  R(15, headY, 7, 8, palettes.hair);
  R(14, headY + 3, 9, 4, palettes.skin);
  R(15, headY, 7, 2, palettes.hair.deep);
  if (side) R(22, headY + 3, 1, 2, palettes.skin);
  if (back) R(14, headY + 3, 9, 4, palettes.hair.shadow);
  if (!back) {
    R(17, headY + 4, 1, 1, palettes.ink);
    R(19, headY + 4, 1, 1, palettes.ink);
  }
  if (facing === 'right' || facing === 'down') R(20, headY + 4, 1, 1, palettes.ink);
  R(16, 9, 2, 5, palettes.jumper.light);
  if (!back) R(16, 13, 4, 2, palettes.paper);
  outline(m, p, palettes.outline);
  return m;
}

// ---------------------------------------------------------------------------
// Tile kits: 16x16 ground, 16x32 furniture. Furniture shares the player size
// and anchor convention so a bench occupies exactly its tile.
// ---------------------------------------------------------------------------

const TILE_16 = { w: 16, h: 16 };
const FURN_32 = { w: 16, h: 32 };

function groundImage(colors, base, speckle) {
  return (p, palettes, random) => {
    const m = emptyMatrix(p.rw, p.rh);
    for (let y = 0; y < p.rh; y += 1) {
      for (let x = 0; x < p.rw; x += 1) put(m, p, x, y, palettes[base].pick(random));
    }
    for (let i = 0; i < 22; i += 1) {
      const x = Math.floor(random() * p.rw);
      const y = Math.floor(random() * p.rh);
      const pal = palettes[speckle[Math.floor(random() * speckle.length)]];
      put(m, p, x, y, pal.base[0]);
      if (random() < 0.4) put(m, p, x, y - 1, pal.hi[0]);
    }
    return m;
  };
}

const TILE_KITS = {
  grass: { size: TILE_16, colors: ['grass-floor'], aliases: { wood: 'bench-wood', iron: 'bench-iron' }, draw: groundImage(['grass-floor'], 'grass-floor', ['grass-floor']) },
  moss: { size: TILE_16, colors: ['moss'], aliases: { wood: 'bench-wood', iron: 'bench-iron' }, draw: groundImage(['moss'], 'moss', ['moss']) },
  path_stone: {
    size: TILE_16,
    aliases: { wood: 'bench-wood', iron: 'bench-iron', grass: 'grass-floor', trunk: 'bark', leaf: 'pine-needle' },
    colors: ['stone'],
    draw: (p, palettes, random) => {
      const m = emptyMatrix(p.rw, p.rh);
      for (let y = 0; y < 4; y += 1) {
        for (let x = 0; x < 4; x += 1) {
          const x0 = x * 4;
          const y0 = y * 4;
          const tone = palettes.stone.pick(random);
          for (let dy = 0; dy < 4; dy += 1) {
            for (let dx = 0; dx < 4; dx += 1) {
              const edgeL = dx === 0;
              const edgeT = dy === 0;
              const joint = dx === 3 || dy === 3;
              put(m, p, x0 + dx, y0 + dy, joint ? palettes.stone.deep[0] : edgeL || edgeT ? palettes.stone.hi[0] : tone);
            }
          }
        }
      }
      return m;
    },
  },
  wall_stone: {
    size: TILE_16,
    aliases: { wood: 'bench-wood', iron: 'bench-iron', grass: 'grass-floor', trunk: 'bark', leaf: 'pine-needle' },
    colors: ['stone', 'moss'],
    draw: (p, palettes, random) => {
      const m = emptyMatrix(p.rw, p.rh);
      const rows = [[0, 4], [4, 3], [7, 4], [11, 3], [14, 2]];
      rows.forEach(([y0, hh], ri) => {
        let x = ri % 2 === 0 ? 0 : 3;
        while (x < p.rw) {
          const bw = 4 + Math.floor(random() * 3);
          for (let dy = 0; dy < hh; dy += 1) {
            for (let dx = 0; dx < bw; dx += 1) {
              const lit = dy === 0;
              const dark = dy === hh - 1 || dx === bw - 1;
              put(m, p, x + dx, y0 + dy, lit ? palettes.stone.hi[0] : dark ? palettes.stone.deep[0] : palettes.stone.pick(random));
            }
          }
          if (random() < 0.7) put(m, p, x + 1, y0, palettes.moss.hi[0]);
          x += bw + 1;
        }
      });
      return m;
    },
  },
  stairs_up: {
    size: TILE_16,
    aliases: { wood: 'bench-wood', iron: 'bench-iron', grass: 'grass-floor', trunk: 'bark', leaf: 'pine-needle' },
    colors: ['stone-step', 'stone'],
    draw: (p, palettes, random) => {
      const m = emptyMatrix(p.rw, p.rh);
      for (let y = 0; y < p.rh; y += 1) {
        for (let x = 0; x < p.rw; x += 1) put(m, p, x, y, palettes['stone-step'].pick(random));
      }
      for (let y = 2; y < p.rh; y += 4) {
        for (let x = 0; x < p.rw; x += 1) {
          put(m, p, x, y, palettes['stone-step'].hi[0]);
          put(m, p, x, y + 1, palettes.stone.shadow[0]);
        }
      }
      for (let x = 0; x < p.rw; x += 1) put(m, p, x, 0, palettes.stone.deep[0]);
      return m;
    },
  },
  stairs_down: {
    size: TILE_16,
    aliases: { wood: 'bench-wood', iron: 'bench-iron', grass: 'grass-floor', trunk: 'bark', leaf: 'pine-needle' },
    colors: ['stone-step', 'stone'],
    draw: (p, palettes, random) => {
      const m = emptyMatrix(p.rw, p.rh);
      for (let y = 0; y < p.rh; y += 1) {
        for (let x = 0; x < p.rw; x += 1) put(m, p, x, y, palettes['stone-step'].pick(random));
      }
      for (let y = 1; y < p.rh; y += 4) {
        for (let x = 0; x < p.rw; x += 1) {
          put(m, p, x, y, palettes.stone.shadow[0]);
          put(m, p, x, y + 1, palettes['stone-step'].hi[0]);
        }
      }
      return m;
    },
  },
  pine_trunk: {
    size: FURN_32,
    aliases: { leaf: 'pine-needle' },
    colors: ['bark', 'pine-needle'],
    draw: (p, palettes, random) => {
      const m = emptyMatrix(p.rw, p.rh);
      const top = 6;
      for (let y = top; y < p.rh - 2; y += 1) {
        for (let x = 5; x <= 10; x += 1) {
          const lit = x <= 6;
          const dark = x >= 9;
          put(m, p, x, y, lit ? palettes.bark.light[0] : dark ? palettes.bark.deep[0] : palettes.bark.pick(random));
        }
      }
      for (let x = 4; x <= 11; x += 1) {
        put(m, p, x, top - 1, palettes.bark.light[0]);
        put(m, p, x, top - 2, palettes.bark.base[0]);
      }
      for (let x = 3; x <= 12; x += 1) put(m, p, x, p.rh - 2, palettes.bark.deep[0]);
      for (let x = 4; x <= 11; x += 1) put(m, p, x, p.rh - 1, palettes.bark.deep[0]);
      for (let i = 0; i < 26; i += 1) {
        const side = random() < 0.5 ? -1 : 1;
        const x = p.cx + side * (4 + Math.floor(random() * 4));
        const y = top + Math.floor(random() * 14);
        put(m, p, x, y, palettes.leaf.pick(random));
        if (random() < 0.5) put(m, p, x + side, y - 1, palettes.leaf.light[0]);
      }
      outline(m, p, palettes.bark);
      return m;
    },
  },
  bench: {
    size: FURN_32,
    aliases: { wood: 'bench-wood', iron: 'bench-iron', grass: 'grass-floor', trunk: 'bark', leaf: 'pine-needle' },
    colors: ['wood', 'iron'],
    draw: (p, palettes, random) => {
      const m = emptyMatrix(p.rw, p.rh);
      const R = (x, y, w, h, pal) => {
        for (let dy = 0; dy < h; dy += 1) {
          for (let dx = 0; dx < w; dx += 1) put(m, p, x + dx, y + dy, pal === 'wood' ? palettes.wood.pick(random) : palettes.iron.pick(random));
        }
      };
      R(2, 8, 12, 2, 'iron');
      R(3, 6, 10, 7, 'wood');
      for (let y = 6; y < 13; y += 2) for (let x = 3; x < 13; x += 1) put(m, p, x, y, palettes.wood.deep[0]);
      R(2, 14, 12, 2, 'wood');
      R(3, 16, 10, 1, 'wood');
      R(3, 17, 1, 2, 'iron');
      R(12, 17, 1, 2, 'iron');
      for (let i = 0; i < 26; i += 1) {
        const x = 2 + Math.floor(random() * 12);
        const y = 19 + Math.floor(random() * 12);
        put(m, p, x, y, palettes.grass.pick(random));
      }
      put(m, p, 4, 12, palettes.grass.hi[0]);
      put(m, p, 9, 11, palettes.grass.base[0]);
      outline(m, p, palettes.wood);
      return m;
    },
  },
  gate: {
    size: FURN_32,
    aliases: { wood: 'bench-wood', iron: 'bench-iron', grass: 'grass-floor', trunk: 'bark', leaf: 'pine-needle' },
    colors: ['wood', 'iron'],
    draw: (p, palettes, random) => {
      const m = emptyMatrix(p.rw, p.rh);
      const R = (x, y, w, h, pal) => {
        for (let dy = 0; dy < h; dy += 1) {
          for (let dx = 0; dx < w; dx += 1) put(m, p, x + dx, y + dy, pal === 'wood' ? palettes.wood.pick(random) : palettes.iron.pick(random));
        }
      };
      R(2, 14, 2, 17, 'wood');
      R(12, 14, 2, 17, 'wood');
      R(1, 12, 14, 2, 'iron');
      R(4, 15, 1, 5, 'iron');
      R(8, 15, 1, 6, 'iron');
      R(11, 15, 1, 5, 'iron');
      R(6, 17, 4, 1, 'iron');
      R(4, 13, 1, 1, 'iron');
      R(11, 13, 1, 1, 'iron');
      for (let i = 0; i < 18; i += 1) {
        const x = 2 + Math.floor(random() * 12);
        const y = 22 + Math.floor(random() * 9);
        put(m, p, x, y, palettes.grass.pick(random));
      }
      outline(m, p, palettes.wood);
      return m;
    },
  },
  guide: {
    size: FURN_32,
    aliases: { ...{ wood: 'bench-wood', iron: 'bench-iron', grass: 'grass-floor', trunk: 'bark', leaf: 'pine-needle' }, shirt: 'guide-shirt', hat: 'cap', leaf: 'uniform' },
    colors: ['skin', 'uniform', 'uniform-dark', 'cap', 'hat-band', 'boots', 'trousers', 'ink', 'paper'],
    draw: (p, palettes, random) => {
      const m = emptyMatrix(p.rw, p.rh);
      const R = (x, y, w, h, pal, light) => {
        for (let dy = 0; dy < h; dy += 1) {
          for (let dx = 0; dx < w; dx += 1) put(m, p, x + dx, y + dy, light ? palettes[pal].light[0] : palettes[pal].pick(random));
        }
      };
      R(4, 28, 3, 2, 'boots');
      R(9, 28, 3, 2, 'boots');
      R(4, 20, 8, 8, 'trousers');
      R(3, 13, 10, 7, 'shirt');
      R(3, 8, 10, 5, 'uniform');
      R(11, 10, 2, 4, 'uniform');
      R(4, 14, 8, 2, 'uniform-dark');
      R(5, 3, 6, 6, 'skin');
      R(3, 2, 10, 2, 'hat');
      R(5, 0, 6, 2, 'hat');
      R(4, 4, 8, 1, 'hat-band');
      put(m, p, 7, 6, palettes.ink.base[0]);
      put(m, p, 9, 6, palettes.ink.base[0]);
      put(m, p, 10, 12, palettes.paper.base[0]);
      outline(m, p, palettes.uniform);
      return m;
    },
  },
  pc: {
    size: FURN_32,
    aliases: { wood: 'bench-wood', iron: 'bench-iron', grass: 'grass-floor', trunk: 'bark', leaf: 'pine-needle' },
    colors: ['wood', 'iron'],
    draw: (p, palettes, random) => `PC`,
  },
};

const PLAYER_KIT = {
  size: FURN_32,
  aliases: { outline: 'outline' },
  colors: ['outline', 'hair', 'skin', 'jumper', 'trousers', 'boots', 'satchel', 'ink', 'paper'],
  draw: drawPlayer,
  variants: { down: 'down', up: 'up', left: 'left', right: 'right' },
};

const KITS = { ...PLANT_KITS, player: PLAYER_KIT, tile: { variants: Object.fromEntries(Object.keys(TILE_KITS).map((k) => [k, k])) } };

// ---------------------------------------------------------------------------
// Rendering to PNG
// ---------------------------------------------------------------------------

const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

export function encodePng(rgba, width, height) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([PNG_SIG, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

/** Minimal RGBA PNG decoder (filter types 0-4), used by the self-check. */
export function decodePng(buf) {
  let pos = 8;
  let width;
  let height;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
    } else if (type === 'IDAT') idat.push(data);
    pos += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const out = Buffer.alloc(stride * height);
  const paeth = (a, b, c) => {
    const pp = a + b - c;
    const pa = Math.abs(pp - a);
    const pb = Math.abs(pp - b);
    const pc = Math.abs(pp - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < height; y += 1) {
    const f = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x += 1) {
      const v = raw[y * (stride + 1) + 1 + x];
      const a = x >= 4 ? out[y * stride + x - 4] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = x >= 4 && y > 0 ? out[(y - 1) * stride + x - 4] : 0;
      let add = 0;
      if (f === 1) add = a;
      else if (f === 2) add = b;
      else if (f === 3) add = (a + b) >> 1;
      else if (f === 4) add = paeth(a, b, c);
      out[y * stride + x] = (v + add) & 0xff;
    }
  }
  return { width, height, rgba: out };
}

function nearestUpscale(rgba, w, h, scale) {
  const out = Buffer.alloc(w * scale * h * scale * 4);
  for (let y = 0; y < h * scale; y += 1) {
    for (let x = 0; x < w * scale; x += 1) {
      const src = ((y / scale) | 0) * w * 4 + ((x / scale) | 0) * 4;
      rgba.copy(out, (y * w * scale + x) * 4, src, src + 4);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function resolveKit(k, variant) {
  if (!k) throw new Error('kit required');
  if (k.startsWith('tile:')) return { kind: 'tile', id: k.slice(5), kit: TILE_KITS[k.slice(5)], variants: TILE_KITS };
  if (k === 'tile') return { kind: 'tile', id: variant, kit: TILE_KITS[variant], variants: TILE_KITS };
  if (k === 'player') return { kind: 'player', id: 'player', kit: PLAYER_KIT, variants: PLAYER_KIT.variants };
  if (PLANT_KITS[k]) return { kind: 'plant', id: k, kit: PLANT_KITS[k], variants: PLANT_KITS[k].variants };
  throw new Error(`unknown kit "${k}". Known: ${Object.keys(PLANT_KITS).join(', ')}, player, tile:<${Object.keys(TILE_KITS).join('|')}>`);
}

export function generate(kitName, variant = 'mature', seed = 0, { scale = 1 } = {}) {
  const resolved = resolveKit(kitName, variant);
  const { kind, id, kit, variants } = resolved;
  if (!kit) throw new Error(`unknown tile "${variant}". Known: ${Object.keys(TILE_KITS).join(', ')}`);
  if (kind === 'plant' && !kit.variants[variant]) throw new Error(`unknown variant "${variant}" for ${id}. Known: ${Object.keys(kit.variants).join(', ')}`);
  if (variant !== undefined && !variants[variant]) throw new Error(`unknown ${kind === 'player' ? 'facing' : 'tile'} "${variant}"`);
  const spec = kind === 'plant' ? kit.variants[variant] : null;

  const random = rngFor(hashString(`${id ?? kitName}:${variant}:${seed}`));
  const palettes = paletteFor(kit.colors, seed, kit.aliases);
  const size = kit.size;
  const p = { rw: size.w, rh: size.h, cx: Math.floor(size.w / 2), yb: size.h - 1 };

  let m;
  if (kind === 'plant') {
    m = kit.draw(p, palettes, random, spec);
    outline(m, p, palettes.outline);
    underEdge(m, p, palettes.outline);
    if (spec.desat) {
      const faded = new Uint32Array(m.length);
      for (let i = 0; i < m.length; i += 1) if (m[i]) faded[i] = pack(desaturate(unpackColor(m[i]), spec.desat));
      m = faded;
    }
  } else if (kind === 'player') {
    m = kit.draw(p, palettes, random, variant);
    underEdge(m, p, palettes.outline);
  } else {
    m = kit.draw(p, palettes, random, variant);
  }

  const rgba = Buffer.alloc(size.w * size.h * 4);
  for (let i = 0; i < m.length; i += 1) {
    const v = m[i];
    if (!v) continue;
    rgba[i * 4] = v & 0xff;
    rgba[i * 4 + 1] = (v >>> 8) & 0xff;
    rgba[i * 4 + 2] = (v >>> 16) & 0xff;
    rgba[i * 4 + 3] = (v >>> 24) & 0xff;
  }
  const w = size.w * scale;
  const h = size.h * scale;
  const png = encodePng(scale === 1 ? rgba : nearestUpscale(rgba, size.w, size.h, scale), w, h);
  return {
    ok: true,
    kit: kitName,
    variant,
    seed,
    width: w,
    height: h,
    anchor: { x: kit.anchor?.[0] ?? Math.floor(size.w / 2), y: (kit.anchor?.[1] ?? size.h - 1) * scale },
    palette: Object.fromEntries(Object.entries(palettes).map(([k, v]) => [k, toHex(v.base[0])])),
    dataUri: `data:image/png;base64,${png.toString('base64')}`,
    png,
  };
}

function unpackColor(v) {
  return [v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff];
}
const toHex = (c) => `#${c.slice(0, 3).map((b) => b.toString(16).padStart(2, '0')).join('')}`;

export function catalog() {
  return {
    plants: Object.fromEntries(Object.entries(PLANT_KITS).map(([k, v]) => [k, Object.keys(v.variants)])),
    player: Object.keys(PLAYER_KIT.variants),
    tiles: Object.keys(TILE_KITS).map((t) => `tile:${t}`),
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const argv = process.argv.slice(2);
  const flag = (name) => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const positional = argv.filter((a, i) => !a.startsWith('--') && !['--scale', '--png'].includes(argv[i - 1]));
  const [kit, variant, seedArg] = positional;
  if (!kit) {
    console.log(JSON.stringify({ ok: true, usage: 'node tools/gen-sprite.mjs <kit> <variant> <seed> [--scale N] [--png file]', catalog: catalog() }, null, 2));
    process.exit(0);
  }
  try {
    const seed = seedArg === undefined ? 0 : Number(seedArg);
    if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw new Error(`seed must be an integer 0..4294967295, got "${seedArg}"`);
    const result = generate(kit, variant ?? 'mature', seed, { scale: Number(flag('--scale') ?? 1) });
    const pngPath = flag('--png');
    if (pngPath) writeFileSync(pngPath, result.png);
    const { png, ...rest } = result;
    console.log(JSON.stringify(rest));
  } catch (err) {
    console.error(JSON.stringify({ ok: false, error: err.message }));
    process.exit(2);
  }
}