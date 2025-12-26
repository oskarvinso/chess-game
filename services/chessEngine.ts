
import { Chess, Move } from 'chess.js';

/**
 * Motor de ajedrez "El Teso" (Versión Hardcoded)
 * No utiliza APIs externas ni IA. Se basa en:
 * 1. Libro de aperturas básico.
 * 2. Capturas de mayor valor.
 * 3. Control del centro.
 * 4. Movimientos aleatorios legales como fallback.
 */

const OPENING_BOOK: Record<string, string[]> = {
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1": ["e4", "d4", "Nf3"],
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1": ["c5", "e5", "d6"],
};

const PIECE_VALUES: Record<string, number> = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 90,
  k: 900
};

export const getHardcodedMove = (fen: string): string => {
  const game = new Chess(fen);
  const moves = game.moves({ verbose: true });

  if (moves.length === 0) return "";

  // 1. Verificar libro de aperturas
  if (OPENING_BOOK[fen]) {
    const bookMoves = OPENING_BOOK[fen];
    return bookMoves[Math.floor(Math.random() * bookMoves.length)];
  }

  // 2. Priorizar capturas (Heurística de material)
  let bestMove: Move | null = null;
  let maxGain = -1;

  for (const move of moves) {
    if (move.captured) {
      const gain = PIECE_VALUES[move.captured];
      if (gain > maxGain) {
        maxGain = gain;
        bestMove = move;
      }
    }
  }

  if (bestMove) return bestMove.lan;

  // 3. Control del centro (e4, e5, d4, d5, c4, c5, f4, f5)
  const centerSquares = ['e4', 'e5', 'd4', 'd5', 'c4', 'c5', 'f4', 'f5'];
  const centerMoves = moves.filter(m => centerSquares.includes(m.to));
  if (centerMoves.length > 0) {
    return centerMoves[Math.floor(Math.random() * centerMoves.length)].lan;
  }

  // 4. Evitar jaque (si es posible) y desarrollar piezas menores
  const minorPieces = ['n', 'b'];
  const developmentMoves = moves.filter(m => minorPieces.includes(m.piece));
  if (developmentMoves.length > 0) {
    return developmentMoves[Math.floor(Math.random() * developmentMoves.length)].lan;
  }

  // 5. Movimiento aleatorio legal
  return moves[Math.floor(Math.random() * moves.length)].lan;
};
