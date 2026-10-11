# Usos

Dónde se va a ver el vídeo decide sus valores por defecto. El uso se fija en el encargo; lo que el usuario diga explícitamente manda sobre esta tabla.

| Uso | Proporción | Duración | Zona segura (`FORMAT.safe`) | Texto mínimo (mundo) | Sonido |
|---|---|---|---|---|---|
| Reels, TikTok, Shorts | 9:16 | 15–30 s (anuncio 6–15 s) | `{ top: .14, bottom: .35, left: .06, right: .13 }` | 64 px | se ve sin sonido: el texto lleva la idea |
| Historias | 9:16 | 5–15 s | `{ top: .14, bottom: .20, left: .06, right: .06 }` | 64 px | se ve sin sonido |
| Feed (Instagram, Facebook, LinkedIn) | 4:5 o 1:1 | 6–30 s | `{ top: .05, bottom: .05, left: .05, right: .05 }` | 56 px | se ve sin sonido |
| YouTube, web, presentación | 16:9 | 30–120 s | `{ top: .05, bottom: .08, left: .05, right: .05 }` | 40 px | con sonido |
| Solo para ver aquí o probar | 16:9 | lo que pida | `null` | 40 px | con sonido |

- **Zona segura:** fracción de cada borde que tapa la interfaz de la plataforma (botones, nombre, descripción, barra de progreso). El texto, las caras y lo que el vídeo quiere que se vea van dentro; el fondo y el decorado siguen llenando el encuadre hasta el borde. Los valores de 9:16 siguen las guías de Meta para Reels, con el margen derecho ampliado para la columna de botones de TikTok; las interfaces cambian, así que son aproximados y generosos.
- **Texto mínimo:** altura de la letra en pixeles del mundo (lienzo de 2560 × 1440, o el lado corto de 1440 en vertical). En pixel art, `s: 2` como mínimo.
- **Sin sonido:** la idea tiene que entenderse con el sonido apagado. Si el vídeo lleva voz, lleva también subtítulos o rótulos que digan lo esencial.
- Todos los usos se exportan a −14 LUFS, el nivel al que normalizan YouTube, Instagram y TikTok.

Para revisar la zona segura, `grabar.cjs` la dibuja encima de los fotogramas y de la hoja con `--zonas`: lo que queda bajo el sombreado rojo lo tapa la interfaz.
