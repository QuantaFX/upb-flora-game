// End-to-end Playwright smoke & visual verification test for UP Baguio Flora Quest.
// Starts Vite dev server, captures screenshots across the title screen, Oblation Plaza,
// Prof. Dulay dialog, Pokemon-style plant encounter, Herbarium journal, and medicinal quests.

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

// 1. Title screen screenshot
await page.screenshot({ path: 'shots/demo-01-title.png' });

// 2. Click Start Fieldwork -> Oblation Plaza
await page.fill('#player-name-input', 'Isko');
await page.click('#btn-start-game');
await page.waitForTimeout(500);
await page.screenshot({ path: 'shots/demo-02-oblation-plaza.png' });

// 3. Walk up to Prof. Dulay (19, 27) and start Mission 1
await page.evaluate(() => window.__game.teleportTo(19, 28, 'up'));
await page.waitForTimeout(300);
await page.click('#btn-interact');
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/demo-03-prof-dulay-dialog.png' });

// Advance through all pages of Prof. Dulay's intro
for (let i = 0; i < 8; i += 1) {
  const open = await page.evaluate(() => window.__game.dialogUI.isOpen);
  if (!open) break;
  await page.keyboard.press('Space');
  await page.waitForTimeout(120);
}

// 4. Examine the heritage Benguet Pine (Saleng) at (16, 25)
await page.evaluate(() => window.__game.teleportTo(16, 26, 'up'));
await page.waitForTimeout(300);
await page.click('#btn-interact');
await page.waitForTimeout(400);

// Observe leaves clue
await page.click('[data-cmd="observe"]');
await page.waitForTimeout(150);
await page.click('.encounter-submenu button:first-child');
await page.waitForTimeout(200);
await page.screenshot({ path: 'shots/demo-04-saleng-encounter.png' });

// Identify Benguet Pine & Collect voucher
await page.click('[data-cmd="identify"]');
await page.waitForTimeout(150);
await page.locator('.encounter-submenu button', { hasText: 'Benguet Pine' }).click();
await page.waitForTimeout(200);
await page.click('[data-cmd="collect"]');
await page.waitForTimeout(200);
await page.click('[data-cmd="leave"]');
await page.waitForTimeout(300);

// 5. Talk to Apo Sabado (15, 26) & complete M1 with Prof. Dulay
await page.evaluate(() => window.__game.teleportTo(15, 27, 'up'));
await page.waitForTimeout(200);
await page.click('#btn-interact');
for (let i = 0; i < 8; i += 1) {
  const open = await page.evaluate(() => window.__game.dialogUI.isOpen);
  if (!open) break;
  await page.keyboard.press('Space');
  await page.waitForTimeout(100);
}

await page.evaluate(() => window.__game.teleportTo(19, 28, 'up'));
await page.waitForTimeout(200);
await page.click('#btn-interact');
for (let i = 0; i < 8; i += 1) {
  const open = await page.evaluate(() => window.__game.dialogUI.isOpen);
  if (!open) break;
  await page.keyboard.press('Space');
  await page.waitForTimeout(100);
}

// 6. Visit Breha Dormitory & examine Lagundi (4, 21) for Paolo's cough (Mission 2)
await page.evaluate(() => window.__game.teleportTo(8, 21, 'up'));
await page.waitForTimeout(250);
await page.click('#btn-interact'); // Talk to Paolo
for (let i = 0; i < 8; i += 1) {
  const open = await page.evaluate(() => window.__game.dialogUI.isOpen);
  if (!open) break;
  await page.keyboard.press('Space');
  await page.waitForTimeout(100);
}

await page.evaluate(() => window.__game.teleportTo(4, 22, 'up'));
await page.waitForTimeout(250);
await page.click('#btn-interact'); // Examine Lagundi
await page.waitForTimeout(300);
await page.click('[data-cmd="identify"]');
await page.waitForTimeout(150);
await page.locator('.encounter-submenu button', { hasText: 'Lagundi' }).click();
await page.waitForTimeout(200);
await page.click('[data-cmd="collect"]');
await page.waitForTimeout(200);
await page.screenshot({ path: 'shots/demo-05-lagundi-encounter.png' });
await page.click('[data-cmd="leave"]');
await page.waitForTimeout(250);

// 7. Teleport to College of Science Terrace (Level 1) & open Digital Herbarium Journal
await page.evaluate(() => window.__game.teleportTo(19, 15, 'up'));
await page.waitForTimeout(350);
await page.screenshot({ path: 'shots/demo-06-science-terrace.png' });

await page.click('#btn-journal');
await page.waitForTimeout(300);
await page.screenshot({ path: 'shots/demo-07-herbarium-journal.png' });

const summary = await page.evaluate(() => ({
  identified: window.__game.state.data.identifiedPlants,
  collected: window.__game.state.data.collectedPlants,
  quests: window.__game.state.data.quests,
}));
console.log('Verification state:', JSON.stringify(summary));

await browser.close();
await server.close();

if (errors.length > 0) {
  console.error('Page errors:', errors);
  process.exit(1);
}
console.log('Smoke test passed with 0 errors!');
