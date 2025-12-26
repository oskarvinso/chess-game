
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { GameMode, ChatMessage, PlayerColor } from '../types';
import ChessBoard from './ChessBoard';
import { getHardcodedMove } from '../services/chessEngine';
import { History, RotateCcw, Copy, CheckCircle2, Trophy, MessageCircle, Send, Globe, User, List } from 'lucide-react';

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

  // Chat y Presencia
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isOpponentOnline, setIsOpponentOnline] = useState(false);
  const [myColor, setMyColor] = useState<PlayerColor>('w');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isRemote = mode === GameMode.REMOTE_PVP;

  // Determinar mi color en remoto
  useEffect(() => {
    if (isRemote) {
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
      const role = urlParams.get('role');
      if (role === 'b') setMyColor('b');
      else setMyColor('w');
    }
  }, [isRemote]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, game]);

  // Sync de Partida, Chat y Presencia
  useEffect(() => {
    if (!isRemote) return;
    const roomId = window.location.hash.split('-')[1]?.split('?')[0];
    if (!roomId) return;

    const interval = setInterval(async () => {
      try {
        // 1. Sync Movimientos
        const resSync = await fetch(`${BACKEND_URL}/sync/${roomId}`);
        const dataSync = await resSync.json();
        if (dataSync.fen && dataSync.fen !== game.fen()) {
          const newGame = new Chess(dataSync.fen);
          setGame(newGame);
          setFen(dataSync.fen);
          updateCaptured(newGame);
        }

        // 2. Sync Chat
        const resChat = await fetch(`${BACKEND_URL}/chat/${roomId}`);
        const dataChat = await resChat.json();
        if (Array.isArray(dataChat)) setMessages(dataChat);

        // 3. Heartbeat de Presencia
        await fetch(`${BACKEND_URL}/presence`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, role: myColor })
        });

        // 4. Ver estado del oponente
        const resPres = await fetch(`${BACKEND_URL}/presence/${roomId}`);
        const dataPres = await resPres.json();
        const opponentRole = myColor === 'w' ? 'b' : 'w';
        setIsOpponentOnline(!!dataPres[opponentRole]);

      } catch (e) {
        // Silencio para no saturar consola si no hay backend
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isRemote, game, myColor]);

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
    if (!isRemote) return;
    const roomId = window.location.hash.split('-')[1]?.split('?')[0];
    if (!roomId) return;

    try {
      await fetch(`${BACKEND_URL}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, fen: currentFen, history: game.history() })
      });
    } catch (e) {
      console.warn("Backend de Ameliasoft LLC fuera de línea.");
    }
  }, [isRemote, game]);

  const makeMove = useCallback((move: any) => {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      
      if (result) {
        setGame(gameCopy);
        setFen(gameCopy.fen());
        setLastMove({ from: result.from, to: result.to });
        updateCaptured(gameCopy);

        if (isRemote) {
          syncRemoteMove(gameCopy.fen());
        }
        return true;
      }
    } catch (e) {
      console.log("Movimiento no permitido.");
    }
    return false;
  }, [game, isRemote, syncRemoteMove]);

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

    // Bloqueo de turno en remoto: No puedes mover si no es tu turno o tu color
    if (isRemote && game.turn() !== myColor) {
        return;
    }

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

  const sendChatMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    
    const roomId = window.location.hash.split('-')[1]?.split('?')[0];
    if (!roomId) return;

    const newMessage = { sender: myColor, text: inputText.trim(), id: Date.now().toString() };
    setMessages(prev => [...prev, newMessage as ChatMessage]);
    setInputText('');

    try {
        await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId, ...newMessage })
        });
    } catch (e) { /* Fallback local */ }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setSelectedSquare(null);
    setLastMove(null);
    setCaptured({w: [], b: []});
    localStorage.removeItem('chess_save_data');
  };

  const copyInviteLink = () => {
    const baseUrl = window.location.href.split('?')[0];
    const inviteUrl = `${baseUrl}?role=b`;
    navigator.clipboard.writeText(inviteUrl);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const isCheck = game.inCheck();
  const isCheckmate = game.isCheckmate();
  const moveHistory = game.history();

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl animate-in fade-in duration-700">
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

        <div className="mt-8 w-full flex justify-between items-center bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${game.turn() === 'w' ? 'bg-white shadow-[0_0_10px_white]' : 'bg-slate-700 border border-slate-500'}`} />
            <span className="text-lg font-medium">
              {game.isGameOver() ? 'Partida terminada' : (
                isRemote 
                ? (game.turn() === myColor ? 'Su turno, hágale' : 'Espere al llave...')
                : `Mueve el ${game.turn() === 'w' ? "Blanco" : "Negro"}`
              )}
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={resetGame} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors" title="Limpiar partida">
              <RotateCcw className="w-5 h-5 text-slate-400" />
            </button>
            {isRemote && (
              <button 
                onClick={copyInviteLink}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${showCopied ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-500'}`}
              >
                {showCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm font-bold">{showCopied ? '¡Copiado!' : 'Link pal llave'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[400px] flex flex-col gap-6">
        {/* Panel Superior: Status y Capturas */}
        <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <Globe className={`w-4 h-4 ${isRemote && isOpponentOnline ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {isRemote ? (isOpponentOnline ? 'El llave está conectado' : 'El llave se fue') : 'Partida Local'}
                </span>
            </div>
            {isRemote && (
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
                    <User className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-bold text-slate-300">YO: {myColor === 'w' ? 'BLANCAS' : 'NEGRAS'}</span>
                </div>
            )}
          </div>
          
          <div className="space-y-4">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Botín de guerra</p>
            <div className="flex flex-wrap gap-1">
               {captured.b.concat(captured.w).length > 0 ? captured.b.concat(captured.w).map((p, i) => (
                 <div key={i} className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-[10px] text-slate-300 font-bold">{p.slice(1)}</div>
               )) : <span className="text-xs italic text-slate-600">Nadie ha caído aún</span>}
            </div>
          </div>
        </div>

        {/* Panel de Chat / Historial - CONDICIONAL */}
        <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden flex flex-col min-h-[400px] backdrop-blur-xl shadow-2xl">
          <div className="flex border-b border-slate-800">
            <button className="flex-1 py-4 text-xs font-bold tracking-widest text-indigo-400 border-b-2 border-indigo-400 uppercase flex items-center justify-center gap-2">
                {isRemote ? <><MessageCircle className="w-4 h-4"/> Chisme y Chat</> : <><List className="w-4 h-4"/> Historial de Jugadas</>}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
            {isRemote ? (
                // Lógica de CHAT para Remoto
                messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 italic text-sm text-center px-8">
                        <MessageCircle className="w-8 h-8 mb-2 opacity-20" />
                        Mándele un saludo al llave para que no se aburra.
                    </div>
                ) : (
                    messages.map((m, i) => (
                        <div key={m.id || i} className={`flex flex-col ${m.sender === myColor ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                m.sender === myColor 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                            }`}>
                                {m.text}
                            </div>
                            <span className="text-[9px] text-slate-600 mt-1 uppercase font-bold">
                                {m.sender === 'w' ? 'Blancas' : 'Negras'}
                            </span>
                        </div>
                    ))
                )
            ) : (
                // Lógica de HISTORIAL para Local / CPU
                <div className="grid grid-cols-2 gap-2">
                    {moveHistory.length === 0 ? (
                        <div className="col-span-2 text-center text-slate-600 py-20 text-sm italic">Haga un movimiento para ver el registro.</div>
                    ) : (
                        moveHistory.map((move, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-slate-800/40 border border-slate-800 rounded-lg text-sm">
                                <span className="text-slate-600 font-mono w-4">{i + 1}.</span>
                                <span className="text-indigo-300 font-bold">{move}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {isRemote && (
            <form onSubmit={sendChatMessage} className="p-4 bg-slate-900/80 border-t border-slate-800 flex gap-2">
                <input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Dígale algo al veci..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
                <button type="submit" className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-all active:scale-90 shadow-lg">
                    <Send className="w-4 h-4" />
                </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
