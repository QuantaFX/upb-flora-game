// 3D Campus Buildings, Oblation Monument, Quest Plant Billboards with sparkles,
// decorative trees, signs, and benches.

import * as THREE from 'three';
import { canvasToTexture, sliceTileTexture } from '../assets.js';
import { BUILDINGS, PLANT_NODES, SIGNS } from './map.js';

function createBuildingFacadeTexture(b) {
  const c = document.createElement('canvas');
  c.width = b.w * 32;
  c.height = 96;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;

  // Base wall plaster
  g.fillStyle = b.wallColor || '#f0e4ce';
  g.fillRect(0, 0, c.width, c.height);

  // Concrete pillars & cornice bands (classic UP campus architecture)
  g.fillStyle = '#c8b89e';
  g.fillRect(0, 0, c.width, 8);
  g.fillRect(0, c.height - 10, c.width, 10);
  for (let i = 0; i <= b.w; i += 1) {
    g.fillRect(i * 32 - 3, 0, 6, c.height);
  }

  // Windows across upper & lower floors
  for (let i = 0; i < b.w; i += 1) {
    const wx = i * 32 + 7;
    // Upper window
    g.fillStyle = '#2d475a';
    g.fillRect(wx, 18, 18, 20);
    g.fillStyle = '#7bb0d4';
    g.fillRect(wx + 2, 20, 6, 16);
    g.fillRect(wx + 10, 20, 6, 16);

    // Door or lower window
    const isDoor = b.x + i === b.doorX;
    if (isDoor) {
      g.fillStyle = '#4a2a14';
      g.fillRect(wx, 52, 18, 36);
      g.fillStyle = '#d89b48';
      g.fillRect(wx + 3, 55, 12, 16);
    } else {
      g.fillStyle = '#2d475a';
      g.fillRect(wx, 52, 18, 22);
      g.fillStyle = '#6da0c4';
      g.fillRect(wx + 2, 54, 14, 18);
    }
  }

  // UP Maroon signage banner across the front
  const signW = Math.min(c.width - 12, Math.max(110, b.name.length * 7 + 16));
  const signX = (c.width - signW) / 2;
  g.fillStyle = '#7b1113';
  g.fillRect(signX, 38, signW, 13);
  g.strokeStyle = '#f5b935';
  g.lineWidth = 1;
  g.strokeRect(signX + 0.5, 38.5, signW - 1, 12);

  g.fillStyle = '#fff8e6';
  g.font = 'bold 8px "Trebuchet MS", sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(b.name, c.width / 2, 44.5);

  return canvasToTexture(c);
}

function createSparkleTexture() {
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 16;
  const g = c.getContext('2d');
  g.fillStyle = '#fff6a8';
  g.fillRect(7, 1, 2, 14);
  g.fillRect(1, 7, 14, 2);
  g.fillStyle = '#ffffff';
  g.fillRect(6, 6, 4, 4);
  return canvasToTexture(c);
}

export function buildPropsAndBuildings(scene, map, assets) {
  const group = new THREE.Group();
  scene.add(group);

  const { nature, element } = assets.tilesets;

  // 1. 3D Campus Buildings
  for (const b of BUILDINGS) {
    const elev = map.tileAt(b.x, b.y)?.elev ?? 0;
    const bGroup = new THREE.Group();
    bGroup.position.set(b.x + b.w / 2, elev, b.y + b.d / 2);

    const facadeTex = createBuildingFacadeTexture(b);
    const sideMat = new THREE.MeshLambertMaterial({ color: b.wallColor || '#e8dac2' });
    const frontMat = new THREE.MeshLambertMaterial({ map: facadeTex });
    const roofMat = new THREE.MeshLambertMaterial({ color: b.roofColor || '#7b1113' });

    // Box geometry material order: +x, -x, +y, -y, +z (south/front), -z (north/back)
    const bodyGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
    const bodyMesh = new THREE.Mesh(bodyGeo, [
      sideMat,
      sideMat,
      roofMat,
      sideMat,
      frontMat,
      sideMat,
    ]);
    bodyMesh.position.y = b.h / 2;
    bGroup.add(bodyMesh);

    // Pitched hip roof overhang
    const roofGeo = new THREE.ConeGeometry(Math.max(b.w, b.d) * 0.68, 1.1, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.scale.set(1, 1, (b.d / b.w) * 1.05);
    roofMesh.position.y = b.h + 0.52;
    bGroup.add(roofMesh);

    group.add(bGroup);
  }

  // 2. Iconic UP Oblation Monument in the Oblation Ground (SE Entrance, x=42..43, y=21)
  {
    const obGroup = new THREE.Group();
    obGroup.position.set(43, 0, 21.5);

    const pedMat = new THREE.MeshLambertMaterial({ color: '#d8d2c5' });
    const ped1 = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.45, 1.4), pedMat);
    ped1.position.y = 0.225;
    obGroup.add(ped1);

    const ped2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 0.9), pedMat);
    ped2.position.y = 0.85;
    obGroup.add(ped2);

    // Statue silhouette canvas
    const sc = document.createElement('canvas');
    sc.width = 32;
    sc.height = 48;
    const sg = sc.getContext('2d');
    sg.fillStyle = '#f7f5f0';
    sg.fillRect(13, 6, 6, 6); // head
    sg.fillRect(2, 13, 28, 4); // arms outstretched
    sg.fillRect(12, 13, 8, 16); // torso
    sg.fillRect(13, 29, 6, 15); // legs
    const statueTex = canvasToTexture(sc);
    const statueMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 2.0),
      new THREE.MeshBasicMaterial({ map: statueTex, transparent: true, alphaTest: 0.3 }),
    );
    statueMesh.position.set(0, 2.2, 0.05);
    statueMesh.rotation.x = -0.32;
    obGroup.add(statueMesh);

    group.add(obGroup);
  }

  // 2b. Four Pillars Monument near CAC Dap-ay (#6, SW Level 1 Terrace at x=13, y=28)
  {
    const fpGroup = new THREE.Group();
    fpGroup.position.set(13.5, 1, 28.5);
    const pillarMat = new THREE.MeshLambertMaterial({ color: '#e4ddd0' });
    for (let i = 0; i < 4; i += 1) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.8 + (i % 2) * 0.25, 0.28), pillarMat);
      p.position.set((i - 1.5) * 0.45, 0.9, (i % 2) * 0.25);
      fpGroup.add(p);
    }
    group.add(fpGroup);
  }

  // 3. Decorative Trees, Sunflowers, Benches from Ninja Adventure Tilesets
  const pineTex = sliceTileTexture(nature, 0, 2, 4, 3); // 3-pine cluster or single conifer
  const sunflowerTex = sliceTileTexture(nature, 0, 11, 1, 1);
  const benchTex = sliceTileTexture(element, 11, 1, 3, 1);
  const signTex = sliceTileTexture(element, 0, 2, 1, 1);

  for (const p of map.props) {
    if (p.kind === 'pine') {
      // Use our custom high-res Benguet Pine world sprite for authentic Cordillera pines!
      const tex = assets.plants.benguet_pine.worldTex;
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.1, 2.7),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.4 }),
      );
      mesh.position.set(p.x + 0.5, p.elev + 1.25, p.y + 0.5);
      mesh.rotation.x = -0.32;
      group.add(mesh);
    } else if (p.kind === 'sunflower_deco') {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.95, 1.05),
        new THREE.MeshBasicMaterial({ map: sunflowerTex, transparent: true, alphaTest: 0.4 }),
      );
      mesh.position.set(p.x + 0.5, p.elev + 0.5, p.y + 0.5);
      mesh.rotation.x = -0.32;
      group.add(mesh);
    } else if (p.kind === 'bench') {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.4, 0.8),
        new THREE.MeshBasicMaterial({ map: benchTex, transparent: true, alphaTest: 0.4 }),
      );
      mesh.position.set(p.x + 0.5, p.elev + 0.4, p.y + 0.5);
      mesh.rotation.x = -0.32;
      group.add(mesh);
    } else {
      void pineTex;
    }
  }

  // 4. Campus Wooden Signs
  for (const s of SIGNS) {
    const elev = map.tileAt(s.x, s.y)?.elev ?? 0;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.95, 1.05),
      new THREE.MeshBasicMaterial({ map: signTex, transparent: true, alphaTest: 0.4 }),
    );
    mesh.position.set(s.x + 0.5, elev + 0.52, s.y + 0.5);
    mesh.rotation.x = -0.32;
    group.add(mesh);
  }

  // 5. Interactive Quest Plant Nodes + Floating Sparkle Indicator
  const sparkleTex = createSparkleTexture();
  const plantMeshes = [];

  for (const node of PLANT_NODES) {
    const elev = map.tileAt(node.x, node.y)?.elev ?? 0;
    const plantAsset = assets.plants[node.plantId];
    const scale = node.scale || 1.4;
    const aspect = plantAsset.world.width / plantAsset.world.height;
    const h = scale;
    const w = h * aspect;

    const pGroup = new THREE.Group();
    pGroup.position.set(node.x + 0.5, elev, node.y + 0.5);

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        map: plantAsset.worldTex,
        transparent: true,
        alphaTest: 0.35,
      }),
    );
    mesh.position.set(0, h * 0.48, 0.05);
    mesh.rotation.x = -0.32;
    pGroup.add(mesh);

    const sparkle = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.42),
      new THREE.MeshBasicMaterial({ map: sparkleTex, transparent: true }),
    );
    sparkle.position.set(0, h + 0.25, 0.15);
    sparkle.rotation.x = -0.32;
    pGroup.add(sparkle);

    group.add(pGroup);
    plantMeshes.push({ node, group: pGroup, sparkle, baseH: h + 0.25 });
  }

  function update(timeSec) {
    for (const pm of plantMeshes) {
      pm.sparkle.position.y = pm.baseH + Math.sin(timeSec * 4 + pm.node.x) * 0.1;
      pm.sparkle.scale.setScalar(0.85 + Math.sin(timeSec * 6 + pm.node.y) * 0.2);
    }
  }

  return { group, plantMeshes, update };
}
