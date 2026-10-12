/**
 * Valida una escena .html de la skill escenas-3d antes de abrirla. Atrapa lo que produce un lienzo en blanco sin
 * decir por qué: el núcleo sin armar o viejo, un import que no existe, una API que ya no existe, o un nombre
 * del andamiaje redeclarado en CONTENIDO.
 *
 *   node validar.js escena.html
 *   node validar.js --reservados assets/laboratorio.html   lista los nombres del andamiaje
 *
 * El modo sale del contenido: con los marcadores «CONTENIDO (inicio)» y «CONTENIDO (fin)» de
 * assets/laboratorio.html es laboratorio; sin ellos, figura. Un marcador solo es FALLO.
 * Los imports pelados deben ser «three» o «three/addons/…», que es lo que provee el importmap de la propia
 * escena; los de «three/addons/» se piden al CDN para comprobar que existen.
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const args = process.argv.slice(2);
const soloReservados = args.includes("--reservados");
const ruta = args.find((a) => !a.startsWith("--"));
if (!ruta) { console.log("uso: node validar.js escena.html\n     node validar.js --reservados assets/laboratorio.html   (lista los nombres del andamiaje)"); process.exit(2); }
const archivo = fs.readFileSync(ruta, "utf8");

// La escena es el <script type="module"> con las marcas del NÚCLEO. Lo de entre las marcas es de assets/nucleo.js:
// se compara con él y el resto de comprobaciones mira solo lo que escribe la escena.
const NUCLEO_RE = /^[ \t]*\/\/ ── NÚCLEO \(inicio\)[^\n]*\n([\s\S]*?)^[ \t]*\/\/ ── NÚCLEO \(fin\)[^\n]*$/m;
const modulo = [...archivo.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((g) => NUCLEO_RE.test(g)) ?? "";
const nucleoEscrito = modulo.match(NUCLEO_RE)?.[1].trimEnd() ?? "";
const codigo = modulo.replace(NUCLEO_RE, "");

// Sin comentarios: la plantilla nombra las APIs prohibidas para explicarlas y no debe fallar por eso.
// El lookbehind respeta el "//" de las URL.
const sinComentarios = codigo
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/(?<![:"'\w])\/\/.*$/gm, "");

// Con su guion («── CONTENIDO (inicio) ──»): la cabecera de la escena también cita los nombres.
const MARCA_INI = /^[ \t]*\/\/ *─+ *CONTENIDO \(inicio\)/m, MARCA_FIN = /^[ \t]*\/\/ *─+ *CONTENIDO \(fin\)/m;
const tieneIni = MARCA_INI.test(codigo), tieneFin = MARCA_FIN.test(codigo);
const LAB = tieneIni || tieneFin;

// ── declaraciones del nivel superior de un guion ──────────────────────────
// Tokeniza (saltando comentarios, cadenas, plantillas y regex) para sacar los nombres declarados en el nivel superior
// (const/let/var, también desestructurados; function; class). Comprueba que CONTENIDO no redeclare nada del andamiaje:
// un nombre repetido es un SyntaxError y la escena queda en «sin-arrancar» sin mensaje.
function fichas(src) {
  const out = []; let i = 0, nl = false;
  const n = src.length, esId = (c) => /[A-Za-z0-9_$ -￿]/.test(c);
  const saltarCadena = (q) => { i++; while (i < n && src[i] !== q) i += src[i] === "\\" ? 2 : 1; i++; };
  const saltarPlantilla = () => {   // src[i] === "`"
    i++;
    while (i < n && src[i] !== "`") {
      if (src[i] === "\\") { i += 2; continue; }
      if (src[i] === "$" && src[i + 1] === "{") {
        i += 2; let d = 1;
        while (i < n && d) {
          const c = src[i];
          if (c === "{") { d++; i++; } else if (c === "}") { d--; i++; }
          else if (c === "'" || c === '"') saltarCadena(c);
          else if (c === "`") saltarPlantilla();
          else if (c === "/" && src[i + 1] === "/") { while (i < n && src[i] !== "\n") i++; }
          else if (c === "/" && src[i + 1] === "*") { i = src.indexOf("*/", i + 2) + 2 || n; }
          else i++;
        }
      } else i++;
    }
    i++;
  };
  const antesDeRegex = (f) => !f || (f.t === "p" && !/^[)\]}]$/.test(f.v)) || (f.t === "id" && /^(return|typeof|case|in|of|delete|void|throw|new|else|do|yield|await)$/.test(f.v));
  while (i < n) {
    const c = src[i];
    if (c === "\n") { nl = true; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === "/" && src[i + 1] === "/") { while (i < n && src[i] !== "\n") i++; continue; }
    if (c === "/" && src[i + 1] === "*") { const f = src.indexOf("*/", i + 2); const t = src.slice(i, f < 0 ? n : f); if (t.includes("\n")) nl = true; i = f < 0 ? n : f + 2; continue; }
    const ini = i, ficha = (t, v) => { out.push({ t, v, nl, pos: ini }); nl = false; };
    if (c === "'" || c === '"') { saltarCadena(c); ficha("s", "s"); continue; }
    if (c === "`") { saltarPlantilla(); ficha("s", "s"); continue; }
    if (c === "/" && antesDeRegex(out[out.length - 1])) {   // literal regex: hasta la / sin escapar fuera de [...]
      i++; let clase = false;
      while (i < n && (src[i] !== "/" || clase)) { if (src[i] === "\\") i++; else if (src[i] === "[") clase = true; else if (src[i] === "]") clase = false; i++; }
      i++; while (i < n && esId(src[i])) i++;
      ficha("s", "r"); continue;
    }
    if (esId(c)) { while (i < n && esId(src[i])) i++; ficha("id", src.slice(ini, i)); continue; }
    if (c === "." && src.startsWith("...", i)) { i += 3; ficha("p", "..."); continue; }
    if (c === "=" && src[i + 1] === ">") { i += 2; ficha("p", "=>"); continue; }
    i++; ficha("p", c);
  }
  return out;
}
const abre = { "(": 1, "[": 1, "{": 1 }, cierra = { ")": 1, "]": 1, "}": 1 };
// Profundidad de paréntesis y llaves al inicio de `src`: el laboratorio está dentro de montar(k), así que su
// andamiaje y CONTENIDO quedan a profundidad 1 y no a 0.
function profundidadEn(src) {
  return fichas(src).reduce((d, f) => (f.t !== "p" ? d : abre[f.v] ? d + 1 : cierra[f.v] ? d - 1 : d), 0);
}
// `niveles`: profundidades que cuentan como «nivel superior» del trozo analizado.
function declaradosArriba(src, niveles = [0]) {
  const f = fichas(src), res = [];
  const linea = (pos) => src.slice(0, pos).split("\n").length;
  // Salta un valor por defecto o inicializador: hasta `,` o `;` a nivel 0 (o fin de sentencia por salto de línea).
  const CONTINUA_DESPUES = /^[,=+\-*/&|?:(<>{[.%^!~]$|^=>$/, CONTINUA_ANTES = /^[.,?:+\-*/&|)\]}=<>%^]$/;
  const saltarExpr = (k, dentroPatron) => {
    let d = 0;
    for (; k < f.length; k++) {
      const x = f[k];
      if (x.t === "p") {
        if (abre[x.v]) d++;
        else if (cierra[x.v]) { if (d === 0) return k; d--; }
        else if (d === 0 && (x.v === "," || (x.v === ";" && !dentroPatron))) return k;
      }
      if (d === 0 && !dentroPatron && k > 0 && x.nl && !(f[k - 1].t === "p" && CONTINUA_DESPUES.test(f[k - 1].v)) &&
          !(x.t === "p" && CONTINUA_ANTES.test(x.v)) && !(x.t === "id" && /^(in|of|instanceof)$/.test(x.v))) return k;
    }
    return k;
  };
  // Un patrón (identificador, {…} o […]): añade los nombres que introduce y devuelve la posición siguiente.
  const patron = (k, tipo) => {
    const x = f[k];
    if (!x) return k;
    if (x.t === "id") { res.push({ nombre: x.v, tipo, linea: linea(x.pos) }); return k + 1; }
    if (x.v === "{" || x.v === "[") {
      const cierre = x.v === "{" ? "}" : "]"; k++;
      while (k < f.length && f[k].v !== cierre) {
        if (f[k].v === ",") { k++; continue; }
        if (f[k].v === "...") { k = patron(k + 1, tipo); continue; }
        if (x.v === "{") {
          const clave = f[k]; k++;
          if (clave.v === "[" && clave.t === "p") { k = saltarExpr(k, true); k++; }   // clave calculada
          if (f[k]?.v === ":") k = patron(k + 1, tipo);
          else if (clave.t === "id") res.push({ nombre: clave.v, tipo, linea: linea(clave.pos) });
        } else k = patron(k, tipo);
        if (f[k]?.v === "=") k = saltarExpr(k + 1, true);
      }
      return k + 1;
    }
    return k + 1;
  };
  let d = 0;
  for (let k = 0; k < f.length; k++) {
    const x = f[k];
    if (x.t === "p") { if (abre[x.v]) d++; else if (cierra[x.v]) d--; continue; }
    if (!niveles.includes(d) || x.t !== "id") continue;
    const p = f[k - 1], inicio = k === 0 || x.nl || (p && p.t === "p" && (p.v === ";" || p.v === "}")) || (p && p.v === "async");
    if (!inicio) continue;
    const sig = f[k + 1];
    if (/^(const|let|var)$/.test(x.v) && sig && (sig.t === "id" || sig.v === "{" || sig.v === "[")) {
      k++;
      for (;;) {
        k = patron(k, x.v);
        if (f[k]?.v === "=") k = saltarExpr(k + 1, false);
        if (f[k]?.v === ",") { k++; continue; }
        break;
      }
      k--;
    } else if (/^(function|class)$/.test(x.v)) {
      let j = k + 1; if (f[j]?.v === "*") j++;
      if (f[j]?.t === "id") res.push({ nombre: f[j].v, tipo: x.v, linea: linea(f[j].pos) });
    }
  }
  return res;
}

const fallos = [], avisos = [];
const exigir = (cond, msg) => { if (!cond) fallos.push(msg); };
const sugerir = (cond, msg) => { if (!cond) avisos.push(msg); };

// ── andamiaje de laboratorio ──────────────────────────────────────────────
// Andamiaje = lo anterior y lo posterior a los marcadores; CONTENIDO = lo del medio. En el módulo, todo está dentro de
// montar(k): por eso se cuentan las declaraciones a la profundidad de `prof` y no solo a la 0.
function partirGuion(g) {
  const a = g.match(MARCA_INI), b = g.match(MARCA_FIN);
  if (!a || !b || b.index < a.index) return null;
  return {
    ini: g.slice(0, a.index).split("\n").length,
    fin: g.slice(0, b.index).split("\n").length,
    prof: profundidadEn(g.slice(0, a.index)),
  };
}
function reservadosDe(g, p) {
  const m = new Map();
  for (const r of declaradosArriba(g, [0, p.prof])) {
    if (r.linea > p.ini && r.linea < p.fin) continue;
    if (!m.has(r.nombre)) m.set(r.nombre, r.tipo);
  }
  return m;
}

if (soloReservados) {
  const p = partirGuion(codigo);
  if (!p) { console.log("no encuentro los marcadores «CONTENIDO (inicio)» y «CONTENIDO (fin)»: ¿es assets/laboratorio.html?"); process.exit(2); }
  const nombres = [...reservadosDe(codigo, p).keys()].sort((x, y) => x.localeCompare(y, "en"));
  console.log(`Nombres del andamiaje que CONTENIDO no puede redeclarar (${nombres.length}):`);
  for (let i = 0; i < nombres.length; i += 8) console.log("  " + nombres.slice(i, i + 8).join(", ") + (i + 8 < nombres.length ? "," : ""));
  process.exit(0);
}

// ── nombre del archivo ────────────────────────────────────────────────────
// Se teclea en consola (captura.mjs) y va en el src del iframe de la nota: los espacios obligan a
// entrecomillar y a escapar con %20; las tildes viajan mal entre Windows, git y las URL.
const base = path.basename(ruta, path.extname(ruta));
// NFD separa la tilde de su letra y el rango la borra.
const limpio = base.normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
exigir(path.extname(ruta) === ".html", `"${path.basename(ruta)}" no es una escena .html: se copia de assets/figura.html o assets/laboratorio.html`);
exigir(base === limpio,
  `el nombre "${path.basename(ruta)}" tiene espacios, mayúsculas o acentos: renómbralo a "${limpio}.html" ` +
  `(el título con tildes va en la cabecera de la escena, no en el nombre del archivo)`);

// ── núcleo y arranque ─────────────────────────────────────────────────────
// Sin núcleo la escena no tiene cámara ni bucle: el lienzo queda en blanco. Uno viejo funciona, pero sin los arreglos.
const NUCLEO = fs.readFileSync(path.resolve(__dirname, "../assets/nucleo.js"), "utf8").trimEnd();
exigir(!!modulo, "no encuentro el <script type=\"module\"> con las marcas «NÚCLEO (inicio)» y «NÚCLEO (fin)»: copia la escena de assets/figura.html o assets/laboratorio.html");
if (modulo) {
  exigir(nucleoEscrito.length > 0, `el núcleo está vacío: ármalo con «node scripts/armar.mjs ${ruta}»`);
  if (nucleoEscrito.length > 0 && nucleoEscrito !== NUCLEO) avisos.push(`el núcleo no coincide con assets/nucleo.js: ponlo al día con «node scripts/armar.mjs ${ruta}»`);
}
exigir(/\bfunction\s+montar\s*\(/.test(sinComentarios) && /\barrancarEscena\s*\(\s*montar\s*\)/.test(sinComentarios),
  "falta el arranque: la escena define «function montar(k) {…}» y termina con «arrancarEscena(montar);», como en la plantilla");

// ── imports ───────────────────────────────────────────────────────────────
// El importmap va en la propia escena y provee «three» y «three/addons/».
const mapa = archivo.match(/<script type="importmap">([\s\S]*?)<\/script>/)?.[1] ?? "";
const addons = mapa.match(/"three\/addons\/"\s*:\s*"([^"]+)"/)?.[1];
const ver = mapa.match(/three@([\d.]+)\/build/)?.[1] ?? "?";
exigir(/"three"\s*:/.test(mapa) && !!addons, "falta el importmap con «three» y «three/addons/» en el <head>: cópialo de assets/figura.html");

const especificadores = new Set([
  ...[...(modulo.replace(/\/\*[\s\S]*?\*\//g, "")).matchAll(/\bimport\s+[\s\S]*?\bfrom\s*["']([^"']+)["']/g)].map((m) => m[1]),
  ...[...sinComentarios.matchAll(/\bimport\s*["']([^"']+)["']/g)].map((m) => m[1]),
  ...[...sinComentarios.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]),
]);

// Sin conexión no es posible saber si el archivo existe: null no es fallo, pero se avisa.
function existeEnCdn(url) {
  const r = spawnSync("curl", ["-s", "-I", "-o", "/dev/null", "-w", "%{http_code}", "-m", "8", url], { encoding: "utf8" });
  if (r.error || r.status !== 0) return null;
  const codigoHttp = r.stdout.trim();
  return codigoHttp === "200" ? true : codigoHttp === "404" ? false : null;
}

for (const esp of especificadores) {
  if (/^(\.|\/|https?:|data:)/.test(esp)) {
    if (/^\./.test(esp)) avisos.push(`import relativo "${esp}": el archivo deja de ser autocontenido`);
    continue;
  }
  if (esp === "three") continue;
  if (!esp.startsWith("three/addons/")) {
    fallos.push(`import "${esp}": el importmap de la escena solo provee «three» y «three/addons/…»`);
    continue;
  }
  if (!addons) continue;
  const r = existeEnCdn(addons + esp.slice("three/addons/".length));
  if (r === false) fallos.push(`el import "${esp}" no existe en three@${ver} (el CDN responde 404): revisa el nombre del archivo en examples/jsm`);
  else if (r === null) avisos.push(`no pude comprobar "${esp}": sin conexión al CDN`);
}

// ── API retirada ──────────────────────────────────────────────────────────
// Three.js borra de verdad lo que depreca: copiar un ejemplo antiguo revienta en la primera línea.
const RETIRADO = [
  [/\bnew\s+THREE\.Geometry\b/, "THREE.Geometry se eliminó: usa BufferGeometry"],
  [/\bTHREE\.Face3\b/, "THREE.Face3 se eliminó junto con Geometry"],
  [/\b(Plane|Box|Sphere|Cylinder|Circle|Cone|Torus|Ring|Icosahedron|Dodecahedron|Octahedron|Tetrahedron|Lathe|Tube|Extrude|Shape|Text|Polyhedron|TorusKnot)BufferGeometry\b/,
   "las clases *BufferGeometry se eliminaron: hoy se llaman sin el 'Buffer' (PlaneGeometry, BoxGeometry…)"],
  [/\.outputEncoding\b/, ".outputEncoding se eliminó: usa renderer.outputColorSpace = THREE.SRGBColorSpace"],
  [/\bTHREE\.(sRGBEncoding|LinearEncoding|GammaEncoding)\b/, "las constantes *Encoding se eliminaron: usa THREE.SRGBColorSpace / THREE.LinearSRGBColorSpace"],
  [/\.encoding\s*=/, "texture.encoding se eliminó: usa texture.colorSpace"],
  [/\.physicallyCorrectLights\b/, "physicallyCorrectLights se eliminó: hoy es el comportamiento por defecto"],
  [/\.useLegacyLights\b/, "useLegacyLights se eliminó (r165)"],
  [/\.gamma(Factor|Input|Output)\b/, "las propiedades gamma* se eliminaron"],
  [/\bWebGLMultisampleRenderTarget\b/, "WebGLMultisampleRenderTarget se eliminó: usa WebGLRenderTarget con samples"],
  [/\bTHREE\.CanvasRenderer\b/, "CanvasRenderer se eliminó hace muchas versiones"],
  [/\.applyMatrix\s*\(/, ".applyMatrix() se eliminó: usa .applyMatrix4()"],
  [/three\/examples\/js\//, "three/examples/js/ (guiones globales) ya no existe: usa three/addons/ como módulo"],
  [/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js/, "ese CDN sirve versiones antiguas: usa el importmap con jsdelivr"],
];
for (const [re, msg] of RETIRADO) if (re.test(sinComentarios)) fallos.push(msg);

// ── posprocesado ──────────────────────────────────────────────────────────
// Posprocesado y reflejos multiplican el coste por fotograma; los HDR pesan megas y abiertos con doble clic (file://) no cargan.
// RoomEnvironment NO está: se genera una vez con PMREM y da al metal su aspecto sin coste por fotograma.
const PROHIBIDO = ["EffectComposer", "UnrealBloomPass", "BokehPass", "SSRPass", "SSAOPass",
  "Reflector", "RGBELoader", "HDRLoader", "EXRLoader"];
for (const nombre of PROHIBIDO) {
  if (new RegExp("\\b" + nombre + "\\b").test(sinComentarios)) {
    fallos.push(`prohibido ${nombre} (posprocesado, reflejos o entorno HDR): ` +
      `cuesta demasiado por fotograma. Para metal creíble usa RoomEnvironment con PMREM, generado una vez`);
  }
}

// ── laboratorio: nombres reservados y texto ──────────────────────────────
if (LAB) {
  const p = tieneIni && tieneFin ? partirGuion(codigo) : null;
  if (!p) {
    fallos.push("el laboratorio necesita los dos marcadores «CONTENIDO (inicio)» y «CONTENIDO (fin)», en ese orden (como en assets/laboratorio.html)");
  } else {
    const reservados = reservadosDe(codigo, p);
    const vistos = new Set();
    for (const d of declaradosArriba(codigo, [p.prof]).filter((r) => r.linea > p.ini && r.linea < p.fin)) {
      if (!reservados.has(d.nombre) || vistos.has(d.nombre)) continue;
      vistos.add(d.nombre);
      fallos.push(`CONTENIDO redeclara "${d.nombre}" (${d.tipo}, línea ${d.linea}), que ya declara el andamiaje como ${reservados.get(d.nombre)}: ` +
        `el módulo no se ejecuta y la escena queda en «sin-arrancar» sin mensaje. Renómbralo (lista: node validar.js --reservados assets/laboratorio.html)`);
    }
  }

  // Solo el gancho es texto fijo (220 caracteres ≈ dos frases). Relato y relato corto dependen del estado: no se miden aquí.
  for (const g of sinComentarios.matchAll(/\bgancho\s*:\s*("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)/g)) {
    const t = g[1].slice(1, -1).replace(/\$\{[^}]*\}/g, "0000").replace(/\s+/g, " ").trim();
    sugerir(t.length <= 220, `el gancho tiene ${t.length} caracteres (máx. ~220, una o dos frases): la explicación va en la nota`);
  }
}

// ── hábitos que arruinan la escena sin romperla ───────────────────────────
// El núcleo ya pone el bucle de render, el tamaño y la órbita: la escena no los toca.
sugerir(!/requestAnimationFrame\s*\(/.test(sinComentarios),
  "usa requestAnimationFrame: el núcleo ya pone el bucle de render, y dos bucles duplican el coste por fotograma");
sugerir(!/\.(rotation|position)\.[xyz]\s*\+=/.test(sinComentarios),
  "hay animación acumulativa (rotation.y += …): depende de los fotogramas, así que ni ?t= ni las capturas son reproducibles. Escríbela en función de t.");

// ── informe ───────────────────────────────────────────────────────────────
console.log(`escena: ${ruta}`);
console.log(`modo: ${LAB ? "laboratorio" : "figura"}`);
console.log(`three ${ver} · imports: ${especificadores.size} · ${Math.round(archivo.length / 1024)} KB`);
if (avisos.length) console.log("\nAVISOS (" + avisos.length + "):\n- " + avisos.join("\n- "));
if (fallos.length) { console.log("\nFALLOS (" + fallos.length + "):\n- " + fallos.join("\n- ")); process.exit(1); }
console.log("\nTODO OK");
