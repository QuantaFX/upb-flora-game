import * as THREE from 'three';
import { canvasToTexture } from '../assets.js';

// Raised banners and pennants leave the walking routes beneath them clear.
export function buildFestival(scene, map) {
  const group = new THREE.Group();
  group.name = 'Native Plants Week';
  scene.add(group);
  const colors = ['#7b1113', '#f5b935', '#2f6239', '#f6efe2'];
  const materials = colors.map(color => new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide }));
  const cordMat = new THREE.LineBasicMaterial({ color: '#dfc79b' });
  const flags = [];
  function bunting(x, z, width, height) {
    const points = [];
    for (let i = 0; i <= width; i++) {
      const sag = Math.sin(i / width * Math.PI) * 0.45;
      points.push(new THREE.Vector3(x + i, height - sag, z));
      if (i === width) continue;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0.72, 0, 0, 0.36, -0.85, 0], 3));
      geo.computeVertexNormals();
      const flag = new THREE.Mesh(geo, materials[i % materials.length]);
      flag.position.set(x + i + 0.14, height - sag, z);
      group.add(flag);
      flags.push(flag);
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), cordMat));
  }
  function banner(x, z, width, subtitle) {
    const c = document.createElement('canvas');
    c.width = 768; c.height = 192;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#7b1113'; ctx.fillRect(0, 0, 768, 192);
    ctx.strokeStyle = '#f5b935'; ctx.lineWidth = 12; ctx.strokeRect(8, 8, 752, 176);
    ctx.textAlign = 'center'; ctx.fillStyle = '#fff4d6';
    ctx.font = 'bold 48px Trebuchet MS'; ctx.fillText('Native Plants Week', 384, 83);
    ctx.fillStyle = '#f5b935'; ctx.font = '26px Trebuchet MS'; ctx.fillText(subtitle, 384, 140);
    const elev = map.tileAt(Math.floor(x), Math.floor(z))?.elev || 0;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, width / 4), new THREE.MeshBasicMaterial({ map: canvasToTexture(c), side: THREE.DoubleSide }));
    mesh.position.set(x, elev + 4.2, z);
    group.add(mesh);
    bunting(x - width / 2 - 2, z, width + 4, elev + 6.3);
  }
  banner(68, 29, 7, 'Welcome, campus explorers!');
  banner(44, 29, 8, 'Observe • Identify • Celebrate');
  banner(26, 48, 7, 'Every plant has a story');
  bunting(39, 9, 11, 4.8);
  bunting(39, 35, 13, 6.2);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  return { update(time) {
    if (reducedMotion.matches) return;
    flags.forEach((flag, i) => { flag.rotation.x = Math.sin(time * 1.3 + i * 0.6) * 0.12; });
  } };
}
