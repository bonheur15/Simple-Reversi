import type { BoardState } from '../types';

/**
 * A simple AI that finds the best move.
 * For now, it just picks a random valid move.
 * @param board The current state of the board (for future, more complex AI).
 * @param validMoves A list of possible moves for the current player.
 * @returns The chosen move as [row, col], or null if no moves are available.
 */
export const findBestMove = (
    board: BoardState,
    validMoves: [number, number][]
): [number, number] | null => {
    if (validMoves.length === 0) {
        return null;
    }
    
    // A simple strategy: just pick a random valid move.
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
};
