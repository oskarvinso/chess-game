
# Pautas para el Backend (gaming.ameliasoft.net/chess/api)

Para que el modo **"Partida con el llave"** funcione con Chat y Presencia, implemente:

## 1. Endpoints de Partida
### `POST /move` y `GET /sync/:roomId`
*   Manejan el FEN y el historial de jugadas.

## 2. Endpoints de Chat
### `POST /chat`
*   **Body**: `{ "roomId": "xyz", "sender": "w|b", "text": "Hola!" }`
### `GET /chat/:roomId`
*   **Response**: `[{ "id": "...", "sender": "w", "text": "...", "timestamp": 123 }]`

## 3. Endpoints de Presencia
### `POST /presence`
*   **Body**: `{ "roomId": "xyz", "role": "w|b" }`
*   **Acción**: Actualizar "lastSeen" del rol en esa sala.
### `GET /presence/:roomId`
*   **Response**: `{ "w": true, "b": false }` (Verdadero si lastSeen < 10s).

## 4. Notas
*   El frontend espera que estos endpoints existan bajo la base `BACKEND_URL`.
*   Si el backend no está listo, el juego funcionará localmente pero mostrará advertencias en consola.
