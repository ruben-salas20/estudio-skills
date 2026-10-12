# Estilo: motion graphics plano

Vector limpio, colores planos y movimiento fluido con rebote. Es el estilo de las infografías animadas: se lee rápido, se entiende en silencio y aguanta mucho texto. Sirve para biología, medicina, procesos e historia. Kit: `estilos/motion.js` (pégalo entre `KIT-INICIO` y `KIT-FIN`). Prueba resuelta (la insulina y la glucosa, explicativo y con los principios de animación): `estilos/pruebas/motion.html`.

## FORMAT

```js
expo: 1, post: { flicker: 0, grain: 0, vignette: 0, bg: '#F3EEE4' },
ink: [27, 31, 59], light: [255, 255, 255], paper: 0, shadow: null,
```

## Ritmo

- Planos de 2,5–4,5 s. Los sucesos caen en la rejilla del `MUSIC` del estilo: a 110 bpm, una corchea dura 0,27 s.
- Entre planos: corte seco o `wipeIn` (un panel de color barre la pantalla en 0,35–0,4 s).
- Todo entra con rebote: `popIn` como escala, o `life()` si además tiene que salir. Cada aparición es un movimiento.

## Color

`C.bg` (crema claro) de fondo, `C.ink` (azul tinta) para texto y contornos, y cuatro colores planos: `C.blue`, `C.coral`, `C.sun` y `C.mint`. Un plano da protagonismo a tres como máximo; el resto del decorado compartido va atenuado. `C.mist` para formas de fondo que llenan el encuadre sin competir. Un tono plano por forma.

## Materia

- Formas geométricas redondeadas (`rrect`, círculos, curvas suaves) rellenas con `flat()`: color plano más una sombra plana desplazada hacia abajo (`sh`, `sa ≈ .13`). Superficies limpias: color plano y nada más.
- Líneas gruesas con puntas redondas que se dibujan solas con `lineOn()`.
- El fondo siempre lleva 3–5 círculos grandes de `C.mist` que respiran despacio.

## Movimiento

- Fluido a 60 fps (`expo: 1`), sin `boil`.
- Curvas con carácter: `ease.back` para entrar, `ease.elastic` para objetos que caen o rebotan, `eio` para la cámara.
- Cámara casi quieta: zoom de 1,0 a 1,06 como mucho. El movimiento lo ponen las formas, no la cámara.
- La física (caídas, rebotes) se puede calcular analíticamente: `y = y0 + g·t²` da el instante exacto del impacto para la partitura.

## Texto

`kinetic()`: palabra a palabra, subiendo con rebote y escalonadas 0,07 s. `FONTS.display` a peso 800, tamaño 100–130 para titulares y 60–80 para etiquetas. Color `C.ink` sobre claro o `C.white` sobre color. Máximo 5 palabras por rótulo.

## Sonido

- Música: `MUSIC = { bpm: 110, key: 'D', mode: 'major', prog: [1, 5, 6, 4], inst: { pad: 'synth', bass: 'bass', keys: 'synth', lead: 'marimba', perc: 'click' } }`: sintetizador suave con bajo en los tiempos fuertes.
- **Sincronía**: `pop` para formas que entran, `click` para impactos pequeños y `whoosh` para los barridos.
- Ambiente `studio` (casi silencio).

## Revisión

- Fondo crema con 3–5 círculos de `C.mist`; ningún tercio del encuadre queda vacío.
- Como máximo tres colores con protagonismo por plano, cada forma de un solo tono.
- Cada forma lleva su sombra plana desplazada hacia abajo.
- En capturas seguidas, las formas entran con rebote (pasan de su tamaño y vuelven) a lo largo de varios fotogramas.
- Los titulares van a 100–130 px y las etiquetas a 60–80 px, en peso 800, con 5 palabras como máximo, y se leen enteros.
