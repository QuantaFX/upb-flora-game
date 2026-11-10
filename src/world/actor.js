// 2.5D Actor system: Pokemon-style grid movement, stair elevation transitions,
// 4-frame directional walk animation from Ninja Adventure sprite sheets, and emote bubbles.

import * as THREE from 'three';
import { canvasToTexture } from '../assets.js';

const DIR_COL = {
  down: 0,
  up: 1,
  left: 2,
  right: 3,
};

const DIR_DELTA = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

function createBlobShadowTexture() {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(16, 16, 2, 16, 16, 14);
  grad.addColorStop(0, 'rgba(15, 25, 15, 0.45)');
  grad.addColorStop(1, 'rgba(15, 25, 15, 0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  return canvasToTexture(c);
}

const SHADOW_TEX = createBlobShadowTexture();

export class Actor {
  constructor(scene, map, charAsset, opts = {}) {
    this.scene = scene;
    this.map = map;
    this.sheet = charAsset.sheet;
    this.id = opts.id || 'actor';
    this.name = opts.name || 'Actor';
    this.role = opts.role || '';
    this.isPlayer = Boolean(opts.isPlayer);

    this.tileX = opts.x ?? 21;
    this.tileY = opts.y ?? 31;
    this.dir = opts.dir || 'down';
    this.elev = this.map.tileAt(this.tileX, this.tileY)?.elev ?? 0;

    // Determine how many walk rows this sheet has (Child/OldWoman have 2 rows, standard has 4+)
    this.maxWalkFrames = Math.min(4, Math.floor(this.sheet.height / 16));
    this.frame = 0;
    this.animTimer = 0;

    // Canvas for the current 16x16 frame
    this.canvas = document.createElement('canvas');
    this.canvas.width = 16;
    this.canvas.height = 16;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.texture = canvasToTexture(this.canvas);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Shadow disc on ground
    const shadowGeo = new THREE.PlaneGeometry(0.85, 0.55);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: SHADOW_TEX,
      transparent: true,
      depthWrite: false,
    });
    this.shadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadow.position.y = 0.03;
    this.group.add(this.shadow);

    // Upright billboard plane tilted slightly back to match camera pitch
    const spriteGeo = new THREE.PlaneGeometry(1.15, 1.35);
    const spriteMat = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      alphaTest: 0.4,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(spriteGeo, spriteMat);
    this.mesh.position.set(0, 0.68, 0.05);
    this.mesh.rotation.x = -0.32;
    this.group.add(this.mesh);

    // Optional emote bubble above NPC head
    this.emoteMesh = null;
    this.emoteBaseY = 1.65;

    // Movement interpolation state
    this.moving = false;
    this.moveElapsed = 0;
    this.moveDuration = 0.17;
    this.fromPos = new THREE.Vector3();
    this.toPos = new THREE.Vector3();
    this.locked = false;
    this.onStepComplete = null;

    this.drawFrame();
    this.syncWorldPosition();
  }

  drawFrame() {
    const col = DIR_COL[this.dir] ?? 0;
    const row = this.frame % this.maxWalkFrames;
    this.ctx.clearRect(0, 0, 16, 16);
    this.ctx.drawImage(this.sheet, col * 16, row * 16, 16, 16, 0, 0, 16, 16);
    this.texture.needsUpdate = true;
  }

  syncWorldPosition() {
    const t = this.map.tileAt(this.tileX, this.tileY);
    this.elev = t ? t.elev : 0;
    this.group.position.set(this.tileX + 0.5, this.elev, this.tileY + 0.5);
  }

  setDirection(dir) {
    if (this.dir !== dir) {
      this.dir = dir;
      this.drawFrame();
    }
  }

  faceToward(targetX, targetY) {
    const dx = targetX - this.tileX;
    const dy = targetY - this.tileY;
    if (Math.abs(dx) >= Math.abs(dy)) {
      this.setDirection(dx >= 0 ? 'right' : 'left');
    } else {
      this.setDirection(dy >= 0 ? 'down' : 'up');
    }
  }

  getFacingTile() {
    const [dx, dy] = DIR_DELTA[this.dir] || [0, 1];
    return { x: this.tileX + dx, y: this.tileY + dy };
  }

  setEmote(emoteTex) {
    if (!emoteTex) {
      if (this.emoteMesh) this.emoteMesh.visible = false;
      return;
    }
    if (!this.emoteMesh) {
      const geo = new THREE.PlaneGeometry(0.62, 0.58);
      const mat = new THREE.MeshBasicMaterial({
        map: emoteTex,
        transparent: true,
        alphaTest: 0.2,
      });
      this.emoteMesh = new THREE.Mesh(geo, mat);
      this.emoteMesh.position.set(0, this.emoteBaseY, 0.1);
      this.emoteMesh.rotation.x = -0.32;
      this.group.add(this.emoteMesh);
    } else {
      this.emoteMesh.material.map = emoteTex;
      this.emoteMesh.material.needsUpdate = true;
      this.emoteMesh.visible = true;
    }
  }

  tryStep(dir, running = false) {
    if (this.moving || this.locked) return false;
    this.setDirection(dir);
    const [dx, dy] = DIR_DELTA[dir];
    const nx = this.tileX + dx;
    const ny = this.tileY + dy;

    if (!this.map.canStep(this.tileX, this.tileY, nx, ny)) {
      return false;
    }

    const nextTile = this.map.tileAt(nx, ny);
    this.fromPos.copy(this.group.position);
    this.toPos.set(nx + 0.5, nextTile.elev, ny + 0.5);
    this.tileX = nx;
    this.tileY = ny;
    this.elev = nextTile.elev;

    this.moving = true;
    this.moveElapsed = 0;
    this.moveDuration = running ? 0.11 : 0.175;
    this.frame = (this.frame + 1) % this.maxWalkFrames;
    this.drawFrame();
    return true;
  }

  update(dt, timeSec = 0) {
    if (this.emoteMesh && this.emoteMesh.visible) {
      this.emoteMesh.position.y = this.emoteBaseY + Math.sin(timeSec * 5) * 0.07;
    }

    if (!this.moving) return;

    this.moveElapsed += dt;
    this.animTimer += dt;
    if (this.animTimer >= this.moveDuration * 0.5) {
      this.animTimer = 0;
      this.frame = (this.frame + 1) % this.maxWalkFrames;
      this.drawFrame();
    }

    const t = Math.min(1, this.moveElapsed / this.moveDuration);
    this.group.position.lerpVectors(this.fromPos, this.toPos, t);

    if (t >= 1) {
      this.moving = false;
      this.frame = 0;
      this.drawFrame();
      if (this.onStepComplete) {
        this.onStepComplete(this.tileX, this.tileY, this.elev);
      }
    }
  }
}
