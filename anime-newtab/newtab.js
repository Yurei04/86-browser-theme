/* ── 86 — EIGHTY-SIX // TERMINAL SYSTEM // BLUE ─── */

// ── Grid canvas ───────────────────────────────────────
(function initGrid() {
  const canvas = document.getElementById('grid');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    drawGrid();
  }

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const CELL = 48;

    ctx.strokeStyle = 'rgba(0,170,255,0.08)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += CELL) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += CELL) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    ctx.fillStyle = 'rgba(0,170,255,0.14)';
    for (let x = 0; x <= canvas.width; x += CELL) {
      for (let y = 0; y <= canvas.height; y += CELL) {
        ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
      }
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.strokeStyle = 'rgba(0,170,255,0.24)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - 44, cy); ctx.lineTo(cx + 44, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - 44); ctx.lineTo(cx, cy + 44); ctx.stroke();

    ctx.fillStyle = 'rgba(0,170,255,0.6)';
    ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2); ctx.fill();
  }

  window.addEventListener('resize', resize);
  resize();
})();

// ── Clock & date ──────────────────────────────────────
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  document.getElementById('clock').textContent      = `${h}:${m}`;
  document.getElementById('clockSec').textContent   = s;
  document.getElementById('cornerTime').textContent = `${h}:${m}:${s}`;

  const DAYS   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const dateStr = `${DAYS[now.getDay()]} ${String(now.getDate()).padStart(2,'0')}.${MONTHS[now.getMonth()]}.${now.getFullYear()}`;

  document.getElementById('dateStr').textContent   = dateStr;
  document.getElementById('stripDate').textContent = dateStr;
}
updateClock();
setInterval(updateClock, 1000);

// ── CPU mock readout ──────────────────────────────────
(function initCpu() {
  const el = document.getElementById('cpuVal');
  function tick() {
    if (el) el.textContent = (Math.random() * 12 + 2).toFixed(1) + '%';
  }
  tick();
  setInterval(tick, 2600);
})();

// ── Shortcuts ─────────────────────────────────────────
(function initShortcuts() {
  const MAX = 7;
  const STORAGE_KEY = 'hud_shortcuts_v1';

  const DEFAULT_SHORTCUTS = [
    { label: 'GOOGLE',    url: 'https://www.google.com' },
    { label: 'YOUTUBE',   url: 'https://www.youtube.com' },
    { label: 'GITHUB',    url: 'https://github.com' },
    { label: 'REDDIT',    url: 'https://www.reddit.com' },
    { label: 'GMAIL',     url: 'https://mail.google.com' },
  ];

  // Load from storage or fall back to defaults
  function loadShortcuts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return DEFAULT_SHORTCUTS.slice();
  }

  function saveShortcuts(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch(e) {}
  }

  // Extract domain for favicon fetching
  function getDomain(url) {
    try { return new URL(url).hostname; } catch(e) { return ''; }
  }

  function getFaviconUrl(url) {
    const domain = getDomain(url);
    return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : '';
  }

  // Render the list
  function render(list) {
    const container = document.getElementById('shortcutsList');
    const countEl   = document.getElementById('shortcutCount');
    container.innerHTML = '';

    list.forEach((sc, idx) => {
      const a = document.createElement('a');
      a.className = 'sc-item';
      a.href = sc.url;
      a.target = '_self';
      a.style.animationDelay = `${0.06 + idx * 0.06}s`;
      a.title = sc.label;

      // Prevent default on remove click bubbling to link
      a.addEventListener('click', (e) => {
        if (e.target.closest('.sc-remove')) e.preventDefault();
      });

      // Icon wrap
      const wrap = document.createElement('div');
      wrap.className = 'sc-icon-wrap';

      const faviconUrl = getFaviconUrl(sc.url);
      if (faviconUrl) {
        const img = document.createElement('img');
        img.src = faviconUrl;
        img.alt = sc.label;
        img.onerror = () => {
          img.style.display = 'none';
          const letter = document.createElement('span');
          letter.className = 'sc-icon-letter';
          letter.textContent = (sc.label || '?').charAt(0);
          wrap.appendChild(letter);
        };
        wrap.appendChild(img);
      } else {
        const letter = document.createElement('span');
        letter.className = 'sc-icon-letter';
        letter.textContent = (sc.label || '?').charAt(0);
        wrap.appendChild(letter);
      }

      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'sc-remove';
      removeBtn.title = 'Remove';
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', () => {
        const updated = list.filter((_, i) => i !== idx);
        saveShortcuts(updated);
        render(updated);
      });

      wrap.appendChild(removeBtn);
      a.appendChild(wrap);

      // Label
      const labelEl = document.createElement('span');
      labelEl.className = 'sc-label';
      labelEl.textContent = sc.label;
      a.appendChild(labelEl);

      container.appendChild(a);
    });

    // Add (+) button if under limit
    if (list.length < MAX) {
      const addBtn = document.createElement('button');
      addBtn.className = 'sc-add-btn';
      addBtn.title = 'Add shortcut';
      addBtn.textContent = '+';
      addBtn.addEventListener('click', () => openModal(list));
      container.appendChild(addBtn);
    }

    // Update counter
    if (countEl) countEl.textContent = `${list.length} / ${MAX}`;
  }

  // ── Add shortcut modal ──────────────────────────────
  const modal     = document.getElementById('scModal');
  const urlInput  = document.getElementById('scUrl');
  const nameInput = document.getElementById('scName');
  const confirmBtn = document.getElementById('scConfirm');
  const cancelBtn  = document.getElementById('scCancel');

  function openModal(currentList) {
    urlInput.value  = '';
    nameInput.value = '';
    modal.classList.add('open');
    modal.removeAttribute('aria-hidden');
    setTimeout(() => urlInput.focus(), 60);

    // Store reference so confirm can use it
    modal._list = currentList;
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function confirmAdd() {
    const rawUrl  = urlInput.value.trim();
    const rawName = nameInput.value.trim();
    if (!rawUrl) { urlInput.focus(); return; }

    let url = rawUrl;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    const label = (rawName || getDomain(url).replace(/^www\./, '')).toUpperCase().slice(0, 10);
    const updated = [...(modal._list || []), { label, url }];
    saveShortcuts(updated);
    render(updated);
    closeModal();
  }

  confirmBtn.addEventListener('click', confirmAdd);
  cancelBtn.addEventListener('click', closeModal);

  urlInput.addEventListener('keydown',  (e) => { if (e.key === 'Enter') { e.preventDefault(); nameInput.focus(); } });
  nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); confirmAdd(); } });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Initial render
  render(loadShortcuts());
})();

// ── Footer tip popup ──────────────────────────────────
(function initFooterTip() {
  const tipBtn   = document.getElementById('footerTipBtn');
  const tipModal = document.getElementById('footerModal');
  const closeBtn = document.getElementById('footerClose');

  function openTip() {
    tipModal.classList.add('open');
    tipModal.removeAttribute('aria-hidden');
  }
  function closeTip() {
    tipModal.classList.remove('open');
    tipModal.setAttribute('aria-hidden', 'true');
  }

  tipBtn.addEventListener('click', openTip);
  closeBtn.addEventListener('click', closeTip);
  tipModal.addEventListener('click', (e) => { if (e.target === tipModal) closeTip(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tipModal.classList.contains('open')) closeTip();
  });
})();

// ── Auto-focus search ─────────────────────────────────
setTimeout(() => { document.getElementById('searchInput').focus(); }, 200);