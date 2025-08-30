
import React from 'react';
import { CellState } from '../types';
import type { Player } from '../types';

interface CellProps {
    state: CellState;
    onClick: () => void;
    isValidMove: boolean;
    currentPlayer: Player;
    isInvalid?: boolean;
}

const Piece: React.FC<{ player: Player }> = ({ player }) => {
    const pieceColor = player === CellState.BLACK ? 'bg-black' : 'bg-white';
    const shadowColor = player === CellState.BLACK ? 'shadow-inner shadow-gray-600' : 'shadow-inner shadow-gray-400';
    return <div className={`w-full h-full rounded-full ${pieceColor} ${shadowColor} transform transition-transform duration-300 scale-90`}></div>;
};


const Cell: React.FC<CellProps> = ({ state, onClick, isValidMove, currentPlayer, isInvalid }) => {
    const baseStyle = 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-sm transition-colors duration-200';
    const bgStyle = 'bg-green-700 hover:bg-green-600';
    const validMoveHintColor = currentPlayer === CellState.BLACK ? 'bg-black/30' : 'bg-white/30';
    const cursorStyle = isValidMove ? 'cursor-pointer' : 'cursor-default';
    // FIX: Add a shake animation for when a user clicks on an invalid cell.
    const shakeClass = isInvalid ? 'animate-shake' : '';

    return (
        <div className={`${baseStyle} ${bgStyle} ${cursorStyle} ${shakeClass}`} onClick={onClick}>
            <div className="w-full h-full p-1 relative">
                {state !== CellState.EMPTY && <Piece player={state} />}
                {isValidMove && (
                    <div className={`absolute inset-0 flex items-center justify-center`}>
                        <div className={`w-1/3 h-1/3 rounded-full ${validMoveHintColor} animate-pulse`}></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cell;
