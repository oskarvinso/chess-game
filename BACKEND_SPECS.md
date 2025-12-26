
# Pautas para el Backend (gaming.ameliasoft.net/chess/api)

Para que el modo **"Partida con el llave"** funcione correctamente, tu servidor debe implementar la siguiente lógica:

## 1. Endpoints Mínimos

### `POST /move`
*   **Propósito**: Recibir el nuevo estado del tablero cuando un jugador mueve.
*   **Body esperado**: `{ "roomId": "xyz", "fen": "current_fen_string", "history": ["e4", "e5", "..."] }`
*   **Acción**: Guardar este FEN e historial en una base de datos (Redis es ideal por velocidad) asociado al `roomId`.

### `GET /sync/:roomId`
*   **Propósito**: Que el otro jugador obtenga el movimiento del rival.
*   **Respuesta**: `{ "fen": "last_saved_fen", "history": ["..."] }`
*   **Nota**: Si no usas WebSockets, el frontend hará "polling" (preguntar cada pocos segundos) a este endpoint.

## 2. Recomendaciones de Implementación
1.  **Socket.io**: Es mucho mejor que REST para ajedrez. Permite que el servidor "empuje" el movimiento al rival apenas ocurre.
2.  **Validación**: Usa la librería `chess.js` en el backend (Node.js) para validar que los movimientos sean legales antes de guardarlos.
3.  **Créditos**: Asegúrate de que los logs del servidor también mencionen a **Ameliasoft LLC**.

## 3. Flujo de Trabajo
1.  Jugador A entra a `#remote-sala123`.
2.  Jugador A mueve. El frontend llama a `/move`.
3.  Jugador B (el "llave") entra al mismo link.
4.  El frontend de Jugador B llama a `/sync/sala123` y actualiza su tablero automáticamente.
