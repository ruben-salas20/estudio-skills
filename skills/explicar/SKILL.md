---
name: explicar
description: Explica un tema, o lo último de la conversación, en texto, diagrama, HTML o vídeo.
disable-model-invocation: true
---

# Explicar

Una explicación a medida y desechable, en el formato que mejor se entienda.

## Pasos

1. **Busca cómo enseñar a esta persona.** Sirve dentro y fuera de la carpeta de estudio. Si existen, `<RAIZ>/AGENTS.md` dice cómo enseñar y `<RAIZ>/NOTAS.md`, cómo aprende. Si no, explica en lenguaje claro: lo principal primero, frases cortas, palabras del día a día y cada término técnico explicado la primera vez. Si estás en un proyecto, toma los ejemplos de su código y sus nombres reales. Hecho cuando sabes con qué reglas explicas.

2. **Fija el tema.** Con argumentos, el tema es el argumento sin la palabra de formato. Sin argumentos, es lo último de la conversación. Si la conversación está vacía, pregunta. Hecho cuando dices el tema en una línea.

3. **Indaga en pequeño:** desde dónde parte la persona y qué dicen las fuentes, sin subagente y sin escribir archivos.
   - **Bases:** si lo que leíste en el paso 1 o la conversación ya muestran qué sabe del tema, sigue. Si no, hazle 1 o 2 preguntas cortas que lo comprueben, en vez de preguntarle si lo sabe: lo que alguien cree saber y lo que sabe no siempre coinciden.
   - **Fuentes:** consulta de 1 a 3 fuentes con el criterio del paso 3 de `../indagar/investigar-fuentes.md` y cítalas en la entrega. Si el tema sale del código del proyecto, ese código es la fuente principal.

   Hecho cuando sabes desde dónde parte y cada dato que vas a dar tiene su fuente.

4. **Fija el formato.** Si el argumento empieza por `texto`, `diagrama`, `html` o `video`, usa ese. Si no, pregunta y recomienda el que mejor encaje:
   - **Texto:** una idea o una respuesta corta.
   - **Diagrama:** partes y cómo se conectan, un flujo, una jerarquía, un procedimiento.
   - **HTML:** algo para explorar, comparar o tocar.
   - **Vídeo:** un proceso que cambia con el tiempo.

   Hecho cuando hay formato.

5. **Fija qué se llevará.** Escribe para ti de una a tres ideas que la persona debe poder repetir con sus palabras al terminar, de la que más importa a la que menos. Hecho cuando cada idea cabe en una frase y entre todas responden al tema.

6. **Hazla.**
   - **Texto:** en el chat, tan largo como pidan las ideas del paso 5.
   - **Diagrama:** sigue `diagrama.md`, en el chat.
   - **HTML:** sigue `html.md`.
   - **Vídeo:** sigue `../videos/SKILL.md` y vuelve aquí con lo que entrega.

   Los archivos van en la ruta que diga la persona o, si no dice ninguna, en la carpeta actual; di siempre la ruta completa de cada archivo creado. Hecho cuando cada idea del paso 5 aparece en la entrega.
