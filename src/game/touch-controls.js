// Pointer capture keeps a held direction reliable when a finger leaves its button.
export function setupTouchControls({ setDirection, setRunning, action, back, journal, missions }) {
  const root = document.getElementById('touch-controls');
  const pointers = new Map();
  function sync() {
    const values = [...pointers.values()];
    setDirection(values.filter(v => v !== 'run').at(-1) || null);
    setRunning(values.includes('run'));
  }
  function bindHold(button, value) {
    button.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (value === 'run' && back()) return;
      button.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, value);
      button.classList.add('is-pressed');
      sync();
    });
    const release = e => {
      pointers.delete(e.pointerId);
      button.classList.remove('is-pressed');
      sync();
    };
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
  }
  root.querySelectorAll('[data-direction]').forEach(button => bindHold(button, button.dataset.direction));
  bindHold(document.getElementById('touch-b'), 'run');
  document.getElementById('touch-a').addEventListener('click', action);
  document.getElementById('touch-journal').addEventListener('click', journal);
  document.getElementById('touch-missions').addEventListener('click', missions);
  function clear() {
    pointers.clear();
    root.querySelectorAll('.is-pressed').forEach(button => button.classList.remove('is-pressed'));
    sync();
  }
  window.addEventListener('blur', clear);
  window.addEventListener('resize', clear);
  document.addEventListener('visibilitychange', clear);
  root.addEventListener('contextmenu', e => e.preventDefault());
  return { clear };
}
