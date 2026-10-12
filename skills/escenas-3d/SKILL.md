---
name: escenas-3d
description: Escenas 3D interactivas con Three.js para entender algo — una figura, un mecanismo o un fenómeno que se ve mejor en tres dimensiones, como visualización, simulación o maqueta. Cada escena es un archivo .html que se abre solo con doble clic y se incrusta en las notas de estudio, como figura o como laboratorio.
---

# Escenas 3D con Three.js

Cada **escena** es un solo archivo `.html`: Three.js llega por importmap desde jsdelivr y todo lo demás va dentro. Se abre con doble clic en cualquier navegador y se incrusta en la **nota** (la página que explica el tema) con un `iframe`. El código común de todas las escenas, el **núcleo** (cámara, luces, órbita, etiquetas, vistas, tema, órdenes de la nota), vive una sola vez en `assets/nucleo.js`; `scripts/armar.mjs` lo copia dentro de cada escena.

## Elegir modo

| | **Figura** (`assets/figura.html`) | **Laboratorio** (`assets/laboratorio.html`) |
|---|---|---|
| Para qué | mirar y girar una forma o un mecanismo | un fenómeno con modelo real que el lector manipula |
| Texto en la escena | solo mandos y etiquetas que nombran | gancho, cifras vivas, relato, etiquetas con valor |
| Formatos | la escena y sus mandos debajo | compacto incrustado; completo con ⛶ o abierto solo en una ventana ancha |
| Temas | claro y oscuro | claro y oscuro |

Laboratorio cuando hay una fórmula o simulación con variables y una idea errónea que un número puede romper. Su estilo es el de sael.net/visual-learning en lo didáctico y en el *realismo* de lo construido, sin su *decoración* (neón, bloom, reflejo del suelo, desenfoque). Si al rellenar la ficha de `references/laboratorio.md` no salen presets con una *revelación* distinta cada uno, es una figura.

**¿Toca 3D?** Solo si la tercera dimensión *es* la información: algo que hay que girar mentalmente, piezas que se tapan y ese tapar es parte del asunto, un mecanismo con partes que se mueven entre sí, una superficie sobre dos variables, o una escala que no se cree hasta verla. Jerarquías, procesos y comparaciones van en un diagrama plano. Si el dibujo plano ya lo explica, plano.

## Pasos

1. **Inventa el objeto.** Elige una máquina, instrumento o maqueta reconocible cuyo funcionamiento *sea* la idea, y di en una frase qué se mueve y qué significa ese movimiento: «un fichero de 128 cajones; por cada token se abren los 8 expertos elegidos y cada cajón sale según su peso». Reúne las cifras reales (tamaños, cantidades, umbrales) antes de modelar: la escena las muestra y la nota las cita. Si el objeto son cajas y flechas flotando, no hay objeto todavía. Hecho cuando la frase existe y cada número de la escena tiene su fuente o queda marcado como simulado.

2. **Crea la escena con su nombre definitivo.** `node scripts/armar.mjs --nueva figura|laboratorio <carpeta>/<nombre>.html` copia la plantilla y le escribe el núcleo. Va junto a la nota que la incrusta; si el proyecto ya guarda adjuntos en una carpeta, ahí: mira cómo está organizado y sigue ese patrón. En laboratorio, rellena antes la ficha de `references/laboratorio.md`. Hecho cuando el archivo existe y su nombre sigue § Nombres de archivo.

3. **Escribe solo el contenido.** En figura, la función `montar(k)`; en laboratorio, solo `CONTENIDO`, el antetítulo, el título y el gancho. Pon en el `<title>` el título con tildes y en el `aria-label` de `.escena3d` qué se ve, en una frase. Hecho cuando `node scripts/validar.js <escena>.html` termina en `TODO OK`.

4. **Captura y mira.** `node scripts/captura.mjs <escena>.html captura.png -t 1` y abre el PNG para mirarlo, siempre: encuadre, contraste, etiquetas pisadas, luz aplanada, sombras recortadas y *z-fighting* solo se ven mirando. La captura abre la escena como un doble clic, así que lo que carga en ella carga en cualquier navegador. Opciones: `-v vista`; `--tema claro|oscuro`; en laboratorio, `--todo` (compacto/completo × claro/oscuro), `--estado "k:v,…"` y `--formato`; `--ancho`/`--alto` para el tamaño del hueco donde irá incrustada. Hecho cuando la línea `diag:` dice `OK` (un PNG puede ser la página de error del navegador), la primera vista ya contiene la idea principal y lo importante ocupa sitio en el lienzo, sin quedar tapado.

5. **Si hay movimiento, comprueba que va a alguna parte.** Captura al menos 3 valores de `-t`. Hecho cuando las capturas muestran el cambio que explica la escena.

6. **Incrusta la escena en la nota y escríbela.** Sigue § Incrustar en una nota. Escribe la explicación después de mirar las capturas, con los nombres de las etiquetas y los colores que salieron. Hecho cuando la nota abre la escena, cada botón `data-3d` la lleva al punto que explica su párrafo y la nota tiene lo que pide § Modo figura o § Modo laboratorio.

## Nombres de archivo

Minúsculas ASCII y guiones: `protoboard-tiras.html`, `router-moe.html`. El nombre se teclea en la terminal y va en el `src` del `iframe`, donde un espacio obliga a escapar. El título con tildes va en el `<title>`; el nombre del archivo, sin tildes ni espacios, lo comprueba `validar.js`.

## Incrustar en una nota

La nota pone cada escena en un `iframe` con `id` y carga `assets/incrustar.js` una vez, copiado junto a la nota o pegado en un `<script>`:

```html
<iframe id="router" src="router-moe.html" title="Fichero de 128 cajones que abre 8 por token"
        allowfullscreen loading="lazy" style="width:100%; aspect-ratio:16/10; border:0; border-radius:12px"></iframe>
<p>… <button data-3d='{"en":"router","vista":"lado"}'>Ver de lado</button></p>
<script src="incrustar.js"></script>
```

- `en` es el `id` del `iframe` (se omite con una sola escena), `vista` cambia el encuadre y el resto lo recibe el `orden()` de la escena.
- `incrustar.js` pasa a la escena el tema de la nota (claro u oscuro, según su fondo) y sus colores. Lee las variables del kit de `/crear-kit` (`--fondo`, `--texto`, `--acento`…); si el kit de la persona las llama de otro modo, cambia la tabla `DE_LA_NOTA` de `assets/incrustar.js` (mira cómo está organizado su kit y sigue ese patrón) y anótalo en `<RAIZ>/MEJORAS.md` como ajuste de esta máquina, para que el setup lo reaplique tras cada actualización. Sin esas variables, la escena usa sus colores.
- `allowfullscreen` hace falta para el ⛶ del laboratorio. `allow="fullscreen"` no sirve: solo autoriza al origen del `src`, y una escena abierta desde el disco no tiene origen con el que compararlo. La proporción del hueco la pone el `aspect-ratio` del `iframe`; los mandos ocupan su parte de abajo.
- Incrustada, la rueda del ratón desplaza la nota y el zoom se da con las vistas. Abierta sola, la rueda acerca.
- Una nota en Markdown la incrusta con el mismo `<iframe>` si su visor admite HTML; si no, un enlace a la escena.

## Reglas comunes

- **El movimiento es función pura del tiempo**: `malla.rotation.y = t * 0.6` dentro de `actualizar(t)`. Así `?t=` reproduce el fotograma y las capturas se comparan.
- **El núcleo y el andamiaje son de las plantillas.** Lo de entre las marcas `NÚCLEO` lo escribe solo `armar.mjs`: una mejora se hace en `assets/nucleo.js` y se propaga con `node scripts/armar.mjs <escenas…>`. En laboratorio se sustituye solo `CONTENIDO`; lo que una escena necesite del andamiaje se añade a `assets/laboratorio.html` con una API y se copia a los laboratorios que lo usen.
- **Registrar los mandos después de crear lo que manejan**: invocan su callback al registrarse, y un `const` declarado más abajo da `ReferenceError` y la escena no arranca.
- **Nombres del andamiaje, intocables en CONTENIDO** (`camara`, `render`, `escena`, `t`, `estado`, `cifras`, `tema`…): redeclararlos deja la escena en `sin-arrancar` sin mensaje. `validar.js` los detecta; lista con `node scripts/validar.js --reservados assets/laboratorio.html`.
- **Todo color que dependa del tema pasa por el núcleo** (figura: `k.alCambiarTema` con los colores de `k.colores`; laboratorio: `mat()` y `ampliarTemas`): la nota puede cambiar de tema con la escena abierta.
- **`localStorage` con prefijo** `escenas-3d:` (o `escenas-3d/<escena>:`): las escenas abiertas desde el disco pueden compartir almacenamiento.
- **Sin archivos locales**: abierta con doble clic, la escena no puede cargar modelos ni texturas de la carpeta (el navegador lo bloquea). Geometría construida en código y texturas generadas en canvas.

## Trampas de Three.js ya pagadas

- `LineBasicMaterial.linewidth` se ignora: toda línea sale de 1 px. Grosor real con `TubeGeometry` sobre una curva, o `Line2` con `material.resolution` al redimensionar.
- Un objeto transparente que escribe profundidad recorta lo que se dibuja detrás (un halo abre un agujero en el suelo): halos, gases y volúmenes con `depthWrite: false`.
- Desde r155 las luces son físicas: `PointLight` decae con el cuadrado y necesita intensidades de decenas o cientos; la direccional va bien en 1–3.
- Metal sin entorno sale casi negro: `metalness` por debajo de 0.5, o `RoomEnvironment` con PMREM generado una vez (`references/recetas-visuales.md`).
- El frustum de sombra por defecto es pequeño y la recorta en seco: ajustar `shadow.camera` a la escena.
- `cerca`/`lejos` de la cámara ajustados a la escena, o hay *z-fighting*.
- Al regenerar geometría, `geometry.dispose()` la anterior o se agota la memoria de la GPU.
- Cientos de piezas iguales (cajones, agujeros, celdas): un `InstancedMesh` por pieza y `setMatrixAt` para moverlas, no una malla por pieza.
- Raycast sobre líneas y puntos: subir `params.Line.threshold` / `params.Points.threshold`.
- `colorSpace = SRGBColorSpace` solo en texturas de color, no en normales ni datos.
- `THREE.Timer` en lugar de `Clock`, y `PCFShadowMap` en lugar de `PCFSoftShadowMap`: desde r185 los retirados dejan un aviso en la consola.

## Modo figura

**La escena muestra, la nota explica.** La escena trae la figura y sus mandos; las etiquetas 3D solo nombran piezas en dos o tres palabras. Junto al `iframe`, la nota lleva, con los nombres de la escena: qué se ve y por qué merece tres dimensiones; la leyenda (cada color y cada pieza con nombre); cómo funciona, con el detalle que haga falta (si cabe en dos líneas, la escena sobraba); y un renglón por mando con lo que cambia y lo que enseña. Los botones `data-3d` de la nota llevan la escena al punto que explica cada párrafo.

API de `k`: los comentarios de `assets/nucleo.js`. Lo esencial: `THREE`, `escena`, `camara`, `render`, `orbita`, `sol`, `hemi` (luces ya puestas), `mandos` (fila bajo el lienzo, donde el núcleo pone los botones de vista), `colores`, `pedir()`, `alCambiarTema(fn)`, `etiqueta(obj, texto, {color, alto})`, `sombraSuelo(y, lado)` y `vistas = {clave: {nombre, pos, mira}}`. `montar` devuelve `actualizar(t)` si hay movimiento y `orden(d)` para los botones de la nota. Sin `actualizar`, la escena se dibuja solo cuando algo cambia: llama a `k.pedir()` después de cambiarla fuera de `alCambiarTema`. URL: `?vista=`, `?t=`, `?tema=claro|oscuro`.

## Modo laboratorio

Leer antes `references/laboratorio.md` entero, y `references/recetas-visuales.md` si hay realismo que construir. Cada helper está comentado en el andamiaje de la plantilla; lo esencial:

- **Estado, única fuente de verdad**: `definirEstado({…})`, `cambiar({…})`, y `alCambiar(fn)` aplica el estado a la geometría. Mandos, cifras, relato, etiquetas y gráfico se recalculan solos.
- **Mandos**: `grupo(rótulo, clave, opciones, {principal})` — el `principal` baja a la fila de abajo del compacto. Una opción puede fijar varias claves: `{ texto, valor?, fija: {k: v} }`. `deslizador(rótulo, clave, {min, max, paso, formato, tambien, mostrar})`, `capa(rótulo, clave, tecla)`. Para «animando», una clave booleana con `fija`.
- **Texto**: `cifra(rótulo, e => ({valor, unidad, sub}))`, `relato(e => html)`, `etiqueta(obj, e => texto, {color, alto, lado, opcional, prioridad})`, `grafico(rótulo, (ctx, w, h, e, colores) => …)`, `ayuda(html)` para la línea de supuestos del modelo. Números con `num(v, d)`.
- **Animación**: `ANIMADA = true` y `animar = (t, e) => {…}`, función pura del tiempo y del estado. El botón de pausa sale solo mientras `ANIMADA`. `suavizar(objeto, destinos, ms)` interpola un cambio de estado en vez de saltar.
- **Color**: `mat('azul')` y demás semánticos de `TEMAS`; colores propios y tintes físicos con `ampliarTemas({claro, oscuro})` (mismas claves en ambos; las reservadas las lista el error). Lo que `mat()` no cubre, en `alCambiarTema(fn)`.
- **Vistas**: `VISTAS.clave = {pos, mira, compacto?, oculta?}` — `compacto` da otro encuadre al formato compacto; `oculta` no crea botón pero sirve a `mirarDesde`. `ASPECTO_BASE` admite `{completo, compacto}`.
- **Formato**: compacto cuando está incrustada; completo con ⛶ o abierta sola en una ventana de 1100 px o más. `?formato=` lo fija.
- **Render bajo demanda**: se dibuja solo si algo cambió, la órbita se mueve, hay un `suavizar` en curso o `ANIMADA`. `marcarSombras()` cuando cambie algo que proyecta sombra. Sin posprocesado (`validar.js` lo marca como fallo).
- **URL**: `?t=`, `?vista=`, `?tema=`, `?formato=`, `?e=clave:valor,…`.
- **Comprobación**: las capturas de `--todo` con la lista final de `references/laboratorio.md`.

## Referencias

- `references/laboratorio.md` — diseño del laboratorio: ficha, textos, reparto escena↔nota, estética, composición, fenómenos en el tiempo, comprobación.
- `references/recetas-visuales.md` — técnicas de realismo sin posprocesado con código; su tabla inicial dice cuál usar según el tema.
- `references/patrones-didacticos.md` — diez patrones de escena (corte, explosionado, campo, rastro, paso a paso…) con su palabra guía, para los dos modos.
- `references/ejemplos/` — tres laboratorios aprobados (`motor-raptor-flujo-completo`: flujo, llama, metal, corte con sección; `como-un-rio-rehace-su-valle`: simulación en el tiempo, terreno; `como-bombea-el-corazon`: ciclo con texto vivo, geometría orgánica). Su arranque es anterior al núcleo: sirven para el modelo, la geometría y los textos, no para copiar el andamiaje. `validar.js` no los lee.
- Documentación oficial de una clase: `https://threejs.org/docs/pages/{Clase}.html.md` consultada antes de usar una API que no esté en las plantillas; la documentación completa condensada, en `https://threejs.org/docs/llms-full.txt`.

**WebGL por defecto**: es lo que renderizan las capturas headless. `WebGPURenderer` solo si hacen falta shaders TSL o cómputo en GPU, avisando de que la captura puede fallar.
