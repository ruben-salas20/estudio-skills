// ═══ KIT · acuarela ═══
Object.assign(C, { wpaper: '#F6F1E6', wink: '#3B3A45', wblue: '#4F86C6', wteal: '#5AA69B', wrose: '#E07A7A', wochre: '#E3A857', wviolet: '#8B7BB8', wgrey: '#9AA0A8' });
// papel de acuarela de grano grueso
function wcPaper(seed = 5) {
  const c = backdrop(W + 256, H + 144, { grad: [[0, '#F8F4EA'], [1, '#F0E9DA']], mottle: .3, scratches: 0, dust: 800, light: [.35, .2], glow: .06, dark: .12, seed }), g = g2(c);
  stipple(g, 0, 0, c.width, c.height, { n: 90000, col: '#8a7f6a', r0: .6, r1: 1.6, a: .07, seed: seed + 1 });
  stipple(g, 0, 0, c.width, c.height, { n: 60000, col: '#ffffff', r0: .6, r1: 1.8, a: .25, seed: seed + 2 });
  return c;
}
// una aguada horneada: capas translúcidas con borde irregular, borde oscuro donde se seca el pigmento, granulado y floraciones claras
// band: true → franja horizontal de borde superior ondulado (mar, suelo, cielo), en lugar de mancha redonda
function washSprite(rx, ry, col, { seed = 1, layers = 6, amp = .14, gran = .25, blooms = 3, band = false } = {}) {
  const w = rx * 2.6, h = ry * 2.6, R = rng(seed);
  const blob = (g, x, y, a, b, o) => { if (!band) return blobPath(g, x, y, a, b, o); g.beginPath(); const n = 60; for (let i = 0; i <= n; i++) { const t = i / n, X = x - a + t * a * 2, Y = y - b + noise(t * 6 + o.seed, o.seed * .7) * b * .35; i ? g.lineTo(X, Y) : g.moveTo(X, Y); } g.lineTo(x + a, y + b); g.lineTo(x - a, y + b); g.closePath(); };
  return sprite(w, h, w / 2, h / 2, g => {
    const cx = w / 2, cy = h / 2, main = gg => blob(gg, cx, cy, rx, ry, { amp, seed, freq: 1.7, n: 90 });
    for (let i = 0; i < layers; i++) { blob(g, cx + (R() - .5) * rx * .12, cy + (R() - .5) * ry * .12, band ? rx : rx * (.78 + R() * .3), ry * (.78 + R() * .3), { amp: amp * 1.2, seed: seed + i * 7, freq: 1.5 + R(), n: 90 }); g.fillStyle = tone(col, (R() - .5) * .15, .13 + R() * .06); g.fill(); }
    g.save(); g.filter = 'blur(2px)'; main(g); g.strokeStyle = tone(col, -.2, .45); g.lineWidth = 4; g.stroke(); g.restore();
    withClip(g, main, gg => { stipple(gg, 0, 0, w, h, { n: rx * ry * .02, col: tone(col, -.35), r0: .6, r1: 1.6, a: gran, seed: seed + 3 });
      gg.globalCompositeOperation = 'destination-out'; for (let i = 0; i < blooms; i++) { gg.filter = 'blur(14px)'; blobPath(gg, cx + (R() - .5) * rx, cy + (R() - .5) * ry, Math.min(rx, ry * 2) * (.12 + R() * .15), ry * (.12 + R() * .15), { amp: .3, seed: seed + 40 + i }); gg.fillStyle = 'rgba(0,0,0,.16)'; gg.fill(); } });
  }, { ss: 1, pad: 30, shadow: null, paper: .25 });
}
// la aguada se extiende: crece desde el centro y se vuelve opaca, mezclándose por multiplicación
function washIn(ctx, sp, x, y, u, { rot = 0, a = 1, sx = 1, sy = 1 } = {}) {
  if (u <= 0) return; const k = lerp(.55, 1, eo(u));
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; put(ctx, sp, x, y, rot, k * sx, { alpha: clamp(u * 1.6, 0, 1) * a, sy: sy / sx }); ctx.restore();
}
// la hoja: el papel y las aguadas ya asentadas viven en un solo lienzo, que se rehace solo cuando otra aguada termina de asentarse;
// en vivo solo se componen las que se están extendiendo. Uso en draw: sheet.begin(); sheet.wash(sp, x, y, u, {rot, a, sx, sy, live}) …; sheet.end(ctx)
// `live: true` para las manchas que siguen moviéndose después de extenderse (vapor, gotas): esas nunca se asientan.
let WC_ID = 0;
function wcSheet(seed = 5) {
  return {
    paper: wcPaper(seed), baked: null, key: null, list: [],
    begin() { this.list = []; },
    wash(sp, x, y, u, o = {}) { if (u > 0) this.list.push({ sp, x, y, u, o }); },
    end(ctx) {
      const done = this.list.filter(w => w.u >= 1 && !w.o.live), rest = this.list.filter(w => !(w.u >= 1 && !w.o.live));
      const key = done.map(w => `${w.sp._wc ??= ++WC_ID}@${w.x | 0},${w.y | 0},${w.o.rot || 0},${w.o.a ?? 1},${w.o.sx ?? 1},${w.o.sy ?? 1}`).join(';');
      if (key !== this.key) {
        const c = this.baked || mk(this.paper.width, this.paper.height), g = g2(c); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.drawImage(this.paper, 0, 0);
        g.translate(128, 72); for (const w of done) washIn(g, w.sp, w.x, w.y, 1, w.o);
        this.baked = c; this.key = key;
      }
      ctx.drawImage(this.baked, -128, -72);
      for (const w of rest) washIn(ctx, w.sp, w.x, w.y, w.u, w.o);
    },
  };
}
// línea de tinta de pluma: grosor que respira con el pulso
function inkLine(ctx, pts, u, { col = C.wink, w = 4, seed = 1 } = {}) {
  const q = trimPath(pts, u); if (q.length < 2) return;
  ctx.save(); ctx.strokeStyle = col; ctx.lineCap = 'round';
  for (let i = 1; i < q.length; i++) { ctx.lineWidth = w * (.55 + .9 * (noise(seed + i * .21, seed * 1.3) * .5 + .5)); ctx.beginPath(); ctx.moveTo(q[i - 1][0], q[i - 1][1]); ctx.lineTo(q[i][0], q[i][1]); ctx.stroke(); }
  ctx.restore();
}
// salpicadura: gotitas que aparecen alrededor de un punto
function splatter(ctx, x, y, u, col, { n = 24, r = 160, seed = 1 } = {}) {
  if (u <= 0) return; const R = rng(seed); ctx.save(); ctx.globalCompositeOperation = 'multiply';
  for (let i = 0; i < n; i++) { const a = R() * TAU, d = r * Math.sqrt(R()), s = 2 + R() * 9, t = R() * .6; if (u < t) continue; ctx.fillStyle = tone(col, .15, .32 * clamp((u - t) * 4, 0, 1)); ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, s, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// texto a pluma: serif cursiva en tinta, aparece como si la tinta se asentara
function inkText(ctx, str, x, y, u, { size = 110, col = C.wink, align = 'left' } = {}) {
  if (u <= 0) return; ctx.save(); ctx.globalAlpha = clamp(u * 1.4, 0, 1); ctx.filter = u < 1 ? `blur(${(1 - clamp(u, 0, 1)) * 6}px)` : 'none';
  drawText(ctx, str, x, y, { size, font: FONTS.serif, style: 'italic', weight: 500, col, align }); ctx.restore();
}
