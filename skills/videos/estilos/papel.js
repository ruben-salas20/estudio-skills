// ═══ KIT · papel recortado ═══
// luz lateral suave desde arriba a la izquierda, para cuerpos redondos (vasijas, corazones, frutas)
const shadeBody = (g, x, y, w, h, col) => {
  const lg = g.createLinearGradient(x, 0, x + w, 0); lg.addColorStop(0, tone(col, .12, 0)); lg.addColorStop(.28, tone(col, .14, .5)); lg.addColorStop(.55, tone(col, 0, 0)); lg.addColorStop(1, tone(col, -.32, .8));
  g.fillStyle = lg; g.fillRect(x, y, w, h);
};
// motas claras y oscuras de impresión sobre una superficie
const speck = (g, x, y, w, h, n, s, dark = '#6e1d18') => { stipple(g, x, y, w, h, { n, col: '#f1e3d2', r0: .6, r1: 1.7, a: .55, seed: s }); stipple(g, x, y, w, h, { n: n * .6, col: dark, r0: .6, r1: 1.4, a: .45, seed: s + 1 }); };
// resorte amortiguado: s = { a, va }; lo que se mece, se encoge o late
const spring = (s, dt, k = 260, d = 9) => { s.va += (-s.a * k - s.va * d) * dt; s.a += s.va * dt; };
