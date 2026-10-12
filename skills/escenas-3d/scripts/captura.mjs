#!/usr/bin/env node
// Captura una escena Three.js con Chromium headless (CDP) y devuelve su diagnostico.
// WebGL2 por software (SwiftShader): sin GPU ni servidor web.
//
//   node scripts/captura.mjs escena.html [captura.png] [-t 2.5] [-v iso] [--sin-panel]
//                             [--ancho 1400] [--alto 900] [--presupuesto 20000]
//                             [--formato compacto|completo] [--tema claro|oscuro]
//                             [--estado "clave:valor,clave:valor"] [--exhibicion] [--todo]
//
// -t fija el instante de la animacion (?t=); -t -1 no lo fija.
// --formato compacto (700x394, una ventana estrecha) o completo (1400x788): con el mandan
//   estas medidas, no --ancho/--alto. Fuerza ?formato=. --tema fuerza ?tema=.
// --estado se pasa como ?e=. --todo genera 4 PNG (formato x tema): OUT-compacto-claro.png,
//   OUT-compacto-oscuro.png, OUT-completo-claro.png, OUT-completo-oscuro.png.
// --exhibicion pasa ?exhibicion=1: modo «Solo la figura» (sin textos ni menús, con mini barra); con --todo
//   lo aplica a los 4 PNG.
// --presupuesto: ms maximos de espera a que la escena este lista (20000: hay escenas que simulan
//   algo al arrancar). Se imprime `listo en X ms` para notar los arranques lentos.
//
// Por que CDP y no --screenshot/--dump-dom: --window-size no es el viewport (descuenta ~143 px de
// marco) y --screenshot maqueta con la ventana entera mientras --dump-dom ve el viewport reducido,
// asi que los paneles inferiores caen en sitios distintos. Con Emulation.setDeviceMetricsOverride
// el viewport es exacto y #diag y la captura salen de la MISMA pagina.
// Navegador: el de la variable CHROME si se da; si no, Chromium o Chrome en el PATH o en su ruta habitual
// de macOS y Windows.
// Sin --allow-file-access-from-files: la escena se abre como con doble clic, y lo que ahi no carga tampoco carga aqui.
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, isAbsolute, join, delimiter } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'node:net';

const USO = 'uso: node captura.mjs escena.html [captura.png] [-t 2.5] [-v iso] [--sin-panel] [--formato compacto|completo] [--tema claro|oscuro] [--estado k:v,k:v] [--exhibicion] [--todo]';
const o = { t: '1.5', vista: '', sinPanel: false, ancho: 1400, alto: 900, presupuesto: 20000, formato: '', tema: '', estado: '', exhibicion: false, todo: false };
const pos = [];
const a = process.argv.slice(2);
for (let i = 0; i < a.length; i++) {
  const k = a[i], v = () => a[++i];
  if (k === '-t') o.t = v();
  else if (k === '-v' || k === '--vista') o.vista = v();
  else if (k === '--sin-panel') o.sinPanel = true;
  else if (k === '--ancho') o.ancho = +v();
  else if (k === '--alto') o.alto = +v();
  else if (k === '--presupuesto') o.presupuesto = +v();
  else if (k === '--formato') o.formato = v();
  else if (k === '--tema') o.tema = v();
  else if (k === '--estado') o.estado = v();
  else if (k === '--exhibicion') o.exhibicion = true;
  else if (k === '--todo') o.todo = true;
  else pos.push(k);
}
const entrada = pos[0];
let salida = pos[1] ?? 'captura.png';
if (!entrada || !existsSync(entrada)) { console.log(USO); process.exit(2); }
if (!['', 'compacto', 'completo'].includes(o.formato)) { console.log(`--formato admite compacto o completo, no "${o.formato}"`); process.exit(2); }
if (!['', 'claro', 'oscuro'].includes(o.tema)) { console.log(`--tema admite claro u oscuro, no "${o.tema}"`); process.exit(2); }

const enPath = n => (process.env.PATH ?? '').split(delimiter).filter(Boolean).map(d => join(d, n)).find(existsSync);
const nav = process.env.CHROME
  || ['chromium', 'google-chrome-stable', 'google-chrome', 'chromium-browser', 'chrome.exe'].map(enPath).find(Boolean)
  || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium',
      ...[process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean)
        .map(d => join(d, 'Google', 'Chrome', 'Application', 'chrome.exe'))].find(existsSync);
if (!nav || !existsSync(nav)) { console.log('No se encontro Chromium ni Chrome. Instala uno o pon su ruta en la variable CHROME.'); process.exit(2); }

const absoluta = p => isAbsolute(p) ? p : resolve(process.cwd(), p);
const sleep = ms => new Promise(r => setTimeout(r, ms));
// Umbrales del texto medido en #diag (relato= corto=): 320 caracteres ≈ tres frases con cifras;
// 110 ≈ una línea de la barra inferior compacta (700 px).
const MAX_RELATO = 320, MAX_CORTO = 110;
const MEDIDAS = { compacto: [700, 394], completo: [1400, 788] };

function armarUrl(fmt, tema) {
  const p = new URLSearchParams({ captura: '1' });
  if (+o.t >= 0) p.append('t', o.t);
  if (o.vista) p.append('vista', o.vista);
  if (o.sinPanel) p.append('panel', '0');
  if (fmt) p.append('formato', fmt);
  if (tema) p.append('tema', tema);
  if (o.estado) p.append('e', o.estado);
  if (o.exhibicion) p.append('exhibicion', '1');
  return pathToFileURL(absoluta(entrada)).href + '?' + p;
}

const puertoLibre = () => new Promise((ok, ko) => {
  const s = createServer(); s.on('error', ko);
  s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => ok(p)); });
});

const nCapturas = o.todo ? 4 : 1;
const WINDOWS = process.platform === 'win32';
const perfil = mkdtempSync(resolve(tmpdir(), 'captura-'));
const puerto = await puertoLibre();
const proc = spawn(nav, ['--headless=new', '--disable-gpu', '--enable-unsafe-swiftshader', '--no-sandbox',
  '--hide-scrollbars', `--remote-debugging-port=${puerto}`, `--user-data-dir=${perfil}`, 'about:blank'],
  { stdio: 'ignore', detached: !WINDOWS, windowsHide: true });   // fuera de Windows, grupo propio: se mata con todos sus hijos
const matar = () => WINDOWS ? execFileSync('taskkill', ['/pid', String(proc.pid), '/T', '/F'], { stdio: 'ignore' })
  : process.kill(-proc.pid, 'SIGKILL');
let terminado = false;
const limpiar = () => { if (terminado) return; terminado = true; try { matar(); } catch {}
  try { rmSync(perfil, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch {} };
process.on('exit', limpiar);
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => { limpiar(); process.exit(130); });
// Tope duro: si algo se cuelga, se mata el navegador.
const vigilante = setTimeout(() => { console.error('AVISO: el navegador no termino y hubo que matarlo.'); limpiar(); process.exit(1); },
  (o.presupuesto + 20000) * nCapturas);
vigilante.unref();

let ws, id = 0; const pend = new Map();
async function conectar() {
  let pagina;
  for (let i = 0; i < 100 && !pagina; i++) {
    try { pagina = (await (await fetch(`http://127.0.0.1:${puerto}/json`)).json()).find(t => t.type === 'page'); } catch {}
    if (!pagina) await sleep(150);
  }
  if (!pagina) throw new Error('el navegador no abrio el puerto de depuracion');
  ws = new WebSocket(pagina.webSocketDebuggerUrl);
  await new Promise((r, ko) => { ws.onopen = r; ws.onerror = ko; });
  ws.onmessage = m => { const d = JSON.parse(m.data); const f = d.id && pend.get(d.id); if (f) { pend.delete(d.id); f(d); } };
}
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluar = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result?.result?.value;

const LEE = `(() => { const d = document.getElementById('diag');
  return JSON.stringify({ listo: document.body?.dataset.listo === '1', diag: d ? d.textContent.trim() : '' }); })()`;

let msListo = 0;
async function esperarEscena() {
  const ini = Date.now(), fin = ini + o.presupuesto;
  let est = { listo: false, diag: '' };
  while (Date.now() < fin) {
    try { est = JSON.parse(await evaluar(LEE) ?? '{}'); } catch {}
    if (est.listo || /^(OK|ERROR)/.test(est.diag ?? '')) break;
    await sleep(100);
  }
  msListo = Date.now() - ini;
  // Tras `listo` el modo captura tarda unos fotogramas en congelar el lienzo en un <img>.
  await sleep(300);
  try { est = JSON.parse(await evaluar(LEE) ?? '{}'); } catch {}
  return est.diag ?? '';
}

async function capturar(png, fmt, tema, rotulo) {
  const donde = `formato=${fmt || 'auto'} tema=${tema || 'auto'}${o.estado ? ` estado=${o.estado}` : ''}${o.exhibicion ? ' exhibicion' : ''}`;
  const [w, h] = MEDIDAS[fmt] ?? [o.ancho, o.alto];
  const url = armarUrl(fmt, tema);
  console.log(`url: ${url}`);
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  // Las páginas del kit siguen el tema del sistema, no ?tema=.
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: tema === 'claro' ? 'light' : tema === 'oscuro' ? 'dark' : '' }] });
  await send('Page.navigate', { url: 'about:blank' });   // evita leer el documento anterior
  await sleep(50);
  await send('Page.navigate', { url });
  let diag = await esperarEscena();
  const s = await send('Page.captureScreenshot', { format: 'png' });
  if (s.result?.data) {
    const buf = Buffer.from(s.result.data, 'base64');
    writeFileSync(png, buf);
    console.log(`PNG ${buf.readUInt32BE(16)} x ${buf.readUInt32BE(20)} -> ${rotulo ?? png}`);
  } else console.log(`AVISO: no se genero ${png}`);
  if (!diag) diag = '(no se pudo leer #diag: la escena no llego a escribirlo en el presupuesto)';
  console.log(`diag: ${diag}`);
  const agotado = msListo >= o.presupuesto;
  console.log(`listo en ${msListo} ms${agotado ? ' (presupuesto agotado: la escena no llegó a estar lista)' : ''}`);
  if (/^(ERROR|sin-arrancar)/.test(diag)) {
    console.log('\nLa escena NO arranco. Mira la captura: la plantilla pinta el motivo en rojo.');
    return false;
  }
  const largos = diag.match(/\brelato=(\d+) corto=(\d+)/);
  if (largos) {
    if (+largos[1] > MAX_RELATO) console.log(`AVISO: relato de ${largos[1]} caracteres (máx. ${MAX_RELATO}) en ${donde}: condénsalo, el detalle va en la página de tema.`);
    if (+largos[2] > MAX_CORTO) console.log(`AVISO: relato corto de ${largos[2]} caracteres (máx. ${MAX_CORTO}) en ${donde}: no cabe en una línea de la barra compacta.`);
  }
  if (diag.startsWith('MONTADO')) {
    console.log('Three.js cargo, pero el diag se leyo antes del primer fotograma.');
    console.log('No es un fallo por si mismo: confirmalo abriendo el PNG.');
  }
  return true;
}

let codigo = 0;
try {
  await conectar();
  await send('Page.enable'); await send('Runtime.enable');
  if (o.todo) {
    const base = absoluta(salida.replace(/\.png$/, ''));
    for (const fmt of ['compacto', 'completo']) for (const tema of ['claro', 'oscuro']) {
      console.log(`== ${fmt} / ${tema} ==`);
      if (!await capturar(`${base}-${fmt}-${tema}.png`, fmt, tema)) codigo = 1;
    }
  } else if (!await capturar(absoluta(salida), o.formato, o.tema, salida)) codigo = 1;
} catch (e) {
  console.error(`ERROR de captura: ${e.message}`);
  codigo = 1;
} finally {
  try { ws?.close(); } catch {}
  limpiar();
}
process.exit(codigo);
