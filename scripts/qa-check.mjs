import assert from 'node:assert/strict';
import { GameState, QUEST_DEFS } from '../src/game/state.js';
import { getNpcDialogPages } from '../src/data/story.js';
import { PLANTS } from '../src/data/plants.js';
import { createEncounterUI } from '../src/game/encounter.js';

const state = new GameState();
state.setQuestStatus(QUEST_DEFS[0].id, 'completed');
assert.equal(state.getQuestStatus(QUEST_DEFS[1].id), 'available');
assert.equal(state.getQuestStatus(QUEST_DEFS[5].id), 'locked', 'M6 must stay locked until M5 is complete');
const apo = { id: 'apo_sabado', name: 'Apo Sabado' };
state.markCollected('benguet_pine');
assert.doesNotMatch(getNpcDialogPages(apo, state, {})[0].text, /Photograph the tree/, 'Apo must acknowledge the existing photo');
assert.match(state.getActiveHeadline(), /CAC/, 'The next objective must locate Paolo');
// An older save can have a later completed mission and multiple active quests.
state.data.quests[QUEST_DEFS[5].id] = 'completed';
state.data.quests[QUEST_DEFS[6].id] = 'active';
const oldSave = JSON.stringify(state.data);
globalThis.localStorage = { getItem: () => oldSave, setItem() {} };
const restored = new GameState();
assert.equal(restored.getQuestStatus(QUEST_DEFS[5].id), 'completed');
assert.equal(restored.getQuestStatus(QUEST_DEFS[6].id), 'locked');
assert.ok(restored.hasCollected('benguet_pine'));

let celebrations = 0;
for (const q of QUEST_DEFS) state.data.quests[q.id] = 'completed';
const review = () => getNpcDialogPages({ id: 'prof_barcelo', name: 'Professor' }, state,
  { toast() {}, celebrate() { celebrations++; } }).forEach(p => p.onFinish?.());
review(); review();
assert.equal(celebrations, 1, 'Only the first final review should celebrate');

// Exercise the real encounter open/render path with the same revealing hints
// supplied by the world, before any identification or observation.
const element = () => ({
  classList: { add() {}, remove() {}, contains() { return false; } },
  addEventListener() {}, appendChild() {},
  getContext: () => ({ clearRect() {} }),
});
const elements = new Map();
globalThis.document = {
  body: element(), createElement: element,
  getElementById(id) { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); },
};
const fresh = new GameState();
fresh.data.identifiedPlants = [];
fresh.data.collectedPlants = [];
const assets = { characters: {}, plants: Object.fromEntries(PLANTS.map(p => [p.id, { portraitUrl: '' }])) };
const encounter = createEncounterUI(fresh, assets, null, () => {});
for (const plant of PLANTS) {
  encounter.open(plant.id, { hint: `${plant.name} beside the path` });
  assert.ok(!elements.get('enc-message').innerHTML.includes(plant.name), `${plant.name} must stay hidden`);
  assert.equal(elements.get('enc-plant-name').textContent, 'Unidentified Campus Specimen');
  encounter.close();
}
console.log('QA mission order, save migration, NPC guidance, dialogue, finale and hidden identities passed.');
