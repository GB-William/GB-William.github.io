const UI = (() => {

  function _el(id) { return document.getElementById(id); }

  function _formatSize(bytes) {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  }

  function _getFileIcon(ext) {
    const icons = {
      jpg:'🖼', jpeg:'🖼', png:'🖼', webp:'🖼', gif:'🖼', bmp:'🖼', avif:'🖼',
      tiff:'🖼', tif:'🖼', heic:'🖼', svg:'🖼', psd:'🖼',
      mp4:'🎬', mkv:'🎬', mov:'🎬', avi:'🎬', webm:'🎬', flv:'🎬', wmv:'🎬',
      mp3:'🎵', wav:'🎵', flac:'🎵', ogg:'🎵', m4a:'🎵', aac:'🎵',
      pdf:'📑', docx:'📝', odt:'📝', xlsx:'📊', csv:'📊',
      txt:'📄', md:'📄', html:'📄', json:'📋', yaml:'📋', yml:'📋',
      xml:'📋', srt:'💬', vtt:'💬',
      zip:'📦', tar:'📦', gz:'📦',
      js:'💻', ts:'💻', py:'💻', css:'💻', pptx:'📊'
    };
    return icons[ext] || '📄';
  }

  // ── Drop & drag ──────────────────────────────────────────
  function initDrop(tabId, onFile) {
    const zone = _el(`drop-zone-${tabId}`);
    const input = _el(`file-input-${tabId}`);
    if (!zone || !input) return;

    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    });
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (file) onFile(file);
      input.value = '';
    });

    _el(`reset-btn-${tabId}`)?.addEventListener('click', () => reset(tabId));
  }

  // ── Preview ──────────────────────────────────────────────
  function showPreview(file, category, tabId) {
    const wrap = _el(`preview-${tabId}`);
    if (!wrap) return;
    wrap.innerHTML = '';
    const url = URL.createObjectURL(file);
    let el;
    if (category === 'image') {
      el = document.createElement('img');
      el.src = url;
      el.alt = file.name;
      el.onload = () => URL.revokeObjectURL(url);
    } else if (category === 'video') {
      el = document.createElement('video');
      el.src = url;
      el.controls = true;
    } else if (category === 'audio') {
      el = document.createElement('audio');
      el.src = url;
      el.controls = true;
    }
    if (el) {
      wrap.appendChild(el);
      wrap.classList.add('visible');
    }
  }

  // ── File info ─────────────────────────────────────────────
  function showFileInfo(file, tabId) {
    const ext = file.name.split('.').pop().toLowerCase();
    const infoEl = _el(`file-info-${tabId}`);
    if (!infoEl) return;
    _el(`file-info-icon-${tabId}`).textContent = _getFileIcon(ext);
    _el(`file-info-name-${tabId}`).textContent = file.name;
    _el(`file-info-size-${tabId}`).textContent = _formatSize(file.size);
    infoEl.classList.add('visible');
  }

  function hideFileInfo(tabId) {
    _el(`file-info-${tabId}`)?.classList.remove('visible');
  }

  // ── Formats ──────────────────────────────────────────────
  function renderFormats(tabId, targetsObj, onSelect) {
    const section = _el(`formats-section-${tabId}`);
    const grid = _el(`formats-grid-${tabId}`);
    if (!section || !grid) return;
    grid.innerHTML = '';
    const formats = Object.keys(targetsObj);
    if (!formats.length) return;
    formats.forEach(fmt => {
      const pill = document.createElement('button');
      pill.className = 'format-pill';
      pill.textContent = fmt.toUpperCase();
      pill.dataset.fmt = fmt;
      pill.addEventListener('click', () => {
        grid.querySelectorAll('.format-pill').forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        onSelect(fmt);
      });
      grid.appendChild(pill);
    });
    section.classList.add('visible');
  }

  function clearFormats(tabId) {
    _el(`formats-section-${tabId}`)?.classList.remove('visible');
    const grid = _el(`formats-grid-${tabId}`);
    if (grid) grid.innerHTML = '';
  }

  // ── Options avancées ─────────────────────────────────────
  function renderAdvancedOptions(tabId, format, category) {
    const section = _el(`advanced-section-${tabId}`);
    const container = _el(`advanced-options-${tabId}`);
    if (!section || !container) return;
    container.innerHTML = '';

    const opts = [];

    // Qualité JPEG/WEBP
    if (['jpg', 'jpeg', 'webp'].includes(format)) {
      opts.push({ id: 'quality', label: 'Qualité', min: 10, max: 100, value: 85, unit: '%' });
    }
    // Vidéo → options vidéo
    if (category === 'video' && !['mp3','wav','aac','flac','ogg'].includes(format)) {
      opts.push({ id: 'fps', label: 'FPS', min: 1, max: 60, value: 30, unit: '' });
    }
    // Audio → bitrate
    if (['mp3','aac','ogg'].includes(format)) {
      opts.push({ id: 'bitrate', label: 'Bitrate', min: 64, max: 320, value: 192, unit: 'k' });
    }
    // GIF → fps
    if (format === 'gif') {
      opts.push({ id: 'fps', label: 'FPS', min: 1, max: 30, value: 15, unit: '' });
    }

    if (!opts.length) {
      section.classList.remove('visible');
      return;
    }

    opts.forEach(opt => {
      const row = document.createElement('div');
      row.className = 'option-row';
      row.innerHTML = `
        <span class="option-label">${opt.label}</span>
        <input type="range" id="opt-${tabId}-${opt.id}" min="${opt.min}" max="${opt.max}" value="${opt.value}">
        <span class="option-value" id="opt-val-${tabId}-${opt.id}">${opt.value}${opt.unit}</span>
      `;
      container.appendChild(row);
      const slider = row.querySelector('input');
      const valEl = row.querySelector('.option-value');
      slider.addEventListener('input', () => {
        valEl.textContent = slider.value + opt.unit;
      });
    });

    section.classList.add('visible');
  }

  function getOption(tabId, optId) {
    const el = _el(`opt-${tabId}-${optId}`);
    return el ? parseInt(el.value) : null;
  }

  function clearAdvancedOptions(tabId) {
    _el(`advanced-section-${tabId}`)?.classList.remove('visible');
    const c = _el(`advanced-options-${tabId}`);
    if (c) c.innerHTML = '';
  }

  // ── Bouton convertir ─────────────────────────────────────
  function showConvertBtn(tabId, onClick) {
    const btn = _el(`convert-btn-${tabId}`);
    if (!btn) return;
    btn.classList.add('visible');
    btn.disabled = false;
    btn.onclick = onClick;
  }

  function hideConvertBtn(tabId) {
    const btn = _el(`convert-btn-${tabId}`);
    if (btn) { btn.classList.remove('visible'); btn.disabled = false; }
  }

  // ── Progress ─────────────────────────────────────────────
  function setProgress(tabId, pct, label) {
    const wrap = _el(`progress-wrap-${tabId}`);
    const fill = _el(`progress-fill-${tabId}`);
    const lbl = _el(`progress-label-${tabId}`);
    if (!wrap) return;
    wrap.classList.add('visible');
    if (fill) fill.style.width = pct + '%';
    if (lbl) lbl.textContent = label || (pct + '%');
  }

  function hideProgress(tabId) {
    _el(`progress-wrap-${tabId}`)?.classList.remove('visible');
  }

  // ── Résultat ─────────────────────────────────────────────
  function showSuccess(tabId, blob, filename) {
    hideProgress(tabId);
    const wrap = _el(`result-${tabId}`);
    if (!wrap) return;
    wrap.classList.add('visible');
    const btn = _el(`download-btn-${tabId}`);
    if (!btn) return;
    const url = URL.createObjectURL(blob);
    btn.onclick = () => {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    };
    // Auto-click
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  // ── Erreur ───────────────────────────────────────────────
  function showError(tabId, msg) {
    hideProgress(tabId);
    const el = _el(`error-${tabId}`);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
  }

  // ── Reset complet ────────────────────────────────────────
  function reset(tabId) {
    hideProgress(tabId);
    hideFileInfo(tabId);
    clearFormats(tabId);
    clearAdvancedOptions(tabId);
    hideConvertBtn(tabId);

    const preview = _el(`preview-${tabId}`);
    if (preview) { preview.innerHTML = ''; preview.classList.remove('visible'); }

    const err = _el(`error-${tabId}`);
    if (err) { err.textContent = ''; err.classList.remove('visible'); }

    const result = _el(`result-${tabId}`);
    if (result) result.classList.remove('visible');
  }

  return {
    initDrop, showPreview, showFileInfo, hideFileInfo,
    renderFormats, clearFormats, renderAdvancedOptions, getOption, clearAdvancedOptions,
    showConvertBtn, hideConvertBtn,
    setProgress, hideProgress, showSuccess, showError, reset
  };
})();
