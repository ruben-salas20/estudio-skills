---
name: escenas-3d
description: Hace una escena 3D con Three.js que se mueve y se toca, para entender algo que se ve mejor en tres dimensiones. Se incrusta en una nota.
disable-model-invocation: true
---

# Escenas 3D

Una **escena** es un solo archivo `.html` que se abre con doble clic y se incrusta en la **nota**, la página con la que se estudia. Solo merece 3D lo que hay que girar, piezas que se tapan, un mecanismo o una superficie; si un dibujo plano lo explica, plano. Esta skill hace la escena; la explicación la escribe quien escribe la nota.

## Pasos

1. **Elige el objeto y la pregunta.** El objeto es una cosa reconocible cuyo funcionamiento *sea* la idea; cajas y flechas flotando no son un objeto. La pregunta es la duda o la idea errónea que la escena responde: «una lupa agranda lo que miras, pero aléjala un poco y la imagen se da la vuelta: ¿dónde cambia?». Planea de 2 a 4 **momentos**, estados que enseñan algo distinto cada uno, con una sola diferencia de fondo entre ellos; el primero es el inicial y ya responde la pregunta. Si la escena se mueve, verla en marcha es uno de los momentos: en la nota solo se ven los momentos. Reúne antes las cifras reales (tamaños, valores, tiempos). Hecho cuando hay objeto, pregunta y momentos con lo que enseña cada uno, y cada número tiene una fuente que hayas comprobado o queda marcado como elegido, simulado o exagerado.

2. **Copia `escena.html`** junto a la nota (si te invocó la persona, pregúntale en qué nota va), o donde el proyecto guarde sus adjuntos: mira cómo está organizado y sigue ese patrón. Nombre en minúsculas, sin tildes y con guiones (`corazon-latiendo.html`); el título con tildes va en el `<title>`. Hecho cuando el archivo existe.

3. **Escribe la escena** entre las marcas `CONTENIDO`, sustituyendo el ejemplo, y en el `aria-label` del lienzo, qué se ve en una frase; el resto de la plantilla no se toca. Cada función está explicada en un comentario de la plantilla.
   - **La pregunta** va en el gancho de `cabecera()`. **Los momentos**, en un `grupo(…, { principal: true })` con una opción por momento. En la nota solo se ven la escena, las etiquetas, esa fila y la `lineaCorta()`: la conclusión del estado en una idea y un número. Lo demás sale a pantalla completa.
   - **Lo construido parece real**, porque es lo que da ganas de mirarlo: la forma del objeto de verdad, abierto o cortado si lo que importa está dentro, y cada superficie con el material de lo que es. Lee en `recetas-visuales.md` la receta que su tabla te indique. Resplandor y emisivo solo en lo que emite luz; nada de neón ni efectos que no signifiquen algo.
   - **Los números que cambian se ven**: de 3 a 4 `cifra()`, un `relato()` que narra el estado actual con sus valores, etiquetas con valor («Aorta · 123 mmHg») y, si ayuda, un `grafico()`. Todo sale de una sola función del estado y del tiempo, la misma que mueve las piezas: esas funciones reciben `(e, t)` y se repintan mientras anima.
   - **El color significa algo o no está**: `mat('azul')` y los demás semánticos; los tintes de material (músculo, cobre, roca) con `ampliarTemas()`.
   - **La primera vista ya cuenta la idea**: mucha gente no gira nada.
   - **El movimiento es función pura del tiempo y del estado** (`animar(t, e)`), para que `?t=` repita el fotograma.
   - Los nombres de la plantilla (`escena`, `camara`, `render`, `estado`, `t`…) no se redeclaran: la escena falla al arrancar.
   - `linewidth` se ignora: una línea gruesa es un tubo.

   Hecho cuando cada pieza que se mueve corresponde a algo del paso 1 (**Elige el objeto y la pregunta**) y cada momento es una opción del grupo principal.

4. **Captura y mira.** Abre el PNG siempre: el encuadre, las etiquetas pisadas y la luz solo se ven mirando.

   ```sh
   chromium --headless --enable-unsafe-swiftshader --use-angle=swiftshader --window-size=700,394 \
     --virtual-time-budget=8000 --screenshot=captura.png "file://<ruta>/escena.html?t=1&tema=claro&formato=compacto"
   ```

   Vale `chrome` o `google-chrome` en lugar de `chromium`. El formato **compacto** es como se ve en la nota; el **completo**, a pantalla completa con las tarjetas (`--window-size=1400,788` y `formato=completo`). Captura cada momento en compacto y claro (`&e=clave:valor,clave:valor`), uno en oscuro, uno en completo y cada vista (`&vista=`). Los avisos que Chromium escribe en la terminal no cuentan: manda la captura. Hecho cuando ninguna captura tiene un mensaje de error en rojo, lo que cambia entre momentos es lo más grande del encuadre y nada lo tapa, las etiquetas no se pisan, se ve en los dos temas y, tapando el texto, dos momentos se distinguen a simple vista.

5. **Entrega.** A quien te llamó, o a la persona: la ruta, el `<iframe>` y la lista de lo que la nota necesita (la pregunta, para escribirla encima; cada color por su nombre y cada etiqueta, para la leyenda; cada momento y vista, con lo que enseña, para los botones; qué cifras son elegidas, simuladas o exageradas). Si te invocó la persona, copia `incrustar.js` junto a la nota y pega la pregunta, el `iframe` y, debajo, un botón `data-3d` por momento (y por vista, si ayuda) y la leyenda. Hecho cuando quien escribe la nota puede hacerlo sin abrir la escena.

## Incrustar en una nota

```html
<iframe id="corazon" src="corazon-latiendo.html" title="Corazón latiendo, con la sangre por sus cavidades"
        allowfullscreen loading="lazy" style="width:100%; aspect-ratio:16/9; border:0"></iframe>
<p>… <button data-3d='{"en":"corazon","momento":"expulsion"}'>Ver la expulsión</button></p>
<script src="incrustar.js"></script>
```

La nota carga `incrustar.js` una vez, copiado junto a ella. Pasa a la escena el tema y los colores de la nota, y lleva cada botón `data-3d` a la escena: `en` es el `id` del `iframe`, `vista` cambia el encuadre y las demás claves cambian el estado. Lee los colores del kit de `/crear-kit` (`--fondo`, `--acento`…); si el kit los llama de otro modo, cambia su tabla `DE_LA_NOTA` y anótalo en `<RAIZ>/MEJORAS.md`, para que el setup lo reaplique tras cada actualización. Sin `allowfullscreen` no funciona ⛶. En una nota Markdown cuyo visor no admite HTML, enlaza la escena.
