import React from 'react';
import type { BoardState, Player } from '../types';
import Cell from './Cell';

interface BoardProps {
    board: BoardState;
    onCellClick: (row: number, col: number) => void;
    validMoves: [number, number][];
    currentPlayer: Player;
    boardDisabled: boolean;
    invalidCell: [number, number] | null;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, validMoves, currentPlayer, boardDisabled, invalidCell }) => {
    return (
        <div className={`grid grid-cols-8 gap-1 p-2 bg-gray-800 rounded-lg shadow-2xl transition-opacity duration-300 ${boardDisabled ? 'pointer-events-none opacity-60' : ''}`}>
            {board.map((row, rowIndex) =>
                row.map((cellState, colIndex) => {
                    const isValidMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex);
                    const isInvalidClick = invalidCell?.[0] === rowIndex && invalidCell?.[1] === colIndex;
                    return (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            // FIX: Pass required props to the Cell component to fix missing properties error.
                            state={cellState}
                            onClick={() => onCellClick(rowIndex, colIndex)}
                            isValidMove={isValidMove}
                            currentPlayer={currentPlayer}
                            isInvalid={isInvalidClick}
                        />
                    );
                })
            )}
        </div>
    );
};

// FIX: Add default export to resolve "no default export" error in App.tsx.
export default Board;
