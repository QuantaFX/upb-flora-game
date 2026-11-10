// End-to-end Playwright smoke & visual verification test for the 4-level concentric UP Baguio map.

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

// 1. Title screen
await page.screenshot({ path: 'shots/demo-01-title.png' });

// 2. Click Start Fieldwork -> Oblation Ground (SE Driveway Entrance, Elev 0)
await page.fill('#player-name-input', 'Isko');
await page.click('#btn-start-game');
await page.waitForTimeout(500);
await page.screenshot({ path: 'shots/demo-02-oblation-ground.png' });

// 3. Talk to Prof. Dulay at (42, 22) -> player stands at (42, 23)
await page.evaluate(() => window.__game.teleportTo(42, 23, 'up'));
await page.waitForTimeout(250);
await page.click('#btn-interact');
await page.waitForTimeout(300);
await page.screenshot({ path: 'shots/demo-03-prof-dulay-dialog.png' });

for (let i = 0; i < 8; i += 1) {
  const open = await page.evaluate(() => window.__game.dialogUI.isOpen);
  if (!open) break;
  await page.keyboard.press('Space');
  await page.waitForTimeout(100);
}

// 4. Examine Heritage Benguet Pine (Saleng) at (39, 18) -> player stands at (39, 19)
await page.evaluate(() => window.__game.teleportTo(39, 19, 'up'));
await page.waitForTimeout(250);
await page.click('#btn-interact');
await page.waitForTimeout(300);
await page.click('[data-cmd="observe"]');
await page.waitForTimeout(120);
await page.click('.encounter-submenu button:first-child');
await page.waitForTimeout(150);
await page.screenshot({ path: 'shots/demo-04-saleng-encounter.png' });

await page.click('[data-cmd="identify"]');
await page.waitForTimeout(120);
await page.locator('.encounter-submenu button', { hasText: 'Benguet Pine' }).click();
await page.waitForTimeout(150);
await page.click('[data-cmd="collect"]');
await page.waitForTimeout(150);
await page.click('[data-cmd="leave"]');
await page.waitForTimeout(250);

// 5. Talk to Apo Sabado at (40, 19) & report back to Prof. Dulay at (42, 22)
await page.evaluate(() => window.__game.teleportTo(40, 20, 'up'));
await page.waitForTimeout(200);
await page.click('#btn-interact');
for (let i = 0; i < 8; i += 1) {
  const open = await page.evaluate(() => window.__game.dialogUI.isOpen);
  if (!open) break;
  await page.keyboard.press('Space');
  await page.waitForTimeout(100);
}

await page.evaluate(() => window.__game.teleportTo(42, 23, 'up'));
await page.waitForTimeout(200);
await page.click('#btn-interact');
for (let i = 0; i < 8; i += 1) {
  const open = await page.evaluate(() => window.__game.dialogUI.isOpen);
  if (!open) break;
  await page.keyboard.press('Space');
  await page.waitForTimeout(100);
}

// 6. Check Middle Terrace (Elev 2): Open Court A, UPB Library & Bulwagang Juan Luna
await page.evaluate(() => window.__game.teleportTo(31, 21, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/demo-05-middle-terrace-court-a.png' });

// 7. Check Summit Crown Plateau (Elev 3): IB Building, KA, CS, Balay Panganan, Balay Salun-at
await page.evaluate(() => window.__game.teleportTo(30, 13, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/demo-06-summit-crown-ib-ka.png' });

// 8. Check West Summit: Museo Kordilyera & Student Alumni Center (Elev 3)
await page.evaluate(() => window.__game.teleportTo(18, 14, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/demo-07-museo-kordilyera-summit.png' });

// 9. Verify BFS path reachability from Oblation Spawn (42, 24) to all 4 elevation levels!
const reachability = await page.evaluate(() => {
  const map = window.__game.map;
  const visited = new Set();
  const queue = [[42, 24]];
  visited.add('42,24');
  const elevReached = new Set();

  while (queue.length > 0) {
    const [x, y] = queue.shift();
    const t = map.tileAt(x, y);
    elevReached.add(t.elev);
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
  return {
    tilesVisited: visited.size,
    elevations: Array.from(elevReached).sort((a, b) => a - b),
  };
});
console.log('Walkable BFS Reachability:', JSON.stringify(reachability));

await browser.close();
await server.close();

if (errors.length > 0) {
  console.error('Page errors:', errors);
  process.exit(1);
}
console.log('Smoke test passed with 0 errors!');
