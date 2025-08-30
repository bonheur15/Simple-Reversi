
import React from 'react';
import { CellState } from '../types';
import type { Player } from '../types';

interface GameInfoProps {
    currentPlayer: Player;
    scores: { black: number; white: number };
    message: string;
    gameOver: boolean;
}

const ScoreDisplay: React.FC<{ player: 'Black' | 'White', score: number, isCurrent: boolean }> = ({ player, score, isCurrent }) => {
    const playerColor = player === 'Black' ? 'bg-black' : 'bg-white';
    const textColor = player === 'Black' ? 'text-white' : 'text-black';
    const borderColor = isCurrent ? 'border-cyan-400' : 'border-gray-600';

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg bg-gray-800 border-2 ${borderColor} transition-all duration-300`}>
            <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full ${playerColor}`}></div>
                <span className="font-bold text-lg text-gray-300">{player}</span>
            </div>
            <span className={`font-mono text-2xl font-bold ${isCurrent ? 'text-cyan-400' : 'text-white'}`}>{score}</span>
        </div>
    );
};

const GameInfo: React.FC<GameInfoProps> = ({ currentPlayer, scores, message, gameOver }) => {
    return (
        <div className="p-4 bg-gray-800/50 rounded-lg shadow-lg w-full flex flex-col gap-4 border border-gray-700">
            <h2 className="text-xl font-semibold text-center text-gray-300 border-b border-gray-700 pb-2">Game Status</h2>
            
            <div className="flex flex-col gap-3">
                <ScoreDisplay player="Black" score={scores.black} isCurrent={!gameOver && currentPlayer === CellState.BLACK} />
                <ScoreDisplay player="White" score={scores.white} isCurrent={!gameOver && currentPlayer === CellState.WHITE} />
            </div>

            <div className="mt-2 text-center p-3 bg-gray-900 rounded-md">
                <p className={`text-lg font-medium ${gameOver ? 'text-cyan-400' : 'text-gray-300'}`}>
                    {message}
                </p>
            </div>
        </div>
    );
};

export default GameInfo;
