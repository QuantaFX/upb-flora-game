// Digital Herbarium (Floradex), Campus Missions tracker, and Herbal Satchel UI.

import { PLANTS, PLANT_BY_ID } from '../data/plants.js';
import { QUEST_DEFS, NPC_LOCATIONS } from './state.js';

export function createJournalUI(state, assets, audio) {
  const overlay = document.getElementById('journal-overlay');
  const progressSub = document.getElementById('journal-progress-sub');
  const gridEl = document.getElementById('journal-grid');
  const detailEl = document.getElementById('journal-detail');
  const questsListEl = document.getElementById('journal-quests-list');
  const satchelListEl = document.getElementById('journal-satchel-list');
  const btnClose = document.getElementById('btn-close-journal');
  const tabBtns = Array.from(overlay.querySelectorAll('.journal-tab'));

  const tabPanels = {
    plants: document.getElementById('journal-tab-plants'),
    quests: document.getElementById('journal-tab-quests'),
    satchel: document.getElementById('journal-tab-satchel'),
  };

  let isOpen = false;
  let activeTab = 'plants';
  let selectedPlantId = PLANTS[0].id;

  function switchTab(tabName) {
    activeTab = tabName;
    for (const btn of tabBtns) {
      btn.classList.toggle('is-active', btn.dataset.tab === tabName);
    }
    for (const [k, panel] of Object.entries(tabPanels)) {
      panel.classList.toggle('hidden', k !== tabName);
    }
    render();
  }

  for (const btn of tabBtns) {
    btn.addEventListener('click', () => {
      audio?.playSfx('blip');
      switchTab(btn.dataset.tab);
    });
  }

  btnClose.addEventListener('click', () => close());

  function renderPlantsTab() {
    gridEl.innerHTML = '';
    for (const p of PLANTS) {
      const unlocked = state.isIdentified(p.id);
      const card = document.createElement('div');
      card.className = `journal-card ${unlocked ? '' : 'is-locked'} ${p.id === selectedPlantId ? 'is-selected' : ''}`;
      card.innerHTML = `
        <img src="${assets.plants[p.id].portraitUrl}" alt="${unlocked ? p.name : 'Unknown'}" />
        <div class="journal-card-name">${unlocked ? p.name : '???'}</div>
        <div class="journal-card-sub">${unlocked ? p.scientificName : 'Unidentified'}</div>
      `;
      card.addEventListener('click', () => {
        audio?.playSfx('blip');
        selectedPlantId = p.id;
        renderPlantsTab();
      });
      gridEl.appendChild(card);
    }

    const p = PLANT_BY_ID[selectedPlantId] || PLANTS[0];
    const unlocked = state.isIdentified(p.id);
    const collected = state.hasCollected(p.id);
    const photoUrl = assets.plants[p.id]?.photoUrl || `/game/photos/${p.id}.jpg`;

    if (!unlocked) {
      const revealed = state.getRevealedClues(p.id);
      detailEl.innerHTML = `
        <div class="journal-detail-top">
          <img class="journal-detail-img" src="${assets.plants[p.id].portraitUrl}" style="filter:brightness(0) opacity(0.55)" alt="Locked" />
          <div>
            <h3 style="margin:0;font-size:18px">Unidentified Campus Specimen</h3>
            <div style="font-size:12px;color:var(--ink-muted)">Find this plant on campus and use OBSERVE + IDENTIFY!</div>
          </div>
        </div>
        <div class="journal-section-title">Observed Field Clues So Far</div>
        <ul>
          <li><strong>Leaves:</strong> ${revealed.includes('leaves') ? p.clues.leaves : '???'}</li>
          <li><strong>Flowers/Fruit:</strong> ${revealed.includes('flowers') ? p.clues.flowers : '???'}</li>
          <li><strong>Aroma/Touch:</strong> ${revealed.includes('smell') ? p.clues.smell : '???'}</li>
          <li><strong>Habitat:</strong> ${p.clues.habitat}</li>
        </ul>
      `;
      return;
    }

    detailEl.innerHTML = `
      <div class="journal-detail-top">
        <div class="journal-image-container">
          <img class="journal-detail-img" src="${collected ? photoUrl : assets.plants[p.id].portraitUrl}" alt="${p.name}" />
          ${collected ? '<span class="journal-photo-pill">📷 Doc Specimen</span>' : ''}
        </div>
        <div>
          <span class="enc-badge ${p.protected ? '' : 'enc-badge--green'}">${p.status}</span>
          <h3 style="margin:4px 0 2px;font-size:19px;color:var(--pine-dark)">${p.name}</h3>
          <div style="font-style:italic;font-weight:700;color:var(--maroon)">${p.scientificName}</div>
          <div style="font-size:12px;color:var(--ink-muted)">Local Name: ${p.localName}</div>
          <div style="font-size:11px;margin-top:4px;font-weight:700;color:var(--pine-mid)">
            ${collected ? `✓ Voucher Recorded: ${p.harvestItem.name}` : '○ Not yet photographed into Satchel'}
          </div>
        </div>
      </div>

      <div class="journal-photo-card">
        <div class="journal-photo-header">
          <span>📸 ACTUAL FIELD SPECIMEN (UP BAGUIO HERBARIUM)</span>
          <span class="journal-photo-sub">Documented Campus Flora</span>
        </div>
        <div class="journal-photo-frame">
          <img src="${photoUrl}" alt="${p.name} Field Photo" class="journal-real-photo" />
        </div>
        <div class="journal-photo-caption">
          <strong>Taxonomic Identification:</strong> <em>${p.scientificName}</em> (${p.localName})<br>
          <strong>Campus Location:</strong> ${p.campusZone}
        </div>
      </div>

      <div class="journal-section-title">Cordillera &amp; Campus Lore</div>
      <div>${p.lore}</div>

      <div class="journal-section-title">Medicinal / Ecological Uses</div>
      <div>${p.uses}</div>

      <div class="journal-section-title">Traditional Preparation / Protocol</div>
      <div>${p.preparation}</div>

      <div class="journal-caution">
        <strong>⚠️ Medical &amp; Conservation Reminder:</strong> ${p.caution}
      </div>
    `;
  }

  function renderQuestsTab() {
    questsListEl.innerHTML = '';
    for (const q of QUEST_DEFS) {
      const st = state.getQuestStatus(q.id);
      const statusLabel =
        st === 'completed'
          ? '✓ Completed'
          : st === 'active'
            ? '● In Progress'
            : st === 'available'
              ? '! Available'
              : '🔒 Locked';

      const card = document.createElement('div');
      card.className = 'quest-item-card';
      card.innerHTML = `
        <div>
          <div style="font-weight:700;font-size:14px;color:var(--maroon)">[${q.code}] ${q.title}</div>
          <div style="font-size:11px;color:var(--ink-muted);margin:2px 0 5px">Find ${q.giver}: ${NPC_LOCATIONS[q.npcId]}<br>Specimen location: ${q.locationHint}</div>
          <div style="font-size:12.5px;line-height:1.4">${q.summary}</div>
        </div>
        <span class="quest-status-pill ${st === 'completed' ? 'is-done' : st === 'active' ? 'is-active' : ''}">${statusLabel}</span>
      `;
      questsListEl.appendChild(card);
    }
  }

  function renderSatchelTab() {
    satchelListEl.innerHTML = '';
    const items = state.data.collectedPlants.map((id) => PLANT_BY_ID[id]).filter(Boolean);
    if (items.length === 0) {
      satchelListEl.innerHTML = `
        <div class="quest-item-card">
          <div>Your Herbal Satchel &amp; Photo Roll is currently empty. Examine plants on campus with <kbd>E</kbd>, identify them, and select <strong>COLLECT / PHOTOGRAPH</strong>!</div>
        </div>
      `;
      return;
    }

    for (const p of items) {
      const photoUrl = assets.plants[p.id]?.photoUrl || `/game/photos/${p.id}.jpg`;
      const card = document.createElement('div');
      card.className = 'quest-item-card';
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:14px;width:100%">
          <img src="${photoUrl}" alt="${p.name}" class="satchel-photo-thumb" />
          <div style="flex:1">
            <div style="font-weight:700;font-size:14px">${p.harvestItem.name}</div>
            <div style="font-size:11px;color:var(--maroon)">${p.name} (<em>${p.scientificName}</em>) · ${p.localName}</div>
            <div style="font-size:12px;color:var(--ink-muted);margin-top:2px">${p.harvestItem.description}</div>
            <div style="font-size:11px;color:var(--pine-mid);font-weight:700;margin-top:4px">📍 UPB Location: ${p.campusZone}</div>
          </div>
          <span class="quest-status-pill is-done">📸 Photo Voucher</span>
        </div>
      `;
      satchelListEl.appendChild(card);
    }
  }

  function render() {
    progressSub.textContent = `${state.data.identifiedPlants.length} of ${PLANTS.length} Cordillera & Campus Species Documented`;
    if (activeTab === 'plants') renderPlantsTab();
    else if (activeTab === 'quests') renderQuestsTab();
    else if (activeTab === 'satchel') renderSatchelTab();
  }

  function open(defaultTab = 'plants') {
    isOpen = true;
    overlay.classList.remove('hidden');
    audio?.playSfx('menuOpen');
    switchTab(defaultTab);
  }

  function close() {
    isOpen = false;
    overlay.classList.add('hidden');
  }

  function toggle(defaultTab = 'plants') {
    if (isOpen && activeTab === defaultTab) close();
    else open(defaultTab);
  }

  return {
    open,
    close,
    toggle,
    render,
    get isOpen() {
      return isOpen;
    },
  };
}
