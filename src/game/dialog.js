// Typewriter RPG Dialog UI controller with Faceset portraits and page progression.

export function createDialogUI(audio) {
  const overlay = document.getElementById('dialog-overlay');
  const speakerEl = document.getElementById('dialog-speaker');
  const portraitEl = document.getElementById('dialog-portrait');
  const textEl = document.getElementById('dialog-text');
  const choicesEl = document.getElementById('dialog-choices');
  const nextHintEl = document.getElementById('dialog-next-hint');

  let pages = [];
  let pageIndex = 0;
  let fullText = '';
  let charIndex = 0;
  let typingTimer = null;
  let isOpen = false;
  let onCloseCallback = null;

  function renderChar() {
    if (charIndex < fullText.length) {
      charIndex += 2;
      textEl.textContent = fullText.slice(0, charIndex);
    } else {
      clearInterval(typingTimer);
      typingTimer = null;
    }
  }

  function showPage(idx) {
    const page = pages[idx];
    if (!page) {
      close();
      return;
    }
    speakerEl.textContent = page.speaker || 'Campus Notice';
    if (page.faceUrl) {
      portraitEl.src = page.faceUrl;
      portraitEl.parentElement.classList.remove('hidden');
    } else {
      portraitEl.parentElement.classList.add('hidden');
    }

    fullText = page.text || '';
    charIndex = 0;
    textEl.textContent = '';
    choicesEl.innerHTML = '';
    choicesEl.classList.add('hidden');

    if (typingTimer) clearInterval(typingTimer);
    typingTimer = setInterval(renderChar, 18);

    nextHintEl.innerHTML =
      idx < pages.length - 1
        ? 'Press <kbd>E</kbd> / <kbd>Space</kbd> or Click for Next ▾'
        : 'Press <kbd>E</kbd> / <kbd>Space</kbd> or Click to Finish ✓';
    if (window.matchMedia('(pointer: coarse), (max-width: 700px)').matches) {
      nextHintEl.textContent = idx < pages.length - 1 ? 'Tap here or press A to continue ▾' : 'Tap here or press A to finish ✓';
    }
  }

  function open(dialogPages, defaultFaceUrl = null, onClose = null) {
    pages = dialogPages.map((p) => ({
      ...p,
      faceUrl: p.faceUrl ?? defaultFaceUrl,
    }));
    pageIndex = 0;
    isOpen = true;
    onCloseCallback = onClose;
    overlay.classList.remove('hidden');
    audio?.playSfx('menuOpen');
    showPage(0);
  }

  function advance() {
    if (!isOpen) return;
    if (typingTimer) {
      clearInterval(typingTimer);
      typingTimer = null;
      textEl.textContent = fullText;
      return;
    }

    const current = pages[pageIndex];
    if (current?.onFinish) {
      current.onFinish();
    }

    if (pageIndex + 1 < pages.length) {
      pageIndex += 1;
      audio?.playSfx('blip');
      showPage(pageIndex);
    } else {
      close();
    }
  }

  function close() {
    if (typingTimer) {
      clearInterval(typingTimer);
      typingTimer = null;
    }
    isOpen = false;
    overlay.classList.add('hidden');
    if (onCloseCallback) {
      const fn = onCloseCallback;
      onCloseCallback = null;
      fn();
    }
  }

  overlay.addEventListener('click', () => advance());

  return {
    open,
    advance,
    close,
    get isOpen() {
      return isOpen;
    },
  };
}
