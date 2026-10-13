// Generador de imágenes para Facebook (1080×1350, 4:5) a partir de una frase.
// Uso: node fbimg.js <spec.json> [salida.png]
// El spec se convierte en HTML (out/<nombre>.html) y después se renderiza a PNG con Chromium.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");

const W = 1080;
const H = 1350;
const ROOT = __dirname;
const FONTS = path.resolve(ROOT, "../../public/fonts");

// Paletas aprobadas (sin amarillo). Cada post usa UNA paleta y sus cuatro tonos rotan en la palabra clave.
const PALETAS = {
  rojo: { bg: "#0B0B0D", ink: "#F4F2EE", tones: ["#E8383E", "#F2595E", "#CBCAC8", "#FFFFFF"] },
  oldmoney: { bg: "#1E1C1B", ink: "#F2EFE8", tones: ["#B0484C", "#9A9590", "#D9D5CE", "#7A1E22"] },
  elegant: { bg: "#EEE5D3", ink: "#14142B", tones: ["#222052", "#55568F", "#B7B7B7", "#8A6E45"] },
  azul: { bg: "#061D33", ink: "#F6F5EE", tones: ["#68899C", "#CED9D8", "#3B7EA8", "#D90B1A"] },
  verde: { bg: "#0A140B", ink: "#EEF5EA", tones: ["#9DD65A", "#B7D5D2", "#2C7411", "#E0F2C8"] },
};

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Resalta la palabra clave dentro del texto, con el tono de la paleta
function conClave(texto, clave, tono, estilo = "") {
  const t = esc(texto);
  if (!clave) return t;
  const k = esc(clave);
  const re = new RegExp(`(${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i");
  return t.replace(re, `<span class="key" style="color:${tono};${estilo}">$1</span>`);
}

function base(p) {
  return `
  @font-face { font-family: "Sans"; src: url("${FONTS}/inter-tight-latin-800-normal.woff2"); font-weight: 800; }
  @font-face { font-family: "Sans"; src: url("${FONTS}/inter-tight-latin-600-normal.woff2"); font-weight: 600; }
  @font-face { font-family: "Serif"; src: url("${FONTS}/instrument-serif-latin-400-italic.woff2"); font-style: italic; }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
  body { background: ${p.bg}; color: ${p.ink}; font-family: "Sans", sans-serif; position: relative; }
  .glow { position: absolute; left: -200px; top: -260px; width: 1480px; height: 1120px; border-radius: 50%;
          background: radial-gradient(closest-side, ${p.tones[0]}33, ${p.tones[0]}00 100%); }
  .wrap { position: absolute; inset: 120px 110px; display: flex; flex-direction: column; justify-content: center; }
  .kicker { font-weight: 600; font-size: 34px; letter-spacing: 6px; text-transform: uppercase; opacity: .6; margin-bottom: 40px; }
  .key { font-style: normal; }
  .brand { position: absolute; left: 110px; right: 110px; bottom: 80px; display: flex; justify-content: space-between;
           font-weight: 600; font-size: 28px; letter-spacing: 3px; opacity: .55; }
`;
}

// Formato 1 · Pregunta: una pregunta grande que incomoda; una palabra en color.
function pregunta(s, p) {
  return `<div class="glow"></div>
  <div class="wrap">
    ${s.contexto ? `<div class="kicker">${esc(s.contexto)}</div>` : ""}
    <div style="font-weight:800; font-size:${s.tam || 118}px; line-height:1.04; letter-spacing:-3px;">
      ${conClave(s.texto, s.clave, p.tones[0])}
    </div>
  </div>`;
}

// Formato 2 · Contraste: "Lo que dices" frente a "Lo que haces". Separado por una línea.
function contraste(s, p) {
  return `<div class="glow"></div>
  <div class="wrap">
    <div style="font-weight:600; font-size:44px; opacity:.6; margin-bottom:18px;">${esc(s.a_etiqueta || "Lo que dices")}</div>
    <div style="font-weight:800; font-size:96px; line-height:1.08; letter-spacing:-2px; margin-bottom:56px;">${esc(s.a)}</div>
    <div style="height:3px; width:220px; background:${p.tones[0]}; margin-bottom:56px;"></div>
    <div style="font-weight:600; font-size:44px; opacity:.6; margin-bottom:18px;">${esc(s.b_etiqueta || "Lo que haces")}</div>
    <div style="font-weight:800; font-size:96px; line-height:1.08; letter-spacing:-2px;">${conClave(s.b, s.clave, p.tones[1])}</div>
  </div>`;
}

// Formato 3 · Lista: tres puntos numerados, la última en la palabra clave.
function lista(s, p) {
  const items = (s.items || []).slice(0, 4);
  return `<div class="glow"></div>
  <div class="wrap">
    ${s.titulo ? `<div style="font-weight:800; font-size:80px; line-height:1.05; letter-spacing:-2px; margin-bottom:72px;">${conClave(s.titulo, s.clave, p.tones[0])}</div>` : ""}
    ${items
      .map(
        (it, k) => `<div style="display:flex; gap:36px; align-items:baseline; margin-bottom:46px;">
          <div style="font-family:Serif; font-style:italic; font-size:120px; color:${p.tones[k % p.tones.length]}; line-height:.9; min-width:110px;">${k + 1}</div>
          <div style="font-weight:600; font-size:56px; line-height:1.18; letter-spacing:-1px;">${esc(it)}</div>
        </div>`,
      )
      .join("")}
  </div>`;
}

// Formato 4 · Cita: frase en serif itálica con la palabra clave en color.
function cita(s, p) {
  return `<div class="glow"></div>
  <div class="wrap">
    <div style="font-family:Serif; font-style:italic; font-size:${s.tam || 124}px; line-height:1.08; letter-spacing:-1px;">
      “${conClave(s.texto, s.clave, p.tones[0], "font-style:italic;")}”
    </div>
    ${s.autor ? `<div style="font-weight:600; font-size:38px; letter-spacing:4px; text-transform:uppercase; margin-top:64px; opacity:.6;">${esc(s.autor)}</div>` : ""}
  </div>`;
}


// Objetos 3D-brillantes en SVG (sin fotos ni logos de terceros). viewBox -300..300.
const METAL = `<linearGradient id="met" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#BDBDBD"/><stop offset=".55" stop-color="#5E5E5E"/><stop offset="1" stop-color="#E6E6E6"/></linearGradient>`;
const RED = `<linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF7A7E"/><stop offset=".5" stop-color="#D90B1A"/><stop offset="1" stop-color="#4A0306"/></linearGradient>`;
const OBJETOS = {
  reloj: `<defs>${RED}<radialGradient id="face" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#E4E4E4"/><stop offset="1" stop-color="#8A8A8A"/></radialGradient></defs>
    <ellipse cx="0" cy="250" rx="200" ry="26" fill="#000" opacity=".5"/>
    <circle cx="-190" cy="-210" r="82" fill="url(#red)"/><circle cx="190" cy="-210" r="82" fill="url(#red)"/>
    <line x1="-120" y1="-160" x2="-150" y2="-110" stroke="#8A0A10" stroke-width="22" stroke-linecap="round"/><line x1="120" y1="-160" x2="150" y2="-110" stroke="#8A0A10" stroke-width="22" stroke-linecap="round"/>
    <circle r="250" fill="url(#red)"/><circle r="206" fill="url(#face)"/>
    ${Array.from({ length: 12 }, (_, k) => `<line x1="0" y1="-186" x2="0" y2="${k % 3 ? -172 : -158}" stroke="#141414" stroke-width="${k % 3 ? 5 : 10}" transform="rotate(${k * 30})"/>`).join("")}
    <line x1="0" y1="0" x2="0" y2="-118" stroke="#141414" stroke-width="18" stroke-linecap="round" transform="rotate(-62)"/>
    <line x1="0" y1="0" x2="0" y2="-168" stroke="#141414" stroke-width="10" stroke-linecap="round" transform="rotate(88)"/>
    <line x1="0" y1="0" x2="0" y2="-190" stroke="#D90B1A" stroke-width="5" stroke-linecap="round" transform="rotate(-150)"/>
    <circle r="16" fill="#D90B1A"/>`,
  ciclo: `<defs>${METAL}</defs>
    <ellipse cx="0" cy="250" rx="200" ry="24" fill="#000" opacity=".5"/>
    <path d="M-170 -40 A190 190 0 0 1 170 -40" fill="none" stroke="url(#met)" stroke-width="70"/>
    <polygon points="130,-60 214,-60 176,12" fill="url(#met)"/>
    <path d="M170 40 A190 190 0 0 1 -170 40" fill="none" stroke="url(#met)" stroke-width="70"/>
    <polygon points="-130,60 -214,60 -176,-12" fill="url(#met)"/>
    <path d="M-170 -40 A190 190 0 0 1 170 -40" fill="none" stroke="#D90B1A" stroke-width="6" opacity=".7" transform="translate(0 -6)"/>`,
  cohete: `<defs>${RED}<linearGradient id="cw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3C4A57"/><stop offset=".5" stop-color="#C9D6E0"/><stop offset="1" stop-color="#3C4A57"/></linearGradient></defs>
    <g transform="translate(0 40) rotate(-28)">
      <path d="M-60 120 L-150 240 L-60 210 Z" fill="url(#red)"/><path d="M60 120 L150 240 L60 210 Z" fill="url(#red)"/>
      <path d="M0 -260 C95 -170 118 -40 118 90 L-118 90 C-118 -40 -95 -170 0 -260 Z" fill="url(#red)"/>
      <path d="M0 -260 C-18 -200 -26 -140 -24 -90 L-118 90 C-118 -40 -95 -170 0 -260 Z" fill="#000" opacity=".25"/>
      <circle cx="0" cy="-30" r="48" fill="url(#cw)" stroke="#2B2B2B" stroke-width="10"/>
      <rect x="-50" y="90" width="100" height="44" rx="10" fill="#2B2B2B"/>
      <path d="M-40 134 Q0 200 40 134 Q0 170 -40 134" fill="#FF7A7E" opacity=".9"/>
    </g>`,
};

// Formato 5 · Objeto: titular arriba con una palabra en caja roja; objeto brillante como metáfora abajo.
function objeto(s, p) {
  const svg = OBJETOS[s.objeto] || OBJETOS.reloj;
  const tone = p.tones[0];
  const tex = s.texto.replace(/[.¿?¡!]/g, "");
  const k = s.clave || "";
  const re = new RegExp(`(${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i");
  const titular = esc(tex).replace(re, `<span style="background:${tone};color:#FFFFFF;padding:0 14px;border-radius:6px;">$1</span>`);
  return `<div class="glow" style="top:300px;left:90px;width:900px;height:900px;"></div>
  <div style="position:absolute; left:90px; right:90px; top:130px; text-align:center;">
    <div style="font-weight:800; font-size:${s.tam || 104}px; line-height:1.02; letter-spacing:-2px; text-transform:uppercase;">${titular}</div>
    ${s.sub ? `<div style="font-weight:600; font-size:40px; margin-top:26px; opacity:.75;">${esc(s.sub)}</div>` : ""}
  </div>
  ${s.imagen
    ? `<img src="file://${path.resolve(ROOT, s.imagen)}" style="position:absolute; left:172px; top:478px; width:736px; height:920px; object-fit:cover; mix-blend-mode:screen; -webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%, #000 58%, transparent 100%); mask-image:radial-gradient(ellipse 50% 50% at 50% 50%, #000 58%, transparent 100%);">`
    : `<svg viewBox="-300 -300 600 600" width="560" height="560" style="position:absolute; left:260px; top:560px;">${svg}</svg>`}`;
}

const FORMATOS = { pregunta, contraste, lista, cita, objeto };

function html(s) {
  const p = PALETAS[s.paleta] || PALETAS.rojo;
  const f = FORMATOS[s.formato];
  if (!f) throw new Error(`Formato desconocido: ${s.formato}. Usa: ${Object.keys(FORMATOS).join(", ")}`);
  return `<!doctype html><html><head><meta charset="utf-8"><style>${base(p)}</style></head>
  <body>${f(s, p)}
    ${s.marca ? `<div class="brand"><span>${esc(s.marca)}</span></div>` : ""}
  </body></html>`;
}

async function main() {
  const specPath = process.argv[2];
  if (!specPath) throw new Error("Uso: node fbimg.js <spec.json> [salida.png]");
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const nombre = path.basename(specPath, ".json");
  const outDir = path.join(ROOT, "out");
  fs.mkdirSync(outDir, { recursive: true });
  const htmlPath = path.join(outDir, `${nombre}.html`);
  fs.writeFileSync(htmlPath, html(spec));
  const png = process.argv[3] || path.join(outDir, `${nombre}.png`);

  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto(`file://${htmlPath}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: png, type: "png", clip: { x: 0, y: 0, width: W, height: H } });
  await browser.close();
  console.log(`HTML: ${htmlPath}\nPNG:  ${png}`);
}

if (require.main === module) main().catch((e) => { console.error(e.message); process.exit(1); });
module.exports = { html, PALETAS, FORMATOS };
