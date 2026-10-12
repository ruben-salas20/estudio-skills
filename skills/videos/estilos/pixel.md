# Estilo: pixel art

Pixeles duros sobre fondo casi negro, en una rejilla pequeña ampliada sin suavizado: la estética de consola de 8 y 16 bits y de las visualizaciones técnicas en pixel. Sirve para algoritmos, datos e informática: redes, estructuras de datos, circuitos, cualquier cosa que gane con un aire de pantalla. Kit: `estilos/pixel.js`. Prueba resuelta (el ordenamiento burbuja, 11 planos, explicativo y con los principios de animación): `estilos/pruebas/pixel.html`.

## FORMAT

```js
w: 640, h: 360, fps: 60, expo: 2,
post: { flicker: 0, grain: 0, vignette: 0, bg: '#06070d' },
ink: [6, 7, 13], light: [232, 238, 255], paper: 0, shadow: null, pixel: true,
```

`pixel: true` hace que `w × h` sea la rejilla de pixeles: el reproductor y `grabar.cjs` la amplían sin suavizado. Rejilla de 640×360, que se exporta ×3.

## Ritmo

- Planos de 2,5–4,5 s. Música a 120 bpm (negra de 0,5 s, corchea de 0,25 s): las acciones principales caen en esa rejilla; los desfases dentro de un grupo, de 0,1 s.
- Corte seco entre planos. Si varios planos comparten decorado (la misma red, el mismo mapa), se hornea una vez y cada plano solo cambia lo que se enciende.
- Las cosas aparecen pixel a pixel (`reveal` en `pimage`), se trazan (`pline` con `u`) o parpadean (alternar visible/oculto por exposición; un parpadeo de anticipación dura al menos 0,25 s, o no sale en las capturas).
- `estirar` sin girar el lienzo: solo en lo que se mueve en horizontal o en vertical, a lo largo de ese eje.

## Color

Fondo `C.px0` y paneles `C.px1`/`C.px2`. Estructura apagada en azules (`C.pxLine`, `C.pxNode`, `C.pxNodeL`). Dos acentos que se oponen, `C.pxMag` (magenta) y `C.pxCyan` (cian), con sus versiones oscuras `C.pxMagD` y `C.pxCyanD` para lo que ya pasó. `C.pxWhite` para lo más brillante y `C.pxGold` como tercer acento raro. Las transiciones de brillo se hacen con tramado.

## Materia

- Todo en coordenadas enteras con las primitivas del kit: `pset`, `prect`, `pline` (Bresenham, con `dot` para punteados y `u` para trazarse), `pcircle`, `pdiamond`, `ppanel`. Solo esas primitivas: `arc`, `stroke` y `drawText` suavizan los bordes y rompen la rejilla.
- Brillo y transparencia con tramado Bayer: `dfill` para superficies y `dglow` para halos.
- Imágenes pequeñas con `pimage` (escala de grises en bloques). `strokeImage` convierte trazos a mano en una imagen n×n, para dibujar dígitos, letras o iconos.
- Lo estático (rejillas, conexiones apagadas, etiquetas) se hornea en un lienzo `mk(W, H)` en `build`; en `draw` solo va lo que se enciende.

## Movimiento

- `expo: 2` (30 poses por segundo), sin `boil`.
- Cámara fija (`z: 1`); si se mueve, lo hace en pixeles enteros (el motor redondea la traslación en modo pixel) y con zoom entero.
- Lo que viaja por una línea es un bloque de 2×2 blanco (`plerp` da su posición) y deja la línea teñida detrás.

## Texto

`ptext(ctx, str, x, y, {col, s, align, u, led, shade})`: fuente de mapa de bits de 5×7 incluida en el kit, con acentos, Ñ, ¿ y ¡; todo sale en mayúsculas. `s: 1` para etiquetas y `s: 2–3` para títulos. Un visor grande es `s: 8, led: true` (rejilla entre pixeles). `u` lo teclea letra a letra.

## Sonido

- Música: `MUSIC = { bpm: 120, key: 'A', mode: 'minor', prog: [1, 6, 3, 7], inst: { pad: null, bass: 'chipbass', keys: 'chip', lead: 'chip', perc: 'noise' } }`: consola de 8 bits (onda de pulso, bajo triangular y ruido).
- **Sincronía**: cada cosa que se enciende suena con `chip` a una octava alta (notas de `chordAt(MUSIC, t, 6)`), y lo que aparece pixel a pixel, con ráfagas cortas de `noise`. Lo que salta o se desplaza suena al arrancar con un `chip` de onda `triangle`, y al aterrizar, con un `noise` corto y grave.
- Ambiente `studio`.

## Revisión

- En un recorte ampliado, cada borde es un escalón de pixel duro.
- Fondo casi negro, estructura en azules apagados y acentos magenta y cian.
- Brillos y halos hechos con tramado.
- El texto usa la fuente 5×7 y se lee entero.
- En capturas seguidas, lo que se enciende avanza en orden (capa a capa, pixel a pixel).
