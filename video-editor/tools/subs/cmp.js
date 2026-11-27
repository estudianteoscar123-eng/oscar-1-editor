// node cmp.js spec.json → <id>_overlay.png (texto celeste sobre el original) y <id>_ours.png (nuestro sobre fondo limpio)
// línea: [texto, fuente, izquierda, derecha, línea_base, color, letter_spacing, grosor_trazo]; el tamaño se calcula para que el ancho coincida
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const fonts = JSON.parse(fs.readFileSync(path.join(__dirname, 'fonts.json')));
const specs = JSON.parse(fs.readFileSync(process.argv[2])); const SUF = process.argv[3] || '';
const faces = Object.entries(fonts).map(([k, [f, st, w]]) => `@font-face{font-family:'${k}';src:url('file://${f}');font-style:${st};font-weight:${w};}`).join('');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const out = {};
  for (const s of specs) {
    for (const mode of ['overlay', 'ours']) {
      const bg = mode === 'overlay' ? s.orig : s.clean;
      const texts = s.lines.map((l, i) => { const [t, fam, , , , color, ls = 0, sw = 0] = l; const [, st, w] = fonts[fam];
        const fill = mode === 'overlay' ? 'rgba(0,255,255,0.55)' : color;
        return `<text id="t${i}" x="0" y="0" font-family="${fam}" font-style="${st}" font-weight="${w}" font-size="100" letter-spacing="${ls}" fill="${fill}" ${sw ? `stroke="${fill}" stroke-width="${sw}" stroke-linejoin="round"` : ''} ${mode === 'overlay' ? '' : (l[8] ? `filter="url(#g${i})"` : 'filter="url(#sh)"')}>${t}</text>`; }).join('');
      const glows = s.lines.map((l, i) => l[8] ? `<filter id="g${i}" x="-20%" y="-60%" width="140%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${l[8]}" flood-opacity="0.5" result="a"/><feDropShadow in="a" dx="0" dy="3" stdDeviation="7" flood-color="#000" flood-opacity="0.5"/></filter>` : '').join('');
      const html = `<html><head><style>${faces} body{margin:0}</style></head><body><svg id="s" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg"><defs><filter id="sh" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.55"/></filter>${glows}</defs><image href="file://${bg}" width="1080" height="1920"/>${texts}</svg></body></html>`;
      const hp = path.join(__dirname, `${s.id}_${mode}.html`); fs.writeFileSync(hp, html);
      await p.goto('file://' + hp); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
      const sizes = await p.evaluate((lines) => lines.map((l, i) => {
        const el = document.getElementById('t' + i); const [, , L, Rr, base] = l;
        for (let k = 0; k < 3; k++) { const bb = el.getBBox(); const fs = parseFloat(el.getAttribute('font-size')); el.setAttribute('font-size', fs * (Rr - L) / bb.width); }
        el.setAttribute('y', base); const bb = el.getBBox(); el.setAttribute('x', L - bb.x); const top = l[8]; if (top) { const sy = (base - top) / (base - bb.y); el.setAttribute('transform', `translate(0 ${base}) scale(1 ${sy}) translate(0 ${-base})`); }
        return Math.round(parseFloat(el.getAttribute('font-size')));
      }), s.lines);
      out[s.id] = sizes;
      await p.screenshot({ path: path.join(__dirname, `${s.id}_${mode}${SUF}.png`) });
    }
  }
  console.log(JSON.stringify(out)); await b.close();
})();
