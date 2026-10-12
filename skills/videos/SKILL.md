---
name: videos
description: Hace un vídeo explicativo animado con código, con música y voz opcional, para entender algo que cambia con el tiempo. Se incrusta en una nota.
disable-model-invocation: true
---

# Vídeos

Un **vídeo** es un solo archivo `.html` que se reproduce en el navegador, con sonido y controles, y se incrusta en la **nota**, la página con la que se estudia. Todo sale de código: `motor.html` resuelve reloj, cámara, texto, física, música y voz, y tú escribes los planos. Esta skill hace el vídeo; la explicación la escribe quien escribe la nota.

Tres estilos: **`3b1b`** (matemática animada al modo de 3Blue1Brown) si el tema tiene fórmulas o gráficas; **`pixel`** (pixel art) para algoritmos, datos e informática; y **`motion`** (infografía plana sobre fondo claro) para lo demás: biología, medicina, procesos, historia. Cada uno tiene sus reglas (`estilos/<estilo>.md`), su kit (`estilos/<estilo>.js`) y un vídeo resuelto (`estilos/pruebas/<estilo>.html`).

## Pasos

1. **Fija el encargo.** Propón en una sola tanda el tema, la pregunta que el vídeo responde, la duración (de 30 a 120 s), el estilo y si lleva voz. Ofrece siempre la voz: una voz que explica mientras la imagen muestra enseña más, pero solo si la persona tiene una herramienta de texto a voz. Si te invocó la persona, pregunta también en qué nota va. Hecho cuando la persona aprueba el encargo.

2. **Escribe el guion.** Lee entero el estilo. El vídeo es **explicativo**: enseña algo con partes y un orden, y al terminar quien lo ve sabe nombrarlas.
   - **Gancho**, el primer 10 %: el objeto entero, sin explicar, y la pregunta.
   - **Pasos**, el 75 %: un concepto por paso, de 1 a 3 planos, en el orden en que se aprende. Cada paso **muestra** el suceso, lo **nombra** y enseña su **consecuencia**.
   - **Síntesis**, el 15 % final: todo junto, con los nombres a la vista, y la respuesta a la pregunta.
   - Un **hilo** recorre el vídeo: el mismo objeto o decorado vuelve en cada paso (`sharedShot`, en `MOTOR.md`). Causa y efecto aparecen a la vez en el mismo encuadre.
   - **Rótulos** de 5 palabras como máximo, como mucho uno nuevo por plano, pegados a lo que nombran, en el instante de su suceso y al menos `0,8 s + 0,3 s por palabra`. Con voz, la voz explica y los rótulos solo nombran.

   Escribe en el chat, por plano: la parte, lo que se ve, la **acción principal** con su anticipación, la acción y la reacción en segundos (§ Animación), el rótulo exacto, los sucesos que suenan y la duración. Hecho cuando cada paso cuenta un solo concepto, cada uno se entiende con lo visto antes, cada plano tiene una sola acción principal con sus tres tiempos y la persona da el visto bueno.

3. **Prepara el archivo.** Lee entero `MOTOR.md`. Copia `motor.html` como `<nombre>.html` junto a la nota (o donde el proyecto guarde sus adjuntos: mira cómo está organizado y sigue ese patrón). Rellena `{{TITULO}}` y `{{SINOPSIS}}`, el bloque `FORMAT` con los valores del estilo y un `poster` y pega `estilos/<estilo>.js` entre `KIT-INICIO` y `KIT-FIN`. Hecho cuando la captura del paso 5 sale sin error.

4. **Voz**, si se pidió: sigue `voz.md`. Hecho cuando cada clip está incrustado y el `dur` de cada plano cubre su frase.

5. **Construye plano a plano** en `TU PELÍCULA`. Antes de cada plano, busca uno parecido en la prueba del estilo y copia lo que te sirva. Después, captura en una carpeta `revision/` junto al vídeo y mira tres fotogramas: `A = t0·FPS + 15`, `B` a la mitad y `C = t1·FPS − 10`. Redondea todo fotograma de revisión hacia arriba, a un múltiplo de `expo`, para no caer en la pose ni el plano anteriores.

   ```sh
   chromium --headless --enable-unsafe-swiftshader --use-angle=swiftshader --window-size=1280,720 \
     --virtual-time-budget=10000 --screenshot=revision/plano3-A.png "file://<ruta>/<nombre>.html?frame=A&ui=0"
   ```

   Vale `chrome` o `google-chrome` en lugar de `chromium`; los avisos que escribe en la terminal no cuentan. Además, captura la acción principal en cinco fotogramas: inicio y mitad de la anticipación, mitad de la acción, el 75 % de la acción (donde `llegar` se pasa) y 0,3 s después de acabar. Hecho cuando ninguna captura tiene un `ERROR` en rojo, en las cinco seguidas se ven la anticipación y, si algo se desplaza, el arco y el sobrepaso al parar, y lo que no es la acción está quieto o atenuado, el encuadre está lleno (nada importante cortado, ningún hueco sin intención), el rótulo se lee entero, con el tamaño que da el estilo, y se cumple la **Revisión** del estilo.

6. **Pon el sonido.** La música sale de `compose(MUSIC)` con el `MUSIC` del estilo (`MOTOR.md`, Música). Usa la tonalidad del estilo y su rango de `energy` (si no lo da, de 0,25 a 0,7), y da a cada plano la suya: la más baja en el gancho y la más alta en la consecuencia clave. **Cada suceso visible suena en su mismo instante**, como diga el estilo. Hecho cuando cada plano tiene `energy` y cada suceso del guion tiene su sonido en `score()`.

7. **Revisa los cortes.** Captura `C` de cada plano y `A` del siguiente. Hecho cuando el hilo sigue reconocible de un plano al otro, ningún rótulo tapa lo que nombra y la síntesis responde a la pregunta del gancho.

8. **Entrega.** A quien te llamó, o a la persona: la ruta, el `<iframe>` y lo que enseña cada paso, con su segundo de inicio, para que la nota lo explique. Si te invocó la persona, pega el `iframe` en la nota. Solo si se pide un MP4: `node <carpeta de la skill>/grabar.cjs <nombre>.html <nombre>.mp4`, que necesita Node, Playwright y ffmpeg y tarda unos 9 s por segundo de vídeo. Hecho cuando quien escribe la nota puede hacerlo sin ver el vídeo.

## Animación

Cómo se mueve todo sigue los principios que John Lasseter llevó de la animación clásica a la de ordenador (*Principles of Traditional Animation Applied to 3D Computer Animation*, SIGGRAPH 1987). El estilo manda en cómo se ve; esta tabla, en cómo se mueve. Si el estilo no permite algo de la tabla (en `pixel` no hay transparencia y los sucesos caen en una rejilla de tiempo), usa su equivalente: un color más oscuro, los desfases ajustados a la rejilla.

| Principio | En estos vídeos |
|---|---|
| **Puesta en escena** | Una idea por plano y un solo foco: lo que importa entra, se mueve o se enciende; lo demás se queda quieto o se atenúa (alfa ~0,3). |
| **Anticipación** | Antes de la acción principal, de 0,2 a 0,4 s que la preparan: un leve movimiento en sentido contrario, un encogimiento o una marca donde va a ocurrir. Lo que se coloca para la acción (un marco que llega al par que se compara) es parte de su anticipación, no otra acción. |
| **Tiempo** | Anticipación, acción y reacción, con tiempo para leerlas: al menos 0,5 s de acción y 0,5 s de calma antes de la idea siguiente. Lo pesado tarda más en arrancar y en frenar. |
| **Entrada y salida lentas** | Todo arranca y frena con `eio` o con `llegar`; lo que aparece, con `eo` o `popIn`. Movimiento lineal solo si la física lo pide (una onda que viaja a velocidad fija). |
| **Arcos** | Lo que va de un sitio a otro sigue una curva, no una recta (`arco`). |
| **Estirar y encoger** | Lo que se mueve rápido se estira en la dirección del movimiento y se aplasta al tocar o al prepararse, sin cambiar de área (`estirar`). Solo en movimiento: lo que aparece crece con `popIn`. Lo rígido (ejes, postes, texto), nunca. |
| **Acción continuada y superpuesta** | Al parar, lo que se movía se pasa un 5–12 % y vuelve (`llegar`). Las partes de un grupo no arrancan a la vez: de 0,05 a 0,15 s entre una y otra. |
| **Acción secundaria** | Una reacción pequeña que refuerza la principal sin competir con ella: un número que cambia, un pulso en el rótulo, una onda en el agua. |
| **Exageración** | Lo que se enseña se exagera lo justo para leerse: más amplitud, el cambio clave más lento o más grande. Si altera una magnitud, dilo en la entrega. |
| **Directo y pose a pose** | Lo que mueve la física (cuerdas, partículas) se calcula paso a paso en `step`; lo demás va entre poses clave (`keyframes`). |
| **Atractivo** | Formas simples que se reconocen por su silueta, sin detalles que no expliquen nada. |

## Incrustar en una nota

```html
<iframe src="derivada-como-pendiente.html" title="Vídeo: la derivada como pendiente de la tangente"
        allowfullscreen loading="lazy" style="width:100%; aspect-ratio:16/9; border:0"></iframe>
```

En una nota Markdown cuyo visor no admite HTML, enlaza el vídeo.
