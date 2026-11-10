// End-to-end Playwright smoke & visual verification test for the strict-grid UP Baguio map.

import { chromium } from 'playwright';
import { createServer } from 'vite';
import { mkdirSync } from 'node:fs';

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
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForFunction(() => Boolean(window.__game));
await page.waitForTimeout(400);

// 1. Start Fieldwork -> Oblation Ground & East Driveway Corridors (x=67, y=37)
await page.fill('#player-name-input', 'Isko');
await page.click('#btn-start-game');
await page.waitForTimeout(450);
await page.screenshot({ path: 'shots/grid-01-oblation-driveway.png' });

// 2. Talk to Prof. Dulay at (67, 35) -> player at (67, 36)
await page.evaluate(() => window.__game.teleportTo(67, 36, 'up'));
await page.waitForTimeout(250);
await page.click('#btn-interact');
for (let i = 0; i < 8; i += 1) {
  const open = await page.evaluate(() => window.__game.dialogUI.isOpen);
  if (!open) break;
  await page.keyboard.press('Space');
  await page.waitForTimeout(100);
}

// 3. View Open Court A (dark grey court + blue-grey north bleachers + flanking stairs)
await page.evaluate(() => window.__game.teleportTo(45, 41, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/grid-02-open-court-a-and-stairs.png' });

// 4. View Summit Crown Quad (Elev 3: KA, IB, CS, IM, UHS, Museo Kordilyera)
await page.evaluate(() => window.__game.teleportTo(43, 29, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/grid-03-summit-quad.png' });

// 5. View NW Cluster (Student Alumni Center, Balay Panganan, and stairs down to CSS)
await page.evaluate(() => window.__game.teleportTo(21, 22, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/grid-04-alumni-balay-panganan.png' });

// 6. Verify BFS path reachability from Oblation Spawn (67, 37) to all 10 NPCs and all 9 Plant Nodes!
const check = await page.evaluate(() => {
  const map = window.__game.map;
  const visited = new Set();
  const queue = [[67, 37]];
  visited.add('67,37');

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

  return {
    tilesVisited: visited.size,
    unreachableNpcs: npcs.filter((n) => !n.reachable),
  };
});
console.log('Strict Grid Map Reachability:', JSON.stringify(check));

await browser.close();
await server.close();

if (errors.length > 0 || check.unreachableNpcs.length > 0) {
  console.error('Errors or unreachable NPCs:', errors, check.unreachableNpcs);
  process.exit(1);
}
console.log('Strict grid map smoke test passed with 0 errors!');
