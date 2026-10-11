# Estilo: acuarela

Manchas de color que se extienden sobre papel de grano grueso, con un trazo fino de pluma encima. Es el estilo cálido y poético: piezas emotivas, de marca o de naturaleza. Kit: `estilos/acuarela.js`. Prueba resuelta (ciclo del agua, 2 planos): `estilos/pruebas/acuarela.html`.

## FORMAT

```js
expo: 2, post: { flicker: 0, grain: .15, vignette: .35, bg: '#F6F1E6' },
ink: [59, 58, 69], light: [255, 252, 245], paper: .25, shadow: null,
```

## Ritmo

- Planos de 2,5–5 s: la acuarela respira despacio. Música a 96 bpm o más lenta.
- Cada mancha empieza en una nota y tarda 0,5–0,8 s en extenderse. La línea de tinta llega después, sobre la mancha ya asentada.
- Entre planos, corte seco o un plano que empieza en papel vacío y se va pintando.

## Color

Papel `C.wpaper` y tinta `C.wink`. Pigmentos: `C.wblue`, `C.wteal`, `C.wochre`, `C.wrose`, `C.wviolet` y `C.wgrey`. Un plano usa 2–3 pigmentos, y lo que se superpone se mezcla solo (las aguadas se pintan en `multiply`). El blanco es el papel que queda sin pintar y lo más oscuro es la tinta `C.wink`.

## Materia

- El papel y las manchas viven en una hoja: `const sh = wcSheet(semilla)` (una por vídeo, compartida entre planos). En `draw`: `sh.begin()`, un `sh.wash(sp, x, y, u, {rot, a, sx, sy, live})` por mancha y `sh.end(ctx)` con `setCam(ctx, cam, 1)`; después, la tinta y el texto. Las manchas asentadas se funden con el papel en un solo lienzo y solo las que se extienden se mezclan en vivo. `live: true` para lo que sigue moviéndose (vapor, gotas).
- Cada mancha es un `washSprite(rx, ry, col, {seed, layers, gran, blooms, band})` horneado: capas translúcidas de borde irregular, borde oscuro donde se seca el pigmento, granulado y floraciones claras. `band: true` la convierte en franja horizontal para mar, suelo o cielo.
- Encima, pocas líneas de pluma (`inkLine`) de grosor variable, que no cierran del todo las formas: la mancha se sale del dibujo.
- `splatter` para gotas y salpicaduras sueltas.

## Movimiento

- `expo: 2` (30 poses por segundo), sin `boil`.
- Lo que se mueve es el pigmento: con `u` de 0 a 1, la mancha crece desde el centro y se vuelve opaca (`washIn` hace lo mismo suelto, sin hoja). Lo que viaja (vapor, gotas) es una mancha pequeña que se desplaza y se desvanece.
- Cámara lenta, zoom de 1,0 a 1,06 con `eio`.

## Texto

`inkText(ctx, str, x, y, u)`: serif cursiva en tinta, que aparece enfocándose como si la tinta se asentara. Tamaño 110–140, en frases cortas y en minúscula salvo la primera palabra de un título. Arriba a la izquierda y lejos de las manchas grandes.

## Sonido

- Música: `MUSIC = { bpm: 72, key: 'F', mode: 'major', prog: [1, 4, 6, 5], inst: { pad: 'strings', bass: 'bass', keys: 'piano', lead: 'piano', perc: null } }`: piano lento sobre cuerdas sostenidas. Energía baja en casi todo el vídeo (`.3`–`.55`).
- **Sincronía**: cada mancha empieza en una nota (acento de piano con `chordAt`), y las gotas y los toques suenan con `tick` suave (`v ≈ .3`).
- Ambiente `soft`.

## Revisión

- Las zonas sin pintar muestran el papel crema con grano.
- Las manchas son translúcidas, de borde irregular y con borde de pigmento; donde se superponen, el color se mezcla.
- 2–3 pigmentos por plano; la tinta va en líneas finas que dejan abiertas las formas.
- En la hoja, cada mancha crece y se asienta a lo largo de varios fotogramas.
- El texto va en serif cursiva, lejos de las manchas grandes, y se lee entero.
