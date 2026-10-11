---
name: videos
description: Hace vídeos animados dibujados y musicalizados solo con código, de cualquier duración, proporción (16:9, 9:16, 1:1, 4:5), estilo y forma narrativa, con texto y voz opcionales. Entrega un HTML interactivo y un MP4.
disable-model-invocation: true
---

# Vídeos

Convierte un tema en un vídeo hecho solo con código. El motor (`motor.html`) ya resuelve reloj, cámara, texturas, texto, física, sonido, voz y captura; tú escribes la película.

Un vídeo se decide en tres ejes independientes:

- **Formato:** proporción y duración.
- **Estilo** (`estilos/`): cómo se ve y cómo suena. Cada estilo es un `.md` (reglas) y un `.js` (kit de funciones). Hoy existen `papel` (stop-motion de papel recortado), `motion` (motion graphics plano), `pizarra` (tiza que se dibuja sola), `blueprint` (plano técnico), `acuarela`, `pixel` (pixel art) y `3b1b` (matemática animada al modo de 3Blue1Brown, con fórmulas de MathJax).
- **Forma** (`formas/`): cómo se cuenta. Hoy existen `relevo.md` (historia sin palabras con un testigo que pasa de plano en plano) y `explicativo.md` (un concepto por paso, con rótulos).

Otros archivos: `MOTOR.md` (el contrato del código), `usos.md` (valores por plataforma), `voz.md` (narración), `grabar.cjs` (fotogramas, hojas de movimiento y MP4 con el Chromium del sistema) e `incrustar-voz.cjs` (mete la narración en el HTML). Cada estilo, salvo `papel`, tiene una prueba resuelta en `estilos/pruebas/<estilo>.html`, con su música, su sincronía y sus atajos al día.

## Pasos

1. **Encargo.** Fija el uso (dónde se va a ver), los tres ejes y las palabras: duración, proporción, estilo, forma, si lleva texto y si lleva voz. El uso da los valores por defecto de proporción, duración, zona segura y texto mínimo (`usos.md`). Por defecto, sin voz. Menciona que el vídeo puede llevar narración si la persona tiene una herramienta de texto a voz, y recomiéndala cuando el tema lo pida; cómo conseguirla lo resuelve la persona, con tu ayuda si la pide. Lo que no diga, pregúntalo en una sola tanda, proponiendo el valor más probable. Si pide un estilo o una forma que no existe, escríbelo con `estilos/escribir-un-estilo.md` o `formas/escribir-una-forma.md` y pruébalo como dicen esas guías antes de seguir. Está hecho cuando los siete datos tienen valor y el usuario los ha visto.

2. **Guion.** Lee completos el estilo y la forma elegidos. El número de planos sale de la duración y del largo de plano del estilo. Escribe en el chat el título y el guion que pide la forma, plano por plano, con la duración de cada uno y, si hay texto o voz, las palabras exactas. Está hecho cuando cumple lo que la forma exige, cada movimiento sale de una herramienta de `MOTOR.md` o del kit, y el usuario da el visto bueno.

3. **Preparar.** Lee `MOTOR.md` completo. Copia `motor.html` a `<slug>.html` en el directorio de trabajo, o donde diga el usuario. Rellena `{{TITULO}}` y `{{SINOPSIS}}`, el bloque `FORMAT` con la proporción pedida, la zona segura del uso (`safe`) y los valores del estilo, y pega `estilos/<estilo>.js` entre `KIT-INICIO` y `KIT-FIN`. Está hecho cuando `grabar.cjs` saca un fotograma del HTML sin errores de página.

4. **Voz**, si se pidió: sigue `voz.md`. Está hecho cuando cada clip está incrustado y el `dur` de cada plano cubre su frase.

5. **Construir plano a plano** en la sección `TU PELÍCULA`. Si varios planos comparten decorado, constrúyelo una vez con `sharedShot` (`MOTOR.md`, Decorado compartido). Antes de cada plano, busca uno parecido en la prueba del estilo y copia lo que te sirva. Después de cada plano, revísalo:
   ```
   node <carpeta de la skill>/grabar.cjs <slug>.html revision/ --fotogramas A,B,C --ancho 1280
   node <carpeta de la skill>/grabar.cjs <slug>.html revision/hoja-<plano>.jpg --hoja A-C
   ```
   con `A = t0·FPS + 15`, `B` en la mitad del plano y `C = t1·FPS − 10` (en vertical, `--ancho 720`); si el uso tiene zona segura, añade `--zonas` a los dos. Los fotogramas muestran la composición y la hoja muestra el movimiento: 12 fotogramas seguidos, para ver tirones, cosas que aparecen de golpe y ritmo. El plano está hecho cuando el script sale sin errores de página, el **encuadre está lleno** (nada importante cortado por el borde, ningún hueco sin intención), el texto se lee entero dentro de la zona segura con al menos el tamaño mínimo del uso y cada punto de la **Revisión** del estilo se cumple en las imágenes.

6. **Partitura.** La música la genera `compose(MUSIC)` en `baseScore()` con el `MUSIC` del estilo (`MOTOR.md`, Música): elige la tonalidad y la progresión según el tono del tema y pon a cada plano su `energy`, baja en el gancho y alta en el clímax. Los efectos y los acentos van en la `score()` de cada plano, como diga el estilo. Está hecha cuando hay **sincronía** (`MOTOR.md`, Sincronía) en todo el vídeo y cada plano tiene su `energy`.

7. **Revisión final.** Saca dos fotogramas por corte (`t1·FPS − 10` del plano que acaba y `t0·FPS + 15` del que empieza), júntalos en una hoja y mírala. Está hecha cuando cada corte cumple la revisión que pide la forma y el último plano cierra el vídeo.

8. **Exportar.** `node <carpeta de la skill>/grabar.cjs <slug>.html <slug>.mp4` genera el vídeo con el lado corto a 1080 px, el sonido normalizado a −14 LUFS (el nivel de las redes; `--lufs` lo cambia) y lo verifica. Tarda unos 9 s por segundo de vídeo. Está hecho cuando la última línea muestra la duración igual a `DUR`, un nivel cercano a −14 LUFS y el pico por debajo de −1 dBTP. Entrega las dos rutas: el MP4 y el HTML, que en el navegador se puede tocar (clic) y soplar (arrastrar).
