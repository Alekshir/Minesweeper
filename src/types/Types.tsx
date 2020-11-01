type CellType = {
    status: 'untouched' | 'flag' | 'empty' | 'mine' | 'checkedMine' | 'mineTouched',
    id: string,
    minesAround: number,
    hasMine: boolean
};

type StateType = {
    cellsArray: CellType[],
    timePanel: {
        timeMessage: string,
        timerId: number
    }
    game: {
        status: 'startAnimationFirst' | 'startAnimationSecond' | 'restoreGameMenu' | 'start' | 'successEnd' | 'failureEnd',
        minesToCheck: number,
        notification: string;
    },
    settings: {
        boardHeight: number,
        boardWidth: number,
        minesNumber: number,
        openSettings: boolean,
        openRegMenu: boolean,
        openStatTable: boolean,
        openChart: boolean,
    }
};

type GameType = {
    status: 'startAnimationFirst' | 'startAnimationSecond' | 'restoreGameMenu' | 'start' | 'successEnd' | 'failureEnd',
    minesToCheck: number,
    notification: string
}

type MarkedObject = { marked: boolean };

type MarkedCell = CellType & MarkedObject;

type GameDescription = { date: string, time: string, moves: number, result: 'victory' | 'defeat' };

type User = {
    user: string,
    victories: number,
    defeats: number,
    gamesInfo: GameDescription[]
};

type Move = {
    clickType: 'click' | 'contextmenu',
    cellId: number
};

type MovesArray = Move[];

type GameToReplay = {
    initialState: StateType,
    movesArray: MovesArray
};

export { CellType, MarkedCell, StateType, GameType, GameDescription, User, MovesArray, GameToReplay };