import { StateType, User } from "../types/Types";

/**
 * gets row number of the cell.
 * @param cellNumber - cell number.
 * @param cellsInRow - number of cells in one row.
 */
const getRowNumber = (cellNumber: number, cellsInRow: number): number => {
    return Math.trunc(cellNumber / cellsInRow);
};

/**
 * gets column number of cell.
 * @param cellNumber - cell number.
 * @param cellsInRow - number of cells in one row.
 */
const getColumnNumber = (cellNumber: number, cellsInRow: number): number => {
    return cellNumber % cellsInRow;
};

/**
 * gets array with numbers of the adjacent cells.
 * @param cellNumber - nunber of the current cell.
 * @param cellsInRow - number of cells in one row.
 * @param numberOfRows - number of rows in the gameboard. 
 */
const getAdjacentCells = (cellNumber: number, cellsInRow: number, numberOfRows: number): number[] => {
    let rowNumber: number = getRowNumber(cellNumber, cellsInRow), columnNumber: number = getColumnNumber(cellNumber, cellsInRow);
    let adjacentRows: number[] = [rowNumber + 1, rowNumber - 1, rowNumber].filter(row => row > -1 && row < numberOfRows),
        adjacentColumns: number[] = [columnNumber + 1, columnNumber - 1, columnNumber].filter(column => column > -1 && column < cellsInRow);
    let adjacentCells: number[] = [];

    adjacentRows.forEach((row, i) => {
        adjacentColumns.forEach((column, j) => {
            if (!(i == adjacentRows.length - 1 && j == adjacentColumns.length - 1)) adjacentCells.push(row * cellsInRow + column);
        })
    });
    return adjacentCells;
};

/**
 * gets time string in format "hours:minutes:seconds"
 * @param t - time in seconds.
 */
const getTimeString = (t: number): string => {
    let hours: number | string = Math.trunc(t / (60 * 60));
    hours = hours < 10 ? `0${hours}` : hours;
    let minutes: number | string = Math.trunc((t % (60 * 60) / 60));
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    let seconds: number | string = t % 60;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours} : ${minutes} : ${seconds}`;
};

/**
 * gets time in seconds.
 * @param t - string 'hours'-'minutes'-'seconds'
 */
const getTimeNumber = (t: string): number => {
    return t.split(':').map((el) => Number(el)).reduce((a, c, i) => (a + c * Math.pow(60, 2 - i)), 0);
};

/**
 * set new property for state and does not mutate state.
 * @param property - property to change.
 * @param value - new value of the property.
 * @param state - state.
 */
const setStateProperty = (property: string, value: any, state: StateType) => {

    const newState: StateType = deepCloneGameState(state) as StateType;

    const setStateProperty = (property: string, value: any, state: { [key: string]: any }) => {
        for (var p in state) {
            if (state[p] !== null && state[p].constructor.name == 'Object') {

                setStateProperty(property, value, state[p]);
            } else {
                if (p == property) {

                    state[property] = value;
                    break;
                }
            }
        }
    };

    setStateProperty(property, value, newState);

    return newState;
};

/**
 * makes deep clone of a game state.
 */
const deepCloneGameState = (arg: { [p: string]: any }) => {

    let options: { [p: string]: any };
    let name: string
    let src: any;
    let copy:any;
    let trgt: { [p: string]: any} = (arg.constructor.name == 'Object') ? {} : [];
    
    options = arg;
    
    for (const name in options) {

        src = trgt[name];
        copy = options[name];
        // Prevent never-ending loop
        if (trgt === copy) {
            continue;
        }
        if (copy && (copy.constructor.name == 'Object' ||
            copy.constructor.name == 'Array')) trgt[name] = deepCloneGameState(copy);
        else trgt[name] = copy;

    }

    return trgt;
};

/**
 * detects horizontal position of screen.
 */
const isScreenHorizontal = () => window.innerHeight < window.innerWidth;

/**
 * get current data in 'year-month-day'
 */
const currentDate = (): string => {
    const year = (new Date).getFullYear();
    const month = (new Date).getMonth() + 1;
    const day = (new Date).getDate();
    return `${year}-${month}-${day}`;
};

/**
 * gets statistics
 */
const getStatData = (): { noUser?: boolean, noInfo?: boolean, fullInfo?: User } => {

    const userName = localStorage.getItem('user');
    if (!userName) return { noUser: true };
    const info: User = localStorage.getItem(userName) as unknown as User;
    if (!info) return { noInfo: true };
    return {
        fullInfo: info
    }
};

/**
 * create mouse event
 * @param eventType - click or contextmenu.
 */
const createMouseEvent = (eventType: 'click' | 'contextmenu') => {

    return new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        view: window,
        relatedTarget:document.body // flag to detect mouse events generated internaly by this application.
    });
};

/**
 * gets random integer
 * @param max - upper bound of random integer
 */
const getRandomInt = (max: number): number => {

    return Math.floor(Math.random() * Math.floor(max));
};

export { getRowNumber, getColumnNumber, getAdjacentCells, getTimeString, getTimeNumber, setStateProperty, deepCloneGameState, isScreenHorizontal, currentDate, getStatData, createMouseEvent, getRandomInt };