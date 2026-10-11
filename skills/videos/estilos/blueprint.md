# Estilo: plano técnico (blueprint)

Un plano de ingeniería que se traza solo: líneas blancas finas sobre papel azul, cotas, miras y etiquetas tecleadas. Sirve para explicar cómo está hecho o cómo funciona algo (productos, máquinas, procesos, ciencia) con aire preciso. Kit: `estilos/blueprint.js`. Prueba resuelta (ciclo del agua, 2 planos): `estilos/pruebas/blueprint.html`.

## FORMAT

```js
expo: 1, post: { flicker: 0, grain: .25, vignette: .6, bg: '#173F77' },
ink: [10, 28, 58], light: [234, 242, 255], paper: 0, shadow: null,
```

## Ritmo

- Planos de 2,5–4 s. Música a 96 bpm (rejilla de 0,3125 s).
- Orden de trazado: primero el contorno principal, después los detalles (sección, ondas), después las cotas y al final las etiquetas. Cada elemento empieza en una nota.
- Entre planos, corte seco. El papel (`blueprintBackdrop`) es el mismo en todo el vídeo: hornéalo una vez y compártelo entre planos.

## Color

Papel `C.bp` y línea `C.line` (blanco azulado) para todo. Un único acento, `C.warn` (naranja), solo para lo que el vídeo quiere señalar: una pieza que falla, una medida clave. `lineA(a)` da la línea con transparencia para cuadrículas y rayados.

## Materia

- Fondo `blueprintBackdrop(semilla)`: cuadrícula fina cada 40 px y gruesa cada 200 px, pliegues del papel, marco y cajetín.
- Todo es línea: `techLine(ctx, puntos, u, {w, dash})`. Grosor 5 para contornos, 3 para detalles y 2 para cotas y llamadas. `arcPts` para curvas y círculos.
- Las secciones cortadas llevan rayado a 45° con `sectionHatch`.
- Piezas de dibujo técnico: `dimension` (cota con flechas y medida), `crosshair` (mira sobre centros), `leader` (llamada con punto, línea quebrada y etiqueta) y `arrowHead`.

## Movimiento

- Fluido (`expo: 1`) y sin `boil`: el plano es preciso.
- Lo que se mueve es el trazo que avanza (`u` de 0 a 1). Los elementos vivos (agua, flujo) se mueven poco y de forma regular, con `sin`.
- Cámara casi quieta, zoom de 1,0 a 1,06; si hay que ir a un detalle, corte a un plano más cerrado en lugar de acercarse con la cámara.

## Texto

`techText`: `FONTS.mono`, mayúsculas, espaciado ancho, tecleado letra a letra con cursor. Títulos numerados (`01 · NOMBRE`) arriba a la izquierda a 60–70 px. Etiquetas de 44–52 px y medidas de 34–40 px. Nombres y cifras.

## Sonido

- Música: `MUSIC = { bpm: 100, key: 'A', mode: 'minor', prog: [1, 6, 3, 7], inst: { pad: 'strings', bass: 'bass', keys: 'blip', lead: 'piano', perc: 'tick' } }`. 
- **Sincronía**: cada elemento empieza a trazarse en una nota (acento con `chordAt`), y cada flecha, cota o impacto lleva un `tick`.
- Ambiente `lab` (zumbido eléctrico muy bajo).

## Revisión

- El papel es azul, con cuadrícula, pliegues, marco y cajetín.
- Todo es línea blanca de 2, 3 o 5 px; el naranja `C.warn` aparece solo en lo que se señala.
- Cada elemento importante tiene su etiqueta, cota o llamada, en mayúsculas mono.
- En la hoja, el trazado sigue su orden: contorno, detalle, cotas y etiquetas.
