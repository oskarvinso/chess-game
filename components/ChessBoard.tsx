
import React from 'react';
import { Square } from 'chess.js';
import { ChessPieces } from '../constants';

interface BoardProps {
  fen: string;
  selectedSquare: Square | null;
  onSquareClick: (square: Square) => void;
  lastMove: { from: string; to: string } | null;
  isCheck?: boolean;
  kingSquare?: Square;
}

const ChessBoard: React.FC<BoardProps> = ({ 
  fen, 
  selectedSquare, 
  onSquareClick, 
  lastMove,
  isCheck,
  kingSquare 
}) => {
  const rows = [8, 7, 6, 5, 4, 3, 2, 1];
  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const getBoardMap = () => {
    const map: Record<string, string> = {};
    const pieces = fen.split(' ')[0];
    const rankRows = pieces.split('/');
    
    rankRows.forEach((row, rIdx) => {
      let colIdx = 0;
      for (let char of row) {
        if (isNaN(parseInt(char))) {
          const square = `${cols[colIdx]}${rows[rIdx]}`;
          const color = char === char.toUpperCase() ? 'w' : 'b';
          const type = char.toUpperCase();
          map[square] = `${color}${type}`;
          colIdx++;
        } else {
          colIdx += parseInt(char);
        }
      }
    });
    return map;
  };

  const boardMap = getBoardMap();

  return (
    <div className="grid grid-cols-8 aspect-square w-full max-w-[320px] md:max-w-[560px] border-[8px] md:border-[12px] border-slate-900 shadow-2xl rounded-xl overflow-hidden bg-slate-900 ring-1 ring-slate-800">
      {rows.map((row) =>
        cols.map((col) => {
          const square = `${col}${row}` as Square;
          const piece = boardMap[square];
          const isDark = (cols.indexOf(col) + rows.indexOf(row)) % 2 !== 0;
          const isSelected = selectedSquare === square;
          const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
          const isKingInCheck = isCheck && kingSquare === square;

          return (
            <div
              key={square}
              onClick={() => onSquareClick(square)}
              className={`
                relative aspect-square flex items-center justify-center cursor-pointer select-none transition-all duration-200
                ${isDark ? 'bg-slate-700' : 'bg-slate-300'}
                ${isSelected ? 'ring-inset ring-2 md:ring-4 ring-indigo-500 bg-indigo-500/40 z-10' : ''}
                ${isLastMove && !isSelected ? 'after:absolute after:inset-0 after:bg-yellow-400/20' : ''}
                ${isKingInCheck ? 'bg-red-500/60 ring-inset ring-2 md:ring-4 ring-red-500 z-10 animate-pulse' : ''}
                hover:opacity-90 active:scale-95
              `}
            >
              {col === 'a' && (
                <span className={`absolute top-0.5 left-0.5 text-[6px] md:text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {row}
                </span>
              )}
              {row === 1 && (
                <span className={`absolute bottom-0.5 right-0.5 text-[6px] md:text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {col}
                </span>
              )}

              {piece && (
                <div className="w-[85%] h-[85%] transition-transform duration-300 hover:scale-110">
                  {ChessPieces[piece]}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;
