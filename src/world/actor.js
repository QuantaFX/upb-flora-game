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

    // Determine whether this is a 2-frame horizontal Animal sheet or a 4-column human sheet (64x64)
    this.isAnimalSheet = Boolean(charAsset.isAnimal || this.sheet.height < 32);
    this.frameW = this.isAnimalSheet ? Math.floor(this.sheet.width / 2) : 16;
    this.frameH = this.isAnimalSheet ? this.sheet.height : 16;
    this.maxWalkFrames = this.isAnimalSheet ? 2 : Math.min(4, Math.floor(this.sheet.height / 16));
    this.frame = 0;
    this.animTimer = 0;
    this.facingLeft = false;

    const scale = opts.scale || 1;

    // Canvas for the current frame (exact frameW x frameH so wider animal sheets like 44x17, 42x17, 36x16, 34x15 are never cropped)
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.frameW;
    this.canvas.height = this.frameH;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.texture = canvasToTexture(this.canvas);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Shadow disc on ground
    const shadowGeo = new THREE.PlaneGeometry(0.85 * scale, 0.55 * scale);
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
    const widthRatio = this.frameW / 16;
    const heightRatio = this.frameH / 16;
    const spriteGeo = new THREE.PlaneGeometry(
      1.15 * scale * widthRatio,
      (this.isAnimalSheet ? 1.15 : 1.35) * scale * heightRatio,
    );
    const spriteMat = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      alphaTest: 0.4,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(spriteGeo, spriteMat);
    this.mesh.position.set(0, 0.68 * scale * heightRatio + (this.isAnimalSheet ? 0 : 0.22 * scale), 0.05);
    this.mesh.rotation.x = -0.32;
    this.group.add(this.mesh);

    // The supplied human sprites end at the trouser line. Give them a grounded
    // lower-body silhouette without changing or stretching the original artwork.
    this.feet = [];
    if (!this.isAnimalSheet) {
      const trousers = new THREE.MeshBasicMaterial({ color: '#34483e' });
      const shoes = new THREE.MeshBasicMaterial({ color: '#202923' });
      for (const side of [-1, 1]) {
        const leg = new THREE.Group();
        leg.position.set(side * 0.16 * scale, 0, 0.12);
        const trouser = new THREE.Mesh(new THREE.BoxGeometry(0.19 * scale, 0.25 * scale, 0.12 * scale), trousers);
        trouser.position.y = 0.2 * scale;
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.22 * scale, 0.09 * scale, 0.23 * scale), shoes);
        shoe.position.y = 0.055 * scale;
        leg.add(trouser, shoe);
        this.group.add(leg);
        this.feet.push(leg);
      }
    }

    // Optional emote bubble above NPC/animal head
    this.emoteMesh = null;
    this.emoteBaseY = 1.45 * scale * heightRatio + (this.isAnimalSheet ? 0.2 : 0.42);

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
    this.ctx.clearRect(0, 0, this.frameW, this.frameH);
    if (this.isAnimalSheet) {
      if (this.dir === 'left') this.facingLeft = true;
      else if (this.dir === 'right') this.facingLeft = false;
      const col = this.moving ? this.frame % 2 : 0;
      this.ctx.save();
      if (this.facingLeft) {
        this.ctx.translate(this.frameW, 0);
        this.ctx.scale(-1, 1);
      }
      this.ctx.drawImage(
        this.sheet,
        col * this.frameW,
        0,
        this.frameW,
        this.frameH,
        0,
        0,
        this.frameW,
        this.frameH,
      );
      this.ctx.restore();
    } else {
      const col = DIR_COL[this.dir] ?? 0;
      const row = this.frame % this.maxWalkFrames;
      this.ctx.drawImage(this.sheet, col * 16, row * 16, 16, 16, 0, 0, 16, 16);
    }
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

    for (let i = 0; i < this.feet.length; i++) {
      this.feet[i].position.y = this.moving ? Math.max(0, Math.sin(timeSec * 22 + i * Math.PI)) * 0.06 : 0;
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
