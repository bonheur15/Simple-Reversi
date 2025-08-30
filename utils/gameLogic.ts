
import { CellState } from '../types';
import type { BoardState, Player } from '../types';

const BOARD_SIZE = 8;
const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1],
];

export const createInitialBoard = (): BoardState => {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(CellState.EMPTY));
    board[3][3] = CellState.WHITE;
    board[3][4] = CellState.BLACK;
    board[4][3] = CellState.BLACK;
    board[4][4] = CellState.WHITE;
    return board;
};

const isOnBoard = (row: number, col: number): boolean => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
};

export const getValidMoves = (board: BoardState, player: Player): [number, number][] => {
    const validMoves: [number, number][] = [];
    const opponent = player === CellState.BLACK ? CellState.WHITE : CellState.BLACK;

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] !== CellState.EMPTY) {
                continue;
            }

            for (const [dr, dc] of DIRECTIONS) {
                let r = row + dr;
                let c = col + dc;
                let hasOpponentPieceInBetween = false;

                while (isOnBoard(r, c) && board[r][c] === opponent) {
                    r += dr;
                    c += dc;
                    hasOpponentPieceInBetween = true;
                }

                if (hasOpponentPieceInBetween && isOnBoard(r, c) && board[r][c] === player) {
                    validMoves.push([row, col]);
                    break; 
                }
            }
        }
    }
    return validMoves;
};

export const makeMove = (board: BoardState, row: number, col: number, player: Player): BoardState => {
    const newBoard = board.map(r => [...r]);
    const opponent = player === CellState.BLACK ? CellState.WHITE : CellState.BLACK;
    
    newBoard[row][col] = player;

    for (const [dr, dc] of DIRECTIONS) {
        let r = row + dr;
        let c = col + dc;
        const piecesToFlip: [number, number][] = [];

        while (isOnBoard(r, c) && newBoard[r][c] === opponent) {
            piecesToFlip.push([r, c]);
            r += dr;
            c += dc;
        }

        if (isOnBoard(r, c) && newBoard[r][c] === player) {
            for (const [fr, fc] of piecesToFlip) {
                newBoard[fr][fc] = player;
            }
        }
    }
    return newBoard;
};

export const calculateScores = (board: BoardState): { black: number, white: number } => {
    let black = 0;
    let white = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === CellState.BLACK) {
                black++;
            } else if (board[r][c] === CellState.WHITE) {
                white++;
            }
        }
    }
    return { black, white };
};
