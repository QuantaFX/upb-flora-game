// Main entry point for UP Baguio Flora Quest (Project Saleng).
// Boots the 2.5D Three.js scene, loads assets, wires NPCs, quests, encounters, and Herbarium UI.

import * as THREE from 'three';
import { loadAllAssets } from './assets.js';
import { ALL_PLANT_IDS, PLANT_BY_ID } from './data/plants.js';
import { createCampusMap, NPCS, PLANT_NODES, SIGNS } from './world/map.js';
import { buildTerrain } from './world/terrain.js';
import { buildPropsAndBuildings } from './world/props.js';
import { Actor } from './world/actor.js';
import { GameState } from './game/state.js';
import { getNpcDialogPages, getNpcEmoteNumber } from './data/story.js';
import { createDialogUI } from './game/dialog.js';
import { createEncounterUI } from './game/encounter.js';
import { createJournalUI } from './game/journal.js';
import { createAudioManager } from './audio.js';

const CHARACTER_LIST = [
  'Villager3',
  'Princess',
  'OldMan3',
  'Inspector',
  'Villager4',
  'Child',
  'Villager5',
  'Boy',
  'Woman',
  'Samurai',
  'Village6',
];

function showToast(message) {
  const container = document.getElementById('toast-container');
  while (container.children.length >= 2) {
    container.firstElementChild.remove();
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 2600);
}

async function boot() {
  const host = document.getElementById('game-canvas');
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x9bd3f0, 1);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9bd3f0);
  scene.fog = new THREE.FogExp2(0xc4e7f7, 0.014);

  // 2.5D Pokemon-style pitched perspective camera
  const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.5,
    140,
  );

  // Warm Baguio morning sunlight + highland sky hemisphere light
  const hemi = new THREE.HemisphereLight(0xf4fbff, 0x67a84f, 1.55);
  scene.add(hemi);
  const dirLight = new THREE.DirectionalLight(0xfff5dc, 1.15);
  dirLight.position.set(-14, 28, 16);
  scene.add(dirLight);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Load all tilesets, character sheets, emotes, and custom plant sprites
  const assets = await loadAllAssets(ALL_PLANT_IDS, CHARACTER_LIST);
  const audio = createAudioManager();
  const state = new GameState();
  const map = createCampusMap();

  buildTerrain(scene, map, assets);
  const propsCtrl = buildPropsAndBuildings(scene, map, assets);

  // Drifting Cordillera mist clouds
  const mistGroup = new THREE.Group();
  scene.add(mistGroup);
  const mistCanvas = document.createElement('canvas');
  mistCanvas.width = 128;
  mistCanvas.height = 64;
  const mctx = mistCanvas.getContext('2d');
  const mgrad = mctx.createRadialGradient(64, 32, 4, 64, 32, 60);
  mgrad.addColorStop(0, 'rgba(255, 255, 255, 0.36)');
  mgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  mctx.fillStyle = mgrad;
  mctx.fillRect(0, 0, 128, 64);
  const mistTex = new THREE.CanvasTexture(mistCanvas);

  for (let i = 0; i < 7; i += 1) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(11 + (i % 3) * 3, 4.5),
      new THREE.MeshBasicMaterial({ map: mistTex, transparent: true, depthWrite: false }),
    );
    m.rotation.x = -Math.PI / 2.3;
    m.position.set(6 + i * 6, 1.8 + (i % 3) * 0.9, 4 + ((i * 7) % 26));
    m.userData.speed = 0.35 + (i % 3) * 0.15;
    mistGroup.add(m);
  }

  // Spawn Player Actor
  const player = new Actor(scene, map, assets.characters.Villager3, {
    id: 'player',
    name: state.data.playerName,
    x: map.spawn.x,
    y: map.spawn.y,
    dir: map.spawn.dir,
    isPlayer: true,
  });

  // Spawn NPC Actors
  const npcActors = new Map();
  for (const n of NPCS) {
    const actor = new Actor(scene, map, assets.characters[n.sprite], {
      id: n.id,
      name: n.name,
      role: n.role,
      x: n.x,
      y: n.y,
      dir: n.dir,
    });
    npcActors.set(n.id, { def: n, actor });
  }

  // UI Controllers
  const dialogUI = createDialogUI(audio);
  const encounterUI = createEncounterUI(state, assets, audio, showToast);
  const journalUI = createJournalUI(state, assets, audio);

  // HUD Elements
  const titleScreen = document.getElementById('title-screen');
  const nameInput = document.getElementById('player-name-input');
  const btnStartGame = document.getElementById('btn-start-game');
  const btnResetSave = document.getElementById('btn-reset-save');
  const hudTop = document.getElementById('hud-top');
  const hudBottom = document.getElementById('hud-bottom');
  const hudLocation = document.getElementById('hud-location');
  const hudQuestBox = document.getElementById('hud-quest-box');
  const hudQuestText = document.getElementById('hud-quest-text');
  const hudBagCount = document.getElementById('hud-bag-count');
  const hudFloraCount = document.getElementById('hud-flora-count');
  const btnInteract = document.getElementById('btn-interact');
  const btnBag = document.getElementById('btn-bag');
  const btnJournal = document.getElementById('btn-journal');
  const btnMute = document.getElementById('btn-mute');

  nameInput.value = state.data.playerName || 'Isko';

  function refreshHudAndEmotes() {
    const tile = map.tileAt(player.tileX, player.tileY);
    hudLocation.textContent = tile?.zone || 'UP Baguio Campus';
    hudQuestText.textContent = state.getActiveHeadline();
    hudBagCount.textContent = String(state.data.collectedPlants.length);
    hudFloraCount.textContent = `${state.data.identifiedPlants.length}/${ALL_PLANT_IDS.length}`;

    // Refresh NPC emote bubbles
    for (const [npcId, entry] of npcActors.entries()) {
      const emoteNum = getNpcEmoteNumber(npcId, state);
      entry.actor.setEmote(emoteNum ? assets.emotes[emoteNum] : null);
    }

    // Update contextual Examine button
    const target = getInteractTarget();
    if (target && !dialogUI.isOpen && !encounterUI.isOpen && !journalUI.isOpen) {
      btnInteract.classList.remove('hidden');
      btnInteract.innerHTML = `${target.label} <kbd>E</kbd>`;
    } else {
      btnInteract.classList.add('hidden');
    }
  }

  state.subscribe(() => refreshHudAndEmotes());

  // Determine what the player is facing (or orthogonally adjacent to)
  function getInteractTarget() {
    const facing = player.getFacingTile();
    const candidates = [
      facing,
      { x: player.tileX, y: player.tileY - 1 },
      { x: player.tileX, y: player.tileY + 1 },
      { x: player.tileX - 1, y: player.tileY },
      { x: player.tileX + 1, y: player.tileY },
    ];

    for (const c of candidates) {
      const npcEntry = Array.from(npcActors.values()).find(
        (e) => e.actor.tileX === c.x && e.actor.tileY === c.y,
      );
      if (npcEntry) {
        return {
          type: 'npc',
          npc: npcEntry.def,
          actor: npcEntry.actor,
          label: `💬 Talk to ${npcEntry.def.name}`,
        };
      }

      const plantNode = PLANT_NODES.find((p) => p.x === c.x && p.y === c.y);
      if (plantNode) {
        const p = PLANT_BY_ID[plantNode.plantId];
        const known = state.isIdentified(plantNode.plantId);
        return {
          type: 'plant',
          node: plantNode,
          label: `🌿 Examine ${known ? p.name : 'Wild Specimen'}`,
        };
      }

      const sign = SIGNS.find((s) => s.x === c.x && s.y === c.y);
      if (sign) {
        return {
          type: 'sign',
          sign,
          label: `🪧 Read ${sign.title}`,
        };
      }
    }
    return null;
  }

  function triggerInteraction() {
    if (dialogUI.isOpen) {
      dialogUI.advance();
      return;
    }
    if (encounterUI.isOpen || journalUI.isOpen || !titleScreen.classList.contains('hidden')) {
      return;
    }

    const target = getInteractTarget();
    if (!target) return;

    if (target.type === 'npc') {
      player.faceToward(target.actor.tileX, target.actor.tileY);
      target.actor.faceToward(player.tileX, player.tileY);
      const faceUrl = assets.characters[target.npc.sprite]?.faceUrl;
      const pages = getNpcDialogPages(target.npc, state, { toast: showToast });
      dialogUI.open(pages, faceUrl, () => refreshHudAndEmotes());
    } else if (target.type === 'plant') {
      player.faceToward(target.node.x, target.node.y);
      audio.playBgm('encounter');
      encounterUI.open(target.node.plantId, {
        hint: target.node.questHint,
        isWild: false,
        onEnd: () => {
          audio.playBgm('overworld');
          refreshHudAndEmotes();
        },
      });
    } else if (target.type === 'sign') {
      player.faceToward(target.sign.x, target.sign.y);
      dialogUI.open([
        {
          speaker: `🪧 ${target.sign.title}`,
          text: target.sign.text,
        },
      ]);
    }
  }

  // Tall grass step trigger (Pokemon wild flora encounter)
  player.onStepComplete = (tx, ty, elev) => {
    refreshHudAndEmotes();
    const t = map.tileAt(tx, ty);
    if (t?.type === 'tall_grass' && Math.random() < 0.14) {
      // Pick a wild species appropriate for this terrace elevation
    const poolByElev = {
      0: ['lagundi', 'mexican_sunflower'],
      1: ['sapinit', 'tree_fern', 'benguet_pine'],
      2: ['benguet_lily', 'takip_kuhol', 'benguet_pine'],
      3: ['sambong', 'tsaang_gubat', 'mexican_sunflower'],
    };
      const pool = poolByElev[Math.round(elev)] || ALL_PLANT_IDS;
      const wildId = pool[Math.floor(Math.random() * pool.length)];
      audio.playBgm('encounter');
      encounterUI.open(wildId, {
        isWild: true,
        onEnd: () => {
          audio.playBgm('overworld');
          refreshHudAndEmotes();
        },
      });
    }
  };

  // Title Screen & HUD Button Listeners
  function startGame() {
    state.setPlayerName(nameInput.value);
    player.name = state.data.playerName;
    titleScreen.classList.add('hidden');
    hudTop.classList.remove('hidden');
    hudBottom.classList.remove('hidden');
    audio.playBgm('overworld');
    refreshHudAndEmotes();
  }

  btnStartGame.addEventListener('click', startGame);
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startGame();
  });

  btnResetSave.addEventListener('click', () => {
    state.reset();
    nameInput.value = state.data.playerName;
    showToast('Save data reset to fresh semester!');
    refreshHudAndEmotes();
  });

  btnInteract.addEventListener('click', () => triggerInteraction());
  btnJournal.addEventListener('click', () => journalUI.toggle('plants'));
  btnBag.addEventListener('click', () => journalUI.toggle('satchel'));
  hudQuestBox.addEventListener('click', () => journalUI.toggle('quests'));

  btnMute.addEventListener('click', () => {
    const isMuted = audio.toggleMute();
    btnMute.textContent = isMuted ? '🔇' : '🔊';
  });

  // Keyboard Controls
  const heldDirs = [];
  let shiftHeld = false;

  const keyToDir = {
    ArrowUp: 'up',
    KeyW: 'up',
    ArrowDown: 'down',
    KeyS: 'down',
    ArrowLeft: 'left',
    KeyA: 'left',
    ArrowRight: 'right',
    KeyD: 'right',
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') shiftHeld = true;

    // Ignore movement shortcuts while typing name on title screen
    if (!titleScreen.classList.contains('hidden')) return;

    if (e.code === 'KeyE' || e.code === 'Space') {
      e.preventDefault();
      triggerInteraction();
      return;
    }
    if (e.code === 'KeyJ') {
      e.preventDefault();
      if (!encounterUI.isOpen && !dialogUI.isOpen) {
        journalUI.toggle('plants');
      }
      return;
    }
    if (e.code === 'Escape') {
      if (journalUI.isOpen) journalUI.close();
      else if (encounterUI.isOpen) encounterUI.close();
      else if (dialogUI.isOpen) dialogUI.close();
      return;
    }

    const dir = keyToDir[e.code];
    if (dir && !heldDirs.includes(dir)) {
      heldDirs.unshift(dir);
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') shiftHeld = false;
    const dir = keyToDir[e.code];
    if (dir) {
      const idx = heldDirs.indexOf(dir);
      if (idx !== -1) heldDirs.splice(idx, 1);
    }
  });

  // Camera smooth follow state
  const camTarget = new THREE.Vector3(
    player.group.position.x,
    player.group.position.y,
    player.group.position.z,
  );

  function updateCamera(dt) {
    const desiredX = THREE.MathUtils.clamp(player.group.position.x, 7, map.w - 7);
    const desiredZ = THREE.MathUtils.clamp(player.group.position.z, 5, map.h - 4);
    const desiredY = player.group.position.y;

    const lerpFactor = 1 - Math.exp(-8 * dt);
    camTarget.x += (desiredX - camTarget.x) * lerpFactor;
    camTarget.y += (desiredY - camTarget.y) * lerpFactor;
    camTarget.z += (desiredZ - camTarget.z) * lerpFactor;

    camera.position.set(camTarget.x, camTarget.y + 13.5, camTarget.z + 15.5);
    camera.lookAt(camTarget.x, camTarget.y + 0.4, camTarget.z - 1.2);
  }

  refreshHudAndEmotes();

  // Main Render Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;

    const uiBlocked =
      !titleScreen.classList.contains('hidden') ||
      dialogUI.isOpen ||
      encounterUI.isOpen ||
      journalUI.isOpen;

    if (!uiBlocked && heldDirs.length > 0 && !player.moving) {
      player.tryStep(heldDirs[0], shiftHeld);
      refreshHudAndEmotes();
    }

    player.update(dt, elapsed);
    for (const entry of npcActors.values()) {
      entry.actor.update(dt, elapsed);
    }
    propsCtrl.update(elapsed, player);

    for (const m of mistGroup.children) {
      m.position.x += m.userData.speed * dt;
      if (m.position.x > map.w + 6) m.position.x = -6;
    }

    updateCamera(dt);
    renderer.render(scene, camera);
  }

  animate();

  // Expose debug/test handles for Playwright verification
  window.__game = {
    state,
    map,
    player,
    npcActors,
    dialogUI,
    encounterUI,
    journalUI,
    triggerInteraction,
    startGame,
    teleportTo(x, y, dir = 'up') {
      player.moving = false;
      player.tileX = x;
      player.tileY = y;
      player.setDirection(dir);
      player.syncWorldPosition();
      camTarget.set(player.group.position.x, player.group.position.y, player.group.position.z);
      refreshHudAndEmotes();
    },
  };
}

boot();
