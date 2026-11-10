import { Actor } from './actor.js';

const VISITORS = [
  { id:'visitor_aya', name:'Aya', sprite:'Villager6', x:25, y:49, lines:['Happy Native Plants Week! Have you filled your herbarium yet?', 'The library walk is my favorite place to take a break.'] },
  { id:'visitor_luis', name:'Luis', sprite:'Villager2', x:29, y:48, lines:['Seven plants, seven stories. I still have three to find!', 'A photo lasts longer than a picked flower.'] },
  { id:'visitor_mai', name:'Mai', sprite:'Woman', x:44, y:31, lines:['The fern near Inang Laya is easy to miss. Look closely!', 'Please leave the garden beds for the plants.'] },
  { id:'visitor_nico', name:'Nico', sprite:'Villager', x:49, y:28, lines:['The bunting looks lovely against the pine trees.', 'See you at the celebration by Court A!'] },
  { id:'visitor_sam', name:'Sam', sprite:'Villager5', x:68, y:33, lines:['Welcome! Professor Barcelo can help you get started.', 'Keep your camera ready. There is a lot growing here.'] },
  { id:'visitor_jo', name:'Jo', sprite:'Villager4', x:47, y:44, lines:['A little shade, a bench, and a good book. Perfect.', 'The bins are beside the benches. Let us keep campus clean.'] },
  { id:'visitor_ren', name:'Ren', sprite:'Boy', x:45, y:40, lines:['We are taking a break from the game to explore the plants.', 'Enjoy the festival! Watch your step on the terraces.'] },
  { id:'visitor_toni', name:'Toni', sprite:'Village6', x:42, y:9, lines:['The north gardens are full of little surprises.', 'Take your time. Plants reward a closer look.'] },
];

export function buildVisitors(scene, map, assets, onMove) {
  const entries = new Map();
  for (const [index, def] of VISITORS.entries()) {
    if (map.tileAt(def.x,def.y)?.solid) throw new Error(`Blocked visitor start: ${def.id}`);
    const actor = new Actor(scene,map,assets.characters[def.sprite], {...def, dir:'down'});
    actor.onStepComplete = onMove;
    entries.set(def.id, { def, actor, nextMove:1+index*0.4, turn:index, line:0 });
  }
  const directions = [['down',0,1],['right',1,0],['up',0,-1],['left',-1,0]];
  function update(dt, time, paused, player) {
    for (const entry of entries.values()) {
      const {actor,def} = entry;
      actor.update(dt,time);
      if (paused || actor.locked || actor.moving || time < entry.nextMove) continue;
      entry.nextMove = time + 1.2 + (entry.turn % 4) * 0.35;
      entry.turn++;
      for (let i=0;i<4;i++) {
        const [dir,dx,dy] = directions[(entry.turn*7+i*3)%4];
        const x=actor.tileX+dx, y=actor.tileY+dy;
        if (Math.abs(x-def.x)>4 || Math.abs(y-def.y)>2) continue;
        if (x===player.tileX && y===player.tileY) continue;
        if (!['path','plaza','road','court'].includes(map.tileAt(x,y)?.type)) continue;
        if (actor.tryStep(dir)) break;
      }
    }
  }
  // Visitors intentionally never set tile.solid, so a crowd cannot seal a path.
  return { entries, update };
}
