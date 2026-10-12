# Modo laboratorio: diseño didáctico

Qué se decide y qué se escribe antes de tocar el código. La mecánica (API, formatos, temas, arranque) está en `SKILL.md` y en los comentarios de `assets/laboratorio.html`; los patrones de escena, en `patrones-didacticos.md`.

## 1. La ficha

Rellénala entera antes de escribir la escena. Si un campo no cabe en una línea, la idea aún no está clara; si no salen fórmula ni presets con revelaciones distintas, es una figura. Un objeto, una idea: si la ficha pide más de un gancho, son dos escenas.

```
FICHA
Idea errónea o pregunta: <lo que el lector cree o se pregunta; el gancho la ataca>
Modelo: <fórmula(s) real(es) y sus supuestos; qué se aproxima>
Estado: <variables mínimas: las que el lector mueve + interruptores de capa>
Derivadas: <lo que se calcula desde el estado y alimenta cifras/relato/etiquetas>
Presets (2-4): <nombre corto> -> <valores del estado> -> <la revelación>
Cifras (3-4 máx.): <rótulo corto · unidad>, con la del protagonista primero
Protagonistas: <piezas que cambian entre presets: lo más grande del encuadre (§6)>
Disposición: <orden del recorrido en pantalla, p. ej. izquierda→derecha: tanque → bomba → cámara>
Lo invisible que se hace visible: <rayo, flecha, color, zona; con qué se dibuja>
Modos y capas: <vistas (montado/corte/rayos X) y capas, con tecla>
Grupo principal: <el grupo que va en la fila de abajo del compacto, marcado con { principal: true }>
Contexto de escala: <objeto conocido junto a la maqueta>
Gráfico 2D (opcional): <qué curva, con el estado actual marcado>
```

**Cada preset es un experimento con una revelación**, no un valor cómodo: «pone la variable en 5» no enseña; «aquí la imagen desaparece» sí. El primer preset es el estado inicial y ya cuenta la idea principal; los presets difieren en una sola cosa de fondo, o el lector no sabe qué causó el cambio; al menos uno rompe la intuición del gancho; nombres de una o dos palabras. Los deslizadores son para explorar después, no para entender. Ejemplo (lente delgada, f = 10 cm, idea errónea «una lupa siempre agranda»): «Como lupa» (objeto a 6 cm) → imagen virtual, derecha, ×2,5, lo esperado; «En el foco» (10 cm) → rayos paralelos, no hay imagen; «Proyecta» (15 cm) → imagen real, invertida, ×2, que cae en una pantalla.

**Lo invisible se dibuja con la misma fórmula que las cifras**: una sola función de estado a derivadas, y rayos, cifras, relato y etiquetas leen de ahí. Si el rayo se anima a ojo, se contradirá con la cifra en algún estado.

Máximo 3-4 cifras (cada una de más diluye las otras), 2-3 capas y 2-3 vistas; con más, el panel se come la escena.

**Nombres del dominio primero.** Si el tema usa una palabra que coincide con un nombre habitual de vista o de mando («corte» de un meandro, «sección» de una viga, «capa» de la atmósfera), la palabra se queda para el tema y la vista se renombra («Sección», «Por dentro», «Ver capas»): dos significados para un botón confunden justo en la revelación.

## 2. Cuando la variable es el tiempo

Si el fenómeno es una evolución (un río que migra, una epidemia, un cuerpo que se enfría), el estado es **el instante** (`año`, `día`, `t`):

- **Fórmula cerrada en el tiempo** (enfriamiento, órbita): se calcula directamente del instante.
- **Ciclo que se repite** (latido, péndulo, motor de pistones): un preset que anima («Latido») y presets que congelan los instantes con revelación, con una clave booleana (`latir`) y `fija` en cada opción. Mientras anima, cifras, relato y gráfico muestran el valor del instante con `vivo(t, e)`, nunca rangos sin valores. Si el ciclo es rápido, cámara lenta, y dilo en la cifra o en la ayuda.
- **Evolución que depende de la historia** (meandros, crecimiento, contagios): se **simula una vez al arrancar** con semilla fija, se guardan instantáneas cada cierto intervalo y el estado lee la instantánea interpolando entre dos. Así la escena sigue siendo función pura del estado y `?e=año:400` reproduce la captura. Arranque **≤ 2 s** (`arranque=` del `#diag`, ver `SKILL.md`); por encima, bajar resolución o paso de la simulación.
- **Los presets son instantes con revelación**, no fechas redondas: el primero es el primer instante donde la idea ya se ve; el estado inicial queda en el deslizador o como capa («Cauce del año 0»).
- **Cada suceso discreto** (el corte de un meandro, una ruptura, un umbral) tiene su propio preset, justo después del suceso, y una marca en el gráfico.
- **Entre presets se recorre el tiempo, no se salta**: `suavizar` sobre el instante, en cámara rápida. En captura se aplica de golpe: comprobar la transición en vivo.
- **Deja rastro de lo que ya pasó** (cauces antiguos, líneas cada N años): convierte la animación en explicación.
- **El gráfico natural** es la magnitud clave frente al tiempo, con el instante actual y los sucesos marcados.
- Si dos instantes se parecen en la prueba de composición (§6), sepáralos más o haz que el cambio se vea con color o rastro, no solo con la etiqueta.

## 3. Cómo se escribe cada texto

Números con `num(v, d)`, con unidad y sin decimales que no midan nada real.

**Gancho** (cabecera, 1-2 frases): plantea la pregunta o contradice la intuición; no define el tema ni anuncia la escena. Estructura: algo cotidiano + lo que nadie ha visto + la escena lo enseña. El título nombra el fenómeno; el antetítulo, la materia («Óptica · Lente delgada»).

- Bien: «Una lupa agranda lo que miras. Pero aléjala un poco y la imagen se da la vuelta. ¿Dónde cambia?»
- Mal: «En esta escena se explora el comportamiento de una lente convergente delgada.» (anuncia, no pregunta)

**Relato** (tarjeta, ~3 frases): narra **el estado actual con sus números**, causa → efecto. Se calcula desde el estado con una rama por régimen cualitativo (los mismos que separan los presets) y las cifras en negrita; umbrales con tolerancia (`Math.abs(x) < 0.05`), nunca `===` sobre flotantes. Prueba: si mueves un mando y la frase no cambia, no es dinámica; si cambia pero no dice por qué, es un rótulo.

- Bien (una rama por preset): «A **6 cm**, dentro del foco, los rayos salen sin cruzarse. El ojo los prolonga hacia atrás y ve una imagen **virtual** a **15 cm**, derecha y **×2,5**.» / «A **10 cm**, justo en el foco, los rayos salen paralelos y nunca se juntan: **no hay imagen**.» / «A **15 cm** los rayos sí se cruzan, **30 cm** detrás. Es una imagen **real**, invertida y **×2**: se podría proyectar en una pantalla.»
- Mal: «La imagen es virtual y más grande.» (frase fija: al pasar a 15 cm sigue diciéndolo)

**Relato corto** (compacto, una línea de ~70 caracteres): una idea, un número, sin subordinadas; es la conclusión del relato, no su recorte. Bien: «Dentro del foco: imagen virtual ×2,5».

**Etiquetas con valor**: nombre + valor + unidad en una línea de ~20 caracteres, con el mismo nombre que usa la nota: «Objeto · 6 cm», «Imagen · −15 cm». Etiqueta lo que la nota menciona y lo que cambia con el estado. Mal: «Imagen» (sin el valor que la hace etiqueta viva).

**Cifras**: rótulo de 1-2 palabras que nombra la magnitud, no la fórmula; valor grande, unidad aparte y un `sub` de máx. 3 palabras con la interpretación. Bien: `Aumento` · `2,5` · `×` · sub «derecha». Mal: `m = -di/do` · `2.5`.

## 4. Reparto escena ↔ nota

Ni se duplica ni se resume: lo que está en la escena, la nota lo enlaza por su nombre.

| En la escena | En la nota |
|---|---|
| Título y gancho | Qué es el fenómeno y dónde aparece |
| Cifras y relato con el estado vivo | La teoría de fondo y por qué la fórmula es así |
| Etiquetas con valor, colores, capas | La leyenda de colores y el nombre de cada pieza |
| Presets con nombre corto | Qué probar con cada preset, en orden, y qué debería verse |
| Ayuda (`?`) con los atajos y una línea de supuestos si el error puede confundir | Qué es exacto y qué aproximado, preguntas de comprobación, errores comunes |
| Ninguna fórmula larga | Las fórmulas con todos los pasos, el despeje y la convención de signos |

La nota nombra cada preset con el mismo texto del botón, para leer y pulsar a la vez. Si un dato solo cabe en una de las dos, va en la nota.

## 5. Estética: realismo sin decoración

**Decoración, fuera**: neón en aristas y tiras, reflejo del suelo, bloom, desenfoque de fondo (salvo que el desenfoque sea el tema), cinemáticas automáticas de cámara, explosionado o corte como espectáculo. No explican, cuestan en cada fotograma y hacen que el brillo deje de significar algo. **Realismo, sí**: metal que parece metal, una llama que parece fuego, una cámara incandescente por dentro. El fenómeno *es* lo que se ve, y un motor gris y mate no se entiende mejor que uno creíble: se mira menos. Emisivo y halo solo en lo que emite luz de verdad. Las técnicas, con código, en `recetas-visuales.md`.

## 6. Composición: qué ocupa el encuadre

**Las protagonistas son lo más grande del encuadre.** Son las piezas que cambian entre presets (campo «Protagonistas» de la ficha): en la vista inicial su caja envolvente abarca al menos el **60 %** del ancho o del alto del hueco que dejan los paneles, en los dos formatos. Lo que es igual en todos los presets pasa a segundo plano: más pequeño, recortado por el borde, atenuado o fuera. Una pieza grande que no cambia y no hace falta para entender el recorrido sobra.

**El recorrido en un plano, de frente a la cámara.** Si la idea es un flujo (propelente, corriente, luz, señal), las piezas van en el orden del recorrido, de izquierda a derecha o de arriba abajo, en un plano casi perpendicular a la vista; la profundidad, para lo secundario. En la vista inicial ninguna protagonista tapa a otra y el camino de las partículas no se cruza consigo mismo en pantalla.

**Esquemático antes que fiel.** Separa piezas que en la realidad van apiñadas y alarga los conductos hasta que el recorrido se lea. Dilo en la ayuda («disposición esquemática»).

**Los dos formatos tienen huecos distintos**: en compacto la zona libre es apaisada (~2:1); en completo, con las tarjetas a los lados, casi cuadrada. Ajusta `ASPECTO_BASE` y `VISTAS` mirando las capturas de ambos. Las etiquetas también tienen que caer en la zona libre: una bajo la tarjeta izquierda no existe.

**Tamaño mínimo de lectura**: toda pieza etiquetada mide al menos **~40 px** en su lado menor en la captura compacta (700×394); si no llega, acerca la cámara, agranda la pieza o quítale la etiqueta. Las partículas de flujo, al menos **~6 px**, y separadas lo bastante para leerse como caudal y no como mancha.

**Cada vista cambia la lectura.** Corte: oculta o atenúa fuerte lo exterior. Cuando lo que cuenta es el interior, suele funcionar mejor que un plano de recorte volver las carcasas casi transparentes (opacidad ~0,1, sin `castShadow`) y mostrar dentro el fluido o las piezas. Explosionado: a lo largo del eje de montaje, con guías; si la disposición base ya es esquemática y separada, sepáralo más o prescinde de él. Si la captura de una vista se parece a la de otra, esa vista sobra.

**La base, ajustada a la huella de la maqueta**, sin llanuras vacías; puede llevar lo que aporte a la lectura (un rótulo, un riel graduado, las etiquetas de entrada y salida). La figura de escala, discreta: que no compita con las protagonistas.

**Etiquetas que se pisan: muévelas antes de quitarlas**, a un costado de su pieza (`lado`) hacia zonas vacías. Se quita solo la que la pieza no necesita para seguir la nota.

**Prueba de composición.** Pon lado a lado las capturas compactas de dos presets con el texto tapado: la diferencia tiene que verse sin leer nada. Si hay que buscarla, recompón antes de pulir cualquier otra cosa.

## 7. Comprobación final (las capturas de `--todo`)

- **Compacto (700×394):** el título no tapa la figura; la fila de abajo muestra el grupo principal y se ve ⛶; la primera vista ya cuenta la idea.
- **Completo:** cabecera, cifras, relato, gráfico y mandos no tapan a las protagonistas.
- **Ambos formatos:** etiquetas sin superponerse entre sí ni contra el borde; etiquetas, cifras y relato dan el mismo número con el mismo redondeo.
- **Ambos temas:** cada color semántico se distingue del fondo y del resto; ninguna pieza oscura desaparece en el oscuro ni una clara en el claro; texto con contraste AA; el pedestal se separa del fondo.
- **Volumen:** sin exceso de luz ambiental (parece un dibujo plano), sombras sin recortar por el frustum, sin z-fighting.
- **Textos y presets:** los de §3; cada preset produce la revelación de su ficha; ningún texto repite la nota.
- **Composición:** todo §6, con la prueba de composición.
- **Compacto y completo**: el compacto muestra la escena, ⛶ y la fila del grupo principal; el completo, los paneles alrededor de la escena.
- **Técnica:** `diag` en `OK … formato=… tema=…`; una captura con `?t=` es reproducible; la escena quieta no consume fotogramas.

Si algo falla en la captura compacta, no se arregla añadiendo texto: se quita algo del compacto.
