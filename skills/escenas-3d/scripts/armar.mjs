#!/usr/bin/env node
// Escribe el núcleo (assets/nucleo.js) dentro de una o varias escenas .html, entre sus marcas
// «// ── NÚCLEO (inicio)» y «// ── NÚCLEO (fin)». Así cada escena es un archivo que se abre solo.
//
//   node scripts/armar.mjs --nueva figura|laboratorio ruta/nombre.html   copia la plantilla y la arma
//   node scripts/armar.mjs escena.html [otra.html…]                      arma o pone al día el núcleo
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL = join(dirname(fileURLToPath(import.meta.url)), "..");
const NUCLEO = readFileSync(join(SKILL, "assets/nucleo.js"), "utf8").trimEnd();
const MARCAS = /(^[ \t]*\/\/ ── NÚCLEO \(inicio\)[^\n]*\n)[\s\S]*?(^[ \t]*\/\/ ── NÚCLEO \(fin\)[^\n]*$)/m;
const USO = "uso: node armar.mjs --nueva figura|laboratorio ruta/nombre.html\n     node armar.mjs escena.html [otra.html…]";

const args = process.argv.slice(2);
let rutas = args;
if (args[0] === "--nueva") {
  const [, modo, ruta] = args;
  if (!["figura", "laboratorio"].includes(modo) || !ruta?.endsWith(".html")) { console.log(USO); process.exit(2); }
  if (existsSync(ruta)) { console.log(`${ruta} ya existe: no la piso. Para poner al día su núcleo: node armar.mjs ${ruta}`); process.exit(1); }
  copyFileSync(join(SKILL, `assets/${modo}.html`), ruta);
  rutas = [ruta];
}
if (!rutas.length) { console.log(USO); process.exit(2); }

let fallos = 0;
for (const ruta of rutas) {
  const html = readFileSync(ruta, "utf8");
  if (!MARCAS.test(html)) { console.log(`${basename(ruta)}: faltan las marcas del NÚCLEO (inicio y fin): cópialas de assets/figura.html`); fallos++; continue; }
  const nuevo = html.replace(MARCAS, (_, ini, fin) => `${ini}${NUCLEO}\n${fin}`);
  if (nuevo === html) { console.log(`${basename(ruta)}: el núcleo ya estaba al día`); continue; }
  writeFileSync(ruta, nuevo);
  console.log(`${basename(ruta)}: núcleo escrito`);
}
process.exit(fallos ? 1 : 0);
