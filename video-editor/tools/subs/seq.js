// node seq.js seq.json → seq_<n>.png ; línea: {segs:[[texto,fuente,tamaño,color]], x, y, anchor, glow, sw}
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const fonts = JSON.parse(fs.readFileSync(path.join(__dirname, 'fonts.json')));
const seq = JSON.parse(fs.readFileSync(process.argv[2]));
const faces = Object.entries(fonts).map(([k, [f, st, w]]) => `@font-face{font-family:'${k}';src:url('file://${f}');font-style:${st};font-weight:${w};}`).join('');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  let n = 0;
  for (const fr of seq) {
    n++;
    let defs = '<filter id="sh" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.55"/></filter>';
    const texts = fr.lines.map((l, i) => {
      if (l.glow) defs += `<filter id="g${i}" x="-20%" y="-60%" width="140%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${l.glow}" flood-opacity="0.5" result="a"/><feDropShadow in="a" dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.55"/></filter>`;
      const spans = l.segs.map(([t, fam, size, color, ls = 0]) => { const [, st, w] = fonts[fam]; return `<tspan font-family="${fam}" font-style="${st}" font-weight="${w}" font-size="${size}" fill="${color}" letter-spacing="${ls}" ${l.sw ? `stroke="${color}" stroke-width="${l.sw}" stroke-linejoin="round"` : ''}>${t}</tspan>`; }).join('');
      return `<text ${l.rot ? `transform="rotate(${l.rot} ${l.x} ${l.y})"` : ''} x="${l.x}" y="${l.y}" text-anchor="${l.anchor || 'start'}" filter="url(#${l.glow ? 'g' + i : 'sh'})">${spans}</text>`;
    }).join('');
    const html = `<html><head><style>${faces} body{margin:0}</style></head><body><svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs><image href="file://${fr.bg}" width="1080" height="1920"/>${texts}</svg></body></html>`;
    const hp = path.join(__dirname, `seq_${n}.html`); fs.writeFileSync(hp, html);
    await p.goto('file://' + hp); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    // margen premium: si alguna línea sale de [110, 970], se reduce el grupo entero hasta entrar
    const fit = await p.evaluate(() => { const ts=[...document.querySelectorAll('text')]; let k=1; for (const t of ts){ const bb=t.getBBox(); const L=bb.x, R=bb.x+bb.width; if (L<110) k=Math.min(k,(t.getAttribute('text-anchor')==='end'? (parseFloat(t.getAttribute('x'))-110)/bb.width : k)); if (R>970) { const a=t.getAttribute('text-anchor')||'start'; const x=parseFloat(t.getAttribute('x')); const avail = a==='start'? 970-x : a==='middle'? 2*Math.min(970-x,x-110) : bb.width; k=Math.min(k, avail/bb.width); } } if (k<1) ts.forEach(t=>t.querySelectorAll('tspan').forEach(sp=>sp.setAttribute('font-size', parseFloat(sp.getAttribute('font-size'))*k))); return [k, ts.map(t=>{const b=t.getBBox(); return [Math.round(b.x), Math.round(b.x+b.width)];})]; });
    console.log('frame', n, 'escala', fit[0].toFixed(2), JSON.stringify(fit[1]));
    await p.screenshot({ path: path.join(__dirname, `seq_${n}.png`) });
  }
  await b.close();
})();
