const LightConverter = (() => {

  // ── CDN libs ─────────────────────────────────────────────
  const CDN = {
    jspdf:       'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    pdfjs:       'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.mjs',
    pdflib:      'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js',
    mammoth:     'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
    docx:        'https://unpkg.com/docx@8.2.2/build/index.js',
    xlsx:        'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    utif:        'https://cdn.jsdelivr.net/npm/utif@3.1.0/UTIF.js',
    heic2any:    'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js',
    jszip:       'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    jsyaml:      'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js',
    html2canvas: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  };

  const _loaded = {};
  function loadScript(key) {
    if (_loaded[key]) return _loaded[key];
    _loaded[key] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = CDN[key];
      s.type = key === 'pdfjs' ? 'module' : 'text/javascript';
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Bibliothèque ${key} indisponible — vérifie ta connexion.`));
      document.head.appendChild(s);
    });
    return _loaded[key];
  }

  // ── Maps ─────────────────────────────────────────────────
  const CONVERSION_MAP = {
    jpg:{type:'image-static',category:'image'}, jpeg:{type:'image-static',category:'image'},
    png:{type:'image-static',category:'image'}, webp:{type:'image-static',category:'image'},
    gif:{type:'image-static',category:'image'}, bmp:{type:'image-static',category:'image'},
    avif:{type:'image-static',category:'image'}, ico:{type:'image-static',category:'image'},
    tiff:{type:'image-tiff',category:'image'}, tif:{type:'image-tiff',category:'image'},
    heic:{type:'image-heic',category:'image'}, svg:{type:'image-svg',category:'image'},
    psd:{type:'image-psd',category:'image'},
    pdf:{type:'pdf',category:'doc'}, docx:{type:'docx',category:'doc'}, odt:{type:'docx',category:'doc'},
    xlsx:{type:'xlsx',category:'data'}, csv:{type:'csv',category:'data'},
    txt:{type:'text',category:'text'}, md:{type:'text',category:'text'}, html:{type:'text',category:'text'},
    json:{type:'json',category:'data'}, yaml:{type:'yaml',category:'data'}, yml:{type:'yaml',category:'data'},
    xml:{type:'xml',category:'data'}, srt:{type:'subtitle',category:'doc'}, vtt:{type:'subtitle',category:'doc'},
    zip:{type:'zip',category:'archive'}, tar:{type:'tar',category:'archive'}, gz:{type:'gz',category:'archive'},
    js:{type:'code',category:'text'}, ts:{type:'code',category:'text'}, py:{type:'code',category:'text'},
    css:{type:'code',category:'text'}, pptx:{type:'pptx',category:'doc'},
  };

  const TARGETS_BY_TYPE = {
    'image-static': { jpg:{}, png:{}, webp:{}, gif:{}, bmp:{}, ico:{}, pdf:{} },
    'image-tiff':   { png:{}, jpg:{} },
    'image-heic':   { jpg:{}, png:{} },
    'image-svg':    { png:{}, jpg:{}, pdf:{} },
    'image-psd':    { png:{}, jpg:{} },
    'pdf':          { txt:{}, docx:{} },
    'docx':         { txt:{}, pdf:{} },
    'xlsx':         { csv:{}, json:{} },
    'csv':          { xlsx:{}, json:{} },
    'text':         { pdf:{}, docx:{} },
    'json':         { yaml:{}, csv:{} },
    'yaml':         { json:{} },
    'xml':          { json:{} },
    'subtitle':     { srt:{}, vtt:{}, txt:{} },
    'zip':          { txt:{} },
    'tar':          { txt:{} },
    'gz':           { txt:{} },
    'code':         { pdf:{}, txt:{} },
    'pptx':         { pdf:{}, txt:{} },
  };

  // ── Helpers Canvas ───────────────────────────────────────
  function _readFileAsArrayBuffer(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = e => res(e.target.result);
      r.onerror = rej;
      r.readAsArrayBuffer(file);
    });
  }

  function _readFileAsText(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = e => res(e.target.result);
      r.onerror = rej;
      r.readAsText(file, 'utf-8');
    });
  }

  function _loadImageFromBlob(blob) {
    return new Promise((res, rej) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.onload = () => { URL.revokeObjectURL(url); res(img); };
      img.onerror = rej;
      img.src = url;
    });
  }

  function _imageToCanvas(img, maxW = 4096) {
    const scale = img.width > maxW ? maxW / img.width : 1;
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    return c;
  }

  function _canvasToBlob(canvas, fmt, quality) {
    return new Promise(res => {
      const mime = fmt === 'jpg' ? 'image/jpeg' :
                   fmt === 'png' ? 'image/png' :
                   fmt === 'webp' ? 'image/webp' :
                   fmt === 'gif' ? 'image/gif' :
                   fmt === 'bmp' ? 'image/bmp' : 'image/png';
      canvas.toBlob(res, mime, quality ? quality / 100 : undefined);
    });
  }

  // ── ICO ──────────────────────────────────────────────────
  function _makeIco(canvas) {
    const sizes = [256, 128, 64, 48, 32, 16];
    const pngBuffers = sizes.map(sz => {
      const c = document.createElement('canvas');
      c.width = c.height = sz;
      c.getContext('2d').drawImage(canvas, 0, 0, sz, sz);
      let dataURL = c.toDataURL('image/png');
      const b64 = dataURL.split(',')[1];
      const bin = atob(b64);
      const buf = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
      return buf;
    });

    const count = sizes.length;
    const headerSize = 6 + 16 * count;
    let totalSize = headerSize;
    pngBuffers.forEach(b => totalSize += b.length);

    const buf = new ArrayBuffer(totalSize);
    const view = new DataView(buf);

    // ICONDIR
    view.setUint16(0, 0, true);
    view.setUint16(2, 1, true);
    view.setUint16(4, count, true);

    let offset = headerSize;
    pngBuffers.forEach((png, i) => {
      const sz = sizes[i];
      view.setUint8(6 + i*16 + 0, sz === 256 ? 0 : sz);
      view.setUint8(6 + i*16 + 1, sz === 256 ? 0 : sz);
      view.setUint8(6 + i*16 + 2, 0);
      view.setUint8(6 + i*16 + 3, 0);
      view.setUint16(6 + i*16 + 4, 1, true);
      view.setUint16(6 + i*16 + 6, 32, true);
      view.setUint32(6 + i*16 + 8, png.length, true);
      view.setUint32(6 + i*16 + 12, offset, true);
      new Uint8Array(buf).set(png, offset);
      offset += png.length;
    });

    return new Blob([buf], { type: 'image/x-icon' });
  }

  // ── Conversion images statiques ──────────────────────────
  async function _convertImageStatic(file, fmt, opts, progress) {
    progress(20, 'Chargement de l\'image…');
    const img = await _loadImageFromBlob(file);
    const canvas = _imageToCanvas(img);
    progress(60, 'Conversion…');

    if (fmt === 'ico') return _makeIco(canvas);
    if (fmt === 'pdf') {
      await loadScript('jspdf');
      const { jsPDF } = window.jspdf;
      const ratio = canvas.height / canvas.width;
      const pw = 210, ph = pw * ratio;
      const doc = new jsPDF({ orientation: ph > pw ? 'p' : 'l', unit: 'mm', format: [pw, ph] });
      doc.addImage(canvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, pw, ph);
      progress(90, 'Finalisation…');
      return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
    }
    progress(80, 'Encodage…');
    return _canvasToBlob(canvas, fmt, opts.quality);
  }

  // ── Conversion TIFF ──────────────────────────────────────
  async function _convertTiff(file, fmt, opts, progress) {
    progress(20, 'Chargement TIFF…');
    await loadScript('utif');
    const buf = await _readFileAsArrayBuffer(file);
    const ifds = UTIF.decode(buf);
    UTIF.decodeImage(buf, ifds[0]);
    const ifd = ifds[0];
    const rgba = UTIF.toRGBA8(ifd);
    const canvas = document.createElement('canvas');
    canvas.width = ifd.width; canvas.height = ifd.height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(ifd.width, ifd.height);
    imgData.data.set(rgba);
    ctx.putImageData(imgData, 0, 0);
    progress(70, 'Encodage…');
    if (fmt === 'pdf') {
      await loadScript('jspdf');
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.addImage(canvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, 210, 297);
      return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
    }
    return _canvasToBlob(canvas, fmt, opts.quality);
  }

  // ── Conversion HEIC ──────────────────────────────────────
  async function _convertHeic(file, fmt, opts, progress) {
    progress(20, 'Conversion HEIC…');
    await loadScript('heic2any');
    const outBlob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
    const blob = Array.isArray(outBlob) ? outBlob[0] : outBlob;
    if (fmt === 'jpg' || fmt === 'jpeg') return blob;
    progress(60, 'Post-traitement…');
    const img = await _loadImageFromBlob(blob);
    const canvas = _imageToCanvas(img);
    return _canvasToBlob(canvas, fmt, opts.quality);
  }

  // ── Conversion SVG ───────────────────────────────────────
  async function _convertSvg(file, fmt, opts, progress) {
    progress(20, 'Rendu SVG…');
    const text = await _readFileAsText(file);
    const svgBlob = new Blob([text], { type: 'image/svg+xml' });
    const img = await _loadImageFromBlob(svgBlob);
    const canvas = _imageToCanvas(img);
    progress(70, 'Encodage…');
    if (fmt === 'pdf') {
      await loadScript('jspdf');
      const { jsPDF } = window.jspdf;
      const ratio = canvas.height / canvas.width;
      const pw = 210, ph = pw * ratio;
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: [pw, ph] });
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pw, ph);
      return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
    }
    return _canvasToBlob(canvas, fmt, opts.quality);
  }

  // ── Conversion PSD ───────────────────────────────────────
  async function _convertPsd(file, fmt, opts, progress) {
    progress(20, 'Lecture PSD…');
    const buf = await _readFileAsArrayBuffer(file);
    const bytes = new Uint8Array(buf);
    let start = -1, end = -1;
    for (let i = 0; i < bytes.length - 3; i++) {
      if (bytes[i] === 0xFF && bytes[i+1] === 0xD8 && bytes[i+2] === 0xFF) { start = i; break; }
    }
    if (start !== -1) {
      for (let i = bytes.length - 2; i >= start; i--) {
        if (bytes[i] === 0xFF && bytes[i+1] === 0xD9) { end = i + 2; break; }
      }
    }
    if (start === -1 || end === -1) throw new Error('Impossible d\'extraire le preview du PSD.');
    const jpegBlob = new Blob([bytes.slice(start, end)], { type: 'image/jpeg' });
    progress(70, 'Encodage…');
    if (fmt === 'jpg') return jpegBlob;
    const img = await _loadImageFromBlob(jpegBlob);
    const canvas = _imageToCanvas(img);
    return _canvasToBlob(canvas, fmt, opts.quality);
  }

  // ── Conversion PDF ───────────────────────────────────────
  async function _convertPdf(file, fmt, opts, progress) {
    progress(10, 'Chargement PDF…');
    await loadScript('pdfjs');
    let attempts = 0;
    while (typeof window.pdfjsLib === 'undefined' && attempts < 50) {
      await new Promise(r => setTimeout(r, 100));
      attempts++;
    }
    if (typeof window.pdfjsLib === 'undefined') throw new Error('pdf.js non disponible.');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.mjs';

    const buf = await _readFileAsArrayBuffer(file);
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    const numPages = pdf.numPages;

    if (fmt === 'txt') {
      let text = '';
      for (let i = 1; i <= numPages; i++) {
        progress(10 + Math.round(80 * i / numPages), `Page ${i}/${numPages}…`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(s => s.str).join(' ') + '\n\n';
      }
      return new Blob([text], { type: 'text/plain;charset=utf-8' });
    }

    if (fmt === 'docx') {
      await loadScript('docx');
      let allText = '';
      for (let i = 1; i <= numPages; i++) {
        progress(10 + Math.round(60 * i / numPages), `Extraction page ${i}…`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        allText += content.items.map(s => s.str).join(' ') + '\n\n';
      }
      progress(80, 'Génération DOCX…');
      const { Document, Packer, Paragraph, TextRun } = window.docx;
      const doc = new Document({ sections: [{ children: allText.split('\n').map(line =>
        new Paragraph({ children: [new TextRun(line)] })
      )}] });
      const blob = await Packer.toBlob(doc);
      return blob;
    }

    throw new Error(`Conversion PDF → ${fmt} non supportée.`);
  }

  // ── Conversion DOCX ──────────────────────────────────────
  async function _convertDocx(file, fmt, opts, progress) {
    progress(20, 'Lecture DOCX…');
    await loadScript('mammoth');
    const buf = await _readFileAsArrayBuffer(file);

    if (fmt === 'txt') {
      const result = await mammoth.extractRawText({ arrayBuffer: buf });
      return new Blob([result.value], { type: 'text/plain;charset=utf-8' });
    }

    if (fmt === 'pdf') {
      progress(40, 'Extraction texte…');
      const result = await mammoth.extractRawText({ arrayBuffer: buf });
      await loadScript('jspdf');
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(result.value, 180);
      let y = 20;
      lines.forEach(line => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, 15, y);
        y += 7;
      });
      progress(90, 'Finalisation PDF…');
      return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
    }

    throw new Error(`Conversion DOCX → ${fmt} non supportée.`);
  }

  // ── Conversion XLSX ──────────────────────────────────────
  async function _convertXlsx(file, fmt, opts, progress) {
    progress(20, 'Lecture XLSX…');
    await loadScript('xlsx');
    const buf = await _readFileAsArrayBuffer(file);
    const wb = XLSX.read(buf, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    progress(60, 'Conversion…');

    if (fmt === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(ws);
      return new Blob([csv], { type: 'text/csv;charset=utf-8' });
    }
    if (fmt === 'json') {
      const json = XLSX.utils.sheet_to_json(ws);
      return new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    }
    throw new Error(`Conversion XLSX → ${fmt} non supportée.`);
  }

  // ── Conversion CSV ───────────────────────────────────────
  async function _convertCsv(file, fmt, opts, progress) {
    progress(20, 'Lecture CSV…');
    const text = await _readFileAsText(file);
    await loadScript('xlsx');
    const ws = XLSX.utils.csv_to_sheet(text);
    progress(60, 'Conversion…');

    if (fmt === 'xlsx') {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
      return new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }
    if (fmt === 'json') {
      const json = XLSX.utils.sheet_to_json(ws);
      return new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    }
    throw new Error(`Conversion CSV → ${fmt} non supportée.`);
  }

  // ── Conversion Texte ─────────────────────────────────────
  async function _convertText(file, fmt, opts, progress) {
    progress(20, 'Lecture fichier…');
    const text = await _readFileAsText(file);
    progress(50, 'Conversion…');

    if (fmt === 'txt') {
      return new Blob([text], { type: 'text/plain;charset=utf-8' });
    }
    if (fmt === 'pdf') {
      await loadScript('jspdf');
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(text, 180);
      let y = 20;
      lines.forEach(line => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, 15, y);
        y += 7;
      });
      progress(90, 'Finalisation PDF…');
      return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
    }
    if (fmt === 'docx') {
      await loadScript('docx');
      const { Document, Packer, Paragraph, TextRun } = window.docx;
      const doc = new Document({ sections: [{ children: text.split('\n').map(line =>
        new Paragraph({ children: [new TextRun(line)] })
      )}] });
      return await Packer.toBlob(doc);
    }
    throw new Error(`Conversion texte → ${fmt} non supportée.`);
  }

  // ── Conversion JSON ──────────────────────────────────────
  async function _convertJson(file, fmt, opts, progress) {
    progress(20, 'Lecture JSON…');
    const text = await _readFileAsText(file);
    const data = JSON.parse(text);
    progress(50, 'Conversion…');

    if (fmt === 'yaml') {
      await loadScript('jsyaml');
      return new Blob([jsyaml.dump(data)], { type: 'text/yaml;charset=utf-8' });
    }
    if (fmt === 'csv') {
      if (!Array.isArray(data)) throw new Error('Le JSON doit être un tableau pour la conversion CSV.');
      await loadScript('xlsx');
      const ws = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(ws);
      return new Blob([csv], { type: 'text/csv;charset=utf-8' });
    }
    throw new Error(`Conversion JSON → ${fmt} non supportée.`);
  }

  // ── Conversion YAML ──────────────────────────────────────
  async function _convertYaml(file, fmt, opts, progress) {
    progress(20, 'Lecture YAML…');
    await loadScript('jsyaml');
    const text = await _readFileAsText(file);
    const data = jsyaml.load(text);
    progress(60, 'Conversion…');
    if (fmt === 'json') {
      return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    }
    throw new Error(`Conversion YAML → ${fmt} non supportée.`);
  }

  // ── Conversion XML ───────────────────────────────────────
  async function _convertXml(file, fmt, opts, progress) {
    progress(20, 'Lecture XML…');
    const text = await _readFileAsText(file);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    progress(50, 'Conversion…');

    function xmlToObj(node) {
      if (node.nodeType === 3) return node.nodeValue.trim();
      const obj = {};
      for (const child of node.childNodes) {
        if (child.nodeType === 1) {
          const key = child.tagName;
          const val = xmlToObj(child);
          if (obj[key] !== undefined) {
            if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
            obj[key].push(val);
          } else { obj[key] = val; }
        }
      }
      return obj;
    }

    if (fmt === 'json') {
      const obj = xmlToObj(xmlDoc.documentElement);
      return new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    }
    throw new Error(`Conversion XML → ${fmt} non supportée.`);
  }

  // ── Conversion Sous-titres ───────────────────────────────
  async function _convertSubtitle(file, fmt, opts, progress) {
    progress(20, 'Lecture sous-titres…');
    const text = await _readFileAsText(file);
    const ext = file.name.split('.').pop().toLowerCase();
    progress(50, 'Conversion…');

    if (fmt === 'txt') {
      const lines = text.split('\n').filter(l => {
        if (/^\d+$/.test(l.trim())) return false;
        if (/-->/.test(l)) return false;
        if (l.trim().startsWith('WEBVTT')) return false;
        if (/^\d{2}:\d{2}/.test(l.trim())) return false;
        return l.trim() !== '';
      });
      return new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    }

    if (ext === 'srt' && fmt === 'vtt') {
      const vtt = 'WEBVTT\n\n' + text.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
      return new Blob([vtt], { type: 'text/vtt;charset=utf-8' });
    }
    if (ext === 'vtt' && fmt === 'srt') {
      const srt = text.replace(/^WEBVTT.*\n\n/, '').replace(/(\d{2}:\d{2}:\d{2})\.(\d{3})/g, '$1,$2');
      return new Blob([srt], { type: 'text/plain;charset=utf-8' });
    }
    return new Blob([text], { type: 'text/plain;charset=utf-8' });
  }

  // ── Conversion Archives ──────────────────────────────────
  async function _convertArchive(file, fmt, opts, progress) {
    progress(20, 'Lecture archive…');
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'zip' && fmt === 'txt') {
      await loadScript('jszip');
      const buf = await _readFileAsArrayBuffer(file);
      const zip = await JSZip.loadAsync(buf);
      const names = Object.keys(zip.files).sort();
      const lines = [`Contenu de ${file.name} (${names.length} fichiers):\n`];
      names.forEach(n => {
        const f = zip.files[n];
        lines.push((f.dir ? '📁 ' : '📄 ') + n);
      });
      progress(90, 'Finalisation…');
      return new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    }

    const buf = await _readFileAsArrayBuffer(file);
    const bytes = new Uint8Array(buf);
    const names = [];

    if (ext === 'tar') {
      let offset = 0;
      while (offset + 512 <= bytes.length) {
        let name = '';
        for (let i = 0; i < 100 && bytes[offset+i]; i++) name += String.fromCharCode(bytes[offset+i]);
        if (!name) break;
        names.push(name);
        const sizeStr = new TextDecoder().decode(bytes.slice(offset+124, offset+136)).replace(/\0/g,'').trim();
        const size = parseInt(sizeStr, 8) || 0;
        offset += 512 + Math.ceil(size / 512) * 512;
      }
    }

    const content = ext === 'tar' && names.length
      ? `Contenu de ${file.name}:\n` + names.map(n => '📄 ' + n).join('\n')
      : `Archive ${file.name} (${(file.size/1024).toFixed(1)} Ko) — extraction non disponible pour ce format.`;

    return new Blob([content], { type: 'text/plain;charset=utf-8' });
  }

  // ── Conversion PPTX ──────────────────────────────────────
  async function _convertPptx(file, fmt, opts, progress) {
    progress(20, 'Lecture PPTX…');
    await loadScript('jszip');
    const buf = await _readFileAsArrayBuffer(file);
    const zip = await JSZip.loadAsync(buf);

    const slideFiles = Object.keys(zip.files)
      .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
      .sort((a, b) => {
        const na = parseInt(a.match(/\d+/)[0]);
        const nb = parseInt(b.match(/\d+/)[0]);
        return na - nb;
      });

    let allText = '';
    for (let i = 0; i < slideFiles.length; i++) {
      progress(20 + Math.round(60 * i / slideFiles.length), `Slide ${i+1}/${slideFiles.length}…`);
      const xml = await zip.files[slideFiles[i]].async('text');
      const stripped = xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      allText += `\n--- Slide ${i+1} ---\n${stripped}\n`;
    }

    if (fmt === 'txt') {
      return new Blob([allText], { type: 'text/plain;charset=utf-8' });
    }
    if (fmt === 'pdf') {
      await loadScript('jspdf');
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(allText, 180);
      let y = 20;
      lines.forEach(line => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, 15, y);
        y += 7;
      });
      return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
    }
    throw new Error(`Conversion PPTX → ${fmt} non supportée.`);
  }

  // ── Dispatcher principal ─────────────────────────────────
  async function convert(file, config, fmt, opts, progress) {
    switch (config.type) {
      case 'image-static': return _convertImageStatic(file, fmt, opts, progress);
      case 'image-tiff':   return _convertTiff(file, fmt, opts, progress);
      case 'image-heic':   return _convertHeic(file, fmt, opts, progress);
      case 'image-svg':    return _convertSvg(file, fmt, opts, progress);
      case 'image-psd':    return _convertPsd(file, fmt, opts, progress);
      case 'pdf':          return _convertPdf(file, fmt, opts, progress);
      case 'docx':         return _convertDocx(file, fmt, opts, progress);
      case 'xlsx':         return _convertXlsx(file, fmt, opts, progress);
      case 'csv':          return _convertCsv(file, fmt, opts, progress);
      case 'text':         return _convertText(file, fmt, opts, progress);
      case 'code':         return _convertText(file, fmt, opts, progress);
      case 'json':         return _convertJson(file, fmt, opts, progress);
      case 'yaml':         return _convertYaml(file, fmt, opts, progress);
      case 'xml':          return _convertXml(file, fmt, opts, progress);
      case 'subtitle':     return _convertSubtitle(file, fmt, opts, progress);
      case 'zip': case 'tar': case 'gz': return _convertArchive(file, fmt, opts, progress);
      case 'pptx':         return _convertPptx(file, fmt, opts, progress);
      default: throw new Error(`Type ${config.type} non géré.`);
    }
  }

  return { CONVERSION_MAP, TARGETS_BY_TYPE, convert };
})();
