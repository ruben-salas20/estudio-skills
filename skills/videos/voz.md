# Voz

Narración grabada sobre el vídeo. Solo si la persona la quiere: es la única parte del vídeo que no sale del código.

## Generar los clips

Un clip WAV por frase del guion, con la herramienta de texto a voz que tenga la persona: un servidor MCP, una API o un programa local. Este repositorio no trae ninguna. Si no hay, dilo y sigue sin voz.

- **Escribe las frases como se dicen:** símbolos y fórmulas en palabras (*efe prima de equis*, no `f'(x)`), y números en letra cuando importa cómo suenan.
- Un archivo por frase, en orden: `voz/01.wav`, `voz/02.wav`…
- Duración de un clip: `ffprobe -v error -show_entries format=duration -of csv=p=0 voz/01.wav`. Pausas dentro de un clip, para sincronizar un suceso con una palabra: `ffmpeg -i voz/03.wav -af silencedetect=noise=-35dB:d=0.12 -f null - 2>&1 | grep silence_`.

## Incrustar

Los clips viven dentro del HTML, en el bloque `VOZ-INICIO … VOZ-FIN`, como `{ t, v, b64 }`, y los escribe el script:

```
node <carpeta de la skill>/incrustar-voz.cjs <slug>.html 0.5:voz/01.wav 4.2:voz/02.wav
```

Cada argumento es `segundo_de_inicio:archivo`. Sin clips, el script quita la voz.

## Cuadrar los planos

El script imprime dónde empieza y acaba cada clip. Ajusta el `dur` de cada plano para que su frase caiga entera sobre su imagen, con al menos 0,3 s de aire antes del corte.

## Cómo suena

La voz suena seca y centrada, sigue al reproductor (pausa, saltos) y entra en el MP4. Mientras suena un clip, `compose` baja la música a menos de la mitad; los acentos de la `score()` van en los silencios entre frases. Con voz, la voz explica y los rótulos solo nombran.
