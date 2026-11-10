// Audio manager using tracks & jingles from the Ninja Adventure Asset Pack.

import { PACK_BASE } from './assets.js';

export function createAudioManager() {
  let muted = false;
  let currentBgm = null;

  const tracks = {
    overworld: new Audio(`${PACK_BASE}/Audio/Musics/${encodeURIComponent('33 - Calm Village.ogg')}`),
    encounter: new Audio(`${PACK_BASE}/Audio/Musics/${encodeURIComponent('22 - Dream.ogg')}`),
  };

  for (const t of Object.values(tracks)) {
    t.loop = true;
    t.volume = 0.28;
  }

  const sfxUrls = {
    blip: `${PACK_BASE}/Audio/Sounds/Menu/Accept.wav`,
    menuOpen: `${PACK_BASE}/Audio/Sounds/Menu/Menu1.wav`,
    success: `${PACK_BASE}/Audio/Jingles/Success1.wav`,
    wrong: `${PACK_BASE}/Audio/Sounds/Menu/Cancel.wav`,
    encounter: `${PACK_BASE}/Audio/Sounds/Alert/Alert1.wav`,
  };

  function playBgm(name) {
    if (muted) return;
    const next = tracks[name];
    if (!next || currentBgm === next) return;
    if (currentBgm) {
      currentBgm.pause();
    }
    currentBgm = next;
    currentBgm.currentTime = 0;
    currentBgm.play().catch(() => {
      // Autoplay blocked until user gesture
    });
  }

  function playSfx(name) {
    if (muted) return;
    const url = sfxUrls[name];
    if (!url) return;
    try {
      const a = new Audio(url);
      a.volume = 0.4;
      a.play().catch(() => {});
    } catch {
      // ignore audio error
    }
  }

  function toggleMute() {
    muted = !muted;
    if (muted) stopVoice();
    if (muted && currentBgm) {
      currentBgm.pause();
    } else if (!muted && currentBgm) {
      currentBgm.play().catch(() => {});
    }
    return muted;
  }

  function stopVoice() {
    window.speechSynthesis?.cancel();
  }

  function speak(line) {
    if (muted || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    stopVoice();
    const utterance = new SpeechSynthesisUtterance(line);
    utterance.lang = 'en-PH';
    utterance.rate = 0.95;
    utterance.volume = 0.75;
    // Prefer an installed voice; text dialogue remains available on every device.
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.lang === 'en-PH' && v.localService)
      || voices.find(v => v.lang.startsWith('en') && v.localService) || null;
    window.speechSynthesis.speak(utterance);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopVoice(); });

  return {
    playBgm,
    playSfx,
    toggleMute,
    speak,
    stopVoice,
    get muted() {
      return muted;
    },
  };
}
