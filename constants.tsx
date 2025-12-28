import React from 'react';

export const PIECE_SYMBOLS: Record<string, string> = {
  p: 'pawn',
  r: 'rook',
  n: 'knight',
  b: 'bishop',
  q: 'queen',
  k: 'king',
};

export const ChessPieces: Record<string, React.ReactNode> = {
  wK: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"
      className="drop-shadow-sm transition-transform duration-300 hover:scale-110"
      style={{ height: '79%', width: '100%', scale: '120%' }}
    />
  ),
  wQ: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg"
      className="drop-shadow-sm transition-transform duration-300 hover:scale-110"
      style={{ height: '79%', width: '100%', scale: '120%' }}
    />
  ),
  wR: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"
      className="drop-shadow-sm transition-transform duration-300 hover:scale-110"
      style={{ height: '79%', width: '100%', scale: '120%' }}
    />
  ),
  wB: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg"
      className="drop-shadow-sm transition-transform duration-300 hover:scale-110"
      style={{ height: '79%', width: '100%', scale: '120%' }}
    />
  ),
  wN: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg"
      className="drop-shadow-sm transition-transform duration-300 hover:scale-110"
      style={{ height: '79%', width: '100%', scale: '120%' }}
    />
  ),
  wP: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg"
      className="drop-shadow-sm transition-transform duration-300 hover:scale-110"
      style={{ height: '79%', width: '100%', scale: '120%' }}
    />
  ),

  bK: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg"
      className="drop-shadow-sm transition-transform duration-300 hover:scale-110"
      style={{ height: '79%', width: '100%', scale: '120%' }}
    />
  ),
  bQ: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg"
      className="drop-shadow-sm transition-transform duration-300 hover:scale-110"
      style={{ height: '79%', width: '100%', scale: '120%' }}
    />
  ),
  bR: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg"
      className="drop-shadow-sm transition-transform duration-300 hover:scale-110"
      style={{ height: '79%', width: '100%', scale: '120%' }}
    />
  ),
  bB: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg"
      className="drop-shadow-sm transition-transform duration-300 hover:scale-110"
      style={{ height: '79%', width: '100%', scale: '120%' }}
    />
  ),
  bN: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg"
      className="drop-shadow-sm transition-transform duration-300 hover:scale-110"
      style={{ height: '79%', width: '100%', scale: '120%' }}
    />
  ),
  bP: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg"
      className="drop-shadow-sm transition-transform duration-300 hover:scale-110"
      style={{ height: '79%', width: '100%', scale: '120%' }}
    />
  ),
};