#!/usr/bin/env node
// Converts the generated plant illustrations (art-src/*.jpg, solid magenta background) into
// game-ready pixel-art PNGs with real transparency:
//   public/game/plants/<id>.png        -> battle/journal portrait (~128px)
//   public/game/plants/<id>_world.png  -> small overworld sprite (with dark outline)
//   public/game/title_bg.jpg           -> title screen backdrop (copied)
//
// Runs the image maths inside headless Chromium (canvas), so no native image libs are needed.
//   node tools/process-art.mjs

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const SRC = resolve('art-src');
const OUT = resolve('public/game/plants');
mkdirSync(OUT, { recursive: true });

// world: downscale factor applied to the 1024px source for the overworld sprite
const PLANTS = [
  { id: 'benguet_pine', world: 14, outline: true },
  { id: 'lagundi', world: 18, outline: false },
  { id: 'sambong', world: 20, outline: false },
  { id: 'tsaang_gubat', world: 22, outline: true },
  { id: 'takip_kuhol', world: 26, outline: false },
  { id: 'benguet_lily', world: 18, outline: false },
  { id: 'tree_fern', world: 16, outline: true },
  { id: 'mexican_sunflower', world: 22, outline: true },
  { id: 'sapinit', world: 22, outline: true },
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<html><body></body></html>');

for (const p of PLANTS) {
  const file = resolve(SRC, `${p.id}.jpg`);
  if (!existsSync(file)) {
    console.warn('missing', file);
    continue;
  }
  const dataUrl = `data:image/jpeg;base64,${readFileSync(file).toString('base64')}`;
  const result = await page.evaluate(
    async ({ dataUrl, worldFactor, worldOutline }) => {
      const img = new Image();
      img.src = dataUrl;
      await img.decode();
      const W = img.width;
      const H = img.height;
      const c = document.createElement('canvas');
      c.width = W;
      c.height = H;
      const g = c.getContext('2d');
      g.drawImage(img, 0, 0);
      const src = g.getImageData(0, 0, W, H).data;

      const isBg = (i) => {
        const r = src[i], gg = src[i + 1], b = src[i + 2];
        return Math.min(r, b) - gg > 70 && r > 120 && b > 120;
      };

      function downscale(f, outline) {
        const w = Math.floor(W / f);
        const h = Math.floor(H / f);
        const out = new ImageData(w, h);
        const d = out.data;
        for (let by = 0; by < h; by += 1) {
          for (let bx = 0; bx < w; bx += 1) {
            let n = 0, fg = 0, r = 0, gg = 0, b = 0;
            // sample the inner part of the block to dodge jpeg ringing at block borders
            const m = Math.max(1, Math.floor(f * 0.15));
            for (let y = by * f + m; y < (by + 1) * f - m; y += 1) {
              for (let x = bx * f + m; x < (bx + 1) * f - m; x += 1) {
                const i = (y * W + x) * 4;
                n += 1;
                if (!isBg(i)) {
                  fg += 1;
                  r += src[i];
                  gg += src[i + 1];
                  b += src[i + 2];
                }
              }
            }
            const o = (by * w + bx) * 4;
            if (fg / n > 0.42) {
              d[o] = r / fg;
              d[o + 1] = gg / fg;
              d[o + 2] = b / fg;
              d[o + 3] = 255;
              // de-spill: kill leftover magenta tint
              if (d[o] > d[o + 1] + 40 && d[o + 2] > d[o + 1] + 40) {
                d[o] = d[o + 1] = d[o + 2] = 40;
              }
            }
          }
        }
        // crop to content
        let x0 = w, y0 = h, x1 = -1, y1 = -1;
        for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
          if (d[(y * w + x) * 4 + 3]) {
            x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
          }
        }
        const pad = outline ? 1 : 0;
        const cw = x1 - x0 + 1 + pad * 2;
        const ch = y1 - y0 + 1 + pad * 2;
        const cc = document.createElement('canvas');
        cc.width = cw;
        cc.height = ch;
        const cg = cc.getContext('2d');
        const tmp = document.createElement('canvas');
        tmp.width = w;
        tmp.height = h;
        tmp.getContext('2d').putImageData(out, 0, 0);
        cg.drawImage(tmp, x0, y0, cw - pad * 2, ch - pad * 2, pad, pad, cw - pad * 2, ch - pad * 2);
        if (outline) {
          const id = cg.getImageData(0, 0, cw, ch);
          const a = id.data;
          const copy = new Uint8ClampedArray(a);
          for (let y = 0; y < ch; y += 1) for (let x = 0; x < cw; x += 1) {
            const i = (y * cw + x) * 4;
            if (copy[i + 3]) continue;
            const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
              const nx = x + dx, ny = y + dy;
              return nx >= 0 && ny >= 0 && nx < cw && ny < ch && copy[(ny * cw + nx) * 4 + 3];
            });
            if (nb) { a[i] = 22; a[i + 1] = 28; a[i + 2] = 24; a[i + 3] = 255; }
          }
          cg.putImageData(id, 0, 0);
        }
        return { url: cc.toDataURL('image/png'), w: cw, h: ch };
      }

      return { portrait: downscale(8, false), world: downscale(worldFactor, worldOutline) };
    },
    { dataUrl, worldFactor: p.world, worldOutline: p.outline },
  );
  writeFileSync(resolve(OUT, `${p.id}.png`), Buffer.from(result.portrait.url.split(',')[1], 'base64'));
  writeFileSync(resolve(OUT, `${p.id}_world.png`), Buffer.from(result.world.url.split(',')[1], 'base64'));
  console.log(p.id, 'portrait', result.portrait.w, 'x', result.portrait.h, ' world', result.world.w, 'x', result.world.h);
}

await browser.close();
if (existsSync(resolve(SRC, 'title_bg.jpg'))) {
  copyFileSync(resolve(SRC, 'title_bg.jpg'), resolve('public/game/title_bg.jpg'));
  console.log('title_bg copied');
}

