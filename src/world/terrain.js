// Terrain builder: paints a unified pixel-art ground atlas for the 80x64 strict-grid campus map
// (with 4 nested green elevation shades, crisp white walkways, dark grey Open Court A,
// blue-grey court stage/bleachers, and multi-tile directional staircases)
// and constructs terrace retaining walls.

import * as THREE from 'three';
import { canvasToTexture, sliceTileTexture } from '../assets.js';

export function buildTerrain(scene, map, assets) {
  const group = new THREE.Group();
  scene.add(group);

  const { floor, relief, nature } = assets.tilesets;

  // 1. Paint the entire 80x64 map ground onto a single pixel canvas (1280 x 1024 px)
  const atlasCanvas = document.createElement('canvas');
  atlasCanvas.width = map.w * 16;
  atlasCanvas.height = map.h * 16;
  const ctx = atlasCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const drawTile = (img, sc, sr, dx, dy) => {
    ctx.drawImage(img, sc * 16, sr * 16, 16, 16, dx * 16, dy * 16, 16, 16);
  };

  for (let y = 0; y < map.h; y += 1) {
    for (let x = 0; x < map.w; x += 1) {
      const t = map.tileAt(x, y);
      const hash = (x * 37 + y * 91) % 7;
      const elevRound = Math.round(t.elev);
      const grassColOffset = elevRound >= 2 ? 11 : 0;

      // Base grass fill from Ninja Adventure TilesetFloor
      const tuftCol = hash < 3 ? 0 : 1 + (hash % 4);
      drawTile(floor, grassColOffset + tuftCol, 12, x, y);

      // Tint the 4 nested green elevation tiers so the terrace hierarchy reads clearly just like the user's grid map!
      if (t.type === 'grass' || t.type === 'tall_grass') {
        if (elevRound === 1) {
          ctx.fillStyle = 'rgba(20, 65, 18, 0.14)';
          ctx.fillRect(x * 16, y * 16, 16, 16);
        } else if (elevRound === 2) {
          ctx.fillStyle = 'rgba(14, 52, 14, 0.22)';
          ctx.fillRect(x * 16, y * 16, 16, 16);
        } else if (elevRound >= 3) {
          ctx.fillStyle = 'rgba(8, 38, 10, 0.34)';
          ctx.fillRect(x * 16, y * 16, 16, 16);
        }
      }

      if (t.type === 'path' || t.type === 'plaza') {
        // Crisp light stone / concrete campus walkways & plazas (matching the white walkways in the grid map)
        ctx.fillStyle = t.type === 'plaza' ? '#f2efe8' : '#e6e1d6';
        ctx.fillRect(x * 16, y * 16, 16, 16);
        // Subtle paver grid lines
        ctx.strokeStyle = 'rgba(140, 132, 118, 0.38)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * 16 + 0.5, y * 16 + 0.5, 15, 15);
      } else if (t.type === 'court') {
        // Dark charcoal grey Open Court A (#21) matching the grid map's dark grey rectangle
        ctx.fillStyle = '#43464b';
        ctx.fillRect(x * 16, y * 16, 16, 16);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        if (x === 39 || x === 52 || y === 38 || y === 42 || x === 45) {
          ctx.strokeRect(x * 16 + 1, y * 16 + 1, 14, 14);
        }
      } else if (t.type === 'court_stage') {
        // Slate blue-grey bleachers / stage band along the north edge of Open Court A
        ctx.fillStyle = '#2d4f5c';
        ctx.fillRect(x * 16, y * 16, 16, 16);
        ctx.fillStyle = '#3d6676';
        ctx.fillRect(x * 16, y * 16 + 2, 16, 4);
        ctx.fillRect(x * 16, y * 16 + 10, 16, 4);
      } else if (t.type === 'stair') {
        // Crisp white/grey staircase treads oriented according to stairDir
        ctx.fillStyle = '#dcd7cc';
        ctx.fillRect(x * 16, y * 16, 16, 16);
        ctx.fillStyle = '#8b8476';
        if (t.stairDir === 'west' || t.stairDir === 'east') {
          for (let s = 2; s < 16; s += 4) {
            ctx.fillRect(x * 16 + s, y * 16, 2, 16);
          }
        } else {
          for (let s = 2; s < 16; s += 4) {
            ctx.fillRect(x * 16, y * 16 + s, 16, 2);
          }
        }
      } else if (t.type === 'tall_grass') {
        drawTile(nature, 7, 11, x, y);
      }
    }
  }

  const groundTex = canvasToTexture(atlasCanvas);
  const cliffTex = sliceTileTexture(relief, 5, 1, 1, 2);
  cliffTex.wrapS = THREE.RepeatWrapping;
  cliffTex.wrapT = THREE.RepeatWrapping;

  const cliffMat = new THREE.MeshLambertMaterial({ map: cliffTex, side: THREE.DoubleSide });

  // Merge all tile tops into one BufferGeometry with per-tile UVs and smooth multi-tile stair ramps
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];
  let vertOffset = 0;
  const tileCorners = [];

  for (let y = 0; y < map.h; y += 1) {
    const rowCorners = [];
    for (let x = 0; x < map.w; x += 1) {
      const t = map.tileAt(x, y);
      const u0 = x / map.w;
      const u1 = (x + 1) / map.w;
      const v1 = 1 - y / map.h;
      const v0 = 1 - (y + 1) / map.h;

      let yNW = t.elev;
      let yNE = t.elev;
      let ySW = t.elev;
      let ySE = t.elev;

      if (t.type === 'stair') {
        const half = (t.stairStepH || 0.5) * 0.5;
        if (t.stairDir === 'north') {
          yNW = t.elev + half;
          yNE = t.elev + half;
          ySW = t.elev - half;
          ySE = t.elev - half;
        } else if (t.stairDir === 'south') {
          yNW = t.elev - half;
          yNE = t.elev - half;
          ySW = t.elev + half;
          ySE = t.elev + half;
        } else if (t.stairDir === 'west') {
          yNW = t.elev + half;
          ySW = t.elev + half;
          yNE = t.elev - half;
          ySE = t.elev - half;
        } else if (t.stairDir === 'east') {
          yNW = t.elev - half;
          ySW = t.elev - half;
          yNE = t.elev + half;
          ySE = t.elev + half;
        }
      }

      rowCorners.push({ nw: yNW, ne: yNE, sw: ySW, se: ySE });

      // 4 corners: NW(x, y), NE(x+1, y), SW(x, y+1), SE(x+1, y+1)
      positions.push(
        x, yNW, y,
        x + 1, yNE, y,
        x, ySW, y + 1,
        x + 1, ySE, y + 1,
      );
      normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);
      uvs.push(u0, v1, u1, v1, u0, v0, u1, v0);
      indices.push(
        vertOffset, vertOffset + 2, vertOffset + 1,
        vertOffset + 1, vertOffset + 2, vertOffset + 3,
      );
      vertOffset += 4;
    }
    tileCorners.push(rowCorners);
  }

  const mergedGeo = new THREE.BufferGeometry();
  mergedGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  mergedGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  mergedGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  mergedGeo.setIndex(indices);

  const groundMat = new THREE.MeshLambertMaterial({ map: groundTex });
  const groundMesh = new THREE.Mesh(mergedGeo, groundMat);
  group.add(groundMesh);

  // 2. Watertight Vertical Skirt Geometry along all tile boundaries (including sloped stair edges)
  const skirtPos = [];
  const skirtNorm = [];
  const skirtUvs = [];
  const skirtIdx = [];
  let skirtOffset = 0;

  for (let y = 0; y < map.h; y += 1) {
    for (let x = 0; x < map.w; x += 1) {
      const c = tileCorners[y][x];
      // Horizontal boundary at z = y + 1 between (x, y) and (x, y + 1)
      if (y + 1 < map.h) {
        const cs = tileCorners[y + 1][x];
        if (Math.abs(c.sw - cs.nw) > 0.01 || Math.abs(c.se - cs.ne) > 0.01) {
          skirtPos.push(
            x, c.sw, y + 1,
            x + 1, c.se, y + 1,
            x, cs.nw, y + 1,
            x + 1, cs.ne, y + 1,
          );
          skirtNorm.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
          skirtUvs.push(0, 1, 1, 1, 0, 0, 1, 0);
          skirtIdx.push(
            skirtOffset, skirtOffset + 2, skirtOffset + 1,
            skirtOffset + 1, skirtOffset + 2, skirtOffset + 3,
          );
          skirtOffset += 4;
        }
      }
      // Vertical boundary at x + 1 between (x, y) and (x + 1, y)
      if (x + 1 < map.w) {
        const ce = tileCorners[y][x + 1];
        if (Math.abs(c.ne - ce.nw) > 0.01 || Math.abs(c.se - ce.sw) > 0.01) {
          skirtPos.push(
            x + 1, c.ne, y,
            x + 1, c.se, y + 1,
            x + 1, ce.nw, y,
            x + 1, ce.sw, y + 1,
          );
          skirtNorm.push(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0);
          skirtUvs.push(0, 1, 1, 1, 0, 0, 1, 0);
          skirtIdx.push(
            skirtOffset, skirtOffset + 2, skirtOffset + 1,
            skirtOffset + 1, skirtOffset + 2, skirtOffset + 3,
          );
          skirtOffset += 4;
        }
      }
    }
  }

  if (skirtPos.length > 0) {
    const skirtGeo = new THREE.BufferGeometry();
    skirtGeo.setAttribute('position', new THREE.Float32BufferAttribute(skirtPos, 3));
    skirtGeo.setAttribute('normal', new THREE.Float32BufferAttribute(skirtNorm, 3));
    skirtGeo.setAttribute('uv', new THREE.Float32BufferAttribute(skirtUvs, 2));
    skirtGeo.setIndex(skirtIdx);
    group.add(new THREE.Mesh(skirtGeo, cliffMat));
  }

  // 3. Build 3D Cliff Retaining Curbs wherever a flat terrace tile is higher than its neighbor
  const wallGeo = new THREE.BoxGeometry(1, 1, 0.14);
  for (let y = 0; y < map.h; y += 1) {
    for (let x = 0; x < map.w; x += 1) {
      const t = map.tileAt(x, y);
      if (t.type === 'stair') continue;
      const south = map.tileAt(x, y + 1);
      if (south && south.type !== 'stair' && t.elev - south.elev > 0.25) {
        const diff = t.elev - south.elev;
        const wall = new THREE.Mesh(wallGeo, cliffMat);
        wall.scale.set(1, diff, 1);
        wall.position.set(x + 0.5, south.elev + diff / 2, y + 1);
        group.add(wall);
      }
      const north = map.tileAt(x, y - 1);
      if (north && north.type !== 'stair' && t.elev - north.elev > 0.25) {
        const diff = t.elev - north.elev;
        const wall = new THREE.Mesh(wallGeo, cliffMat);
        wall.scale.set(1, diff, 1);
        wall.position.set(x + 0.5, north.elev + diff / 2, y);
        group.add(wall);
      }
      const west = map.tileAt(x - 1, y);
      if (west && west.type !== 'stair' && t.elev - west.elev > 0.25) {
        const diff = t.elev - west.elev;
        const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, diff, 1), cliffMat);
        sideWall.position.set(x, west.elev + diff / 2, y + 0.5);
        group.add(sideWall);
      }
      const east = map.tileAt(x + 1, y);
      if (east && east.type !== 'stair' && t.elev - east.elev > 0.25) {
        const diff = t.elev - east.elev;
        const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, diff, 1), cliffMat);
        sideWall.position.set(x + 1, east.elev + diff / 2, y + 0.5);
        group.add(sideWall);
      }
    }
  }

  return group;
}
