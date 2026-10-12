# Patrones para explicar en 3D

Catálogo de patrones de escena, comunes a la figura y al laboratorio. Cada uno se nombra por su palabra guía.

## Patrones

1. **Corte** — enseñar el interior sin desmontar nada. Técnica en `recetas-visuales.md` §5; si solo importa lo de dentro, carcasas casi transparentes (`laboratorio.md` §6).
2. **Explosionado** — enseñar cómo se monta: cada pieza se separa desde su posición base a lo largo de su eje de montaje, con un mando de 0 (montado) a 1. El patrón más rentable para cualquier cosa con partes.
3. **Campo** — `InstancedMesh` de flechas, con la magnitud en la longitud **y** en el color: solo con la longitud, las que apuntan a la cámara se ven cortas por escorzo y engañan.
4. **Rastro** — el camino recorrido enseña más que la partícula que se mueve. Si el camino es fijo (una órbita, una función), se dibuja entero de golpe y se anima solo un marcador que lo recorre: más barato, y el destino se ve desde el principio.
5. **Lado a lado** — dos copias con un solo parámetro distinto y el **mismo** reloj; cada lado etiquetado con su valor.
6. **Capas** — cada sistema en su `Group` con un interruptor: una escena recargada se vuelve varias legibles.
7. **Paso a paso** — etapas discretas; entre una y otra se interpolan cámara y piezas, no se salta, para seguir qué se transformó en qué. En la escena, solo el nombre de la etapa; en la nota, un apartado por etapa con el mismo título.
8. **Escala** — algo conocido al lado (una persona de 1,7 m, un coche, una moneda) hace más que cualquier cifra. Si el rango obliga a escala logarítmica, dilo en la escena: deforma la lectura.
9. **Atenuar** — para dirigir la mirada, bajar el resto (`opacity` ~0,25) funciona mejor que iluminar el objetivo; también aristas con `EdgesGeometry` o una etiqueta con línea de guía. El brillo emisivo queda para lo que emite luz (`laboratorio.md` §5).
10. **Barrido** — un plano semitransparente recorre el objeto mientras al lado se dibuja la sección que le corresponde. Para geometrías complicadas convierte «no entiendo esa forma» en «ah, es eso».

## Reglas comunes

**La primera vista se explica sola.** Mucha gente no va a girar nada: el encuadre inicial ya contiene la idea principal, y hay un botón para volver a él.

**El color significa algo o no está.** Cinco o seis colores como mucho, cada uno con su entrada en la leyenda de la nota. Un color decorativo enseña a ignorar el color, y entonces se pierde el que sí significa algo.

**Un objeto, un mensaje.** Dos escenas claras enseñan más que una completa.
