
import React from 'react';

export const PIECE_SYMBOLS: Record<string, string> = {
  p: 'pawn',
  r: 'rook',
  n: 'knight',
  b: 'bishop',
  q: 'queen',
  k: 'king',
};

// Standard SVG piece icons for a high-quality look
export const ChessPieces: Record<string, React.ReactNode> = {
  wP: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" strokeWidth="1.5" />
    </svg>
  ),
  wR: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
      <path d="M9 39h27v-3H9v3zM12 36h21l-4-18H17l-4 18zM11 14V9h4v2h5V9h5v2h5V9h4v5" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <path d="M34 14l-3 3H14l-3-3" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <path d="M31 17v12.5H14V17" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <path d="M11 14h23" fill="none" stroke="#000" strokeWidth="1.5" />
    </svg>
  ),
  wN: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
      <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <path d="M24 18c.3 1 2 4 2 4s1.5-2.5 2-4" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <path d="M9.5 25.5A.5.5 0 1 1 9 25.5c.3-1.5 1.5-3 1.5-3s2.5 1 2.5 2.5-1 3-3 3z" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <path d="M15 15.5s.5 1.5-2 2-2.5-.5-2.5-1.5 1-2 2.5-2 2 1 2 1.5z" fill="#fff" stroke="#000" strokeWidth="1.5" />
    </svg>
  ),
  wB: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 0 5.46-4.5 5.46h-18C9 41.46 9 36 9 36z" fill="#fff" />
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill="#fff" />
        <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" fill="#fff" />
      </g>
    </svg>
  ),
  wQ: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
      <g fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM11 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM38 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" />
        <path d="M9 26c0 2 1.5 2 2.5 4 2.5 4 17 4 19.5 0 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-24.5 0z" />
        <path d="M11 30c3.5 1.5 20 1.5 23 0m-21 3.5c3.5 1.5 18 1.5 21 0m-20 3.5c3.5 1.5 16 1.5 19 0" fill="none" />
      </g>
    </svg>
  ),
  wK: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.5 11.63V6M20 8h5" stroke="#000" />
        <path d="M22.5 25s4.5-7.5 3-10c-1.5-2.5-6-2.5-6 0-1.5 2.5 3 10 3 10z" fill="#fff" />
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-1-1-4-1-4.5 1.5-11 1.5-15.5 0-3 0 0 0-4 1-3 6 6 10.5 6 10.5v7z" fill="#fff" />
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
      </g>
    </svg>
  ),
  bP: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
  bR: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
      <path d="M9 39h27v-3H9v3zM12 36h21l-4-18H17l-4 18zM11 14V9h4v2h5V9h5v2h5V9h4v5" fill="#000" stroke="#fff" strokeWidth="1.5" />
      <path d="M34 14l-3 3H14l-3-3" fill="#000" stroke="#fff" strokeWidth="1.5" />
      <path d="M31 17v12.5H14V17" fill="#000" stroke="#fff" strokeWidth="1.5" />
      <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" fill="#000" stroke="#fff" strokeWidth="1.5" />
      <path d="M11 14h23" fill="none" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
  bN: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
      <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000" stroke="#fff" strokeWidth="1.5" />
      <path d="M24 18c.3 1 2 4 2 4s1.5-2.5 2-4" fill="#000" stroke="#fff" strokeWidth="1.5" />
      <path d="M9.5 25.5A.5.5 0 1 1 9 25.5c.3-1.5 1.5-3 1.5-3s2.5 1 2.5 2.5-1 3-3 3z" fill="#000" stroke="#fff" strokeWidth="1.5" />
      <path d="M15 15.5s.5 1.5-2 2-2.5-.5-2.5-1.5 1-2 2.5-2 2 1 2 1.5z" fill="#000" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
  bB: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
      <g fill="none" fillRule="evenodd" stroke="#fff" strokeWidth="1.5">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 0 5.46-4.5 5.46h-18C9 41.46 9 36 9 36z" fill="#000" />
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill="#000" />
        <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" fill="#000" />
      </g>
    </svg>
  ),
  bQ: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
      <g fill="black" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM11 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM38 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" />
        <path d="M9 26c0 2 1.5 2 2.5 4 2.5 4 17 4 19.5 0 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-24.5 0z" />
        <path d="M11 30c3.5 1.5 20 1.5 23 0m-21 3.5c3.5 1.5 18 1.5 21 0m-20 3.5c3.5 1.5 16 1.5 19 0" fill="none" />
      </g>
    </svg>
  ),
  bK: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
      <g fill="none" fillRule="evenodd" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.5 11.63V6M20 8h5" stroke="#fff" />
        <path d="M22.5 25s4.5-7.5 3-10c-1.5-2.5-6-2.5-6 0-1.5 2.5 3 10 3 10z" fill="#000" />
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-1-1-4-1-4.5 1.5-11 1.5-15.5 0-3 0 0 0-4 1-3 6 6 10.5 6 10.5v7z" fill="#000" />
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
      </g>
    </svg>
  ),
};
