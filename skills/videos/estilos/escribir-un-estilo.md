# Escribir un estilo nuevo

Un estilo dice cómo se ve y cómo suena un vídeo; no dice qué se cuenta (eso es la forma). Se escribe cuando el usuario pide una estética que no está en `estilos/`. Son dos archivos: `estilos/<nombre>.md` con las reglas y `estilos/<nombre>.js` con el kit, las funciones de dibujo propias del estilo (fondo, trazos, texto), que se pegan en `TU PELÍCULA`. Modelos: `estilos/pizarra.md` y `estilos/pizarra.js`.

## Qué debe fijar

Cada sección nombra valores concretos y la función del motor que los produce, para que dos vídeos del mismo estilo parezcan de la misma mano.

1. **FORMAT.** `expo` (5 = stop motion, 2 = animación a doses, 1 = movimiento continuo), `post` (parpadeo, grano, viñeta, color de fondo), `ink` y `light` (hacia dónde oscurece y aclara `tone()`) `paper` (textura por defecto de los sprites; 0 para superficies planas), `shadow` (sombra por defecto; `null` para ninguna) y `pixel` (rejilla de pixeles sin suavizado).
2. **Ritmo.** Duración típica de un plano, tipo de transición (corte seco, fundido, barrido) y tempo de la música.
3. **Color.** La paleta completa: el kit sustituye o amplía `C` con `Object.assign(C, {...})` en su primera línea. Cuántos acentos y para qué.
4. **Materia.** De qué están hechas las figuras y los fondos: recortes con sombra, vector plano sin sombra (`shadow: null, paper: 0`), trazo de tiza, etc. Qué capas de textura llevan (`hatch`, `stipple`, `backdrop`).
5. **Movimiento.** Cómo se mueve la cámara, si las figuras hierven (`boil`), qué curvas usan (`eio`, `eo`, resortes) y qué mueve la física.
6. **Personajes**, si los hay: construcción y cómo actúan.
7. **Texto.** Tipografía (`FONTS.*` o una fuente incrustada con `@font-face` en base64), tamaños, cómo entra y sale y cómo se integra con la materia.
8. **Sonido.** El `MUSIC` del estilo para `compose` (tonalidad, progresión e instrumento de cada capa; ver `MOTOR.md`, Música), el ambiente (`bed`) y la **sincronía**: con qué suena cada clase de suceso del estilo. Si ningún sonido del motor sirve, añade uno a la clase `Sound` de `motor.html` y a su `play()`, y documéntalo en `MOTOR.md`.

9. **Revisión.** De 4 a 6 comprobaciones que se ven en un fotograma o en la hoja de movimiento. Son el criterio con el que el paso 5 da un plano por hecho, así que cada una se contesta con sí o no mirando la imagen.

## Cómo probarlo

Antes de usarlo en el vídeo del usuario, haz un vídeo de prueba de dos planos y 5 s sobre un tema neutro (las pruebas existentes usan el ciclo del agua: evaporación y lluvia). Revisa tres fotogramas y una hoja de movimiento por plano con `grabar.cjs` y ajusta el archivo hasta que las imágenes cumplan lo que dice. Guarda la prueba en `estilos/pruebas/<nombre>.html`: es la referencia resuelta del estilo. Enseña los fotogramas al usuario y espera su visto bueno antes de dar el estilo por bueno.
