// 3D Campus Buildings (with solid basement skirts & automatic player-occlusion transparency),
// Oblation Monument, Four Pillars, Quest Plant Billboards with sparkles, trees, signs, and benches.

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
    const isDoor = !b.noSign && b.x + i === b.doorX;
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
  if (!b.noSign) {
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
  }

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

  // Track building visual instances so we can smoothly fade them when they occlude the player
  const buildingEntries = [];

  // 1. 3D Campus Buildings (with solid stone foundation plinth so no building ever looks floating)
  for (const b of BUILDINGS) {
    const elev = b.elev ?? map.tileAt(b.x, b.y)?.elev ?? 0;
    const bGroup = new THREE.Group();
    bGroup.position.set(b.x + b.w / 2, elev, b.y + b.d / 2);

    // Concrete foundation plinth extending 0.6 units below terrace surface to seal any slope seam
    const plinthMat = new THREE.MeshLambertMaterial({
      color: '#8c867a',
      transparent: true,
      opacity: 1,
    });
    const plinthMesh = new THREE.Mesh(
      new THREE.BoxGeometry(b.w + 0.16, 0.7, b.d + 0.16),
      plinthMat,
    );
    plinthMesh.position.y = -0.25;
    bGroup.add(plinthMesh);

    const facadeTex = createBuildingFacadeTexture(b);
    const sideMat = new THREE.MeshLambertMaterial({
      color: b.wallColor || '#e8dac2',
      transparent: true,
      opacity: 1,
    });
    const frontMat = new THREE.MeshLambertMaterial({
      map: facadeTex,
      transparent: true,
      opacity: 1,
    });
    const roofMat = new THREE.MeshLambertMaterial({
      color: b.roofColor || '#7b1113',
      transparent: true,
      opacity: 1,
    });

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

    // Pitched hip roof overhang (unit 4-sided pyramid has base side 0.74 * sqrt(2) = 1.05, scaled by b.w x b.d)
    const roofGeo = new THREE.ConeGeometry(0.74, 1.1, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.scale.set(b.w, 1, b.d);
    roofMesh.position.y = b.h + 0.55;
    bGroup.add(roofMesh);

    group.add(bGroup);
    buildingEntries.push({
      def: b,
      elev,
      materials: [sideMat, frontMat, roofMat, plinthMat],
      currentOpacity: 1,
    });
  }

  // 2. Iconic UP Oblation Monument right in the middle between the two East Driveway stairs (x=67..68, y=28)
  {
    const obElev = map.tileAt(68, 28)?.elev ?? 1;
    const obGroup = new THREE.Group();
    obGroup.position.set(68, obElev, 28.5);

    const pedMat = new THREE.MeshLambertMaterial({ color: '#d8d2c5' });
    const ped1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 1.5), pedMat);
    ped1.position.y = 0.225;
    obGroup.add(ped1);

    const ped2 = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.95, 0.95), pedMat);
    ped2.position.y = 0.85;
    obGroup.add(ped2);

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
      new THREE.PlaneGeometry(1.45, 2.05),
      new THREE.MeshBasicMaterial({ map: statueTex, transparent: true, alphaTest: 0.3 }),
    );
    statueMesh.position.set(0, 2.25, 0.05);
    statueMesh.rotation.x = -0.32;
    obGroup.add(statueMesh);

    group.add(obGroup);
  }

  // 2b. Four Pillars Monument near CAC Dap-ay (#6, West CAC Promenade at x=8, y=50.5)
  {
    const fpElev = map.tileAt(8, 50)?.elev ?? 0;
    const fpGroup = new THREE.Group();
    fpGroup.position.set(8, fpElev, 50.5);
    const pillarMat = new THREE.MeshLambertMaterial({ color: '#e4ddd0' });
    for (let i = 0; i < 4; i += 1) {
      const p = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.9 + (i % 2) * 0.25, 0.3),
        pillarMat,
      );
      p.position.set((i - 1.5) * 0.5, 0.95, (i % 2) * 0.25);
      fpGroup.add(p);
    }
    group.add(fpGroup);
  }

  // 3. Decorative Trees, Bushes, Small Plants, Sunflowers, and Benches
  const sunflowerTex = assets.plants.kamantigi.worldTex;
  const benchTex = sliceTileTexture(element, 11, 1, 3, 1);
  const signTex = sliceTileTexture(element, 0, 2, 1, 1);

  // Lush pixel-art bushes, shrubs, and small ground-cover plants from TilesetNature
  const bushRoundTex = sliceTileTexture(nature, 0, 0, 2, 2);
  const bushPineTex = sliceTileTexture(nature, 2, 0, 2, 2);
  const treeRoundTex = sliceTileTexture(nature, 16, 0, 2, 2);
  const smallPlantTexs = [
    sliceTileTexture(nature, 0, 10, 1, 1),
    sliceTileTexture(nature, 1, 10, 1, 1),
    sliceTileTexture(nature, 2, 10, 1, 1),
    sliceTileTexture(nature, 8, 10, 1, 1),
    sliceTileTexture(nature, 9, 10, 1, 1),
    sliceTileTexture(nature, 0, 11, 1, 1),
    sliceTileTexture(nature, 2, 11, 1, 1),
    sliceTileTexture(nature, 3, 11, 1, 1),
    sliceTileTexture(nature, 6, 11, 1, 1),
    sliceTileTexture(nature, 8, 11, 1, 1),
  ];
  const smallPlantMats = smallPlantTexs.map(
    (tex) => new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.35 }),
  );
  const bushMats = [
    new THREE.MeshBasicMaterial({ map: bushRoundTex, transparent: true, alphaTest: 0.35 }),
    new THREE.MeshBasicMaterial({ map: bushPineTex, transparent: true, alphaTest: 0.35 }),
  ];

  const treeEntries = [];

  for (const p of map.props) {
    if (p.kind === 'pine') {
      const treeVariant = (p.x * 7 + p.y * 13) % 5;
      const tex =
        treeVariant === 0
          ? assets.plants.agoho?.worldTex || assets.plants.benguet_pine.worldTex
          : treeVariant === 1
            ? assets.plants.moclame?.worldTex || assets.plants.benguet_pine.worldTex
            : treeVariant === 2
              ? treeRoundTex
              : assets.plants.benguet_pine.worldTex;
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.35,
        opacity: 1,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.7), mat);
      mesh.position.set(p.x + 0.5, p.elev + 1.25, p.y + 0.5);
      mesh.rotation.x = -0.32;
      group.add(mesh);
      treeEntries.push({ x: p.x, y: p.y, mat });
    } else if (p.kind === 'understory') {
      const variant = (p.x * 3 + p.y * 5) % 6;
      if (variant < 4) {
        const id = ['tri_vein_fern', 'gipas', 'kamantigi', 'fishtail_fern'][variant];
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(0.95, 0.95),
          new THREE.MeshBasicMaterial({
            map: assets.plants[id].worldTex,
            transparent: true,
            alphaTest: 0.35,
          }),
        );
        mesh.position.set(p.x + 0.5, p.elev + 0.45, p.y + 0.5);
        mesh.rotation.x = -0.32;
        group.add(mesh);
      } else {
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(1.15, 1.1),
          bushMats[variant - 4],
        );
        mesh.position.set(p.x + 0.5, p.elev + 0.52, p.y + 0.5);
        mesh.rotation.x = -0.32;
        group.add(mesh);
      }
    } else if (p.kind === 'sunflower_deco') {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.95, 1.05),
        new THREE.MeshBasicMaterial({ map: sunflowerTex, transparent: true, alphaTest: 0.4 }),
      );
      mesh.position.set(p.x + 0.5, p.elev + 0.5, p.y + 0.5);
      mesh.rotation.x = -0.32;
      group.add(mesh);
    } else if (p.kind === 'noticeboard') {
      const board = new THREE.Group();
      board.position.set(p.x+0.5,p.elev,p.y+0.5);
      const wood = new THREE.MeshLambertMaterial({color:'#795336'});
      for (const x of [-0.38,0.38]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1,1.3,0.1),wood);
        leg.position.set(x,0.65,0); board.add(leg);
      }
      const c = document.createElement('canvas'); c.width=160; c.height=128;
      const ctx=c.getContext('2d');
      ctx.fillStyle='#795336';ctx.fillRect(0,0,160,128);
      ctx.fillStyle='#efe7cb';ctx.fillRect(7,7,146,114);
      ctx.textAlign='center';ctx.fillStyle='#7b1113';ctx.font='bold 17px Trebuchet MS';
      ctx.fillText('Native Plants',80,32);ctx.fillText('Week',80,53);
      ctx.fillStyle='#2f6239';ctx.font='12px Trebuchet MS';
      ctx.fillText('Campus walks',80,78);ctx.fillText('Photo fieldwork',80,96);
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.15,0.92),new THREE.MeshBasicMaterial({map:canvasToTexture(c),side:THREE.DoubleSide}));
      panel.position.set(0,1.1,0.08);board.add(panel);group.add(board);
    } else if (p.kind === 'bench') {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.4, 0.8),
        new THREE.MeshBasicMaterial({ map: benchTex, transparent: true, alphaTest: 0.4 }),
      );
      mesh.position.set(p.x + 0.5, p.elev + 0.4, p.y + 0.5);
      mesh.rotation.x = -0.32;
      group.add(mesh);
    }
  }

  // 3b. Walkable Ground-Cover Bushes, Small Plants, Ferns & Wildflowers across Grass Tiles
  const smallGeo = new THREE.PlaneGeometry(0.68, 0.68);
  const bushSmallGeo = new THREE.PlaneGeometry(0.88, 0.85);
  for (let y = 2; y < map.h - 2; y += 1) {
    for (let x = 2; x < map.w - 2; x += 1) {
      const t = map.tileAt(x, y);
      if (!t || !['grass', 'tall_grass'].includes(t.type)) continue;
      // Skip tiles occupied by buildings, NPCs, or Quest Plant Nodes
      if (
        BUILDINGS.some((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.d) ||
        PLANT_NODES.some((p) => p.x === x && p.y === y)
      ) {
        continue;
      }
      const h = (x * 43 + y * 97) % 17;
      if (h < 7) {
        const mat = smallPlantMats[(x * 19 + y * 31) % smallPlantMats.length];
        const ox = (((x * 13 + y * 7) % 5) - 2) * 0.08;
        const oz = (((x * 23 + y * 11) % 5) - 2) * 0.08;
        const m = new THREE.Mesh(h < 2 ? bushSmallGeo : smallGeo, mat);
        m.position.set(x + 0.5 + ox, t.elev + (h < 2 ? 0.4 : 0.32), y + 0.5 + oz);
        m.rotation.x = -0.32;
        group.add(m);
      }
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

  /**
   * Updates floating sparkles AND fades any building or tall pine tree that sits between
   * the camera (+Z/south) and the player (behind/north of the building).
   */
  function update(timeSec, playerActor = null) {
    for (const pm of plantMeshes) {
      pm.sparkle.position.y = pm.baseH + Math.sin(timeSec * 4 + pm.node.x) * 0.1;
      pm.sparkle.scale.setScalar(0.85 + Math.sin(timeSec * 6 + pm.node.y) * 0.2);
    }

    if (!playerActor) return;
    const px = playerActor.group.position.x;
    const pz = playerActor.group.position.z;

    for (const entry of buildingEntries) {
      const b = entry.def;
      // Camera looks from South (+Z) toward North (-Z).
      // A building covers the player when the player is horizontally within the building's width (+margin)
      // and behind (north of) the building's south wall within ~4.5 tiles.
      const inX = px >= b.x - 0.9 && px <= b.x + b.w + 0.9;
      const behindZ = pz >= b.y - 3.8 && pz <= b.y + b.d + 0.3;
      const targetOpacity = inX && behindZ ? 0.28 : 1.0;

      entry.currentOpacity += (targetOpacity - entry.currentOpacity) * 0.18;
      const isTransparent = entry.currentOpacity < 0.98;
      for (const m of entry.materials) {
        m.opacity = entry.currentOpacity;
        m.depthWrite = !isTransparent;
      }
    }

    for (const tree of treeEntries) {
      const inX = Math.abs(px - (tree.x + 0.5)) < 1.3;
      const behindZ = pz < tree.y + 0.5 && pz > tree.y - 2.6;
      tree.mat.opacity = inX && behindZ ? 0.35 : 1.0;
    }
  }

  return { group, plantMeshes, buildingEntries, update };
}
