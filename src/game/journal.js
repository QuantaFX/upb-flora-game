// Digital Herbarium (Floradex), Campus Missions tracker, Herbal Satchel, and Contest & Sources UI.

import { PLANTS, PLANT_BY_ID } from '../data/plants.js';
import { QUEST_DEFS, NPC_LOCATIONS } from './state.js';

export function createJournalUI(state, assets, audio) {
  const overlay = document.getElementById('journal-overlay');
  const progressSub = document.getElementById('journal-progress-sub');
  const gridEl = document.getElementById('journal-grid');
  const detailEl = document.getElementById('journal-detail');
  const questsListEl = document.getElementById('journal-quests-list');
  const satchelListEl = document.getElementById('journal-satchel-list');
  const aboutEl = document.getElementById('journal-about-content');
  const btnClose = document.getElementById('btn-close-journal');
  const searchInput = document.getElementById('journal-search-input');
  const filterPillsContainer = document.getElementById('journal-filter-pills');
  const tabBtns = Array.from(overlay.querySelectorAll('.journal-tab'));

  const tabPanels = {
    plants: document.getElementById('journal-tab-plants'),
    quests: document.getElementById('journal-tab-quests'),
    satchel: document.getElementById('journal-tab-satchel'),
    about: document.getElementById('journal-tab-about'),
  };

  let isOpen = false;
  let activeTab = 'plants';
  let selectedPlantId = PLANTS[0]?.id || 'benguet_pine';
  let activeFilter = 'all'; // 'all' | 'endemic' | 'indigenous'
  let searchQuery = '';

  function switchTab(tabName) {
    activeTab = tabName;
    for (const btn of tabBtns) {
      btn.classList.toggle('is-active', btn.dataset.tab === tabName);
    }
    for (const [k, panel] of Object.entries(tabPanels)) {
      if (panel) {
        panel.classList.toggle('hidden', k !== tabName);
      }
    }
    render();
  }

  for (const btn of tabBtns) {
    btn.addEventListener('click', () => {
      audio?.playSfx('blip');
      switchTab(btn.dataset.tab);
    });
  }

  if (filterPillsContainer) {
    filterPillsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      audio?.playSfx('blip');
      activeFilter = btn.dataset.filter || 'all';
      filterPillsContainer.querySelectorAll('.filter-pill').forEach((p) => {
        p.classList.toggle('is-active', p === btn);
      });
      renderPlantsTab();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = (e.target.value || '').trim().toLowerCase();
      renderPlantsTab();
    });
  }

  btnClose.addEventListener('click', () => close());

  function getFilteredPlants() {
    return PLANTS.filter((p) => {
      // Filter by Philippine Endemic vs Indigenous Native
      if (activeFilter === 'endemic') {
        if (!p.nativeStatus.includes('Endemic')) return false;
      } else if (activeFilter === 'indigenous') {
        if (p.nativeStatus.includes('Endemic')) return false;
      }

      // Filter by search query
      if (!searchQuery) return true;
      const haystack = [
        p.name,
        p.scientificName,
        p.family,
        p.localName,
        p.campusZone,
        p.category,
        p.themeRelevance,
        p.uses,
        p.lore,
      ].join(' ').toLowerCase();

      return haystack.includes(searchQuery);
    });
  }

  function renderPlantsTab() {
    const filtered = getFilteredPlants();
    const prevGridScroll = gridEl.scrollTop;
    gridEl.innerHTML = '';

    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 24px; text-align: center; color: var(--ink-muted); font-size: 13px;">
          No matching species found for "<strong>${searchQuery}</strong>".<br>
          <span style="font-size: 11px;">Try searching by family (e.g., Ericaceae, Pinaceae) or common name.</span>
        </div>
      `;
      detailEl.innerHTML = `
        <div style="padding: 30px; text-align: center; color: var(--ink-muted); font-size: 13px;">
          No plant selected. Clear or adjust search filter.
        </div>
      `;
      return;
    }

    // Keep selection if in filtered list, else choose the first
    if (!filtered.some((p) => p.id === selectedPlantId)) {
      selectedPlantId = filtered[0].id;
    }

    for (const p of filtered) {
      const unlocked = state.isIdentified(p.id);
      const isEndemic = p.nativeStatus.includes('Endemic');
      const isIntro = p.nativeStatus.includes('Introduced') || p.nativeStatus.includes('Cultivated');
      const badgeIcon = isEndemic ? '🇵🇭' : isIntro ? '🏡' : '🌿';

      const card = document.createElement('div');
      card.className = `journal-card ${unlocked ? '' : 'is-locked'} ${p.id === selectedPlantId ? 'is-selected' : ''}`;
      card.innerHTML = `
        <div class="journal-card-status-pip" title="${p.nativeStatus}">${badgeIcon}</div>
        <img src="${assets.plants[p.id]?.portraitUrl || ''}" alt="${unlocked ? p.name : 'Unknown'}" />
        <div class="journal-card-name">${unlocked ? p.name : '???'}</div>
        <div class="journal-card-sub">${unlocked ? p.scientificName : 'Unidentified'}</div>
        <div class="journal-card-family">${unlocked ? p.family : '???'}</div>
      `;
      card.addEventListener('click', () => {
        audio?.playSfx('blip');
        selectedPlantId = p.id;
        renderPlantsTab();
        detailEl.scrollTop = 0;
      });
      gridEl.appendChild(card);
    }
    gridEl.scrollTop = prevGridScroll;

    const p = PLANT_BY_ID[selectedPlantId] || filtered[0];
    const unlocked = state.isIdentified(p.id);
    const collected = state.hasCollected(p.id);
    const photoUrl = assets.plants[p.id]?.photoUrl || `/game/photos/${p.id}.jpg`;

    if (!unlocked) {
      const revealed = state.getRevealedClues(p.id);
      detailEl.innerHTML = `
        <div class="journal-detail-top">
          <div class="journal-image-container">
            <img class="journal-detail-img is-silhouette" src="${assets.plants[p.id]?.portraitUrl || ''}" alt="Locked" />
          </div>
          <div>
            <h3 style="margin:0;font-size:18px">Unidentified Campus Specimen</h3>
            <div style="font-size:12px;color:var(--ink-muted)">Find this plant on campus and use OBSERVE + IDENTIFY!</div>
            <div style="font-size:11.5px;color:var(--pine-mid);margin-top:6px;font-weight:700">📍 Field Hint: ${p.campusZone}</div>
          </div>
        </div>
        <div class="journal-section-title">Observed Field Clues So Far</div>
        <ul style="padding-left:18px;margin:6px 0;line-height:1.5;font-size:13px">
          <li><strong>Leaves:</strong> ${revealed.includes('leaves') ? p.clues.leaves : '???'}</li>
          <li><strong>Flowers/Fruit:</strong> ${revealed.includes('flowers') ? p.clues.flowers : '???'}</li>
          <li><strong>Aroma/Touch:</strong> ${revealed.includes('smell') ? p.clues.smell : '???'}</li>
          <li><strong>Habitat:</strong> ${p.clues.habitat}</li>
        </ul>
      `;
      return;
    }

    const isEndemic = p.nativeStatus.includes('Endemic');
    const isIntro = p.nativeStatus.includes('Introduced') || p.nativeStatus.includes('Cultivated');
    const statusPillClass = isEndemic ? 'enc-badge--endemic' : isIntro ? 'enc-badge--amber' : 'enc-badge--green';

    detailEl.innerHTML = `
      <div class="journal-detail-top">
        <div class="journal-image-container">
          <img class="journal-detail-img" src="${assets.plants[p.id]?.portraitUrl || ''}" alt="${p.name}" />
        </div>
        <div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:4px">
            <span class="enc-badge ${statusPillClass}">${p.nativeStatus}</span>
            <span class="journal-family-badge">Family: ${p.family}</span>
            ${p.protected ? '<span class="enc-badge enc-badge--protected">Protected</span>' : ''}
          </div>
          <h3 style="margin:2px 0 2px;font-size:20px;color:var(--pine-dark)">${p.name}</h3>
          <div style="font-style:italic;font-weight:700;color:var(--maroon);font-size:14px">${p.scientificName}</div>
          <div style="font-size:12px;color:var(--ink-muted);margin-top:2px">Local Name: <strong>${p.localName}</strong></div>
          <div class="journal-gps-badge">
            <span>📍 <strong>Campus GPS:</strong> ${p.gps}</span>
            <span style="opacity:0.8">(${p.campusZone})</span>
          </div>
          <div style="font-size:11px;margin-top:6px;font-weight:700;color:var(--pine-mid)">
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
          <strong>Taxonomic Identification:</strong> <em>${p.scientificName}</em> (${p.family})<br>
          <strong>Campus Location &amp; Coordinates:</strong> ${p.campusZone} (${p.gps})
        </div>
      </div>

      <div class="journal-theme-box">
        <div class="journal-theme-header">
          🌱 NATIVE PLANTS WEEK 2026 THEME FOCUS
        </div>
        <div class="journal-theme-body">
          ${p.themeRelevance}
        </div>
      </div>

      <div class="journal-section-title">Distinguishing Botanical Characteristics</div>
      <div class="journal-botanical-traits">
        <div><strong>Leaves &amp; Stems:</strong> ${p.clues.leaves}</div>
        <div style="margin-top:4px"><strong>Flowers &amp; Fruit:</strong> ${p.clues.flowers}</div>
        <div style="margin-top:4px"><strong>Aroma &amp; Texture:</strong> ${p.clues.smell}</div>
        <div style="margin-top:4px"><strong>Campus Habitat:</strong> ${p.clues.habitat}</div>
      </div>

      <div class="journal-section-title">Cordillera &amp; Campus Lore</div>
      <div>${p.lore}</div>

      <div class="journal-section-title">Medicinal / Traditional / Ecological Significance</div>
      <div>${p.uses}</div>

      <div class="journal-section-title">Traditional Preparation / Field Protocol</div>
      <div>${p.preparation}</div>

      <div class="journal-caution">
        <strong>⚠️ Medical &amp; Conservation Reminder:</strong> ${p.caution}
      </div>

      <div class="journal-section-title">Authoritative Botanical References &amp; Native Status</div>
      <div class="journal-refs-box">
        <a href="${p.references.cosFlora}" target="_blank" rel="noopener noreferrer" class="journal-ref-link">
          🇵🇭 <strong>Co's Digital Flora of the Philippines:</strong> Family ${p.family} ↗
          ${p.references.cosStatus ? `<div style="font-size:11px;color:var(--ink-base);margin-top:3px;line-height:1.35">${p.references.cosStatus}</div>` : ''}
        </a>
        <a href="${p.references.powo}" target="_blank" rel="noopener noreferrer" class="journal-ref-link">
          🌍 <strong>Plants of the World Online (Kew POWO):</strong> <em>${p.scientificName}</em> ↗
          ${p.references.powoStatus ? `<div style="font-size:11px;color:var(--ink-base);margin-top:3px;line-height:1.35">${p.references.powoStatus}</div>` : ''}
        </a>
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
            <div style="font-size:11px;color:var(--maroon)">${p.name} (<em>${p.scientificName}</em> · ${p.family}) · ${p.localName}</div>
            <div style="font-size:12px;color:var(--ink-muted);margin-top:2px">${p.harvestItem.description}</div>
            <div style="font-size:11px;color:var(--pine-mid);font-weight:700;margin-top:4px">📍 GPS: ${p.gps} (${p.campusZone})</div>
          </div>
          <span class="quest-status-pill is-done">📸 Photo Voucher</span>
        </div>
      `;
      satchelListEl.appendChild(card);
    }
  }

  function renderAboutTab() {
    if (!aboutEl) return;
    aboutEl.innerHTML = `
      <div class="about-hero-card">
        <div class="festival-ribbon" style="display:inline-block;margin-bottom:8px">Official Contest Submission Entry</div>
        <h2 style="margin:0 0 4px;font-size:22px;color:var(--pine-dark)">Ex-Flora-Tive</h2>
        <div style="font-size:14px;font-weight:700;color:var(--maroon)">
          UP Baguio Interactive Native Plant Map &amp; Digital Herbarium
        </div>
        <div style="font-size:12.5px;color:var(--ink-muted);margin-top:6px;line-height:1.5">
          <strong>Contest:</strong> Interactive Plant Map Contest — Native Plants Week 2026<br>
          <strong>Theme:</strong> “Rooted in Heritage, Growing the Future: Native Plants for Food, Culture, and Sustainability”
        </div>
      </div>

      <div class="journal-section-title">Submission Information &amp; Team Details (Section VI)</div>
      <div class="about-info-grid">
        <div class="about-info-cell">
          <strong>Institution:</strong> University of the Philippines Baguio (UPB)
        </div>
        <div class="about-info-cell">
          <strong>Academic Unit:</strong> College of Science · Department of Biology
        </div>
        <div class="about-info-cell">
          <strong>Facilitator:</strong> Biology Department Faculty Facilitator
        </div>
        <div class="about-info-cell">
          <strong>Platform:</strong> Interactive Web Application &amp; 2.5D Spatial Campus Map
        </div>
      </div>

      <div class="journal-section-title">Interactive Map Description &amp; Methodology</div>
      <div style="font-size:13px;line-height:1.55;color:var(--ink-base)">
        <p style="margin:0 0 8px">
          <strong>Ex-Flora-Tive</strong> is a dual-perspective interactive campus flora platform built for Native Plants Week 2026.
          It merges a spatial, tile-accurate 2.5D simulation of the UP Baguio campus with a comprehensive digital herbarium.
          Users navigate iconic campus landmarks—the Oblation Grounds, Inang Laya, College of Science (KA/HKP), and Teatro Amianan—to locate, examine, and photograph authenticated plant specimens.
        </p>
        <p style="margin:0 0 8px">
          Per Contest Guidelines (Rule V.2 and V.3), all <strong>10 documented campus plant species</strong> have been strictly verified as indigenous/native or endemic to the Philippines using <strong>Co's Digital Flora of the Philippines</strong> and <strong>Plants of the World Online (Kew POWO)</strong> (excluding non-native cultivated ornamentals):
        </p>
        <ul style="margin:0 0 8px;padding-left:20px">
          <li><strong>Philippine Endemics (2):</strong> <em>Rhododendron subsessile</em> (Philippine Azalea) and <em>Medinilla pendula</em> (Agubangbang).</li>
          <li><strong>Indigenous Philippine Native Flora (8):</strong> <em>Pinus kesiya</em> (Pine Tree / Saleng), <em>Sarcandra glabra</em> (Gipas), <em>Microsorum punctatum</em> (Fishtail Fern), <em>Casuarina equisetifolia</em> (Agoho), <em>Impatiens platypetala</em> (Kamantigi), <em>Coleus scutellarioides</em> (Mayana), <em>Nephrolepis cordifolia</em> (Fishbone Fern / Bayabang), and <em>Spathoglottis plicata</em> (Philippine Ground Orchid).</li>
        </ul>
        <p style="margin:0">
          Every specimen entry incorporates authenticated field photographs from the UP Baguio Herbarium, precise campus GPS coordinates, family classifications, vegetative and reproductive keys, Cordillera ethnobotanical traditions, and thematic connections to food, culture, and sustainability.
        </p>
      </div>

      <div class="journal-section-title">Authoritative References &amp; Scientific Bibliography</div>
      <ol class="about-references-list">
        <li>
          <strong>Pelser, P.B., Barcelona, J.F. &amp; Nickrent, D.L. (eds.) (2011 onwards).</strong>
          <em>Co's Digital Flora of the Philippines.</em>
          Accessible at: <a href="https://www.philippineplants.org/" target="_blank" rel="noopener noreferrer">https://www.philippineplants.org/</a>
          (Mandatory benchmark for Philippine native and endemic status determination).
        </li>
        <li>
          <strong>Royal Botanic Gardens, Kew (2026).</strong>
          <em>Plants of the World Online (POWO).</em>
          Facilitated by the Royal Botanic Gardens, Kew.
          Accessible at: <a href="https://powo.science.kew.org/" target="_blank" rel="noopener noreferrer">https://powo.science.kew.org/</a>
          (Authoritative source for accepted nomenclature, families, and global distribution).
        </li>
        <li>
          <strong>University of the Philippines Baguio Herbarium (UPB).</strong>
          <em>Campus Botanical Records, Herbarium Vouchers, and Morpho-Anatomical Survey Data.</em>
          College of Science, UP Baguio, Baguio City, Philippines.
        </li>
        <li>
          <strong>Quisumbing, E. (1978).</strong>
          <em>Medicinal Plants of the Philippines.</em>
          Katha Publishing Co., Inc., Quezon City.
        </li>
        <li>
          <strong>Balangcod, T. D., &amp; Balangcod, A. K. D. (2018).</strong>
          <em>Ethnomedicinal plants in Bayabas, Sablan, Benguet Province, Luzon, Philippines.</em>
          Indian Journal of Traditional Knowledge, 17(4), 659–666.
        </li>
        <li>
          <strong>International Union for Conservation of Nature (IUCN) (2026).</strong>
          <em>The IUCN Red List of Threatened Species.</em>
          Assessments for <em>Rhododendron subsessile</em> and <em>Medinilla pendula</em>.
        </li>
      </ol>
    `;
  }

  function render() {
    progressSub.textContent = `${state.data.identifiedPlants.length} of ${PLANTS.length} Cordillera & Campus Species Documented`;
    if (activeTab === 'plants') renderPlantsTab();
    else if (activeTab === 'quests') renderQuestsTab();
    else if (activeTab === 'satchel') renderSatchelTab();
    else if (activeTab === 'about') renderAboutTab();
  }

  function open(defaultTab = 'plants') {
    isOpen = true;
    overlay.classList.remove('hidden');
    document.body.classList.add('in-journal');
    const touchCtrl = document.getElementById('touch-controls');
    if (touchCtrl) touchCtrl.inert = true;
    audio?.playSfx('menuOpen');
    switchTab(defaultTab);
  }

  function close() {
    isOpen = false;
    overlay.classList.add('hidden');
    document.body.classList.remove('in-journal');
    const touchCtrl = document.getElementById('touch-controls');
    if (touchCtrl && document.body.classList.contains('is-playing') && !document.body.classList.contains('in-encounter')) {
      touchCtrl.inert = false;
    }
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
