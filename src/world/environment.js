import * as THREE from 'three';

// Sparse airborne leaves and pollen, kept behind the HUD and above the terrain.
export function buildEnvironment(scene, map) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = 70;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const seeds = Array.from({ length: count }, (_, i) => ({
    x: (i * 17.31) % map.w, z: (i * 11.73) % map.h, phase: i * 2.41,
  }));
  for (let i = 0; i < count; i++) {
    const c = new THREE.Color(i % 3 ? '#c5ce92' : '#e4ba69');
    c.toArray(colors, i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.09, vertexColors: true, transparent: true, opacity: 0.48, depthWrite: false,
  }));
  points.frustumCulled = false;
  scene.add(points);
  function update(time) {
    const t = reducedMotion ? 0 : time;
    for (let i = 0; i < count; i++) {
      const s = seeds[i], x = (s.x + t * 0.18) % map.w, z = s.z + Math.sin(t * 0.2 + s.phase) * 0.6;
      const elev = map.tileAt(Math.floor(x), Math.floor(z))?.elev || 0;
      positions.set([x, elev + 4.8 + Math.sin(t * 0.3 + s.phase) * 0.7, z], i * 3);
    }
    geo.attributes.position.needsUpdate = true;
  }
  update(0);
  return { update, reducedMotion };
}
