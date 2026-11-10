import * as THREE from 'three';

export function buildBoundaryMist(scene, map) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 14, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(220,234,227,1)');
  gradient.addColorStop(0.65, 'rgba(220,234,227,0.92)');
  gradient.addColorStop(1, 'rgba(220,234,227,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    fog: false,
  });

  // Continuous north-to-south mist sheet texture to completely seal the blue background beyond the south edge
  const southSheetCanvas = document.createElement('canvas');
  southSheetCanvas.width = 64;
  southSheetCanvas.height = 128;
  const sctx = southSheetCanvas.getContext('2d');
  const sgrad = sctx.createLinearGradient(0, 0, 0, 128);
  sgrad.addColorStop(0, 'rgba(220,234,227,0)');
  sgrad.addColorStop(0.14, 'rgba(220,234,227,0.88)');
  sgrad.addColorStop(0.28, 'rgba(220,234,227,1)');
  sgrad.addColorStop(1, 'rgba(220,234,227,1)');
  sctx.fillStyle = sgrad;
  sctx.fillRect(0, 0, 64, 128);
  const southSheetTex = new THREE.CanvasTexture(southSheetCanvas);

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

  // Two stacked southern mist sheets spanning the entire southern horizon (z = b.maxY - 0.5 .. b.maxY + 21.5)
  // Positioned higher (y = 0.55 and y = 1.2) to cover the blue sky background at the bottom of the screen
  // while staying well below the camera's sightline (camera is at y = 13.5).
  for (const [layerY, startZ] of [
    [0.55, b.maxY - 0.4],
    [1.2, b.maxY + 0.6],
  ]) {
    const depth = 22;
    const sheet = new THREE.Mesh(
      new THREE.PlaneGeometry(map.w + 56, depth),
      new THREE.MeshBasicMaterial({
        map: southSheetTex,
        transparent: true,
        depthWrite: false,
        fog: false,
        side: THREE.DoubleSide,
      }),
    );
    sheet.name = 'Southern fog blanket';
    sheet.rotation.x = -Math.PI / 2;
    sheet.position.set(map.w / 2, layerY, startZ + depth / 2);
    group.add(sheet);
  }

  for (let x = b.minX - 8; x <= b.maxX + 8; x += 4) {
    cloud(x, b.minY - 3);
    // Raised overlapping southern fog banks covering the bottom border of the map
    for (const [bankY, bankZ, d] of [
      [0.75, b.maxY + 2.2, 10],
      [1.45, b.maxY + 5.4, 12],
    ]) {
      const bank = new THREE.Mesh(
        new THREE.PlaneGeometry(15, d),
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
          fog: false,
          side: THREE.DoubleSide,
        }),
      );
      bank.name = 'Low southern fog';
      bank.rotation.x = -Math.PI / 2;
      bank.position.set(x, bankY, bankZ);
      group.add(bank);
    }
  }

  for (let y = b.minY; y <= b.maxY + 4; y += 5) {
    cloud(b.minX - 4, y);
    cloud(b.maxX + 4, y);
  }

  scene.add(group);
  const haze = document.getElementById('boundary-haze');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  return {
    update(time, player) {
      const x = player.group.position.x,
        z = player.group.position.z;
      const distance = Math.min(x - b.minX, b.maxX + 1 - x, z - b.minY);
      const proximity = THREE.MathUtils.clamp(1 - distance / 5, 0, 1);
      scene.fog.density = 0.014 + proximity * 0.055;
      const southProximity = THREE.MathUtils.clamp(1 - (b.maxY + 1 - z) / 3.5, 0, 1);
      haze.style.background =
        proximity > 0
          ? 'radial-gradient(ellipse, transparent 20%, #dceae3 100%)'
          : 'linear-gradient(to top, #dceae3 0%, rgba(220,234,227,0.85) 10%, transparent 28%)';
      haze.style.opacity = String(Math.max(proximity * 0.65, southProximity * 0.32));
      group.position.y = reducedMotion.matches ? 0 : Math.sin(time * 0.25) * 0.22;
    },
  };
}
