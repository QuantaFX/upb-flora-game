// Resilient mobile D-pad and action button controller.
// Guarantees held buttons always release on pointerup, touchend, finger slide, or overlay open.
export function setupTouchControls({ setDirection, setRunning, action, back, journal, missions }) {
  const root = document.getElementById('touch-controls');
  const activePointers = new Map(); // pointerId -> { value, button }

  function sync() {
    let dir = null;
    let run = false;
    for (const entry of activePointers.values()) {
      if (entry.value === 'run') run = true;
      else dir = entry.value;
    }
    setDirection(dir);
    setRunning(run);
    // Sync visual .is-pressed state strictly from activePointers so a button can never stay stuck visually
    const pressedButtons = new Set([...activePointers.values()].map((e) => e.button));
    root.querySelectorAll('button').forEach((btn) => {
      btn.classList.toggle('is-pressed', pressedButtons.has(btn));
    });
  }

  function releasePointer(pointerId) {
    if (activePointers.has(pointerId)) {
      const entry = activePointers.get(pointerId);
      activePointers.delete(pointerId);
      entry?.button?.blur?.();
      sync();
    }
  }

  function releaseButton(button) {
    let changed = false;
    for (const [pid, entry] of activePointers.entries()) {
      if (entry.button === button) {
        activePointers.delete(pid);
        changed = true;
      }
    }
    button?.blur?.();
    if (changed) sync();
    else button?.classList.remove('is-pressed');
  }

  function clear() {
    if (activePointers.size === 0) {
      root.querySelectorAll('.is-pressed').forEach((b) => b.classList.remove('is-pressed'));
      setDirection(null);
      setRunning(false);
      return;
    }
    activePointers.clear();
    root.querySelectorAll('button').forEach((b) => {
      b.classList.remove('is-pressed');
      b.blur?.();
    });
    sync();
  }

  function bindHold(button, value) {
    if (!button) return;
    button.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (value === 'run' && back()) {
        clear();
        return;
      }
      // Clear any previous entry of the same category so no direction or run state can ever get orphaned
      for (const [pid, entry] of activePointers.entries()) {
        if ((value === 'run') === (entry.value === 'run')) {
          activePointers.delete(pid);
        }
      }
      try {
        if (button.setPointerCapture) button.setPointerCapture(e.pointerId);
      } catch {
        // Ignore synthetic events where pointerId cannot be captured
      }
      activePointers.set(e.pointerId, { value, button });
      sync();
    });

    const onRelease = (e) => {
      if (e?.pointerId !== undefined && activePointers.has(e.pointerId)) {
        releasePointer(e.pointerId);
      } else {
        releaseButton(button);
      }
      try {
        if (e?.pointerId !== undefined && button.hasPointerCapture?.(e.pointerId)) {
          button.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore
      }
    };

    button.addEventListener('pointerup', onRelease);
    button.addEventListener('pointercancel', onRelease);
    button.addEventListener('lostpointercapture', onRelease);
    button.addEventListener('touchend', () => releaseButton(button), { passive: true });
    button.addEventListener('touchcancel', () => releaseButton(button), { passive: true });
    button.addEventListener('mouseup', () => releaseButton(button));
    button.addEventListener('mouseleave', (e) => {
      if (!e.buttons) releaseButton(button);
    });
  }

  root.querySelectorAll('[data-direction]').forEach((button) =>
    bindHold(button, button.dataset.direction),
  );
  bindHold(document.getElementById('touch-b'), 'run');

  const bindTap = (id, fn) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      clear();
      btn.blur?.();
      fn();
    });
  };
  bindTap('touch-a', action);
  bindTap('touch-journal', journal);
  bindTap('touch-missions', missions);

  // Global safety listeners so lifting a finger anywhere on screen always releases held state
  window.addEventListener('pointerup', (e) => releasePointer(e.pointerId));
  window.addEventListener('pointercancel', (e) => releasePointer(e.pointerId));
  window.addEventListener(
    'touchend',
    (e) => {
      if (!e.touches || e.touches.length === 0) clear();
    },
    { passive: true },
  );
  window.addEventListener('touchcancel', clear, { passive: true });
  window.addEventListener('mouseup', clear);
  window.addEventListener('blur', clear);
  window.addEventListener('resize', clear);
  document.addEventListener('visibilitychange', clear);
  root.addEventListener('contextmenu', (e) => e.preventDefault());
  root.addEventListener('selectstart', (e) => e.preventDefault());

  return { clear };
}
