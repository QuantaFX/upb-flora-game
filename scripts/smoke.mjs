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
  if (id === 'philippine_azalea') await page.screenshot({ path: 'shots/grid-07-plant-encounter.png' });
  await page.evaluate(() => window.__game.encounterUI.close());
}

// Verify Herbarium images and scrolling across all 10 species
await page.evaluate(() => window.__game.journalUI.open('plants'));
await page.waitForTimeout(250);
for (let i = 0; i < 10; i += 1) {
  await page.locator('#journal-grid .journal-card').nth(i).click();
  await page.waitForFunction(() => {
    const img = document.querySelector('#journal-detail .journal-real-photo');
    return Boolean(img && img.complete && img.naturalWidth > 0);
  });
}
// Select first plant (Pine Tree) and take top screenshot
await page.locator('#journal-grid .journal-card').first().click();
await page.evaluate(() => {
  document.querySelector('#journal-grid').scrollTop = 0;
  document.querySelector('#journal-detail').scrollTop = 0;
});
await page.waitForTimeout(150);
await page.screenshot({ path: 'shots/grid-10-herbarium-top.png' });

// Verify scrolling in both #journal-grid and #journal-detail and scroll preservation on card click
const scrollCheck = await page.evaluate(() => {
  const grid = document.querySelector('#journal-grid');
  const detail = document.querySelector('#journal-detail');
  grid.scrollTop = 220;
  detail.scrollTop = 180;
  return {
    gridScrollHeight: grid.scrollHeight,
    gridClientHeight: grid.clientHeight,
    gridScrollTop: grid.scrollTop,
    detailScrollHeight: detail.scrollHeight,
    detailClientHeight: detail.clientHeight,
    detailScrollTop: detail.scrollTop,
  };
});
assert.ok(scrollCheck.gridScrollTop > 0, 'Herbarium grid must scroll');
assert.ok(scrollCheck.detailScrollTop > 0, 'Herbarium detail pane must scroll');

// Click the 10th card while grid is scrolled down and verify grid scrollTop does not reset to 0
await page.locator('#journal-grid .journal-card').nth(9).click();
const preservedGridScroll = await page.evaluate(() => document.querySelector('#journal-grid').scrollTop);
assert.ok(preservedGridScroll > 0, 'Clicking a card must preserve Herbarium grid scroll position');
await page.evaluate(() => {
  document.querySelector('#journal-detail').scrollTop = 160;
});
await page.waitForTimeout(150);
await page.screenshot({ path: 'shots/grid-11-herbarium-scrolled.png' });
await page.evaluate(() => window.__game.journalUI.close());

// Verify southern fog covers the bottom edge and test petting a campus animal
await page.evaluate(() => {
  const g = window.__game;
  const pet = g.visitors.pets.get('pet_sagada');
  pet.actor.locked = true;
  pet.actor.moving = false;
  pet.actor.tileX = 46;
  pet.actor.tileY = 44;
  pet.actor.syncWorldPosition();
  g.teleportTo(46, 53, 'down');
});
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/grid-08-south-fog.png' });

await page.evaluate(() => window.__game.teleportTo(46, 45, 'up'));
await page.waitForTimeout(200);
await page.click('#btn-interact');
await page.waitForTimeout(450);
await page.screenshot({ path: 'shots/grid-09-pet-animal.png' });
await page.evaluate(() => window.__game.dialogUI.close());

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
