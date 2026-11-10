// Pokemon-style Botanical Encounter Screen:
//   OBSERVE (Leaves, Flowers/Fruit, Aroma/Touch, Habitat)
//   IDENTIFY (4 species choices with 3 Field Focus hearts)
//   COLLECT (Unlocked only after positive identification; sustainable harvest or conservation photo)
//   LEAVE

import { PLANTS, PLANT_BY_ID } from '../data/plants.js';

export function createEncounterUI(state, assets, audio, toast) {
  const overlay = document.getElementById('encounter-overlay');
  const plantNameEl = document.getElementById('enc-plant-name');
  const plantTagEl = document.getElementById('enc-plant-tag');
  const plantSubEl = document.getElementById('enc-plant-sub');
  const plantSpriteEl = document.getElementById('enc-plant-sprite');
  const playerCanvas = document.getElementById('enc-player-canvas');
  const playerNameEl = document.getElementById('enc-player-name');
  const focusHeartsEl = document.getElementById('enc-focus-hearts');
  const cluesBarEl = document.getElementById('enc-clues-bar');
  const messageEl = document.getElementById('enc-message');
  const mainMenuEl = document.getElementById('enc-main-menu');
  const subMenuEl = document.getElementById('enc-sub-menu');
  const btnCollect = document.getElementById('btn-enc-collect');

  let currentPlant = null;
  let focus = 3;
  let isOpen = false;
  let onEndCallback = null;

  function drawPlayerBackSprite() {
    const ctx = playerCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 64, 64);
    const sheet = assets.characters[state.data.character === 'female' ? 'Woman' : 'Villager3']?.sheet;
    if (sheet) {
      // Column 1 is facing UP (back sprite)
      ctx.drawImage(sheet, 16, 0, 16, 16, 4, 4, 56, 56);
    }
  }

  function renderHeaderAndClues() {
    if (!currentPlant) return;
    const identified = state.isIdentified(currentPlant.id);
    const collected = state.hasCollected(currentPlant.id);

    plantNameEl.textContent = identified
      ? `${currentPlant.name} (${currentPlant.scientificName})`
      : 'Unidentified Campus Specimen';

    plantTagEl.textContent = identified
      ? (currentPlant.harvestItem.mode === 'photo')
        ? 'PHOTO SPECIMEN'
        : 'IDENTIFIED FLORA'
      : 'WILD FLORA';

    plantSubEl.textContent = identified
      ? `${currentPlant.localName} · ${currentPlant.category}`
      : 'Use OBSERVE to inspect leaves, flowers, aroma & habitat!';

    playerNameEl.textContent = `Researcher ${state.data.playerName}`;
    focusHeartsEl.textContent = '❤️'.repeat(focus) + '🖤'.repeat(Math.max(0, 3 - focus));

    // Update collect button label based on protection status
    if ((currentPlant.harvestItem.mode === 'photo')) {
      btnCollect.innerHTML = collected ? '📸 PHOTOGRAPHED ✓' : '📸 PHOTOGRAPH';
    } else {
      btnCollect.innerHTML = collected ? '🌿 COLLECTED ✓' : '🌿 COLLECT SAMPLE';
    }

    // Update clue chips
    const revealed = state.getRevealedClues(currentPlant.id);
    const labels = {
      leaves: '🍃 Leaves',
      flowers: '🌸 Flowers/Fruit',
      smell: '👃 Aroma/Touch',
      habitat: '⛰️ Habitat',
    };
    cluesBarEl.innerHTML = '';
    for (const key of ['leaves', 'flowers', 'smell', 'habitat']) {
      const chip = document.createElement('div');
      const isRev = identified || revealed.includes(key);
      chip.className = `enc-clue-chip ${isRev ? 'is-revealed' : ''}`;
      chip.innerHTML = `${labels[key]}: <span>${isRev ? currentPlant.clues[key] : 'Not observed yet'}</span>`;
      cluesBarEl.appendChild(chip);
    }
  }

  function showMainMenu(msg) {
    if (msg) messageEl.innerHTML = msg;
    subMenuEl.classList.add('hidden');
    subMenuEl.innerHTML = '';
    mainMenuEl.classList.remove('hidden');
    renderHeaderAndClues();
  }

  function openObserveMenu() {
    audio?.playSfx('blip');
    subMenuEl.innerHTML = '';
    subMenuEl.classList.remove('hidden');

    const parts = [
      ['leaves', '🍃 Inspect Leaves'],
      ['flowers', '🌸 Inspect Flowers & Fruit'],
      ['smell', '👃 Check Aroma & Texture'],
      ['habitat', '⛰️ Note Microhabitat'],
    ];

    for (const [key, label] of parts) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pixel-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        audio?.playSfx('blip');
        state.revealClue(currentPlant.id, key);
        showMainMenu(`<strong>Field Observation (${label}):</strong> ${currentPlant.clues[key]}`);
      });
      subMenuEl.appendChild(btn);
    }

    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'pixel-btn pixel-btn--sm';
    backBtn.textContent = '← Back';
    backBtn.addEventListener('click', () => showMainMenu());
    subMenuEl.appendChild(backBtn);
  }

  function openIdentifyMenu() {
    if (state.isIdentified(currentPlant.id)) {
      showMainMenu(
        `You already identified this specimen as <strong>${currentPlant.name}</strong> (<em>${currentPlant.scientificName}</em>)! Now select <strong>${(currentPlant.harvestItem.mode === 'photo') ? 'PHOTOGRAPH' : 'COLLECT SAMPLE'}</strong>.`,
      );
      return;
    }

    audio?.playSfx('blip');
    subMenuEl.innerHTML = '';
    subMenuEl.classList.remove('hidden');

    // Build 4 deterministic/shuffled options including the right plant
    const others = PLANTS.filter((p) => p.id !== currentPlant.id);
    // Deterministic shuffle seeded by plant id + focus
    const pool = [...others].sort((a, b) =>
      (a.id.charCodeAt(0) + focus * 7) - (b.id.charCodeAt(0) + focus * 3),
    );
    const choices = [currentPlant, ...pool.slice(0, 3)].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    for (const option of choices) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pixel-btn';
      btn.innerHTML = `<strong>${option.name}</strong> <span style="font-size:11px;opacity:0.8">(${option.scientificName})</span>`;
      btn.addEventListener('click', () => handleIdentifyPick(option));
      subMenuEl.appendChild(btn);
    }

    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'pixel-btn pixel-btn--sm';
    backBtn.textContent = '← Back';
    backBtn.addEventListener('click', () => showMainMenu());
    subMenuEl.appendChild(backBtn);
  }

  function handleIdentifyPick(option) {
    if (option.id === currentPlant.id) {
      state.markIdentified(currentPlant.id);
      audio?.playSfx('success');
      toast(`🌿 Identified: ${currentPlant.name} (${currentPlant.scientificName})!`);
      showMainMenu(
        `✅ <strong>Positive Identification!</strong> This is <strong>${currentPlant.name}</strong> (<em>${currentPlant.scientificName}</em>).<br/>Uses: ${currentPlant.uses}<br/>Select <strong>${(currentPlant.harvestItem.mode === 'photo') ? '📸 PHOTOGRAPH' : '🌿 COLLECT SAMPLE'}</strong> to record it in your satchel!`,
      );
    } else {
      focus -= 1;
      audio?.playSfx('wrong');
      if (focus <= 0) {
        renderHeaderAndClues();
        showMainMenu(
          `❌ Not quite — that was <em>${option.name}</em>. Your field focus is spent! Step back, review the morphological clues, and examine the plant again.`,
        );
        setTimeout(() => close(), 1600);
      } else {
        showMainMenu(
          `❌ Hmm, <em>${option.name}</em> doesn’t match these traits. Try using <strong>🔍 OBSERVE</strong> first! (${focus} Focus remaining)`,
        );
      }
    }
  }

  function handleCollect() {
    if (!state.isIdentified(currentPlant.id)) {
      audio?.playSfx('wrong');
      showMainMenu(
        `⚠️ <strong>Botanical Safety Rule #1:</strong> Never harvest or voucher a wild plant before making a positive identification! Choose <strong>🏷️ IDENTIFY</strong> first.`,
      );
      return;
    }

    state.markCollected(currentPlant.id);
    audio?.playSfx('success');
    const item = currentPlant.harvestItem;
    toast(`🎒 Added to Satchel: ${item.name}`);

    const actionText = (currentPlant.harvestItem.mode === 'photo')
      ? `📸 <strong>Conservation Protocol:</strong> You captured a geotagged voucher photograph without disturbing the living plant!`
      : `🌿 <strong>Sustainable Harvest:</strong> You carefully gathered <strong>${item.name}</strong> while leaving the parent plant healthy!`;

    showMainMenu(`${actionText}<br/><em>(${currentPlant.caution})</em>`);
  }

  mainMenuEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cmd]');
    if (!btn || !isOpen) return;
    const cmd = btn.dataset.cmd;
    if (cmd === 'observe') openObserveMenu();
    else if (cmd === 'identify') openIdentifyMenu();
    else if (cmd === 'collect') handleCollect();
    else if (cmd === 'leave') close();
  });

  function open(plantId, opts = {}) {
    const plant = PLANT_BY_ID[plantId];
    if (!plant) return;
    currentPlant = plant;
    focus = 3;
    isOpen = true;
    onEndCallback = opts.onEnd || null;

    plantSpriteEl.src = assets.plants[plantId].portraitUrl;
    drawPlayerBackSprite();
    overlay.classList.remove('hidden');
    audio?.playSfx('encounter');

    const introPrefix = opts.isWild
      ? '🌱 Rustling tall grass! You encountered a wild campus specimen!'
      : `🔍 Examining <strong>${opts.hint || 'campus specimen'}</strong>...`;

    showMainMenu(
      `${introPrefix} Observe its leaves, flowers, and aroma, then identify the species!`,
    );
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.add('hidden');
    if (onEndCallback) {
      const fn = onEndCallback;
      onEndCallback = null;
      fn();
    }
  }

  return {
    open,
    close,
    get isOpen() {
      return isOpen;
    },
  };
}
