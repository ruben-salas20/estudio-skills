#!/usr/bin/env node
// Incrusta clips de narración en un vídeo: los pone en el bloque VOZ-INICIO … VOZ-FIN del HTML.
//   node incrustar-voz.cjs video.html 1.25:voz/linea1.wav 6.0:voz/linea2.mp3 [--v 1]
//   node incrustar-voz.cjs video.html            (sin clips: quita la voz)
// Cada clip es segundo_de_inicio:archivo. Imprime la duración de cada clip para cuadrar los planos con la voz.
'use strict';
const fs = require('fs'), { execFileSync } = require('child_process');
const args = process.argv.slice(2), vi = args.indexOf('--v'), v = vi < 0 ? 1 : +args.splice(vi, 2)[1];
const [html, ...clips] = args;
if (!html) { console.error('uso: incrustar-voz.cjs video.html [t:archivo ...] [--v 1]'); process.exit(2); }
const items = clips.map(c => {
  const i = c.indexOf(':'), t = +c.slice(0, i), f = c.slice(i + 1);
  if (!(t >= 0) || !fs.existsSync(f)) { console.error(`clip no válido: ${c}`); process.exit(2); }
  const dur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
  console.log(`${t.toFixed(3)} s → ${(t + dur).toFixed(3)} s  (${dur.toFixed(3)} s)  ${f}`);
  return `  { t: ${t}, v: ${v}, b64: '${fs.readFileSync(f).toString('base64')}' },`;
});
const src = fs.readFileSync(html, 'utf8'), re = /(\/\/ VOZ-INICIO[^\n]*\n)[\s\S]*?(\/\/ VOZ-FIN)/;
if (!re.test(src)) { console.error('el HTML no tiene el bloque VOZ-INICIO … VOZ-FIN'); process.exit(1); }
fs.writeFileSync(html, src.replace(re, (_, a, b) => `${a}const VOICE = [\n${items.join('\n')}\n];\n${b}`));
console.log(`${items.length} clip(s) en ${html}`);
