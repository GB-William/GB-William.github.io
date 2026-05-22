const ProConverter = (() => {

  const CONVERSION_MAP = {
    mp4:{category:'video'}, mkv:{category:'video'}, mov:{category:'video'},
    avi:{category:'video'}, webm:{category:'video'}, flv:{category:'video'}, wmv:{category:'video'},
    mp3:{category:'audio'}, wav:{category:'audio'}, flac:{category:'audio'},
    ogg:{category:'audio'}, m4a:{category:'audio'}, aac:{category:'audio'},
    jpg:{category:'image'}, jpeg:{category:'image'}, png:{category:'image'},
    webp:{category:'image'}, gif:{category:'image'},
  };

  const TARGETS = {
    video: { mp4:{}, webm:{}, gif:{}, mp3:{}, wav:{}, aac:{} },
    audio: { mp3:{}, wav:{}, flac:{}, ogg:{}, aac:{}, m4a:{} },
    image: { jpg:{}, png:{}, webp:{}, gif:{} },
  };

  let ffmpeg = null;
  let initPromise = null;

  function getTargets(category) {
    return TARGETS[category] || {};
  }

  // ── Init FFmpeg ──────────────────────────────────────────
  function ensureInit() {
    if (initPromise) return initPromise;

    const initEl = document.getElementById('ffmpeg-init');
    const fillEl = document.getElementById('ffmpeg-init-fill');
    const labelEl = document.getElementById('ffmpeg-init-label');
    const dropEl = document.getElementById('drop-zone-pro');

    if (initEl) initEl.classList.add('visible');

    initPromise = (async () => {
      try {
        if (!window.FFmpegWASM) throw new Error('FFmpeg.wasm non chargé. Vérifier js/ffmpeg.js.');
        ffmpeg = new window.FFmpegWASM.FFmpeg();

        ffmpeg.on('progress', ({ progress }) => {
          const pct = Math.round(progress * 100);
          if (fillEl) fillEl.style.width = pct + '%';
          if (labelEl) labelEl.textContent = `Chargement FFmpeg… ${pct}%`;
        });

        if (fillEl) fillEl.style.width = '10%';
        if (labelEl) labelEl.textContent = 'Téléchargement du moteur vidéo (~30 Mo)…';

        await ffmpeg.load({
          coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd/ffmpeg-core.js',
          wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd/ffmpeg-core.wasm',
        });

        if (fillEl) fillEl.style.width = '100%';
        if (labelEl) labelEl.textContent = 'FFmpeg prêt !';

        setTimeout(() => {
          if (initEl) initEl.classList.remove('visible');
          if (dropEl) dropEl.style.display = '';
        }, 600);

      } catch (err) {
        if (initEl) initEl.classList.remove('visible');
        const errEl = document.getElementById('error-pro');
        if (errEl) {
          errEl.textContent = 'Erreur FFmpeg : ' + err.message;
          errEl.classList.add('visible');
        }
        throw err;
      }
    })();

    return initPromise;
  }

  // ── Conversion ───────────────────────────────────────────
  async function convert(file, targetFmt, opts, progress) {
    await ensureInit();

    const ext = file.name.split('.').pop().toLowerCase();
    const inputName = `input.${ext}`;
    const outputName = `output.${targetFmt}`;
    const category = CONVERSION_MAP[ext]?.category || 'video';

    progress(10, 'Écriture dans le FS virtuel…');
    const buf = await file.arrayBuffer();
    await ffmpeg.writeFile(inputName, new Uint8Array(buf));

    ffmpeg.on('log', ({ message }) => {
      console.log('[FFmpeg]', message);
    });
    ffmpeg.on('progress', ({ progress: p }) => {
      progress(10 + Math.round(p * 80), `Conversion… ${Math.round(p * 100)}%`);
    });

    const args = _buildArgs(inputName, outputName, targetFmt, category, opts);
    progress(15, 'Démarrage FFmpeg…');

    await ffmpeg['exec'](args);

    progress(92, 'Lecture du résultat…');
    const data = await ffmpeg.readFile(outputName);
    const mime = _getMime(targetFmt);
    const blob = new Blob([data.buffer], { type: mime });

    try { await ffmpeg.deleteFile(inputName); } catch {}
    try { await ffmpeg.deleteFile(outputName); } catch {}

    progress(100, 'Terminé !');
    return blob;
  }

  function _buildArgs(input, output, fmt, category, opts) {
    const args = ['-i', input];

    if (category === 'video') {
      if (fmt === 'mp4') {
        args.push('-c:v', 'libx264', '-c:a', 'aac', '-movflags', '+faststart');
        if (opts.fps) args.push('-r', String(opts.fps));
      } else if (fmt === 'webm') {
        args.push('-c:v', 'libvpx-vp9', '-c:a', 'libopus');
        if (opts.fps) args.push('-r', String(opts.fps));
      } else if (fmt === 'gif') {
        const fps = opts.fps || 15;
        args.push('-vf', `fps=${fps},scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`);
      } else if (['mp3','wav','aac'].includes(fmt)) {
        args.push('-vn');
        if (fmt === 'mp3') {
          args.push('-c:a', 'libmp3lame');
          if (opts.bitrate) args.push('-b:a', opts.bitrate + 'k');
        } else if (fmt === 'aac') {
          args.push('-c:a', 'aac');
        }
      }
    } else if (category === 'audio') {
      if (fmt === 'mp3') {
        args.push('-c:a', 'libmp3lame');
        if (opts.bitrate) args.push('-b:a', opts.bitrate + 'k');
      } else if (fmt === 'flac') {
        args.push('-c:a', 'flac');
      } else if (fmt === 'ogg') {
        args.push('-c:a', 'libvorbis');
      } else if (fmt === 'aac' || fmt === 'm4a') {
        args.push('-c:a', 'aac');
      } else if (fmt === 'wav') {
        args.push('-c:a', 'pcm_s16le');
      }
    } else if (category === 'image') {
      if (fmt === 'jpg') args.push('-q:v', '2');
    }

    args.push(output);
    return args;
  }

  function _getMime(fmt) {
    const mimes = {
      mp4:'video/mp4', webm:'video/webm', mkv:'video/x-matroska',
      gif:'image/gif', avi:'video/x-msvideo', mov:'video/quicktime',
      mp3:'audio/mpeg', wav:'audio/wav', flac:'audio/flac',
      ogg:'audio/ogg', aac:'audio/aac', m4a:'audio/mp4',
      jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', webp:'image/webp',
    };
    return mimes[fmt] || 'application/octet-stream';
  }

  return { CONVERSION_MAP, getTargets, ensureInit, convert };
})();
