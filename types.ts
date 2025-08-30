
export enum CellState {
    EMPTY = 0,
    BLACK = 1,
    WHITE = 2,
}

export type Player = CellState.BLACK | CellState.WHITE;
export type BoardState = CellState[][];
