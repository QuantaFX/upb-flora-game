import * as THREE from 'three';

export function buildBoundaryMist(scene, map) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 12, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(220,234,227,1)');
  gradient.addColorStop(0.6, 'rgba(220,234,227,0.85)');
  gradient.addColorStop(1, 'rgba(220,234,227,0)');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, fog: false });
  const group = new THREE.Group();
  group.name = 'Campus fog boundary';
  const b = map.bounds;
  function cloud(x, z) {
    for (let layer = 0; layer < 3; layer++) {
      const sprite = new THREE.Sprite(material);
      sprite.position.set(x, layer * 4 - 1, z);
      sprite.scale.set(13, 12, 1);
      group.add(sprite);
    }
  }
  for (let x = b.minX - 5; x <= b.maxX + 5; x += 5) {
    cloud(x, b.minY - 3); cloud(x, b.maxY + 4);
  }
  for (let y = b.minY; y <= b.maxY; y += 5) {
    cloud(b.minX - 4, y); cloud(b.maxX + 4, y);
  }
  scene.add(group);
  const haze = document.getElementById('boundary-haze');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  return { update(time, player) {
    const x = player.group.position.x, z = player.group.position.z;
    const distance = Math.min(x - b.minX, b.maxX + 1 - x, z - b.minY, b.maxY + 1 - z);
    const proximity = THREE.MathUtils.clamp(1 - distance / 5, 0, 1);
    scene.fog.density = 0.014 + proximity * 0.055;
    haze.style.opacity = String(proximity * 0.65);
    group.position.y = reducedMotion.matches ? 0 : Math.sin(time * 0.25) * 0.25;
  } };
}
