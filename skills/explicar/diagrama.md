# Diagramas en texto

La persona lee el chat en una terminal: Mermaid se ve como código sin dibujar. Elige la vista más pequeña que deje clara la idea, ponla junto a la frase que la apoya y muestra solo los elementos que la idea necesita.

- **Flujo o relación entre partes:** diagrama de cajas en un bloque `text`. Antes de mostrarlo, pásalo por `python3 <carpeta de esta skill>/revisar-diagrama.py` y corrige cada línea que señale hasta que diga `0 errores`. Después lee cada flecha y confirma que llega a la caja correcta. Pega el diagrama final en tu respuesta: la persona no ve la salida de los comandos.

  ```text
  ┌──────┐  luz, agua, CO₂  ┌─────────────┐  glucosa  ┌────────┐
  │ Hoja ├─────────────────►│ Cloroplasto ├──────────►│ Planta │
  └──────┘                  └──────┬──────┘           └────────┘
                                   │ libera
                                   ▼
                                ┌────┐
                                │ O₂ │
                                └────┘
  ```

- **Jerarquía o clasificación:** árbol.

  ```text
  Números reales
  ├── Racionales
  │   ├── Enteros
  │   └── Fracciones
  └── Irracionales (√2, π)
  ```

- **Procedimiento o algoritmo:** pseudocódigo, un paso por línea.

  ```text
  resolver ax² + bx + c = 0
    calcular Δ = b² − 4ac
    si Δ < 0: no hay soluciones reales
    si no: x = (−b ± √Δ) / 2a
  ```

- **Comparar dos o más cosas:** tabla.

- **Temas de programación:** también un `diff` cuando importa qué cambia, o un árbol de archivos con la responsabilidad de cada uno.
