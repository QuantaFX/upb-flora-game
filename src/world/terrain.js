// Terrain builder: paints a unified pixel-art ground atlas for the 44x36 campus map
// and constructs terrace blocks, stone retaining walls, and staircases.

import * as THREE from 'three';
import { canvasToTexture, sliceTileTexture } from '../assets.js';

export function buildTerrain(scene, map, assets) {
  const group = new THREE.Group();
  scene.add(group);

  const { floor, relief, nature } = assets.tilesets;

  // 1. Paint the entire 44x36 map ground onto a single pixel canvas (704 x 576 px)
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
      // Use darker highland grass on Pine Hill (elev 2), lighter meadow grass on lower terraces
      const grassColOffset = t.elev >= 2 ? 11 : 0;

      // Base grass fill
      const tuftCol = hash < 3 ? 0 : 1 + (hash % 4);
      drawTile(floor, grassColOffset + tuftCol, 12, x, y);

      if (t.type === 'path') {
        // Dirt/stone path from TilesetFloor autotile block
        drawTile(floor, grassColOffset + 1, 8, x, y);
        // Subtle border grass edge if adjacent is grass
        if (map.tileAt(x, y - 1)?.type === 'grass') {
          drawTile(floor, grassColOffset + 1, 7, x, y);
        } else if (map.tileAt(x, y + 1)?.type === 'grass') {
          drawTile(floor, grassColOffset + 1, 9, x, y);
        }
      } else if (t.type === 'plaza') {
        // Cream/terracotta patterned plaza tiles from TilesetFloor rows 21..23
        drawTile(floor, 15 + (x % 2), 22 + (y % 2), x, y);
      } else if (t.type === 'court') {
        // Blue-grey patterned basketball court tiles
        drawTile(floor, 4 + (x % 2), 22 + (y % 2), x, y);
        // Court boundary lines
        if (x === 34 || x === 40 || y === 18 || y === 23) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.strokeRect(x * 16 + 1, y * 16 + 1, 14, 14);
        }
      } else if (t.type === 'road') {
        // Governor Pack Road asphalt + yellow center dashed line
        ctx.fillStyle = '#3b3f46';
        ctx.fillRect(x * 16, y * 16, 16, 16);
        if (y === 34 && x % 2 === 0) {
          ctx.fillStyle = '#f2c144';
          ctx.fillRect(x * 16 + 2, y * 16 + 14, 12, 2);
        }
      } else if (t.type === 'stair') {
        // Stone steps
        ctx.fillStyle = '#c8bfa8';
        ctx.fillRect(x * 16, y * 16, 16, 16);
        ctx.fillStyle = '#7e7664';
        for (let s = 2; s < 16; s += 4) {
          ctx.fillRect(x * 16, y * 16 + s, 16, 2);
        }
      } else if (t.type === 'tall_grass') {
        // Stamp tall grass icon on ground too
        drawTile(nature, 7, 11, x, y);
      }
    }
  }

  const groundTex = canvasToTexture(atlasCanvas);
  const cliffTex = sliceTileTexture(relief, 5, 1, 1, 2);
  cliffTex.wrapS = THREE.RepeatWrapping;
  cliffTex.wrapT = THREE.RepeatWrapping;

  const cliffMat = new THREE.MeshLambertMaterial({ map: cliffTex });

  // Build individual elevation plane meshes per tile (fast and crisp UVs)
  const topGeo = new THREE.PlaneGeometry(1, 1);
  topGeo.rotateX(-Math.PI / 2);

  // Merge all tile tops into one BufferGeometry with per-tile UVs
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];
  let vertOffset = 0;

  for (let y = 0; y < map.h; y += 1) {
    for (let x = 0; x < map.w; x += 1) {
      const t = map.tileAt(x, y);
      const u0 = x / map.w;
      const u1 = (x + 1) / map.w;
      const v1 = 1 - y / map.h;
      const v0 = 1 - (y + 1) / map.h;

      // For stair tiles, slope from south (elev - 0.5) to north (elev + 0.5)
      const yNorth = t.type === 'stair' ? t.elev + 0.5 : t.elev;
      const ySouth = t.type === 'stair' ? t.elev - 0.5 : t.elev;

      // 4 corners: NW(x, y), NE(x+1, y), SW(x, y+1), SE(x+1, y+1)
      positions.push(
        x, yNorth, y,
        x + 1, yNorth, y,
        x, ySouth, y + 1,
        x + 1, ySouth, y + 1,
      );
      normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);
      uvs.push(u0, v1, u1, v1, u0, v0, u1, v0);
      indices.push(
        vertOffset, vertOffset + 2, vertOffset + 1,
        vertOffset + 1, vertOffset + 2, vertOffset + 3,
      );
      vertOffset += 4;
    }
  }

  const mergedGeo = new THREE.BufferGeometry();
  mergedGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  mergedGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  mergedGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  mergedGeo.setIndex(indices);

  const groundMat = new THREE.MeshLambertMaterial({ map: groundTex });
  const groundMesh = new THREE.Mesh(mergedGeo, groundMat);
  group.add(groundMesh);

  // 2. Build Cliff Retaining Walls wherever a tile is higher than its South, West, or East neighbor
  const wallGeo = new THREE.BoxGeometry(1, 1, 0.12);
  for (let y = 0; y < map.h; y += 1) {
    for (let x = 0; x < map.w; x += 1) {
      const t = map.tileAt(x, y);
      if (t.type === 'stair') continue;
      const south = map.tileAt(x, y + 1);
      if (south && south.type !== 'stair' && t.elev > south.elev) {
        const diff = t.elev - south.elev;
        const wall = new THREE.Mesh(wallGeo, cliffMat);
        wall.scale.set(1, diff, 1);
        wall.position.set(x + 0.5, south.elev + diff / 2, y + 1);
        group.add(wall);
      }
      const west = map.tileAt(x - 1, y);
      if (west && west.type !== 'stair' && t.elev > west.elev) {
        const diff = t.elev - west.elev;
        const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, diff, 1), cliffMat);
        sideWall.position.set(x, west.elev + diff / 2, y + 0.5);
        group.add(sideWall);
      }
      const east = map.tileAt(x + 1, y);
      if (east && east.type !== 'stair' && t.elev > east.elev) {
        const diff = t.elev - east.elev;
        const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, diff, 1), cliffMat);
        sideWall.position.set(x + 1, east.elev + diff / 2, y + 0.5);
        group.add(sideWall);
      }
    }
  }

  return group;
}
