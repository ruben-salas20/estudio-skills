// ═══ KIT · plano técnico (blueprint) ═══
Object.assign(C, { bp: '#1D4F91', bpD: '#153B6E', bpL: '#2A62A8', line: '#EAF2FF', warn: '#FFB347' });
const lineA = a => `rgba(234,242,255,${a})`;
// papel de plano: azul, cuadrícula fina y gruesa, pliegues y cajetín
function blueprintBackdrop(seed = 4) {
  const c = backdrop(W + 256, H + 144, { grad: [[0, '#2159A0'], [1, '#173F77']], mottle: .35, scratches: 120, light: [.35, .25], glow: .08, dark: .35, dust: 1500, seed }), g = g2(c);
  for (let x = 0; x <= c.width; x += 40) { g.fillStyle = lineA(x % 200 === 72 ? .28 : .11); g.fillRect(x + 8, 0, x % 200 === 72 ? 2 : 1, c.height); }
  for (let y = 0; y <= c.height; y += 40) { g.fillStyle = lineA(y % 200 === 32 ? .28 : .11); g.fillRect(0, y + 32, c.width, y % 200 === 32 ? 2 : 1); }
  for (const x of [c.width / 3, c.width * 2 / 3]) { g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(x, 0, 3, c.height); g.fillStyle = 'rgba(0,10,30,.12)'; g.fillRect(x + 3, 0, 4, c.height); }
  g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(0, c.height / 2, c.width, 3); g.fillStyle = 'rgba(0,10,30,.12)'; g.fillRect(0, c.height / 2 + 3, c.width, 4);
  g.strokeStyle = lineA(.55); g.lineWidth = 3; g.strokeRect(60, 60, c.width - 120, c.height - 120);
  const bx = c.width - 700, by = c.height - 250; g.lineWidth = 2; g.strokeRect(bx, by, 580, 130); g.beginPath(); g.moveTo(bx, by + 65); g.lineTo(bx + 580, by + 65); g.moveTo(bx + 380, by); g.lineTo(bx + 380, by + 130); g.stroke();
  return c;
}
function strokePts(ctx, q) { ctx.beginPath(); q.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }
// línea técnica que se traza sola
function techLine(ctx, pts, u, { w = 4, col = C.line, dash = null } = {}) {
  const q = trimPath(pts, u); if (q.length < 2) return;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'butt'; ctx.lineJoin = 'miter'; if (dash) ctx.setLineDash(dash); strokePts(ctx, q); ctx.restore();
}
function arcPts(cx, cy, r, a0 = 0, a1 = TAU, n = 64) { const p = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; }
function arrowHead(ctx, x, y, ang, s = 22, col = C.line) { ctx.save(); ctx.fillStyle = col; ctx.translate(x, y); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s, -s * .35); ctx.lineTo(-s, s * .35); ctx.closePath(); ctx.fill(); ctx.restore(); }
// cota: líneas de referencia, línea de cota con flechas y la medida en el centro
function dimension(ctx, a, b, off, u, label, { size = 38, col = C.line } = {}) {
  if (u <= 0) return; const L = Math.hypot(b[0] - a[0], b[1] - a[1]), dx = (b[0] - a[0]) / L, dy = (b[1] - a[1]) / L, nx = -dy, ny = dx;
  const A = [a[0] + nx * off, a[1] + ny * off], B = [b[0] + nx * off, b[1] + ny * off], e1 = clamp(u / .3, 0, 1), e2 = clamp((u - .2) / .5, 0, 1);
  techLine(ctx, [a, [a[0] + nx * (off + 16 * Math.sign(off)), a[1] + ny * (off + 16 * Math.sign(off))]], e1, { w: 2, col });
  techLine(ctx, [b, [b[0] + nx * (off + 16 * Math.sign(off)), b[1] + ny * (off + 16 * Math.sign(off))]], e1, { w: 2, col });
  const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  techLine(ctx, [M, A], e2, { w: 2, col }); techLine(ctx, [M, B], e2, { w: 2, col });
  if (e2 >= 1) { const ang = Math.atan2(dy, dx); arrowHead(ctx, B[0], B[1], ang, 20, col); arrowHead(ctx, A[0], A[1], ang + PI, 20, col); }
  if (u > .7) { ctx.save(); ctx.globalAlpha = inv(.7, 1, u); ctx.translate(M[0], M[1]); let ang = Math.atan2(dy, dx); if (ang > PI / 2 || ang < -PI / 2) ang += PI; ctx.rotate(ang);
    ctx.font = `600 ${size}px ${FONTS.mono}`; const tw = ctx.measureText(label).width + 24; ctx.fillStyle = C.bp; ctx.fillRect(-tw / 2, -size * .7, tw, size * 1.1); drawText(ctx, label, 0, -size * .15, { size, font: FONTS.mono, weight: 600, col }); ctx.restore(); }
}
// mira: círculo que se cierra y cruz
function crosshair(ctx, x, y, r, u, { col = C.line } = {}) { techLine(ctx, arcPts(x, y, r, -PI / 2, PI * 1.5), u, { w: 3, col }); techLine(ctx, [[x - r * 1.3, y], [x + r * 1.3, y]], inv(.3, .8, u), { w: 1.5, col, dash: [18, 8, 4, 8] }); techLine(ctx, [[x, y - r * 1.3], [x, y + r * 1.3]], inv(.3, .8, u), { w: 1.5, col, dash: [18, 8, 4, 8] }); }
// llamada: punto, línea quebrada y etiqueta que se teclea
function leader(ctx, from, to, label, u, { size = 48, col = C.line } = {}) {
  if (u <= 0) return; const dir = to[0] >= from[0] ? 1 : -1, sh = [to[0] + dir * 60, to[1]];
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(from[0], from[1], 7 * clamp(u * 4, 0, 1), 0, TAU); ctx.fill();
  techLine(ctx, [from, to, sh], clamp(u / .6, 0, 1), { w: 2.5, col });
  techText(ctx, label, sh[0] + dir * 14, sh[1], { size, u: inv(.5, 1, u), col, align: dir > 0 ? 'left' : 'right' });
}
// texto técnico: mayúsculas, espaciado, se teclea con un cursor
function techText(ctx, str, x, y, { size = 48, u = 1, col = C.line, align = 'left', weight = 600 } = {}) {
  if (u <= 0) return; str = str.toUpperCase(); const n = Math.ceil(str.length * clamp(u, 0, 1)), s = str.slice(0, n);
  const box = drawText(ctx, s, x, y, { size, font: FONTS.mono, weight, col, align, track: size * .08 });
  if (u < 1) { ctx.fillStyle = col; ctx.fillRect(align === 'right' ? x + 6 : box.x + box.w + 6, y - size * .45, size * .5, size * .9); }
}
// sombreado de sección (rayado a 45°) dentro de una forma
function sectionHatch(ctx, pathFn, u = 1, { gap = 22, col = lineA(.45) } = {}) { if (u <= 0) return; ctx.save(); pathFn(ctx); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = 2; for (let k = -H; k < W * u; k += gap) { ctx.beginPath(); ctx.moveTo(k, H * 2); ctx.lineTo(k + H * 2, 0); ctx.stroke(); } ctx.restore(); }
