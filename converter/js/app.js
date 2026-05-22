(() => {
  // ── Accent couleurs par onglet ───────────────────────────
  const ACCENT = {
    light: { var: '--cyan', soft: '--cyan-soft', glow: '--cyan-glow' },
    pro:   { var: '--violet', soft: '--violet-soft', glow: '--violet-glow' }
  };

  // ── État global ──────────────────────────────────────────
  const state = {
    light: { file: null, selectedFormat: null, config: null },
    pro:   { file: null, selectedFormat: null, config: null }
  };

  // ── Routing onglets ──────────────────────────────────────
  function activateTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });
    document.querySelectorAll('.panel').forEach(p => {
      p.classList.toggle('active', p.dataset.panel === tabId);
    });

    // Appliquer accent CSS sur le panel actif
    const acc = ACCENT[tabId];
    if (acc) {
      document.documentElement.style.setProperty('--accent', `var(${acc.var})`);
      document.documentElement.style.setProperty('--accent-soft', `var(${acc.soft})`);
      document.documentElement.style.setProperty('--accent-glow', `var(${acc.glow})`);
    }

    // Init FFmpeg au premier clic sur Pro
    if (tabId === 'pro') ProConverter.ensureInit();
  }

  // ── Gestion fichier reçu ─────────────────────────────────
  function handleFile(tabId, file) {
    const ext = file.name.split('.').pop().toLowerCase();

    if (tabId === 'light') {
      const config = LightConverter.CONVERSION_MAP[ext];
      if (!config) {
        UI.showError(tabId, `Format « .${ext} » non reconnu dans le moteur Light.`);
        return;
      }
      state.light.file = file;
      state.light.config = config;
      state.light.selectedFormat = null;

      UI.reset(tabId);
      UI.showFileInfo(file, tabId);
      if (['image', 'video', 'audio'].includes(config.category)) {
        UI.showPreview(file, config.category, tabId);
      }

      const targets = LightConverter.TARGETS_BY_TYPE[config.type] || {};
      UI.renderFormats(tabId, targets, fmt => {
        state.light.selectedFormat = fmt;
        UI.renderAdvancedOptions(tabId, fmt, config.category);
        UI.showConvertBtn(tabId, () => runLightConversion(file, config, fmt));
      });

    } else {
      const config = ProConverter.CONVERSION_MAP[ext];
      if (!config) {
        UI.showError(tabId, `Format « .${ext} » non reconnu dans le moteur Pro.`);
        return;
      }
      state.pro.file = file;
      state.pro.config = config;
      state.pro.selectedFormat = null;

      UI.reset(tabId);
      UI.showFileInfo(file, tabId);
      if (['image', 'video', 'audio'].includes(config.category)) {
        UI.showPreview(file, config.category, tabId);
      }

      const targets = ProConverter.getTargets(config.category);
      UI.renderFormats(tabId, targets, fmt => {
        state.pro.selectedFormat = fmt;
        UI.renderAdvancedOptions(tabId, fmt, config.category);
        UI.showConvertBtn(tabId, () => runProConversion(file, config, fmt));
      });
    }
  }

  // ── Conversions ──────────────────────────────────────────
  async function runLightConversion(file, config, fmt) {
    UI.hideConvertBtn('light');
    UI.setProgress('light', 5, 'Démarrage…');
    try {
      const quality = UI.getOption('light', 'quality');
      const opts = quality ? { quality } : {};
      const blob = await LightConverter.convert(file, config, fmt, opts, (pct, lbl) => {
        UI.setProgress('light', pct, lbl);
      });
      const outName = file.name.replace(/\.[^.]+$/, '') + '.' + fmt;
      UI.showSuccess('light', blob, outName);
    } catch (err) {
      UI.showError('light', err.message || 'Erreur lors de la conversion.');
    }
  }

  async function runProConversion(file, config, fmt) {
    UI.hideConvertBtn('pro');
    UI.setProgress('pro', 5, 'Démarrage…');
    try {
      const fps = UI.getOption('pro', 'fps');
      const bitrate = UI.getOption('pro', 'bitrate');
      const opts = {};
      if (fps) opts.fps = fps;
      if (bitrate) opts.bitrate = bitrate;
      const blob = await ProConverter.convert(file, fmt, opts, (pct, lbl) => {
        UI.setProgress('pro', pct, lbl);
      });
      const outName = file.name.replace(/\.[^.]+$/, '') + '.' + fmt;
      UI.showSuccess('pro', blob, outName);
    } catch (err) {
      UI.showError('pro', err.message || 'Erreur FFmpeg.');
    }
  }

  // ── Init ─────────────────────────────────────────────────
  function init() {
    activateTab('light');

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn.dataset.tab));
    });

    UI.initDrop('light', file => handleFile('light', file));
    UI.initDrop('pro',   file => handleFile('pro', file));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
