# Estilo: stop-motion de papel recortado

Recortes de papel animados a 12 fotogramas por segundo, como un stop-motion hecho a mano. Kit: `estilos/papel.js` (`shadeBody`, `speck`, `spring`). Este archivo dice cómo se ve y cómo suena un vídeo de papel. Cómo se cuenta lo dice la forma (`formas/`). Cada regla nombra la función del motor que la cumple.

## FORMAT

```js
expo: 5, post: { flicker: .05, grain: .6, vignette: 1, bg: '#0c1719' },
ink: [12, 22, 25], light: [242, 234, 216], paper: .45,
shadow: { dx: 6, dy: 9, blur: 11, a: .3 },
```

`w` y `h` salen de la proporción pedida (ver `MOTOR.md`). En vertical (9:16 y 4:5) el encuadre se compone en altura: el suelo abajo, el personaje en el centro y el aire arriba para lo que cae o vuela.

## Ritmo

- Planos de **2,5 s**, un compás de caja de música a 96 bpm por plano, separados por corte seco. Dentro de un plano no hay cortes. Un vídeo de N segundos lleva N / 2,5 planos; si la forma pide un plano más largo, que dure 5 s (dos compases).
- Encuadre lleno de borde a borde. Un plano de mesa lleva 5–6 objetos; un exterior lleva 3–5 capas de profundidad.

## Color

- Paleta de impresión `C`: fondo verde azulado apagado (`teal`, `navy`, `hill*`), **un solo acento rojo coral** (`red`, `coral`) para el protagonista y lo que importa, crema de papel (`cream`, `paper`) y tinta casi negra (`ink`).
- Las sombras y luces salen de `tone(color, k)`: oscurece hacia la tinta y aclara hacia el papel, así todo tono se queda dentro de la tinta impresa.
- Si el tema exige un color que no está, añade como máximo dos a `C`, desaturados y con la misma luz que el resto.

## Materia

- Toda figura es un **recorte**: `sprite()` le hornea textura de papel (`paper: .3–.45`) y sombra de contacto. La luz es una sola, arriba a la izquierda, y las sombras caen abajo a la derecha (`dx, dy` positivos, `a ≈ .3`).
- Los bordes grandes se cortan a mano: `cutPath` para polígonos y `blobPath` para formas redondas.
- Las superficies llevan capas de impresión recortadas con `withClip`: `hatch` (líneas finas, `a ≈ .1`), `stipple` (motas claras y oscuras) y un degradado lateral de luz (`shadeBody` en el plano 1 de la referencia).
- Los fondos grandes salen de `backdrop()`: degradado, moteado, fibras (`vstreak`/`hstreak`), arañazos, polvo y brillo de la luz principal. El motor añade viñeta, grano y parpadeo de exposición.

## Movimiento

- Las marionetas posan **12 veces por segundo** (`expo: 5`): el motor fotografía el estado cada 5 fotogramas (`snap`) y `draw` dibuja solo esa foto. La cámara se mueve suave en cada fotograma: ese contraste es el estilo.
- Cada marioneta **hierve**: suma `boil(id, e, amt)` a su posición y rotación en cada exposición, porque el animador la recoloca a mano.
- La cámara es de control de movimiento: acercamiento lento y suavizado (`z` de 1,0 a 1,2 con `eio`) y leve desplazamiento. Los fondos van en capas de paralaje con `setCam(ctx, cam, p)`: `p` entre .1 y .5 para el fondo, `p = 1` para el plano de las marionetas.
- La física da la vida, las curvas a mano solo dirigen. `Rope` mueve todo lo flexible (vapor, cables, pelo, colas, cuerdas). `petalStep` mueve todo lo que planea al caer (pétalos, hojas, papel, plumas, confeti). Un resorte (`a += va`) mueve lo que se mece (ramas, objetos golpeados). `curl` hace las derivas.
- Todo lo que se mueve lee `gustAt()` (el soplo del espectador) y responde a `poke()`.

## Personajes

- Formas simples, ojos de punto, mejillas rosadas y pelo en masa de tinta.
- El cuerpo va en piezas separadas (piernas, torso, cabeza con pivote en el cuello) para posarlas como marioneta. Los ojos, los parpadeos y el rubor son piezas de reemplazo que se dibujan encima.
- Actúan con gestos pequeños: girar la cabeza, parpadear, sonrojarse, dar saltitos.

## Texto

Solo si el vídeo lleva texto. Cada rótulo es un **recorte más**: `drawText` dentro de un `sprite()`, sobre una tira de papel crema cortada con `cutPath`, con tinta `ink` (o `red` para la palabra que importa), `FONTS.serif` y sombra de contacto. Entra como una marioneta: se posa, hierve y lo mueve la física. Pocas palabras: un nombre o una frase corta.

## Sonido

- Todo el sonido es sintético (`Sound`), salvo la voz si se pidió. Música: `MUSIC = { bpm: 96, key: 'G', mode: 'major', prog: [1, 4, 6, 5], inst: { pad: 'strings', bass: 'bass', keys: 'mb', lead: 'mb', perc: null } }`, una **caja de música** en tono mayor.
- **Sincronía** total (*mickey-mousing*): lo que florece, se suelta o aterriza lleva un acento de caja de música con `chordAt`, y lo físico suena con su efecto (`thump`, `rustle`, `flap`, `clink`…).
- Cada plano lleva su ambiente (`bed`: `room`, `street`, `field`, `stage`) con fundido en los cortes.
- Con voz, los acentos caen en los silencios entre frases.

## Revisión

- El encuadre está lleno: 5–6 objetos en un plano de mesa, 3–5 capas en un exterior.
- Hay un solo acento rojo coral, en el protagonista o en lo que importa.
- Cada figura tiene textura de papel y sombra hacia abajo a la derecha.
- El fondo muestra fibras, moteado y grano.
- En la hoja, las marionetas cambian de pose a saltos (una pose cada 5 fotogramas) y hierven: cada pose difiere un poco de la anterior aunque la figura esté quieta.
- Los rótulos, si los hay, son tiras de papel crema con sombra y se leen enteros.
