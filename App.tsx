import React, { useState, useEffect, useCallback } from 'react';
import type { BoardState, Player } from './types';
import { CellState } from './types';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import ResetButton from './components/ResetButton';
import { getValidMoves, makeMove, calculateScores, createInitialBoard } from './utils/gameLogic';
import { findBestMove } from './utils/ai';
import { playAudio, Sounds } from './utils/sounds';

const App: React.FC = () => {
    const [board, setBoard] = useState<BoardState>(createInitialBoard());
    const [currentPlayer, setCurrentPlayer] = useState<Player>(CellState.BLACK);
    const [validMoves, setValidMoves] = useState<[number, number][]>([]);
    const [scores, setScores] = useState({ black: 2, white: 2 });
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState("Black's Turn");
    const [invalidCell, setInvalidCell] = useState<[number, number] | null>(null);

    const updateGameStatus = useCallback((currentBoard: BoardState, nextPlayer: Player) => {
        const newScores = calculateScores(currentBoard);
        setScores(newScores);

        const nextPlayerValidMoves = getValidMoves(currentBoard, nextPlayer);
        
        if (nextPlayerValidMoves.length > 0) {
            setValidMoves(nextPlayerValidMoves);
            setCurrentPlayer(nextPlayer);
            setMessage(`${nextPlayer === CellState.BLACK ? 'Black' : 'White'}'s Turn`);
            setGameOver(false);
        } else {
            const opponent = nextPlayer === CellState.BLACK ? CellState.WHITE : CellState.BLACK;
            const currentPlayerValidMoves = getValidMoves(currentBoard, opponent);
            if (currentPlayerValidMoves.length > 0) {
                setValidMoves(currentPlayerValidMoves);
                setCurrentPlayer(opponent);
                const passedPlayer = nextPlayer === CellState.BLACK ? 'Black' : 'White';
                const nextTurnPlayer = opponent === CellState.BLACK ? 'Black' : 'White';
                setMessage(`${nextTurnPlayer}'s Turn (${passedPlayer} passed)`);
            } else {
                setGameOver(true);
                setValidMoves([]);
                if (newScores.black > newScores.white) {
                    setMessage(`Game Over! Black wins ${newScores.black} to ${newScores.white}.`);
                    playAudio(Sounds.WIN);
                } else if (newScores.white > newScores.black) {
                    setMessage(`Game Over! White wins ${newScores.white} to ${newScores.black}.`);
                    playAudio(Sounds.LOSE);
                } else {
                    setMessage(`Game Over! It's a draw.`);
                    playAudio(Sounds.LOSE); // Using lose sound for draw
                }
            }
        }
    }, []);

    useEffect(() => {
        setValidMoves(getValidMoves(board, currentPlayer));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCellClick = useCallback((row: number, col: number) => {
        if (gameOver || !validMoves.some(([r, c]) => r === row && c === col)) {
            playAudio(Sounds.ERROR);
            setInvalidCell([row, col]);
            setTimeout(() => setInvalidCell(null), 300);
            return;
        }
        
        playAudio(Sounds.PLACE);
        const newBoard = makeMove(board, row, col, currentPlayer);
        setBoard(newBoard);

        const opponent = currentPlayer === CellState.BLACK ? CellState.WHITE : CellState.BLACK;
        updateGameStatus(newBoard, opponent);
    }, [board, currentPlayer, gameOver, validMoves, updateGameStatus]);

    const isAIsTurn = currentPlayer === CellState.WHITE && !gameOver;

    useEffect(() => {
        if (isAIsTurn && validMoves.length > 0) {
            const timer = setTimeout(() => {
                const aiMove = findBestMove(board, validMoves);
                if (aiMove) {
                    handleCellClick(aiMove[0], aiMove[1]);
                }
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [isAIsTurn, validMoves, board, handleCellClick]);

    const resetGame = () => {
        const initialBoard = createInitialBoard();
        setBoard(initialBoard);
        setCurrentPlayer(CellState.BLACK);
        setValidMoves(getValidMoves(initialBoard, CellState.BLACK));
        setScores({ black: 2, white: 2 });
        setGameOver(false);
        setMessage("Black's Turn");
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
            <header className="text-center mb-6">
                <h1 className="text-5xl font-bold text-cyan-400 tracking-wider">Reversi</h1>
                <p className="text-gray-400 mt-2">A game of strategy</p>
            </header>
            <main className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative">
                     <Board 
                        board={board} 
                        onCellClick={handleCellClick}
                        validMoves={validMoves}
                        currentPlayer={currentPlayer}
                        boardDisabled={isAIsTurn || gameOver}
                        invalidCell={invalidCell}
                    />
                    {gameOver && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                           <div className="text-center p-8 bg-gray-800 rounded-lg shadow-2xl">
                                <h2 className="text-3xl font-bold text-cyan-400 mb-4">Game Over</h2>
                                <p className="text-white text-lg">{message.replace('Game Over! ', '')}</p>
                           </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-6 w-64">
                    <GameInfo 
                        currentPlayer={currentPlayer} 
                        scores={scores} 
                        message={isAIsTurn && validMoves.length > 0 ? 'AI is thinking...' : message}
                        gameOver={gameOver}
                    />
                    <ResetButton onReset={resetGame} />
                </div>
            </main>
        </div>
    );
};

export default App;