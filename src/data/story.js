import { QUEST_DEFS } from '../game/state.js';
import { PLANT_BY_ID } from './plants.js';
const allComplete = state => QUEST_DEFS.every(q => state.getQuestStatus(q.id) === 'completed');
export function getNpcEmoteNumber(npcId, state) {
 if (npcId === 'prof_barcelo' && allComplete(state)) return state.data.flags.finale_complete ? 27 : 22;
 const q = QUEST_DEFS.find(q => q.npcId === npcId);
 if (!q) return null;
 const status = state.getQuestStatus(q.id);
 return status === 'available' ? 22 : status === 'active' ? (state.hasCollected(q.plantId) ? 22 : 25) : status === 'completed' ? 27 : null;
}
export function getNpcDialogPages(npc, state, callbacks) {
 const page = (text, onFinish) => ({speaker:npc.name,text,onFinish});
 if (npc.id === 'prof_barcelo' && allComplete(state)) return [page(
  state.data.flags.finale_complete ? 'Your seven-species herbarium is complete. Keep exploring the campus gardens!' : 'You documented all seven campus plants and their habitats. Your field photographs will help the next class recognize them. Well done, Student Curator!',
  () => {state.setFlag('finale_complete'); callbacks.toast('Project Saleng complete: seven campus plants documented.');}
 )];
 const q = QUEST_DEFS.find(q => q.npcId === npc.id);
 if (!q) {
  const lines = {
   apo_sabado: 'Saleng is our pine. Observe its bundles of needles and woody cones. Photograph the tree to the left of Inang Laya without stripping its bark or branches.',
   manong_ben: 'Welcome to UP Baguio. Prof. Racquel Barcelo is waiting beside the Oblation. The stairs to the west lead to the academic quad.',
   junjun: 'Nanay is helping the class find Kamantigi. Look for pink flowers beside the north stairs, and keep the steps clear!'
  };
  return [page(lines[npc.id] || 'Enjoy your campus fieldwork!')];
 }
 const p = PLANT_BY_ID[q.plantId], status=state.getQuestStatus(q.id);
 if (status === 'locked') return [page("Complete Prof. Barcelo's pine-tree fieldwork at Inang Laya first, then return for our next specimen.")];
 if (status === 'available') return [
  page(npc.id === 'prof_barcelo' ? `Welcome, ${state.data.playerName}! I am Prof. Racquel Barcelo. We will identify seven campus plants and build a photographic herbarium.` : `Our next field study is ${p.name}. ${q.locationHint}.`),
  page(`Look for this clue: ${p.clues.leaves} Observe, identify, then photograph the specimen. Return to me with your record.`, () => {state.setQuestStatus(q.id,'active'); state.setFlag('talked_prof_intro'); callbacks.toast(`Fieldwork started: ${p.name}`);})
 ];
 if (status === 'active' && !state.hasCollected(p.id)) return [page(`${q.locationHint}. ${p.clues.flowers} Use Observe and Identify, then Photograph to save your record.`)];
 if (status === 'active') return [page(`Your photograph records ${p.name}, ${p.scientificName}. ${p.uses}`),page('Keep reported traditional uses separate from proven treatments. Our project records plant identity and local knowledge without preparing remedies.', () => {state.setQuestStatus(q.id,'completed'); callbacks.toast(`Fieldwork complete: ${p.name}`);})];
 return [page(`Your ${p.name} record is in the herbarium. ${p.clues.flowers}`)];
}
