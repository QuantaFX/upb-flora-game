import {createCampusMap} from '../src/world/map.js';
const m=createCampusMap(), errors=[];
for (const row of m.tiles) for (const t of row) {
 if (t.x < m.bounds.minX || t.x > m.bounds.maxX || t.y < m.bounds.minY || t.y > m.bounds.maxY) {
  if (m.canStep(Math.max(m.bounds.minX, Math.min(t.x, m.bounds.maxX)), Math.max(m.bounds.minY, Math.min(t.y, m.bounds.maxY)), t.x,t.y)) errors.push(`Boundary is passable: ${t.x},${t.y}`);
 }
}
for(const p of [...m.plantNodes,...m.props.filter(p=>['pine','understory','sunflower_deco'].includes(p.kind))]) if(!['grass','tall_grass'].includes(m.tileAt(p.x,p.y).type)) errors.push(`Plant on ${m.tileAt(p.x,p.y).type}: ${p.id||p.kind} (${p.x},${p.y})`);
const vectors={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
for(const row of m.tiles) for(const t of row) if(t.type==='stair') {
 const [dx,dy]=vectors[t.stairDir];
 for(const sign of [-1,1]) {
  const n=m.tileAt(t.x+dx*sign,t.y+dy*sign); if(!n)continue;
  const edge=t.elev+sign*t.stairStepH/2;
  const next=n.type==='stair'?n.elev-sign*n.stairStepH/2:n.elev;
  if(n.solid||Math.abs(edge-next)>0.001) errors.push(`Stair seam (${t.x},${t.y}) -> (${n.x},${n.y}): ${edge}/${next}${n.solid?' blocked':''}`);
 }
}
console.log(errors.join('\n')||'Plant paving and stair continuity checks passed');
process.exitCode=errors.length?1:0;
