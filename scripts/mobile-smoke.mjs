import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { mkdirSync } from 'node:fs';
mkdirSync('shots', { recursive: true });
const server = await createServer({server:{port:5197,strictPort:false}});
await server.listen();
const browser = await chromium.launch({args:['--use-gl=angle','--enable-unsafe-swiftshader']});
try {
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const page=await context.newPage();
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://localhost:${server.httpServer.address().port}/`);
 await page.waitForFunction(()=>window.__game);
 await page.screenshot({path:'shots/mobile-01-title.png'});
 await page.check('input[value="female"]');
 await page.fill('#player-name-input','Flora');
 await page.click('#btn-start-game');
 await page.waitForTimeout(1200);
 await page.screenshot({path:'shots/mobile-02-opening.png'});
 await page.click('#skip-opening');
 await page.waitForTimeout(250);
 assert.equal(await page.evaluate(()=>window.__game.state.data.character),'female');
 const bounds=await page.evaluate(()=>({game:document.querySelector('#game-canvas').getBoundingClientRect().bottom,controls:document.querySelector('#touch-controls').getBoundingClientRect().top,overflow:document.documentElement.scrollWidth>innerWidth}));
 assert.ok(Math.abs(bounds.game-bounds.controls)<1,'Game and controls must not overlap');
 assert.equal(bounds.overflow,false);
 await page.screenshot({path:'shots/mobile-03-campus.png'});
 // A continues NPC dialogue without a keyboard.
 await page.evaluate(()=>window.__game.teleportTo(67,31,'up'));
 await page.tap('#touch-a');
 assert.ok(await page.evaluate(()=>window.__game.dialogUI.isOpen));
 await page.screenshot({path:'shots/mobile-04-dialog.png'});
 for(let i=0;i<5;i++) await page.tap('#touch-a');
 await page.evaluate(()=>window.__game.dialogUI.close());
 // Hold movement, release, and check it actually stops.
 await page.evaluate(()=>window.__game.teleportTo(74,38,'down'));
 const down=page.locator('[data-direction="down"]');
 await down.dispatchEvent('pointerdown',{pointerId:1,pointerType:'touch',buttons:1});
 await page.waitForTimeout(520);
 await down.dispatchEvent('pointerup',{pointerId:1,pointerType:'touch'});
 await page.waitForTimeout(230);
 const stoppedY=await page.evaluate(()=>window.__game.player.tileY);
 assert.ok(stoppedY>38,'D-pad moves player');
 await page.waitForTimeout(300);
 assert.equal(await page.evaluate(()=>window.__game.player.tileY),stoppedY,'Release stops movement');
 await page.tap('#touch-journal');
 assert.ok(await page.evaluate(()=>window.__game.journalUI.isOpen));
 assert.equal(await page.locator('#touch-controls').isVisible(), false, 'Touch controls hidden in journal');
 await page.screenshot({path:'shots/mobile-05-journal.png'});
 await page.tap('#btn-close-journal');
 assert.equal(await page.evaluate(()=>window.__game.journalUI.isOpen),false);
 assert.equal(await page.locator('#touch-controls').isVisible(), true, 'Touch controls restored after journal');
 await page.evaluate(()=>window.__game.encounterUI.open('kamantigi'));
 await page.locator('[data-cmd="identify"]').tap();
 await page.locator('#enc-sub-menu button').filter({hasText:'Impatiens platypetala'}).tap();
 await page.locator('#btn-enc-collect').tap();
 assert.ok(await page.evaluate(()=>window.__game.state.hasCollected('kamantigi')));
 await page.screenshot({path:'shots/mobile-06-encounter.png'});
 await page.locator('[data-cmd="leave"]').tap();
 // Fog must visibly cover the edge while movement is blocked.
 await page.evaluate(()=>window.__game.teleportTo(3,12,'left'));
 await page.waitForTimeout(350);
 assert.equal(await page.evaluate(()=>window.__game.player.tryStep('left')),false);
 assert.ok(await page.evaluate(()=>Number(document.querySelector('#boundary-haze').style.opacity)>0.4));
 await page.screenshot({path:'shots/mobile-07-fog.png'});
 // Reproduce the reported southern-library view. It must not receive the
 // full-screen boundary haze that previously hid the player and the campus.
 await page.evaluate(()=>window.__game.teleportTo(25,49,'up'));
 await page.waitForTimeout(500);
 assert.ok(await page.evaluate(()=>Number(document.querySelector('#boundary-haze').style.opacity)<0.05));
 await page.screenshot({path:'shots/mobile-10-library-clear.png'});
 // Mission characters and specimens are solid, but wandering visitors are not.
 assert.equal(await page.evaluate(()=>window.__game.map.canStep(67,31,67,30)),false);
 assert.equal(await page.evaluate(()=>window.__game.map.tileAt(40,33).solid),true);
 const beforeVisitors=await page.evaluate(()=>[...window.__game.visitors.entries.values()].map(e=>[e.actor.tileX,e.actor.tileY]));
 await page.waitForTimeout(3200);
 const afterVisitors=await page.evaluate(()=>[...window.__game.visitors.entries.values()].map(e=>[e.actor.tileX,e.actor.tileY]));
 assert.notDeepEqual(afterVisitors,beforeVisitors,'Visitors wander while the game runs');
 await page.evaluate(()=>{
   const g=window.__game, entry=g.visitors.entries.values().next().value;
   entry.actor.locked=true;entry.actor.moving=false;entry.actor.tileX=25;entry.actor.tileY=49;entry.actor.syncWorldPosition();
   g.teleportTo(25,50,'up');
 });
 assert.equal(await page.evaluate(()=>window.__game.map.canStep(25,50,25,49)),true,'Visitor tiles remain passable');
 await page.tap('#touch-a');
 assert.ok(await page.evaluate(()=>window.__game.dialogUI.isOpen),'Visitors have short dialogue');
 await page.waitForTimeout(900);
 await page.screenshot({path:'shots/mobile-11-visitor-dialogue.png'});
 await page.evaluate(()=>window.__game.dialogUI.close());
 await page.setViewportSize({width:844,height:390});
 await page.waitForTimeout(300);
 await page.screenshot({path:'shots/mobile-08-landscape.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.setViewportSize({width:320,height:640});
 await page.waitForTimeout(200);
 await page.screenshot({path:'shots/mobile-09-small.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 for (const selector of ['#touch-a','#touch-b','[data-direction="down"]','#touch-journal']) {
  const box=await page.locator(selector).boundingBox();
  assert.ok(box.x>=0 && box.x+box.width<=320 && box.y+box.height<=640, `${selector} fits the smallest screen`);
 }
 await page.reload();
 await page.waitForFunction(()=>window.__game);
 assert.ok(await page.isChecked('input[value="female"]'),'Character selection survives reload');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.click('#btn-start-game');
 await page.locator('#opening-overlay').waitFor({state:'hidden'});
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('Mobile layout, touch movement/release, dialogue, journal, encounters, fog boundary, saved character and reduced-motion opening passed.');
} finally { await browser.close(); await server.close(); }
