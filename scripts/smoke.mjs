// End-to-end Playwright smoke & visual verification test for the strict-grid UP Baguio map.

import { chromium } from 'playwright';
import { createServer } from 'vite';
import { mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

mkdirSync('shots', { recursive: true });

const server = await createServer({
  server: { port: 5198, strictPort: false },
});
await server.listen();
const address = server.httpServer.address();
const url = `http://localhost:${address.port}/`;
console.log('Dev server running at', url);

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 760 } });

const errors = [];
page.on('pageerror', (e) => {
  console.error('PAGEERROR:', e);
  errors.push(String(e));
});
page.on('console', (m) => {
  if (m.type() === 'error') {
    console.error('CONSOLE ERROR:', m.text());
    errors.push(m.text());
  }
});

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForFunction(() => Boolean(window.__game));
await page.waitForTimeout(400);

// 1. Start Fieldwork -> Oblation Ground between the two East Driveway stairs (x=67, y=32)
await page.fill('#player-name-input', 'Isko');
await page.click('#btn-start-game');
await page.locator('#opening-overlay').waitFor({ state: 'hidden' });
await page.waitForTimeout(450);
await page.screenshot({ path: 'shots/grid-01-oblation-driveway.png' });

// 2. Talk to Prof. Barcelo at (67, 30) -> player at (67, 31)
await page.evaluate(() => window.__game.teleportTo(67, 31, 'up'));
await page.waitForTimeout(250);
await page.click('#btn-interact');
for (let i = 0; i < 8; i += 1) {
  const open = await page.evaluate(() => window.__game.dialogUI.isOpen);
  if (!open) break;
  await page.keyboard.press('Space');
  await page.waitForTimeout(100);
}

// 3. View Open Court A lowered by 1 level (court @ Elev 0 flush with South Promenade, north bleachers @ Elev 1)
await page.evaluate(() => window.__game.teleportTo(45, 41, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/grid-02-open-court-a-and-stairs.png' });

// 4. View fixed CSS, Library (Elev 0), L-shaped CAC, Teatro, and stepped white path
await page.evaluate(() => window.__game.teleportTo(18, 49, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/grid-03-css-library-cac-path.png' });

// 5. View CSS building & CAC L-corner white path
await page.evaluate(() => window.__game.teleportTo(12, 47, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/grid-04-css-and-cac-corner.png' });

// Inspect the north stair gardens, then exercise each new sprite in an encounter.
await page.evaluate(() => window.__game.teleportTo(47, 16, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/grid-05-north-gardens.png' });
await page.evaluate(() => window.__game.teleportTo(32, 31, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/grid-06-inang-laya.png' });
const plantIds = await page.evaluate(() => window.__game.map.plantNodes.map(p => p.plantId));
for (const id of plantIds) {
  await page.evaluate(id => window.__game.encounterUI.open(id), id);
  await page.waitForFunction(() => {
    const img = document.querySelector('#enc-plant-sprite');
    return img.complete && img.naturalWidth > 0;
  });
  await page.locator('[data-cmd="identify"]').click();
  const scientificName = await page.evaluate(async id => (await import('/src/data/plants.js')).PLANT_BY_ID[id].scientificName, id);
  await page.locator('#enc-sub-menu button').filter({ hasText: scientificName }).click();
  await page.locator('#btn-enc-collect').click();
  assert.ok(await page.evaluate(id => window.__game.state.hasCollected(id), id));
  if (id === 'kamantigi') await page.screenshot({ path: 'shots/grid-07-plant-encounter.png' });
  await page.evaluate(() => window.__game.encounterUI.close());
}

// 6. Verify BFS reachability from spawn to every NPC and all seven plant nodes.
const check = await page.evaluate(() => {
  const map = window.__game.map;
  const visited = new Set();
  const queue = [[67, 32]];
  visited.add('67,32');

  while (queue.length > 0) {
    const [x, y] = queue.shift();
    for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      const nx = x + dx;
      const ny = y + dy;
      const key = `${nx},${ny}`;
      if (!visited.has(key) && map.canStep(x, y, nx, ny)) {
        visited.add(key);
        queue.push([nx, ny]);
      }
    }
  }

  const isAdjacentVisited = (tx, ty) =>
    [[0, -1], [0, 1], [-1, 0], [1, 0]].some(([dx, dy]) => visited.has(`${tx + dx},${ty + dy}`));

  const npcs = Array.from(window.__game.npcActors.values()).map((e) => ({
    id: e.def.id,
    reachable: isAdjacentVisited(e.actor.tileX, e.actor.tileY),
  }));

  const plants = map.plantNodes.map((p) => ({
    id: p.id,
    reachable: isAdjacentVisited(p.x, p.y),
  }));

  return {
    tilesVisited: visited.size,
    unreachableNpcs: npcs.filter((n) => !n.reachable),
    unreachablePlants: plants.filter((p) => !p.reachable),
  };
});
console.log('Strict Grid Map Reachability:', JSON.stringify(check));

await browser.close();
await server.close();

if (
  errors.length > 0 ||
  check.unreachableNpcs.length > 0 ||
  check.unreachablePlants.length > 0
) {
  console.error('Errors:', errors, check);
  process.exit(1);
}
console.log('Strict grid map smoke test passed with 0 errors!');
