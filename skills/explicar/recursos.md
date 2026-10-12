# Recursos visuales en las páginas

Si `<RAIZ>/AGENTS.md` trae reglas propias de recursos visuales, mandan esas.

Ninguno va por defecto: cada uno tiene que enseñar algo que el texto solo no logra (un circuito, la forma de una función, cómo se conectan varios conceptos, un procedimiento con ramificaciones). Una secuencia de tres pasos, una definición o la comparación de dos cosas van en texto o en una tabla. Lo normal es uno por página, con un concepto por recurso.

| Recurso | Para | En páginas Markdown |
|---|---|---|
| **Mermaid** | relaciones en las que la posición no importa: mapas conceptuales, flujos con decisiones, jerarquías, estados | si el visor de `AGENTS.md` lo dibuja; si no, un diagrama de texto de `diagrama.md`. Si no consta, pregunta |
| **JavaScript** | lo exacto: circuitos, gráficas con ejes reales, geometría, vectores. Se dibuja con código, no con SVG escrito a mano | en una página HTML aparte, enlazada |
| **Excalidraw** | lo que no es solo cajas y flechas: dibujos, imágenes, esquemas en los que el lugar de cada parte significa algo. Solo si hay una skill de Excalidraw instalada y el visor abre `.excalidraw`; hazlo con ella | igual |
| **3D** | cuando la tercera dimensión es la información. Solo si hay una skill de 3D instalada; hazlo con ella | en una página HTML aparte, enlazada |
| **Vídeo** | un proceso que no se entiende sin movimiento. Solo si existe `../videos/SKILL.md`, y propónlo antes de hacerlo | enlazado |

Un recurso es interactivo solo cuando mover algo enseña algo: arrastrar una resistencia y ver cómo cambia el voltaje. En ese caso, muestra el desarrollo recalculándose, no solo el resultado. Si no, queda fijo. Si el curso tiene un kit, usa sus componentes.
