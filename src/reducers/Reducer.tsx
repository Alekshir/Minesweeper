import { StateType, GameType, CellType, MarkedCell, MovesArray, GameToReplay, User,  GameDescription} from '../types/Types';
import { getAdjacentCells, deepCloneGameState, getRandomInt, currentDate } from '../components/Helpers';
import Sounds from '../components/Sounds';

type Action = {
    type: string,
    [p: string]: any
}

const reducer = (state: StateType, action: Action): StateType => {

    switch (action.type) {
        case 'start second animation':
            return ballClickHandler(state);
        case 'showRestoreGameMenu':
            return showRestoreGameMenu(state);
        case 'start new game':
            return startNewGame(state, action.minesNumber, action.boardWidth, action.boardHeight);
        case 'set time':
            return { ...state, timePanel: { timeMessage: action.timeMessage, timerId: action.timerId } };
        case 'end game':
            return endGame(state, action.idCell, action.firstState, action.gameMovesArray, action.movesCounterObj, action.replayMode);
        case 'show all mines':
            return showAllMines(state);
        case 'open single cell':
            return openSingleEmptyCell(state, action.idCell);
        case 'open empty area':
            return openEmptyCellsArea(state, action.idCell);
        case 'show notification':
            return showNotification(state, action.message);
        case 'close notification':
            return closeNotification(state);
        case 'set flag':
            return setFlagToCell(state, action.idCell);
        case 'remove flag':
            return removeFlagFromCell(state, action.idCell);
        case 'toggle menu':
            return toggleSettingsMenu(state);
        case 'close menu':
            return closeSettingsMenu(state);
        case 'open register form':
            return openRegMenu(state);
        case 'close register form':
            return closeRegMenu(state);
        case 'victory':
            return successEndGame(state, action.firstState, action.gameMovesArray, action.movesCounterObj, action.replayMode);
        case 'restore game':
            return action.state;
        case 'open statistics page':
            return openStatTable(state);
        case 'close statistics page':
            return closeStatTable(state);
        case 'open statistics chart':
            return openStatisticsChart(state);
        case 'open all games statistics':
            return openAllGameStat(state);
        default:
            throw new Error('no such action');
    }

    return state;
}

/**
 * left click on the ball starts second animation.
 * @param state 
 */
const ballClickHandler = (state: StateType): StateType => {

    let newStateGameProperty: GameType = { ...state.game, status: 'startAnimationSecond' };
    return { ...state, game: newStateGameProperty };
}

/**
 * shows restore unfinished game menu.
 * @param state 
 */
const showRestoreGameMenu = (state: StateType): StateType => {

    let newGame: GameType = { ...state.game, status: 'restoreGameMenu' };
    return { ...state, game: newGame };
};

/**
 * starts new game.
 * @param state -state
 * @param minesNumber - number of mines.
 * @param boardWidth  - board width in cells.
 * @param boardHeight - board height in cells.
 */
const startNewGame = (state: StateType, minesNumber: number = state.settings.minesNumber, boardWidth: number = state.settings.boardWidth, boardHeight: number = state.settings.boardHeight): StateType => {

    stopTimer(state);
    let s: StateType = drawInitialBoard(minesNumber, boardWidth, boardHeight);

    return s;
}

/**
 *  Starts the process of Board forming.  Uses function createInitState. Changes state.
 */
const drawInitialBoard = (minesNumber: number, boardWidth: number, boardHeight: number): StateType => {

    const initState: StateType = createInitState(minesNumber, boardWidth, boardHeight);
    return initState;
}

/**
 * creates new initial state to use when we start new game
 * @param numberOfCells - number of cells on the game board
 * @param boardWidth - number of cells as board width
 * @param boardHeight - number of cells as board height
 */
const createInitState = (numberOfmines: number, boardWidth: number, boardHeight: number): StateType => {

    let tempArr: CellType[] = [];
    let initState: StateType;
    let numberOfCells = boardWidth * boardHeight;//the number of cells on Board. We manage quantity of cells in one row by setting it's width and height (10% - 10 cells in a row, 5% - 20 cells in a row, 20% - 5 cells in a row). The height of the board will be (whole quantity of cells)/(quantity of cells in one row)

    for (let i = 0; i < numberOfCells; i++) {
        let cell: CellType = {
            status: 'untouched',
            id: `id${i}--${getRandomInt(10000)}`,//we use getRandomInt(10000) to force id be different when we click start new game (smile) button.
            minesAround: 0,
            hasMine: false
        };
        tempArr.push(cell);
    }
    initState = {
        cellsArray: tempArr,
        timePanel: {
            timeMessage: '00 : 00 : 00',
            timerId: null
        },
        game: {
            status: 'start',
            minesToCheck: numberOfmines,
            notification: 'none'
        },
        settings: {
            boardHeight: boardHeight,
            boardWidth: boardWidth,
            minesNumber: numberOfmines,
            openSettings: false,
            openRegMenu: false,
            openStatTable: false,
            openChart: false,

        }
    };

    initState = setMinesToState(initState, numberOfCells, boardWidth);
    initState.cellsArray = setMinesFiguresAroundCell(initState.cellsArray, boardWidth, boardHeight);

    return initState;
}

/*
*/

/*----------Functions to set Mines on Board (setMinesToState, randomMines, setMinesFiguresAroundCell)----------*/
/**
 * sets mines to State and return it. If a value(cell) of state.cellsArray has mine, set value.hasMine=true
 * @param initialState - initial state
 * @param numberOfCells - number of cells of the game board 
 * @param cellsInRow  - number of cells in one row
 */
const setMinesToState = (initialState: StateType, numberOfCells: number, cellsInRow: number): StateType => {

    let finalArrayMines: number[] = randomMines(initialState.settings.minesNumber, numberOfCells, cellsInRow);
    finalArrayMines.forEach(val => {
        initialState.cellsArray[val].hasMine = true;
    });
    return initialState;
}

/**
 * create an array with numbers, where each number is key of state.cellsArray. Each key is mine. And return this array.
 * @param numberOfmines - number of mines we have on game board
 * @param numberOfCells - number of cells on game board
 * @param cellsInRow - number of cells in one row
 */
const randomMines = (numberOfmines: number, numberOfCells: number, cellsInRow: number): number[] => {

    let arrayMines: number[] = [], randomNumbersRange: number[] = [];

    for (let k = 0; k < numberOfCells; k++)  randomNumbersRange.push(k);

    let randNumber: number, temp: number[];

    for (let i = 0; i < numberOfmines; i++) {

        temp = [];
        randNumber = Math.random() * randomNumbersRange.length;
        randNumber = Math.floor(randNumber);
        arrayMines.push(randomNumbersRange[randNumber]);
        temp = getAdjacentCells(randomNumbersRange[randNumber], cellsInRow, numberOfCells / cellsInRow);
        temp = [...temp, ...[randomNumbersRange[randNumber]]];
        temp.forEach(val => randomNumbersRange = randomNumbersRange.filter(el => el != val));
    }
    return arrayMines;
}

/**
 * If there is a cell and there are mines in adjacent cells - sets quantity of this mines in property "minesAround" of our cell. Return array of cells.
 * @param initCellsArray - array of cells.
 * @param cellsInRow -number of cells in one row.
 */
const setMinesFiguresAroundCell = (initCellsArray: CellType[], cellsInRow: number, numberOfRows: number): CellType[] => {

    initCellsArray.forEach((cell, i, arr) => {
        getAdjacentCells(i, cellsInRow, numberOfRows).forEach((cellNum) => {
            if (arr[cellNum].hasMine) cell.minesAround++;
        });
    });
    return initCellsArray;
}
/*---------- end game functions ----------*/

/**
 * we call this function when game ends and we loose. Changes state.
 * @param cellNumber - the number of cell we clicked on
 */
const endGame = (state: StateType, cellNumber: number, firstState:React.MutableRefObject<StateType>, gameMovesArray:React.MutableRefObject<MovesArray>, movesCounterObj:React.MutableRefObject<number>, replayMode:React.MutableRefObject<boolean>): StateType => {

    stopTimer(state);
    localStorage.setItem('state', ''); //no game to restore.
    saveResult(state, 'defeat', replayMode, movesCounterObj);
    saveGameForReplay(state, replayMode, firstState, gameMovesArray);

    let newGameStatus: GameType = { ...state.game, status: 'failureEnd' };

    let cellsArray = deepCloneGameState(state.cellsArray) as CellType[];
    cellsArray[cellNumber].status = 'mineTouched';
    return { ...state, game: newGameStatus, cellsArray: cellsArray };
}

/**
 * Ends game when is our victory. Dispatches action.
*/
const successEndGame = (state: StateType, firstState:React.MutableRefObject<StateType>, gameMovesArray:React.MutableRefObject<MovesArray>, movesCounterObj:React.MutableRefObject<number>, replayMode:React.MutableRefObject<boolean>): StateType => {

    localStorage.setItem('state', '');
    let newStateGameProperty: GameType = { ...state.game, status: 'successEnd' };
    stopTimer(state);
    saveResult(state, 'victory', replayMode, movesCounterObj);
    saveGameForReplay(state, replayMode, firstState, gameMovesArray);
    Sounds.success.play();

    return { ...state, game: newStateGameProperty };
};

/**
 * stop timer on the time panel
 */
const stopTimer = (state: StateType): void => clearInterval(state.timePanel.timerId);

/**
     * saves result of the game at the localStorage for statistics.
     * @param result - 'victory' or 'defeat'
     */
    const saveResult = (state:StateType, result: 'victory' | 'defeat', replayMode:React.MutableRefObject<boolean>, movesCounterObj:React.MutableRefObject<number>):void => {

         if (replayMode.current) return;
 
         let userName = localStorage.getItem('user');
         if (userName === null) return;
         let userInfoStr = localStorage.getItem(userName);
         let userInfo: User = JSON.parse(userInfoStr) as unknown as User;
 
         result == 'victory' ? userInfo.victories++ : userInfo.defeats++;
         let gameInfo: GameDescription = {
             date: currentDate(),
             time: state.timePanel.timeMessage,
             moves: movesCounterObj.current,
             result
         };
         userInfo.gamesInfo.push(gameInfo);
         userInfoStr = JSON.stringify(userInfo);
         localStorage.setItem(userName, userInfoStr);
     }

     /**
     * saves all information about game at the LocalStorage to replay it later and to use for statistics.
     */
    const saveGameForReplay = (state:StateType, replayMode:React.MutableRefObject<boolean>, firstState:React.MutableRefObject<StateType>, gameMovesArray:React.MutableRefObject<MovesArray>) => {

        if (replayMode.current) return;
        let games: GameToReplay[] = JSON.parse(localStorage.getItem('gamesToReplay'));
        if (games !== null) {
            firstState.current.timePanel.timeMessage = state.timePanel.timeMessage;
            let gameInfoForReplay = {
                initialState: firstState.current,
                movesArray: gameMovesArray.current
            };
            games.push(gameInfoForReplay);
            let gamesStr = JSON.stringify(games)
            localStorage.setItem('gamesToReplay', gamesStr);
        } else {
            games = [
                {
                    initialState: firstState.current,
                    movesArray: gameMovesArray.current
                }
            ];

            let gamesStr = JSON.stringify(games)
            localStorage.setItem('gamesToReplay', gamesStr);
        }
    }
 
/**
 * shows all mines on the board when we lost game.
 * @param cellsArray - array of cells (state.cellsArray). Returns array of cells
 */
const showAllMines = (state: StateType): StateType => {

    let cellsArray = deepCloneGameState(state.cellsArray) as CellType[];
    cellsArray.forEach(cell => {
        cell.hasMine && cell.status == 'flag' ? cell.status = 'checkedMine' : (cell.hasMine && !(cell.status == 'flag') ? cell.status = 'mine' : null);
    });
    return { ...state, cellsArray: cellsArray };
};

/* ----------End of section with end game methods ----------*/

/* ----------left click functions which do not end Game---------- */

/**
 * if we click on a cell and there are no mines or figures of quantity of mines in adjacent cells open all cells till we meet mine or flag or figure of mines. Returns array of cells
 * @param cellId - the number of cell (key) in state.cellsArray.
 */
const openEmptyCellsArea = (state: StateType, cellId: number): StateType => {

    let cellsArray = deepCloneGameState(state.cellsArray) as CellType[];
    cellsArray[cellId].status = 'empty';
    let tempCellsArray: MarkedCell[] = cellsArray.map(cell => { return { ...{ marked: false }, ...cell } });
    let emptyCellsNumbers: number[] = [cellId];
    let cellsInRow = state.settings.boardWidth;
    let numberOfRows = state.settings.boardHeight;

    for (let i = 0, j: number; i < emptyCellsNumbers.length; i++) {

        j = emptyCellsNumbers[i];

        getAdjacentCells(j, cellsInRow, numberOfRows).forEach((cellNumber) => {

            if (tempCellsArray[cellNumber].marked) return;
            !(tempCellsArray[cellNumber].minesAround || tempCellsArray[cellNumber].status == 'flag') ? (tempCellsArray[cellNumber].status = 'empty', emptyCellsNumbers.push(cellNumber), tempCellsArray[cellNumber].marked = true) : null;
            tempCellsArray[cellNumber].minesAround && tempCellsArray[cellNumber].status != 'flag' ? tempCellsArray[cellNumber].status = 'empty' : null;

        });

        tempCellsArray[j].marked = true;

    }
    let resultCellsArray: CellType[] = tempCellsArray.map(cell => {
        delete (cell.marked);
        return cell;
    });

    cellsArray = resultCellsArray;

    return { ...state, cellsArray };
};

/**
 * open single cell. Changes state.
 * @param cellNumber 
 */
const openSingleEmptyCell = (state: StateType, cellNumber: number): StateType => {

    let cellsArray = deepCloneGameState(state.cellsArray) as CellType[];
    cellsArray[cellNumber].status = 'empty';

    return { ...state, cellsArray };
};

/* ---------- End of section of left click functions ---------- */

/*---------- functions show and close notifications of our game ----------*/
const showNotification = (state: StateType, message: string): StateType => {

    let newNotification: GameType = { ...state.game, ...{ notification: message } };
    return { ...state, game: newNotification };
};

const closeNotification = (state: StateType) => {

    let newStateGameProperty: GameType = { ...state.game, ...{ notification: 'none' } };
    return { ...state, game: newStateGameProperty };
};

/*  ---------- rightClick methods section ---------- */

/**
 * clears flag from cell when we right click on it and increase number of mines to check. Changes state.
 * @param cellNumber - number(key) of the cell in state.cellsArray
 */
const removeFlagFromCell = (state: StateType, cellNumber: number): StateType => {

    let cellsArray = deepCloneGameState(state.cellsArray) as CellType[];
    cellsArray[cellNumber].status = 'untouched';
    let minesToCheck = state.game.minesToCheck;
    let newStateGameProperty = { ...state.game, minesToCheck: ++minesToCheck };

    return { ...state, cellsArray, game: newStateGameProperty };
};

/**
 * on right click sets flag to cell when there is no flag yet and decreases number of mines to check. Changes state.
 * @param cellNumber -number(key) of the cell in state.cellArray
 */
const setFlagToCell = (state: StateType, cellNumber: number): StateType => {

    let cellsArray = deepCloneGameState(state.cellsArray) as CellType[];
    cellsArray[cellNumber].status = 'flag';
    let minesToCheck = state.game.minesToCheck;
    let newStateGameProperty = { ...state.game, minesToCheck: --minesToCheck };
    return { ...state, cellsArray, game: newStateGameProperty };
};

/* ---------- end of right click functions section. ---------- */

/* ---------- settings panel functions ----------*/

/**
 * closes settings menu.
 * @param state 
 */
const closeSettingsMenu = (state: StateType): StateType => {

    const newStateSettingsProperty = { ...state.settings, openSettings: false };
    return { ...state, settings: newStateSettingsProperty };
};

/**
 * toggle settings menu.
 * @param state 
 */
const toggleSettingsMenu = (state: StateType): StateType => {

    let openSettings = state.settings.openSettings;
    openSettings = openSettings == false ? true : false;
    let newStateSettingsProperty = { ...state.settings, openSettings };
    return { ...state, settings: newStateSettingsProperty };
};

/**
 * open registration menu
 */
const openRegMenu = (state: StateType): StateType => {

    let newStateSettingsProperty = { ...state.settings, openRegMenu: true, openSettings: false };
    return { ...state, settings: newStateSettingsProperty };
};

/**
 * close registration menu.
 * @param state 
 */
const closeRegMenu = (state: StateType): StateType => {

    let newStateSettingsProperty = { ...state.settings, openRegMenu: false };
    return { ...state, settings: newStateSettingsProperty };
};

/**
 * opens table with statistics information.
 * @param state 
 */
const openStatTable = (state: StateType): StateType => {

    let newStateSettingsProperty = { ...state.settings, openSettings: false, openStatTable: true };
    return { ...state, settings: newStateSettingsProperty };
};

/**
 *  closes table with statistics information.
 * @param state 
 */
const closeStatTable = (state: StateType): StateType => {

    let newStateSettingsProperty = { ...state.settings, openStatTable: false, openChart: false };
    return { ...state, settings: newStateSettingsProperty };
};

/**
 * switches to chart with statistics information.
 * @param state 
 */
const openStatisticsChart = (state: StateType): StateType => {

    let newStateSettingsProperty = { ...state.settings, openChart: true };
    return { ...state, settings: newStateSettingsProperty };
};

/**
 * switch to table with statistics information.
 * @param state 
 */
const openAllGameStat = (state: StateType): StateType => {

    let newStateSettingsProperty = { ...state.settings, openChart: false };
    return { ...state, settings: newStateSettingsProperty };
};

export default reducer;