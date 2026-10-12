// Núcleo de las escenas 3D (skill escenas-3d): cámara, luces, órbita, etiquetas, vistas, tema y órdenes de la nota.
// scripts/armar.mjs lo copia dentro de cada escena .html: se edita aquí y se rearman las escenas.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

const NUCLEO_CSS = `
:root { color-scheme: light dark;
  --bg: #fbfbfa; --fg: #202326; --muted: #696f75; --accent: #0b6bcb;
  --red: #b3261e; --blue: #0b6bcb; --green: #2c6e3a; --orange: #a65a12; --magenta: #a2367f; --cyan: #0f7a80;
  --sans: system-ui, "Noto Sans", sans-serif; --mono: ui-monospace, "Noto Sans Mono", monospace; }
@media (prefers-color-scheme: dark) { :root:not([data-tema="claro"]) {
  --bg: #16181b; --fg: #e3e5e7; --muted: #9aa1a8; --accent: #6cb0ff;
  --red: #ff8a80; --blue: #6cb0ff; --green: #8bd49a; --orange: #f0a35e; --magenta: #e39bd0; --cyan: #6fd0d6; } }
:root[data-tema="oscuro"] {
  --bg: #16181b; --fg: #e3e5e7; --muted: #9aa1a8; --accent: #6cb0ff;
  --red: #ff8a80; --blue: #6cb0ff; --green: #8bd49a; --orange: #f0a35e; --magenta: #e39bd0; --cyan: #6fd0d6; }
:root { --mesa: color-mix(in srgb, var(--fg) 6.5%, var(--bg)); --hueco: color-mix(in srgb, var(--fg) 2%, var(--bg));
  --linea: color-mix(in srgb, var(--fg) 18%, transparent); }
html, body { height: 100%; margin: 0; }
body { background: var(--mesa); color: var(--fg); font-family: var(--sans); line-height: 1.5; }
.escena3d { position: relative; display: flex; flex-direction: column; height: 100%; }
.escena3d .lienzo3d { position: relative; flex: 1; min-height: 12rem; }
.escena3d .lienzo3d canvas { position: absolute; inset: 0; width: 100% !important; height: 100% !important; display: block; cursor: grab; }
.escena3d .lienzo3d canvas:active { cursor: grabbing; }
.escena3d .rotulos3d { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.etiqueta3d { font-size: .78rem; font-weight: 600; color: var(--c, var(--fg)); background: color-mix(in srgb, var(--bg) 82%, transparent); padding: .05rem .45rem; border-radius: 6px; white-space: nowrap; }
.escena3d .mandos3d { display: flex; flex-wrap: wrap; gap: .5rem 1rem; align-items: center; padding: .4rem .6rem .6rem; }
.escena3d .mandos3d:empty { display: none; }
.escena3d .fallo3d { color: var(--red); font-size: .9rem; padding: 1rem .6rem; }
.seg { display: inline-flex; flex-wrap: wrap; gap: 2px; padding: 2px; background: var(--hueco); border-radius: 10px; }
.seg button { font: inherit; font-size: .85rem; padding: .15rem .7rem; border: 0; border-radius: 8px; background: none; color: var(--muted); cursor: pointer; }
.seg button[aria-pressed="true"] { background: var(--accent); color: var(--bg); font-weight: 600; }
.seg button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.escena3d .pantalla3d { position: absolute; top: .45rem; right: .45rem; z-index: 20; width: 2rem; height: 2rem; display: grid; place-items: center; padding: 0; border: 1px solid var(--linea); border-radius: 8px; background: var(--bg); color: var(--fg); cursor: pointer; }
.escena3d .pantalla3d[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: var(--bg); }
.escena3d:fullscreen { background: var(--bg); }
`;

const poco = matchMedia("(prefers-reduced-motion: reduce)");
const url = new URLSearchParams(location.search);
const tFijo = url.has("t") ? parseFloat(url.get("t")) : null;
// La nota que incrusta la escena le manda órdenes y colores (assets/incrustar.js); solo se atiende al marco padre.
const incrustada = window.parent !== window;

if (url.get("tema") === "claro" || url.get("tema") === "oscuro") document.documentElement.dataset.tema = url.get("tema");
const estilo = document.createElement("style");
estilo.textContent = NUCLEO_CSS;
document.head.prepend(estilo);

// Para scripts/captura.mjs: #diag y body[data-listo] avisan del primer fotograma o del fallo.
function diag(texto, listo) {
  let d = document.getElementById("diag");
  if (!d) { d = document.createElement("div"); d.id = "diag"; d.hidden = true; document.body.append(d); }
  if (listo && d.textContent.startsWith("OK")) return;
  d.textContent = texto;
  if (listo) document.body.dataset.listo = "1";
}

function hex(css, dentro) {
  const p = document.createElement("span");
  p.style.color = css;
  dentro.append(p);
  const c = getComputedStyle(p).color;
  p.remove();
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = c;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
const NOMBRES = ["bg", "fg", "muted", "mesa", "accent", "blue", "red", "green", "orange", "magenta", "cyan"];
function leerColores(el) {
  const c = {};
  for (const n of NOMBRES) c[n] = hex(`var(--${n})`, el);
  c.oscuro = new THREE.Color(c.bg).getHSL({}).l < 0.5;
  return c;
}

async function arrancar(fn, cont = document.querySelector(".escena3d")) {
  const id = cont.id || "escena";
  const lienzo = document.createElement("div");
  lienzo.className = "lienzo3d";
  const rotulosEl = document.createElement("div");
  rotulosEl.className = "rotulos3d";
  lienzo.append(rotulosEl);
  const mandos = document.createElement("div");
  mandos.className = "mandos3d";
  cont.append(lienzo, mandos);

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(40, 1.6, 0.1, 200);
  const render = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  render.setPixelRatio(Math.min(devicePixelRatio, 2));
  render.setClearColor(0x000000, 0);
  render.shadowMap.enabled = true;
  render.shadowMap.type = THREE.PCFShadowMap;
  render.domElement.setAttribute("role", "img");
  render.domElement.setAttribute("aria-label", cont.getAttribute("aria-label") || document.title);
  lienzo.prepend(render.domElement);
  const rotulos = new CSS2DRenderer({ element: rotulosEl });
  const orbita = new OrbitControls(camara, render.domElement);
  // Incrustada en una nota, la rueda desplaza la nota: acercar con ella atraparía el scroll.
  orbita.enableZoom = !incrustada;
  orbita.enableDamping = !poco.matches;
  orbita.dampingFactor = 0.08;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 1.1);
  const sol = new THREE.DirectionalLight(0xffffff, 1.8);
  sol.position.set(4, 9, 6);
  sol.castShadow = true;
  sol.shadow.mapSize.set(1024, 1024);
  Object.assign(sol.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, far: 40 });
  escena.add(hemi, sol);

  let pedido = true;
  const pedir = () => { pedido = true; };
  orbita.addEventListener("change", pedir);

  // Laboratorio (data-modo="laboratorio"): botón ⛶ de pantalla completa y el formato que lee el módulo.
  const laboratorio = cont.dataset.modo === "laboratorio";
  const formatos = [];
  let formato = "compacto", boton = null;
  const medirFormato = () => {
    const nuevo = document.fullscreenElement === cont || (!incrustada && innerWidth >= 1100) ? "completo" : "compacto";
    boton?.setAttribute("aria-pressed", String(document.fullscreenElement === cont));
    if (nuevo === formato) return;
    formato = nuevo;
    formatos.forEach((f) => f(formato));
    pedir();
  };
  if (laboratorio) {
    if (url.get("formato") === "completo" || url.get("formato") === "compacto") formato = url.get("formato");
    else medirFormato();
    boton = document.createElement("button");
    boton.type = "button";
    boton.className = "pantalla3d";
    boton.title = "Pantalla completa";
    boton.setAttribute("aria-label", "Pantalla completa");
    boton.setAttribute("aria-pressed", "false");
    boton.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
    cont.append(boton);
    // Incrustada, el iframe necesita «allowfullscreen»: sin él el navegador lo rechaza y aquí se dice por qué.
    boton.addEventListener("click", () => (document.fullscreenElement === cont ? document.exitFullscreen()
      : cont.requestFullscreen().catch((e) => console.error(`escena3d: sin pantalla completa (${e.message})${incrustada ? ": al iframe le falta «allowfullscreen»" : ""}`))));
    document.addEventListener("fullscreenchange", medirFormato);
    if (!url.has("formato")) addEventListener("resize", medirFormato);
  }

  let colores = leerColores(cont);
  const temaFns = [];
  const k = {
    THREE, escena, camara, render, orbita, sol, hemi, contenedor: cont, mandos, pedir,
    get colores() { return colores; },
    get formato() { return formato; },
    alCambiarFormato(f) { formatos.push(f); f(formato); },
    alCambiarTema(f) { temaFns.push(f); f(colores); },
    etiqueta(obj, texto, { color = "fg", alto = 0 } = {}) {
      const d = document.createElement("div");
      d.className = "etiqueta3d";
      d.textContent = texto;
      d.style.setProperty("--c", `var(--${color})`);
      const o = new CSS2DObject(d);
      o.position.y = alto;
      obj.add(o);
      return o;
    },
    // Sombra sobre la mesa sin dibujar un suelo: solo se ve la sombra.
    sombraSuelo(y = 0, lado = 20) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(lado, lado), new THREE.ShadowMaterial({ opacity: 0.18 }));
      m.rotation.x = -Math.PI / 2;
      m.position.y = y;
      m.receiveShadow = true;
      escena.add(m);
      return m;
    },
    vistas: {},
    mirarDesde(clave) {
      const v = k.vistas[clave];
      if (!v) return;
      const mira = new THREE.Vector3(...(v.mira || [0, 0, 0]));
      // fov vertical: en un hueco más estrecho que el aspecto base se perdería ancho; la cámara se retira.
      const f = Math.min(2, Math.max(1, (v.aspecto || 1.6) / camara.aspect));
      camara.position.set(...v.pos).sub(mira).multiplyScalar(f).add(mira);
      orbita.target.copy(mira);
      orbita.update();
      vistaActual = clave;
      mandos.querySelectorAll("[data-vista]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.vista === clave));
      pedir();
    },
  };
  let vistaActual = null;

  const api = (await fn(k)) || {};
  const claves = Object.keys(k.vistas);
  if (claves.length > 1) {
    const seg = document.createElement("div");
    seg.className = "seg";
    seg.setAttribute("role", "group");
    seg.setAttribute("aria-label", "Vista");
    for (const c of claves) {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.vista = c;
      b.textContent = k.vistas[c].nombre || c;
      b.addEventListener("click", () => k.mirarDesde(c));
      seg.append(b);
    }
    mandos.prepend(seg);
  }

  const ajustar = () => {
    const w = lienzo.clientWidth, h = lienzo.clientHeight;
    if (!w || !h) return;
    render.setSize(w, h, false);
    rotulos.setSize(w, h);
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
    if (vistaActual) k.mirarDesde(vistaActual);
    pedir();
  };
  new ResizeObserver(ajustar).observe(lienzo);
  ajustar();
  if (claves.length) k.mirarDesde(k.vistas[url.get("vista")] ? url.get("vista") : claves[0]);

  const retemar = () => { colores = leerColores(cont); temaFns.forEach((f) => f(colores)); pedir(); };
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", retemar);

  const ordenar = (d) => { if (d.vista) k.mirarDesde(d.vista); api.orden?.(d); pedir(); };
  // Mensajes de la nota (assets/incrustar.js): {tipo:"tema", tema, colores} y {tipo:"orden", orden}.
  addEventListener("message", (e) => {
    if (!incrustada || e.source !== window.parent || !e.data) return;
    const m = e.data;
    if (m.tipo === "tema") {
      const raiz = document.documentElement;
      if (m.tema === "claro" || m.tema === "oscuro") raiz.dataset.tema = m.tema;
      for (const [n, v] of Object.entries(m.colores || {})) if (NOMBRES.includes(n) && v) raiz.style.setProperty(`--${n}`, v);
      retemar();
    } else if (m.tipo === "orden" && m.orden) ordenar(m.orden);
  });
  if (incrustada) window.parent.postMessage({ tipo: "escena3d-lista", id }, "*");

  const anima = typeof api.actualizar === "function";
  const reloj = new THREE.Timer();
  let t = tFijo ?? 0, fotogramas = 0;
  if (anima) api.actualizar(t);
  const tick = () => {
    reloj.update();
    const dt = Math.min(reloj.getDelta(), 0.1);
    // animando() (opcional) deja quieta la escena cuando el módulo no tiene nada en marcha: sin él, se mueve siempre.
    const mueve = anima && (api.animando?.() ?? true) && !poco.matches && tFijo === null;
    if (mueve) { t += dt; api.actualizar(t); }
    orbita.update();
    if (!mueve && !pedido) return;
    pedido = false;
    render.render(escena, camara);
    rotulos.render(escena, camara);
    api.despues?.();
    if (++fotogramas === 1) {
      const txt = `escena3d: ${id} lista three=r${THREE.REVISION} triangulos=${render.info.render.triangles}`;
      console.info(txt);
      diag("OK " + txt, true);
    }
  };

  // Pausa fuera de la pantalla: sin bucle no hay coste de GPU.
  let activa = false;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting === activa) return;
    activa = e.isIntersecting;
    if (activa) { reloj.reset?.(); pedir(); render.setAnimationLoop(tick); }
    else render.setAnimationLoop(null);
  }).observe(cont);
  return { orden: ordenar };
}

function arrancarEscena(fn) {
  const cont = document.querySelector(".escena3d");
  return arrancar(fn, cont).catch((e) => {
    const m = document.createElement("p");
    m.className = "fallo3d";
    m.textContent = /fetch|import|module/i.test(e.message) ? "No se pudo cargar la escena 3D. Comprueba la conexión." : "La escena 3D falló: " + e.message;
    cont.append(m);
    console.error(`escena3d: ${e.message}`);
    diag(`ERROR escena3d: ${e.message}`);
  });
}
