import { QUEST_DEFS, NPC_LOCATIONS } from '../game/state.js';
import { PLANT_BY_ID } from './plants.js';

const allComplete = (state) => QUEST_DEFS.every((q) => state.getQuestStatus(q.id) === 'completed');

function findNpcQuest(npcId, state) {
  const npcQuests = QUEST_DEFS.filter((q) => q.npcId === npcId);
  if (npcQuests.length === 0) return null;
  return (
    npcQuests.find((q) => {
      const st = state.getQuestStatus(q.id);
      return st === 'active' || st === 'available';
    }) ||
    npcQuests.find((q) => state.getQuestStatus(q.id) !== 'completed') ||
    npcQuests[npcQuests.length - 1]
  );
}

export function getNpcEmoteNumber(npcId, state) {
  if (npcId === 'prof_barcelo' && allComplete(state)) {
    return state.data.flags.finale_complete ? 27 : 22;
  }
  const npcQuests = QUEST_DEFS.filter((q) => q.npcId === npcId);
  if (npcQuests.length === 0) return null;
  const current = npcQuests.find((q) => {
    const st = state.getQuestStatus(q.id);
    return st === 'active' || st === 'available';
  });
  if (current) {
    const status = state.getQuestStatus(current.id);
    return status === 'available' ? 22 : state.hasCollected(current.plantId) ? 22 : 25;
  }
  if (npcQuests.every((q) => state.getQuestStatus(q.id) === 'completed')) {
    return 27;
  }
  return null;
}

export function getNpcDialogPages(npc, state, callbacks) {
  const page = (text, onFinish) => ({ speaker: npc.name, text, onFinish });
  if (npc.id === 'prof_barcelo' && allComplete(state)) {
    return [
      page(
        state.data.flags.finale_complete
          ? 'Your fifteen-species UP Baguio Digital Herbarium is complete. Keep exploring the campus gardens!'
          : 'You documented all fifteen campus plants, their morphological clues, and their Cordillera & campus habitats! Your field photographs will help the next class recognize them. Well done, Student Curator!',
        () => {
          const firstReview = !state.data.flags.finale_complete;
          state.setFlag('finale_complete');
          if (firstReview) callbacks.celebrate?.();
          callbacks.toast('Ex-Flora-Tive complete: all 15 campus plants documented!');
        },
      ),
    ];
  }
  const q = findNpcQuest(npc.id, state);
  if (!q) {
    const lines = {
      junjun:
        'Nanay is helping the class find Kamantigi (Impatiens platypetala). Look for the flat pink blossoms along the Abortion Stairs, and keep the steps clear!',
    };
    return [page(lines[npc.id] || 'Enjoy your campus fieldwork!')];
  }
  const p = PLANT_BY_ID[q.plantId];
  const status = state.getQuestStatus(q.id);
  if (status === 'locked') {
    const next = QUEST_DEFS.find((item) => state.getQuestStatus(item.id) !== 'completed');
    return [
      page(
        `My field study comes later. Finish ${next.code} with ${next.giver}, ${NPC_LOCATIONS[next.npcId]}, first.`,
      ),
    ];
  }
  if (status === 'available') {
    return [
      page(
        q.id === 'field_benguet_pine'
          ? `Welcome, ${state.data.playerName}! I am Prof. Racquel Barcelo. Welcome to Native Plants Week! We will identify 15 campus plants and build a complete photographic herbarium.`
          : `Our next field study is ${p.name} (${p.scientificName}). Location: ${q.locationHint}.`,
      ),
      page(
        `Look for this clue: ${p.clues.leaves} Observe, identify, then photograph the specimen. Return to me with your record.`,
        () => {
          state.setQuestStatus(q.id, 'active');
          state.setFlag('talked_prof_intro');
          callbacks.toast(`Fieldwork started: ${p.name}`);
        },
      ),
    ];
  }
  if (status === 'active' && !state.hasCollected(p.id)) {
    return [
      page(
        `${q.locationHint}. ${p.clues.flowers} Use Observe and Identify, then Photograph to save your record.`,
      ),
    ];
  }
  if (status === 'active') {
    return [
      page(`Your photograph records ${p.name}, ${p.scientificName}. ${p.uses}`),
      page(
        'Keep reported traditional uses separate from proven clinical treatments, and always respect toxicity and conservation rules. Our project records plant identity and local knowledge without preparing remedies.',
        () => {
          state.setQuestStatus(q.id, 'completed');
          callbacks.toast(`Fieldwork complete: ${p.name}`);
        },
      ),
    ];
  }
  return [page(`Your ${p.name} record is in the herbarium. ${p.clues.flowers}`)];
}
