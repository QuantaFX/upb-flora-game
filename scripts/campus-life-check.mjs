import assert from 'node:assert/strict';
import { createCampusMap } from '../src/world/map.js';

const map = createCampusMap();
for (const entity of [...map.npcs, ...map.plantNodes, ...map.signs, ...map.props]) {
  assert.equal(map.tileAt(entity.x, entity.y).solid, true, `${entity.id || entity.kind} must block walking`);
}
const reached = new Set([`${map.spawn.x},${map.spawn.y}`]);
const queue = [[map.spawn.x, map.spawn.y]];
const directions = [[1,0],[-1,0],[0,1],[0,-1]];
for (let i = 0; i < queue.length; i++) {
  const [x,y] = queue[i];
  for (const [dx,dy] of directions) {
    const nx=x+dx, ny=y+dy, key=`${nx},${ny}`;
    if (!reached.has(key) && map.canStep(x,y,nx,ny)) { reached.add(key); queue.push([nx,ny]); }
  }
}
for (const entity of [...map.npcs,...map.plantNodes,...map.signs]) {
  assert.ok(directions.some(([dx,dy])=>reached.has(`${entity.x+dx},${entity.y+dy}`)), `${entity.id} must remain reachable for interaction`);
}
console.log('Solid characters, vegetation and furniture; all mission interactions reachable.');
