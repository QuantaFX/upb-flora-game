import * as THREE from 'three';

// Animated 6-frame pixel-art falling leaves (FX/Particle/Leaf.png, as seen in Example 1.gif),
// 4-frame fluttering butterflies across grassy areas, and subtle airborne pollen.
export function buildEnvironment(scene, map, assets) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const group = new THREE.Group();
  scene.add(group);

  // 1. Subtle airborne pollen / spores
  const count = 70;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const seeds = Array.from({ length: count }, (_, i) => ({
    x: (i * 17.31) % map.w,
    z: (i * 11.73) % map.h,
    phase: i * 2.41,
  }));
  for (let i = 0; i < count; i += 1) {
    const c = new THREE.Color(i % 3 ? '#c5ce92' : '#e4ba69');
    c.toArray(colors, i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    }),
  );
  points.frustumCulled = false;
  group.add(points);

  // 2. World-Space Falling Pixel-Art Leaves (Example 1.gif style using 6-frame FX/Particle/Leaf.png)
  const leafFrames = assets?.leafFrames || [];
  const leafMats = leafFrames.map(
    (tex) =>
      new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.25,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
  );

  // Collect world-space woody anchor positions (trees, understory bushes, and tall-grass woodland patches)
  const woodyAnchors = [];
  for (const p of map.props) {
    if (p.kind === 'pine' || p.kind === 'understory' || p.kind === 'wood') {
      woodyAnchors.push({
        x: p.x + 0.5,
        z: p.y + 0.5,
        elev: p.elev,
        isTree: p.kind === 'pine',
      });
    }
  }
  for (const row of map.tiles) {
    for (const t of row) {
      if (t.type === 'tall_grass' && (t.x + t.y) % 2 === 0) {
        woodyAnchors.push({
          x: t.x + 0.5,
          z: t.y + 0.5,
          elev: t.elev,
          isTree: false,
        });
      }
    }
  }

  const leafGeo = new THREE.PlaneGeometry(0.46, 0.27);
  const canopyLeaves = [];

  if (leafMats.length === 6 && woodyAnchors.length > 0) {
    // Spawn falling leaves strictly in world coordinates across all woody areas on campus
    const totalCanopyLeaves = 240;
    for (let i = 0; i < totalCanopyLeaves; i += 1) {
      const anchor = woodyAnchors[(i * 7) % woodyAnchors.length];
      const mesh = new THREE.Mesh(leafGeo, leafMats[i % 6]);
      mesh.rotation.x = -0.32;
      const offsetX = (((i * 19) % 13) - 6) * 0.18;
      const offsetZ = (((i * 23) % 13) - 6) * 0.18;
      const startY = anchor.isTree ? 2.15 + (i % 3) * 0.25 : 1.55 + (i % 3) * 0.2;
      const endY = 0.12;
      group.add(mesh);
      canopyLeaves.push({
        mesh,
        baseX: anchor.x + offsetX,
        baseZ: anchor.z + offsetZ,
        elev: anchor.elev,
        startY,
        endY,
        fallSpeed: 0.22 + (i % 5) * 0.035,
        swaySpeed: 2.3 + (i % 4) * 0.35,
        swayAmp: 0.34 + (i % 3) * 0.08,
        phase: i * 1.37,
      });
    }
  }

  // 3. Fluttering Butterflies across Grassy & Floral Areas
  const butterflyMatsByPalette = [];
  if (assets?.butterflyFrames) {
    const { orange = [], blue = [] } = assets.butterflyFrames;
    if (orange.length === 4 && blue.length === 4) {
      // 4 vibrant butterfly palettes: Monarch Orange, Sky Blue, Golden Yellow, and Violet-Pink
      const specs = [
        { frames: orange, tint: '#ffffff' },
        { frames: blue, tint: '#ffffff' },
        { frames: orange, tint: '#fff275' },
        { frames: blue, tint: '#f3b8ff' },
      ];
      for (const spec of specs) {
        butterflyMatsByPalette.push(
          spec.frames.map(
            (tex) =>
              new THREE.MeshBasicMaterial({
                map: tex,
                color: new THREE.Color(spec.tint),
                transparent: true,
                alphaTest: 0.3,
                depthWrite: false,
                side: THREE.DoubleSide,
              }),
          ),
        );
      }
    }
  }

  // Collect grassy anchor tiles across the campus (inside bounds)
  const grassAnchors = [];
  for (let y = map.bounds.minY + 1; y <= map.bounds.maxY - 1; y += 2) {
    for (let x = map.bounds.minX + 1; x <= map.bounds.maxX - 1; x += 2) {
      const t = map.tileAt(x, y);
      if (t && (t.type === 'grass' || t.type === 'tall_grass')) {
        grassAnchors.push({ x: x + 0.5, z: y + 0.5, elev: t.elev });
      }
    }
  }
  // Also include sunflower & quest plant coordinates so butterflies visit campus flowers
  for (const p of map.props) {
    if (p.kind === 'sunflower_deco' || p.kind === 'understory') {
      grassAnchors.push({ x: p.x + 0.5, z: p.y + 0.5, elev: p.elev });
    }
  }

  const butterflies = [];
  const butterflyGeo = new THREE.PlaneGeometry(0.52, 0.52);

  if (butterflyMatsByPalette.length > 0 && grassAnchors.length > 0) {
    const totalButterflies = 60;
    for (let i = 0; i < totalButterflies; i += 1) {
      const anchor = grassAnchors[(i * 11) % grassAnchors.length];
      const palette = butterflyMatsByPalette[i % butterflyMatsByPalette.length];
      const mesh = new THREE.Mesh(butterflyGeo, palette[0]);
      mesh.rotation.x = -0.32;
      group.add(mesh);
      butterflies.push({
        mesh,
        palette,
        baseX: anchor.x + (((i * 13) % 7) - 3) * 0.22,
        baseZ: anchor.z + (((i * 17) % 7) - 3) * 0.22,
        elev: anchor.elev,
        radiusX: 0.65 + (i % 4) * 0.24,
        radiusZ: 0.55 + (i % 3) * 0.22,
        flightSpeed: 0.65 + (i % 5) * 0.14,
        flapSpeed: 8.5 + (i % 4) * 1.2,
        phase: i * 1.73,
      });
    }
  }

  function update(time) {
    const t = reducedMotion ? 0 : time;
    for (let i = 0; i < count; i += 1) {
      const s = seeds[i];
      const x = (s.x + t * 0.18) % map.w;
      const z = s.z + Math.sin(t * 0.2 + s.phase) * 0.6;
      const elev = map.tileAt(Math.floor(x), Math.floor(z))?.elev || 0;
      positions.set([x, elev + 4.8 + Math.sin(t * 0.3 + s.phase) * 0.7, z], i * 3);
    }
    geo.attributes.position.needsUpdate = true;

    if (leafMats.length === 6) {
      // Animate canopy leaves strictly at their world-space tree/woodland coordinates
      for (let i = 0; i < canopyLeaves.length; i += 1) {
        const l = canopyLeaves[i];
        const fallProgress = (t * l.fallSpeed + l.phase) % 1;
        const swayAngle = t * l.swaySpeed + l.phase * 2.1;
        const dx = Math.sin(swayAngle) * l.swayAmp;
        const dz = Math.cos(swayAngle * 0.65) * 0.12 + fallProgress * 0.35;
        const y = l.elev + l.startY * (1 - fallProgress) + l.endY * fallProgress;

        // Map pendulum sway phase to the 6 frames of FX/Particle/Leaf.png
        const cycle = ((swayAngle / (Math.PI * 2)) % 1 + 1) % 1;
        const frameIdx = Math.min(5, Math.floor(cycle * 6));
        if (l.mesh.material !== leafMats[frameIdx]) {
          l.mesh.material = leafMats[frameIdx];
        }
        l.mesh.position.set(l.baseX + dx, y, l.baseZ + dz);
      }
    }

    // Animate butterflies flying in figure-8 loops over the grassy areas
    for (let i = 0; i < butterflies.length; i += 1) {
      const b = butterflies[i];
      const angle = t * b.flightSpeed + b.phase;
      const dx = Math.sin(angle) * b.radiusX + Math.sin(angle * 2.1) * 0.22;
      const dz = Math.cos(angle * 0.85) * b.radiusZ + Math.cos(angle * 1.7) * 0.18;
      const bobY = Math.sin(t * 3.8 + b.phase) * 0.16;
      const tileElev =
        map.tileAt(Math.round(b.baseX + dx), Math.round(b.baseZ + dz))?.elev ?? b.elev;
      const frameIdx = Math.floor(t * b.flapSpeed + b.phase * 4) % 4;
      if (b.mesh.material !== b.palette[frameIdx]) {
        b.mesh.material = b.palette[frameIdx];
      }
      b.mesh.position.set(b.baseX + dx, tileElev + 0.68 + bobY, b.baseZ + dz);
    }
  }

  update(0);
  return { update, reducedMotion };
}
