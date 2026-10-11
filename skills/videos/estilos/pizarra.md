# Estilo: pizarra y tiza

Todo se dibuja a mano, en tiza sobre una pizarra verde, mientras lo ves. Es el estilo del profesor que explica: cercano, didáctico y sin prisa. Kit: `estilos/pizarra.js` (lleva la fuente Caveat incrustada, licencia OFL). Prueba resuelta (ciclo del agua, 2 planos): `estilos/pruebas/pizarra.html`.

## FORMAT

```js
expo: 3, post: { flicker: .02, grain: .3, vignette: .8, bg: '#26332C' },
ink: [18, 26, 22], light: [236, 234, 224], paper: 0, shadow: null,
```

## Ritmo

- Planos de 2,5–5 s: la tiza necesita tiempo para dibujar. Música a 96 bpm (rejilla de 0,3125 s).
- Cada trazo empieza en una nota y dura lo que tarda una mano en hacerlo: 0,1 s un palito, 0,25–0,5 s una línea larga, 0,7–1 s una frase.
- Entre planos, corte seco. Si el siguiente plano sigue sobre la misma pizarra, el fondo es el mismo (`boardBackdrop` con la misma semilla) y lo dibujado antes puede quedarse.

## Color

Pizarra `C.board` y tiza `C.chalk` (blanco roto) para casi todo. Tres tizas de color para lo que importa: `C.chalkY` (amarillo), `C.chalkB` (azul) y `C.chalkP` (rosa). Un plano usa blanco y como máximo dos colores.

## Materia

- Fondo: `boardBackdrop(semilla)`, con restos de borrado y pasadas de borrador. Abajo, la repisa de madera con tizas y borrador (`trayBake()`, en `y ≈ 1350`).
- Cada línea es `chalkLine(ctx, puntos, u, {col, w, seed, e})`: textura seca (`chalkTex`), dos pasadas y cortes donde la tiza no marca. `u` va de 0 a 1 mientras se dibuja.
- Formas a mano: `handCircle`, `handLine` y `handArrow` devuelven puntos con temblor de pulso: todo tiene el pulso de una mano.

## Movimiento

- Lo que se mueve es el trazo que avanza, no las figuras. Una figura dibujada se queda donde está; para moverla, se borra y se vuelve a dibujar.
- `expo: 3` (20 poses por segundo) y `boil` suave en el texto.
- La cámara casi quieta: zoom de 1,0 a 1,05.

## Texto

`chalkText(str, {size, col})` hornea el texto con letra a mano (`FONTS.hand`) y textura de tiza; `writeOn(ctx, sp, x, y, u)` lo escribe de izquierda a derecha con la tiza en la punta. Tamaño 140–180 para títulos y 100–130 para notas. Pocas palabras y en minúscula salvo el título.

## Sonido

- Música: `MUSIC = { bpm: 96, key: 'C', mode: 'major', prog: [1, 6, 4, 5], inst: { pad: 'strings', bass: 'bass', keys: 'marimba', lead: 'piano', perc: null } }`. Para un tema serio o misterioso, `mode: 'minor'` y `prog: [1, 6, 3, 7]`.
- **Sincronía**: cada trazo suena a tiza mientras dura (`chalk`, con `dur` igual a lo que tarda el trazo), y cada punto o palito lleva un `tick`.
- Ambiente `room`.

## Revisión

- La pizarra muestra restos de borrado y la repisa con tizas abajo.
- Todo lo dibujado tiene textura de tiza, con cortes secos y temblor de pulso.
- Blanco y como máximo dos tizas de color por plano.
- En la hoja, los trazos avanzan de fotograma en fotograma y el texto se escribe con la tiza en la punta.
- Los títulos van a mano a 140–180 px y se leen enteros.
