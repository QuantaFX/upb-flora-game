// End-to-end Playwright smoke & visual verification test for the expanded 80x64 UP Baguio map,
// building foundation grounding (zero floating buildings), and automatic building occlusion transparency.

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

// 1. Click Start Fieldwork -> Oblation Ground (SE Driveway Entrance, Elev 0, x=64, y=37)
await page.fill('#player-name-input', 'Isko');
await page.click('#btn-start-game');
await page.waitForTimeout(450);
await page.screenshot({ path: 'shots/expanded-01-oblation-ground.png' });

// 2. Talk to Prof. Dulay at (64, 34) -> player stands at (64, 35)
await page.evaluate(() => window.__game.teleportTo(64, 35, 'up'));
await page.waitForTimeout(250);
await page.click('#btn-interact');
for (let i = 0; i < 8; i += 1) {
  const open = await page.evaluate(() => window.__game.dialogUI.isOpen);
  if (!open) break;
  await page.keyboard.press('Space');
  await page.waitForTimeout(100);
}

// 3. Examine Heritage Benguet Pine (Saleng) at (60, 27) -> player at (60, 28)
await page.evaluate(() => window.__game.teleportTo(60, 28, 'up'));
await page.waitForTimeout(250);
await page.click('#btn-interact');
await page.waitForTimeout(250);
await page.click('[data-cmd="identify"]');
await page.waitForTimeout(120);
await page.locator('.encounter-submenu button', { hasText: 'Benguet Pine' }).click();
await page.waitForTimeout(150);
await page.click('[data-cmd="collect"]');
await page.waitForTimeout(150);
await page.click('[data-cmd="leave"]');
await page.waitForTimeout(250);

// 4. Middle Terrace (Elev 2): Open Court A & UPB Library
await page.evaluate(() => window.__game.teleportTo(47, 30, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/expanded-02-open-court-a.png' });

// 5. Summit Crown Plateau (Elev 3): IB Building, College of Science, Biodiversity Center below
await page.evaluate(() => window.__game.teleportTo(46, 20, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/expanded-03-summit-no-floating.png' });

// 6. Walk BEHIND Iskolar ng Bayan Building (x=43, y=14) to verify automatic building see-through transparency!
await page.evaluate(() => window.__game.teleportTo(43, 14, 'down'));
await page.waitForTimeout(450);
await page.screenshot({ path: 'shots/expanded-04-building-transparent-occlusion.png' });

// 7. Verify BFS path reachability across the 80x64 map from Oblation Spawn (64, 37)
const reachability = await page.evaluate(() => {
  const map = window.__game.map;
  const visited = new Set();
  const queue = [[64, 37]];
  visited.add('64,37');
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
console.log('Expanded Map BFS Reachability:', JSON.stringify(reachability));

await browser.close();
await server.close();

if (errors.length > 0) {
  console.error('Page errors:', errors);
  process.exit(1);
}
console.log('Expanded map smoke test passed with 0 errors!');
