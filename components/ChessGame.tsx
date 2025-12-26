
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess, Square } from 'chess.js';
import { GameMode } from '../types';
import ChessBoard from './ChessBoard';
import { getHardcodedMove } from '../services/chessEngine';
import { History, RotateCcw, Copy, CheckCircle2, Trophy, Cpu, Users, Globe } from 'lucide-react';

interface Props {
  mode: GameMode;
}

const BACKEND_URL = 'https://gaming.ameliasoft.net/chess/api';

const ChessGame: React.FC<Props> = ({ mode }) => {
  const initialGame = useMemo(() => new Chess(), []);
  const [game, setGame] = useState(initialGame);
  const [fen, setFen] = useState(initialGame.fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null);
  const [captured, setCaptured] = useState<{w: string[], b: string[]}>({w: [], b: []});
  const [showCopied, setShowCopied] = useState(false);

  // Cargar estado guardado al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('chess_save_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.mode === mode) {
          const newGame = new Chess(parsed.fen);
          setGame(newGame);
          setFen(parsed.fen);
          updateCaptured(newGame);
        }
      } catch (e) {
        console.error("No se pudo retomar la partida.");
      }
    }
  }, [mode]);

  // Guardar estado en cada movimiento
  useEffect(() => {
    if (fen !== initialGame.fen()) {
      localStorage.setItem('chess_save_data', JSON.stringify({
        fen,
        mode,
        timestamp: Date.now()
      }));
    }
  }, [fen, mode, initialGame]);

  const updateCaptured = (gameInstance: Chess) => {
    const history = gameInstance.history({ verbose: true });
    const capturedW: string[] = [];
    const capturedB: string[] = [];
    history.forEach(m => {
      if (m.captured) {
        const pieceKey = `${m.color === 'w' ? 'b' : 'w'}${m.captured.toUpperCase()}`;
        if (m.color === 'w') capturedB.push(pieceKey);
        else capturedW.push(pieceKey);
      }
    });
    setCaptured({ w: capturedW, b: capturedB });
  };

  const syncRemoteMove = useCallback(async (currentFen: string) => {
    if (mode !== GameMode.REMOTE_PVP) return;
    const roomId = window.location.hash.split('-')[1]?.split('?')[0];
    if (!roomId) return;

    try {
      await fetch(`${BACKEND_URL}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, fen: currentFen, history: game.history() })
      });
    } catch (e) {
      console.warn("Backend de Ameliasoft LLC fuera de línea temporalmente.");
    }
  }, [mode, game]);

  const makeMove = useCallback((move: any) => {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      
      if (result) {
        setGame(gameCopy);
        setFen(gameCopy.fen());
        setLastMove({ from: result.from, to: result.to });
        updateCaptured(gameCopy);

        if (mode === GameMode.REMOTE_PVP) {
          const currentHash = window.location.hash.split('?')[0];
          window.location.hash = `${currentHash}?fen=${encodeURIComponent(gameCopy.fen())}`;
          syncRemoteMove(gameCopy.fen());
        }
        return true;
      }
    } catch (e) {
      console.log("Movimiento no permitido.");
    }
    return false;
  }, [game, mode, syncRemoteMove]);

  // Motor Hardcoded (Sin IA)
  useEffect(() => {
    if (mode === GameMode.VS_CPU && game.turn() === 'b' && !game.isGameOver()) {
      const timer = setTimeout(() => {
        setIsThinking(true);
        const move = getHardcodedMove(game.fen());
        if (move) makeMove(move);
        setIsThinking(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [fen, game, mode, makeMove]);

  const onSquareClick = (square: Square) => {
    if (isThinking || game.isGameOver()) return;

    if (selectedSquare) {
      const moveResult = makeMove({ from: selectedSquare, to: square, promotion: 'q' });
      setSelectedSquare(null);
      if (moveResult) return;
    }

    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
    } else {
      setSelectedSquare(null);
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setSelectedSquare(null);
    setLastMove(null);
    setCaptured({w: [], b: []});
    localStorage.removeItem('chess_save_data');
    if (mode === GameMode.REMOTE_PVP) {
        const currentHash = window.location.hash.split('?')[0];
        window.location.hash = `${currentHash}`;
    }
  };

  const isCheck = game.inCheck();
  const isCheckmate = game.isCheckmate();
  const history = game.history();

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col items-center">
        <div className="relative group">
          <ChessBoard 
            fen={fen} 
            selectedSquare={selectedSquare} 
            onSquareClick={onSquareClick}
            lastMove={lastMove}
            isCheck={isCheck}
            kingSquare={isCheck ? (game.board().flatMap((row, rIdx) => 
              row.map((p, cIdx) => (p?.type === 'k' && p?.color === game.turn()) ? `${String.fromCharCode(97 + cIdx)}${8 - rIdx}` : null)
            ).filter(Boolean)[0] as Square) : undefined}
          />
          
          {(isCheckmate || game.isDraw()) && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center rounded-xl z-20 border border-indigo-500/30">
              <div className="text-center p-8 bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl scale-110">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-4xl font-serif mb-2">
                  {isCheckmate ? '¡Pailas, Mate!' : '¡Tablas, veci!'}
                </h2>
                <button onClick={resetGame} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95">
                  Otra partidita, ala
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 w-full flex justify-between items-center bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${game.turn() === 'w' ? 'bg-white shadow-[0_0_10px_white]' : 'bg-slate-700 border border-slate-500'}`} />
            <span className="text-lg font-medium">
              {game.isGameOver() ? 'Partida terminada' : `Mueve el ${game.turn() === 'w' ? "Blanco" : "Negro"}` }
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={resetGame} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors" title="Limpiar partida">
              <RotateCcw className="w-5 h-5 text-slate-400" />
            </button>
            {mode === GameMode.REMOTE_PVP && (
              <button 
                onClick={() => { navigator.clipboard.writeText(window.location.href); setShowCopied(true); setTimeout(() => setShowCopied(false), 2000); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${showCopied ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-500'}`}
              >
                {showCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm font-bold">{showCopied ? '¡Copiado!' : 'Link para el llave'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
            {mode === GameMode.VS_CPU ? 'Contra el Teso' : mode === GameMode.LOCAL_PVP ? 'Duelo con el veci' : 'Partida con el llave'}
          </h3>
          <div className="space-y-4">
            <p className="text-xs text-slate-500 uppercase font-bold">Fichas capturadas</p>
            <div className="flex flex-wrap gap-1">
               {captured.b.concat(captured.w).length > 0 ? captured.b.concat(captured.w).map((p, i) => (
                 <div key={i} className="bg-slate-800 rounded p-1 text-[10px] text-slate-400 font-bold">{p.slice(1)}</div>
               )) : <span className="text-xs italic text-slate-600">Ninguna todavía</span>}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden flex flex-col min-h-[300px]">
          <div className="p-5 border-b border-slate-800 flex items-center gap-2">
            <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Historial</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-2">
              {history.map((m, i) => (
                <div key={i} className="bg-slate-800/40 p-2 rounded-lg text-sm text-slate-200">
                  <span className="text-slate-500 mr-2">{i + 1}.</span> {m}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
