# Motor: contrato de un plano

`motor.html` trae todo lo que no cambia entre vídeos: utilidades, texturas, sprites, texto, física, sintetizador, voz, reloj, cámara, postproceso, interfaz y ganchos de captura. Tú escribes el bloque `FORMAT` (arriba del todo) y la sección `TU PELÍCULA`, que empieza con el kit del estilo pegado entre `KIT-INICIO` y `KIT-FIN`. Cada estilo tiene su ejemplo resuelto en `estilos/pruebas/<estilo>.html`.

## Formato

El bloque `FORMAT` fija tamaño, cadencia y aspecto final. `W`, `H`, `FPS` y `EXPO` salen de él. El estilo dice qué poner en `expo`, `post`, `ink`, `light`, `paper`, `shadow` (sombra por defecto de los sprites; `null` para ninguna) y `pixel`; la proporción la pide el usuario:

| Proporción | `w × h` del mundo | Exporta por defecto |
|---|---|---|
| 16:9 | 2560 × 1440 | 1920 × 1080 |
| 9:16 | 1440 × 2560 | 1080 × 1920 |
| 1:1 | 1440 × 1440 | 1080 × 1080 |
| 4:5 | 1440 × 1800 | 1080 × 1350 |

`safe` es la zona segura del uso (`usos.md`): solo la dibuja `grabar.cjs --zonas` al revisar.

Con `pixel: true`, `w × h` es una rejilla de pixeles pequeña (640×360, 360×640, 360×360 o 360×450) que el reproductor y `grabar.cjs` amplían sin suavizado, y `setCam` redondea la traslación a pixeles enteros. Solo tiene sentido con un estilo que dibuje pixel a pixel (`estilos/pixel.md`).

La duración no se escribe en ningún sitio: es la suma de los `dur` de los planos. El motor calcula en el arranque `DUR` (segundos) y `NF` (fotogramas), la barra de planos del reproductor y el fundido final del sonido (0,45 s).

## Reloj

Cada plano ve cuatro tiempos:

| Nombre | Qué es | Para qué sirve |
|---|---|---|
| `st` | segundos desde el inicio del plano, continuos | física en `step`, cámara en `cam` |
| `sf` | fotograma entero desde el inicio del plano | sucesos exactos: `if (sf === 75)` |
| `sq` | `st` redondeado a la exposición (`EXPO` fotogramas) | toda animación calculada en `draw` |
| `e` | índice global de exposición | semilla de `boil` |

Con `expo: 1`, `sq` es igual a `st` y no hay pose retenida.

## Interfaz de un plano

```js
const S1 = {
  name: 'Taza', dur: 2.5,           // t0 y t1 los calcula el motor, en el orden de SHOTS
  cam(st) { return { x, y, z }; },  // centro del encuadre en coordenadas del mundo y zoom; suave, sin saltos
  build() {},                      // una vez al cargar: hornea fondos (backdrop/mk) y marionetas (sprite)
  reset() {},                      // estado inicial determinista (this.R = rng(semilla)); pre-rueda la física con st negativo y termina en this.snap()
  step(dt, st, sf) {},             // solo física y lógica; emit({...}) para los sonidos que nacen de la física
  snap() {},                       // copia el estado vivo a los campos r* (rx, ry, rth...) que verá la cámara
  draw(ctx, st, sq, e, cam) {},    // solo lee r* y sq; empieza cada capa con setCam(ctx, cam, p)
  score() { return []; },          // sucesos sonoros programados, con t en segundos globales (this.t0 + local)
  poke(x, y) { return false; },    // clic del espectador en coordenadas del mundo; true si tocó algo; suena con sfx({...})
};
SHOTS.push(S1);
```

`this.t0` ya vale cuando se llaman `build` y `score`. Un plano puede llevar además `energy` (0–1), que usa la música. Fuera de los planos, `function baseScore()` devuelve el ambiente y la música del vídeo (ver Música).

## Reglas duras

- **Determinismo.** `reset`, `step` y `draw` usan solo `rng(semilla)`, `hash` y `noise`. `Math.random` vale solo dentro de `poke`. Saltar a cualquier fotograma o exportar tiene que dar la misma imagen siempre.
- `draw` no cambia el estado. Todo lo que se mueve se lee de la foto (`r*`).
- Lo estático se hornea en `build`. `__film.time()` mide un fotograma completo, esperando a la GPU. Referencia en este portátil: 2–3 ms sin fondo horneado (motion) y 17–22 ms con fondo y postproceso (el resto de estilos). Si un plano pasa de 25 ms, hornea más de lo que dibuja en vivo.
- El mundo ya está vivo en el fotograma 0 de cada plano: `reset` pre-rueda entre 60 y 150 pasos.

## Atajos

- `lapse(t, a, d)`: de 0 a 1 mientras `t` va de `a` a `a + d`; es la `u` de casi todo lo que se traza, crece o aparece.
- `onFrame(T, ev)`: verdadero en el fotograma exacto del suceso `ev`; se usa en `step` para dar impulsos a resortes o soltar partículas.
- `popIn(u)`: escala de aparición con rebote (0 → 1,12 → 1).
- `keyframes([[t, v], …], t)`: valor interpolado entre claves; sirve para recorridos con pausas (una aguja que avanza despacio y luego salta).
- `camPath([x, y, z], [x, y, z], dur, ease)`: devuelve la `cam` de un plano que va de un encuadre a otro.

## Decorado compartido

Cuando varios planos transcurren en el mismo sitio (el hilo de un explicativo, una pizarra que se va llenando, una red que se enciende), el decorado es un objeto que vive en **tiempo global** `T = t0 + st`: lo dibujado en un plano sigue ahí en el siguiente y los cortes solo cambian la cámara y lo que ocurre.

```js
const HILO = {
  build() {},                      // hornea una vez para todos los planos
  reset(T0) {}, step(T, dt) {}, snap() {},
  draw(ctx, cam, T, e) {},         // T global: lapse(T, 7.8, .3) funciona igual en cualquier plano
};
SHOTS.push(
  sharedShot(HILO, { name: 'P', dur: 2.5, energy: .4, cam: camPath([1280, 720, 1.2], [1300, 720, 1.25], 2.5), score: t0 => [{ t: t0 + .3125, k: 'thump' }] }),
  sharedShot(HILO, { name: 'QRS', dur: 2.5, energy: .5, cam: camPath([1300, 730, 1.16], [1320, 730, 1.22], 2.5) }),
);
```

`sharedShot(set, o)` construye el plano: hornea el decorado una sola vez y le pasa el tiempo global. Los sucesos del decorado se programan en segundos globales.

## Caja de herramientas

- Curvas y tiempo: `clamp`, `lerp`, `inv(a,b,x)`, `smooth(a,b,x)`, `eio`, `eo`, `esine`; azar `rng(seed)`, `hash(a,b,c)`; ruido `noise(x,y)`, `fbm`, `curl(x,y,t,sc)`.
- Color: `C` (paleta; un estilo la cambia con `Object.assign(C, {...})`), `tone(hex, k, alfa)`.
- Trazos: `trimPath(pts, u)` (la primera fracción `u` de una polilínea, para líneas que se dibujan solas), `cutPath(g, pts, {amp, step, seed})`, `blobPath(g, cx, cy, rx, ry, {amp, seed, rot})`, `curvePath(g, pts, closed)`, `hatch(g, x, y, w, h, {gap, ang, col, a, wob})`, `stipple(g, x, y, w, h, {n, col, r0, r1, a, dens})`, `withClip(g, pathFn, fn)`, `paperize(g, k)`.
- Texto: `drawText(g, str, x, y, {size, font, weight, style, col, align, base, maxW, lh, track, stroke, sw})` dibuja y devuelve la caja `{x, y, w, h, lines}`; parte líneas con `maxW` y con `\n`. `FONTS.serif`, `FONTS.sans` y `FONTS.mono` son fuentes del sistema. Una fuente propia se incrusta como `@font-face` con `src: url(data:font/woff2;base64,...)` en el `<style>`, y se usa por su nombre; el arranque espera a `document.fonts.ready`. Para que el texto tenga la materia del estilo, dibújalo dentro de un `sprite()`.
- Lienzos: `mk(w, h)`, `g2(canvas)`, `backdrop(w, h, {grad, vstreak, hstreak, mottle, scratches, light, glow, dark, seed})`, que se dibuja en `(-128, -72)` con tamaño `W+256 × H+144`.
- Recortes: `sprite(w, h, ax, ay, dibujo, {ss, pad, shadow, paper})`. El dibujo trabaja en una caja de `w×h` con origen arriba a la izquierda; `(ax, ay)` es el ancla (pies, pivote). `shadow: null` y `paper: 0` dan una figura plana. Se coloca con `put(ctx, sp, x, y, rot, escala, {flip, sy, alpha, shadow})`.
- Física: `new Rope(pts, {grav, damp, iters, slack})` con `pin[i]`, `ax/ay` como fuerzas, `step(dt)`, `snap()`, `at(u)`. Para lo que cae planeando: `newPetal(R, x, y, {vx, vy, col, size, An})`, `petalStep(p, dt, vientoX, vientoY)`, `drawPetals(ctx, lista, e)`. Para el soplo del espectador: `gustAt(x, y)`.
- Pose: `boil(id, e, amt)` devuelve `[dx, dy, drot]`.
- Carga asíncrona del kit: si el kit define `const KIT_READY = <promesa>`, el arranque la espera después de las fuentes y antes de `build()` (la usa `3b1b` para MathJax).
- Sonido: sucesos `{t, k, ...}` con `t` en segundos globales; todos aceptan `v` (volumen) y `pan` (−1 a 1). Los tipos de `k`:

| Familia | `k` (parámetros) |
|---|---|
| Notas | `mb` caja de música, `piano`, `marimba`, `synth` (`bright`), `blip` (`dur`), `chip` (`dur`, `wave`: `pulse`, `square`, `triangle`), `pluck` (cuerda, `f`): todas con `n: 'G5'` o `f` en Hz |
| Acordes y bajos | `chord` (`ns`, `strum`), `strings` (`n` o `ns`, `dur`), `bass` (`n`), `chipbass` (`n`) |
| Golpes y roces | `tick`, `click`, `thump`, `pop` (`f`), `clink` (cerámica), `creak` (crujido), `bloom` (brote), `noise` (`dur`, `hz`) |
| Materia | `rustle` (papel), `cloth` (tela), `chalk` (tiza, `dur`), `whoosh` (ráfaga: `dur`, `p0`, `p1`, `f0`, `f1`), `flap` (aleteo), `chirp` (pío) |
| Ambiente | `bed` (`kind`: `room`, `street`, `field`, `stage`, `studio`, `lab`, `soft`; `dur`) |

## Música

La música de fondo la escribe `compose(MUSIC)`, que devuelve los sucesos de todo el vídeo; se pone en `baseScore()` junto al ambiente:

```js
const MUSIC = { bpm: 96, key: 'C', mode: 'major', prog: [1, 6, 4, 5], inst: { pad: 'strings', bass: 'bass', keys: 'marimba', lead: 'piano', perc: null }, seed: 7 };
function baseScore() { return [{ t: 0, k: 'bed', kind: 'room', dur: DUR }, ...compose(MUSIC)]; }
```

- `key` y `mode` (`major` o `minor`) fijan la tonalidad; `prog` son los grados de la progresión, un acorde por compás, en bucle. `seed` cambia la melodía. `v` (1 por defecto) sube o baja toda la música y `tail` (2,2 s) es la cola del acorde final.
- `inst` asigna un instrumento a cada capa, o `null` para quitarla: `pad` (`strings`, `synth` o `chip`), `bass` (`bass` o `chipbass`), `keys` y `lead` (`piano`, `marimba`, `mb`, `synth`, `blip`, `pluck` o `chip`) y `perc` (`tick`, `click` o `noise`). Las capas ya están calibradas entre sí y respecto a los efectos.
- La **energía** de cada plano (`energy`, de 0 a 1, en el objeto del plano; `.5` si falta) decide qué suena en cada compás: siempre el fondo y el bajo; desde `.3`, un arpegio en negras; desde `.55`, la melodía; desde `.6`, el arpegio pasa a corcheas; y desde `.7`, el pulso. Un gancho tranquilo va en `.25`, los pasos entre `.4` y `.6` y el clímax en `.7` o más.
- El final sale solo: medio compás de dominante (V) y la tónica (I) en todas las capas, `tail` segundos antes del final.
- Con voz, la música baja a menos de la mitad mientras suena cada clip.
- Un acento de un plano (una nota que marca un suceso) usa `chordAt(MUSIC, t)`, que da las notas del acorde que suena en el segundo global `t`, para no desafinar.
- Los efectos (tiza, `tick`, `pop`, `whoosh`…) y los acentos van en la `score()` de cada plano.

## Sincronía

La regla de sonido de todos los estilos: **cada suceso visible suena en su mismo instante**. Un suceso es cualquier cosa que el ojo registra como un momento: algo aparece, se suelta, aterriza, se traza, se enciende o cambia de golpe. Los sucesos programados suenan desde `score()`; los que produce la física (un rebote, un pétalo que toca el suelo), con `emit()` dentro de `step`. Cada estilo dice con qué suena cada clase de suceso.

## Voz

La narración (solo si el usuario la pide) está en `voz.md`: cómo se incrusta, cómo se cuadran los planos y cómo baja la música.

## Ganchos de captura

`window.__film.seek(f)`, `.time()`, `.wav()` y `.info()`; las globales `W`, `H`, `FPS`, `DUR` y `NF`. Parámetros de URL: `?frame=N`, `?t=s`, `?ui=0` (sin controles) y `?smooth=1` (sin pose retenida). `grabar.cjs` los usa.
