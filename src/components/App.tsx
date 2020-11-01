import * as React from 'react';
import { useEffect, useReducer, useRef } from 'react';
import { getTimeString, getTimeNumber, deepCloneGameState, isScreenHorizontal, getStatData, createMouseEvent } from './Helpers';
import { CellType, StateType, User, MovesArray, GameToReplay } from '../types/Types';
import StartAnimationFirst from './StartAnimationFirst';
import StartAnimationSecond from './StartAnimationSecond';
import RestoreGameMenu from './RestoreGameMenu';
import Settings from './Settings';
import ControlPanel from './ControlPanel';
import Board from './Board';
import Notification from './Notification';
import Statistics from './Statistics';
import Sounds from './Sounds';
import reducer from '../reducers/Reducer';
import initialState from '../initialState/InitialState';


/** App is top level functional component*/

const App = () => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const refDraggable = useRef(null); //reference to the draggable gameboard.
    const refDoc = useRef(null); //reference to the main layer of the document.
    const refMineAndTimePanel = { //reference to the mine panel and timer panel.
        minePanel: useRef<HTMLDivElement>(null),
        timePanel: useRef<HTMLDivElement>(null)
    };

    const cellsRef: React.MutableRefObject<HTMLDivElement>[] = []; //array of references to the cells.
    for (let i = 0; i < 800; i++) cellsRef.push(useRef(null));//we can not write i < state.cellsArray.length because if we change board size number of useRef will be different. And this is forbidden in react.

    const isDragging = useRef<boolean>(false); //flag to detect if draggable board is being dragged.
    const movesCounterObj = useRef<number>(0); //flag to detect first render of gameboard.
    const gameMovesArray = useRef<MovesArray>([]); //array of game moves.
    const firstState = useRef<StateType>(null); //state when game board renders for the first time.
    const replayMode = useRef<boolean>(false); //flag to detect replay mode.
    const setTimesArray = useRef<number[]>([]); //array to clear replay setTimesOut when we break replay.

    /*---------- Functions to start New Game: startAudioHandler, startNewGame,  startTimer -----------*/

    /**
     * starts new game without start animation. If pass { minesNumber: undefined, boardWidth: undefined, boardHeight: undefined } to this function we will have default size of board and default number of mines.
     */
    const startNewGame = ({ minesNumber, boardWidth, boardHeight }: { minesNumber: number, boardWidth: number, boardHeight: number }) => {
        //clears old information we saved to replay previous game.
        movesCounterObj.current = 0;
        gameMovesArray.current = [];
        firstState.current = null;
        replayMode.current = false;

        clearOldRef().then(_ => {

            dispatch({ type: 'start new game', minesNumber, boardWidth, boardHeight });
            startTimer(0);
        });
    }

    /**
     * clears replay setTimesOut.
     */
    const clearOldRef = () => {

        return new Promise((resolve, reject) => {

            const len = setTimesArray.current.length;
            for (let i = 0; i < len; i++) clearTimeout(setTimesArray.current[i]);
            resolve(true);
        });
    };

    /**
     * play music when second animation starts.
     */
    const startAudioHandler = (): void => {
        Sounds.start.play(); Sounds.success.play(); Sounds.success.pause(); Sounds.explosion.play(); Sounds.explosion.pause();
    }//we use Sounds.success.pause() and Sounds.explosion.pause()  because of mobile mode.

    /**
     * starts timer on time panel when game starts. Dispatches action.
     */
    const startTimer = (startTime: number) => {

        let timePassed: number = startTime;

        let timerId: number = setInterval(() => {
            ++timePassed;
            dispatch({ type: 'set time', timeMessage: getTimeString(timePassed), timerId });
        }, 1000);
    }

    /*----- functions to end game -----*/
    /**
     * Application calls this function when we lost game. Dispatches action.
     * @param idCell the number of cell we clicked on.
     */
    const endGame = (idCell: number) => {

        Sounds.explosion.play();
        dispatch({ type: 'end game', idCell, firstState, gameMovesArray, movesCounterObj, replayMode });
        setTimeout(() => { dispatch({ type: 'show all mines' }) }, 1500);
    }

    /**
     * Ends game when there is our victory in game. Dispatches action.
     */
    const successEndGame = (): void => dispatch({ type: 'victory', firstState, gameMovesArray, movesCounterObj, replayMode });

    /*----------functions to save information about game to replay it later and to use for statistics ----------*/

    /**
     * saves initial state. Then  game will use this state to replay the game.
     */
    const saveInitialStateForReplay = (): void => {

        if (replayMode.current) return;
        firstState.current = deepCloneGameState(state) as StateType;
    };


    /**
     * saves a move of the game.
     * @param clickType - type of click. Left click (to open cell) or right click (to mark the cell with flag)
     * @param cellId - cell ID.
     */
    const saveMove = (clickType: 'click' | 'contextmenu', cellId: number): void => {
        if (replayMode.current) return;
        gameMovesArray.current.push({ clickType, cellId })
    };

    /*---------- ----------*/

    /**
     * check if condition for successful end of game (victory) is true.
     */
    const checkIfGameSuccess = (): boolean => {

        const allCellsClicked = state.cellsArray.every((cell) => cell.status != 'untouched');

        if (state.game.minesToCheck == 0 && allCellsClicked) {
            if (state.game.status != 'successEnd' && state.game.status != 'failureEnd') {
                return true;
            }
        }
    }

    /*---------- functions which show notifications of the game ----------*/
    /**
     * shows notification. Dispatches action. Calls closeNotification function.
     * @param message - message of notification.
     */

    const showNotification = (message: string): void => {

        if (replayMode.current&&!state.settings.openRegMenu) return;
        dispatch({ type: 'show notification', message });
        closeNotification();
    }

    /**
     * closes notification. Dispatches action.
     */
    const closeNotification = (): void => {

        setTimeout(() => { dispatch({ type: 'close notification' }); }, 2100)
    }

    /* ---------- Handlers for clicks on Cells ----------*/

    /* ---------- Main function which manages mouse left click on Board. ----------*/
    /**
     * Main function which manages mouse left click on Board. Uses endGame, openSingleEmptyCell, openEmptyCellsArea functions
     * @param cellId - ID of the cell (in state.cellsArray), we left-clicked on.
     */

    const cellLeftClickHandler = (e: React.MouseEvent, cellId: string): void => {

        if (replayMode.current && e.relatedTarget != document.body) return; // if click by user when replay mode is on.
        movesCounterObj.current++;

        let status = state.game.status;

        if (status == 'successEnd' || status == 'failureEnd') { showNotification('Game Over'); return; }

        let cellsArray = state.cellsArray;

        for (let i = 0; i < cellsArray.length; i++) {
            if (cellsArray[i].id === cellId) {
                if (cellsArray[i].status !== 'untouched') return; // if click on the cell which is opened already.

                saveMove('click', i);
                cellHasMine(i, cellsArray) ? endGame(i) : cellHasAdjacentMines(i, cellsArray) ? openSingleEmptyCell(i) : openEmptyCellsArea(i);
                return;
            }
        }
    }

    /**
     * function detects if cell contains mine.
     * @param cellId -cell ID.
     * @param cellsArray - array of cells.
     */
    const cellHasMine = (cellId: number, cellsArray: CellType[]): boolean => (cellsArray[cellId].hasMine && cellsArray[cellId].status == 'untouched');

    /**
     * function detects if cell has adjacent mines.
     * @param cellId -cell ID.
     * @param cellsArray - array of cells.
     */
    const cellHasAdjacentMines = (cellId: number, cellsArray: CellType[]): boolean => (cellsArray[cellId].minesAround && cellsArray[cellId].status == 'untouched');

    /**
     * opens single empty cell.
     * @param idCell - cell ID.
     */
    const openSingleEmptyCell = (idCell: number): void => {

        dispatch({ type: 'open single cell', idCell });
    };

    /**
     * opens area of empty cells.
     * @param idCell - cell ID.
     */
    const openEmptyCellsArea = (idCell: number): void => {

        dispatch({ type: 'open empty area', idCell });
    }

    /* ---------- Main function which manages mouse right click on Board ----------*/
    /**
     * Main function which manages mouse right click on Board. Uses 'setFlagToCell', 'clearFlagFromCell', 'showNotificationNoFlagsLeft' functions.
     * @param cellId - ID of the cell(in state.cellsArray), we right-clicked on. 
     */
    const cellRightClickHandler = (e: React.MouseEvent, cellId: string): void => {

        if (replayMode.current && e.relatedTarget != document.body) return; // if click by user when replay mode is on.
        movesCounterObj.current++;
        const status = state.game.status
        if (status == 'successEnd' || status == 'failureEnd') { showNotification('Game Over'); return; }
        let cellsArray = deepCloneGameState(state.cellsArray) as CellType[];
        for (let i = 0; i < cellsArray.length; i++) {
            if (cellsArray[i].id === cellId) {
                if (cellsArray[i].status !== 'untouched' && cellsArray[i].status !== 'flag') return; // if click on the cell which is opened already.
                saveMove('contextmenu', i);
                switch (cellsArray[i].status) {
                    case 'untouched': state.game.minesToCheck != 0 ? (setFlagToCell(i)) : (showNotification('All Mines Are Flagged!'));
                        break;
                    case 'flag': removeFlagFromCell(i);
                        break;
                }
                break;
            }
        }
    }

    /*  ---------- Secondary rightClick function section. The functions cellRightClickHandler calls.  ---------- */

    /**
     * on right click sets flag to cell if there is no flag yet and decrease number of mines to check. Dispatches action.
     * @param idCell -cell ID in state.cellArray
     */
    const setFlagToCell = (idCell: number): void => dispatch({ type: 'set flag', idCell });

    /**
     * remove flag from cell when we right click on it and increase number of mines to check. Dispatches action.
     * @param idCell - cell ID in state.cellsArray
     */
    const removeFlagFromCell = (idCell: number): void => dispatch({ type: 'remove flag', idCell });

    /* ---------- function to restart game when we click on the smile/sorry button at the control panel. Calls startNewGame function ---------- */

    const buttonClickHandler = (): void => startNewGame({ minesNumber: undefined, boardWidth: undefined, boardHeight: undefined });


    /* ---------- settings panel functions ----------*/

    /**
     * on click on menu label, calls function toggleSettingsMenu
     */
    const settingsMenuClickHandler = (): void => toggleSettingsMenu();

    /**
     * Toggles menu of settings. Changes state.
     */
    const toggleSettingsMenu = (): void => dispatch({ type: 'toggle menu' });

    /**
     * on click on an item of menu calls function changeSizeOfBoard with arguments we got from this item.
     * @param minesNumber - number of mines.
     * @param boardWidth - Board width in cells.
     * @param boardHeight - Board height in cells. 
     */
    const settingsMenuItemClickHandler = (minesNumber: number, boardWidth: number, boardHeight: number): void => {

        refDraggable.current.style = ''; ///if board was dragged, remove style properties.
        changeSizeOfBoard(minesNumber, boardWidth, boardHeight);
    }

    /**
     * changes size of board and quantity of mines on the Board. Starts new game with parameters from this item.
     * @param minesNumber 
     * @param boardWidth 
     * @param boardHeight 
     */
    const changeSizeOfBoard = (minesNumber: number, boardWidth: number, boardHeight: number): void => startNewGame({ minesNumber, boardWidth, boardHeight });

    /**
     * closes settings menu. Dispatches action.
     */
    const closeSettingsMenu = (): void => state.settings.openSettings ? dispatch({ type: 'close menu' }) : null; //may be logical check is  excessive.


    /*----------- functions to manage registration of user ----------*/

    /**
     * when 'Registration' item clicked, open registration menu. 
     */
    const settingsMenuRegClickHandler = (): void => dispatch({ type: 'open register form' });

    /**
     * closes user registration form.
     */
    const closeRegForm = (): void => state.settings.openRegMenu ? dispatch({ type: 'close register form' }) : null;

    /*---------- start of section "clicks and keydown on document" ----------*/

    /*---------- functions manage clicks on document ----------*/

    /**
     * if settings menu is opened closes it. If menu is closed and we click out of game board shows notification. Calls ShowNotification function and closeSettingsMenu function.
     * All the same for statistics menu and registration menu.
     * @param event -React mouse event
     */
    const documentClickHandler = (event: React.MouseEvent): void => {

        if (isDragging.current) return;
        if (state.settings.openSettings && (event.target as HTMLElement).closest('.menu')) return;
        if (state.settings.openStatTable && (event.target as HTMLElement).closest('.statistics__wrapper')) return;
        if (state.settings.openRegMenu && (event.target as HTMLElement).closest('.regForm')) return;

        !state.settings.openSettings && !state.settings.openRegMenu && !state.settings.openStatTable && !isClickable(event.target as HTMLElement) ? showNotification('Click Out Of Game Board!') :
            state.settings.openSettings ? closeSettingsMenu() :
                state.settings.openRegMenu ? closeRegForm() :
                    state.settings.openStatTable ? closeStatTableClickHandler() : null;
    }

    /**
     * gets an HTML element on the screen and detects if we may click on it.
     * @param elem - HTML element we check.
     */

    const isClickable = (elem: HTMLElement): boolean => {

        if (elem.closest('.board__cell') || elem.closest('.settings') || elem.closest('.smile') || elem.closest('.regForm') || elem.closest('.statTableBtn')) return true;
        else return false;
    }

    /*---------- start of section "keydownt" ----------*/
    /**
     * if we press ESC close settings menu or close user registration form.
     * @param event -original keyboard event.
     */
    const documentKeyDownHandler = (event: KeyboardEvent): void => {

        if (event.key != 'Escape') return; //if keyboard button is not 'ESC', do not handle.

        state.settings.openSettings ? closeSettingsMenu() :
            state.settings.openRegMenu ? closeRegForm() :
                state.settings.openStatTable ? closeStatTableClickHandler() : null;
    }

    /*---------- drag and drop functions ----------*/

    /**
     * drag and drop function for desktop
     * @param e -mouse event
     */
    const dragMouseDownHandler = (e: React.MouseEvent): void => {

        if (e.target != refMineAndTimePanel.minePanel.current && e.target != refMineAndTimePanel.timePanel.current) return
        const sizeBox = refDraggable.current.getBoundingClientRect();
        const deltaX = e.pageX - sizeBox.left;
        const deltaY = e.pageY - sizeBox.top;

        refDoc.current.onmousemove = function (e: MouseEvent) {
            isDragging.current = true;
            refDraggable.current.style.marginLeft = '0px';
            refDraggable.current.style.marginTop = '0px';
            refDraggable.current.style.left = (e.pageX - deltaX) + 'px';
            refDraggable.current.style.top = (e.pageY - deltaY) + 'px';
        }

        refDoc.current.onmouseup = function (e: MouseEvent) {

            setTimeout(() => { isDragging.current = false }, 500);
            refDoc.current.onmousemove = null;
            refDoc.current.onmouseup = null;
        }
    }

    /**
     * drag and drop function for mobile.
     * @param e -React.TouchEvent
     */
    const dragTouchStartHandler = (e: React.TouchEvent): void => {

        if (e.targetTouches[0].target != refMineAndTimePanel.minePanel.current && e.targetTouches[0].target != refMineAndTimePanel.timePanel.current) return;
        const sizeBox = refDraggable.current.getBoundingClientRect();
        const deltaX = e.touches[0].pageX - sizeBox.left;
        const deltaY = e.touches[0].pageY - sizeBox.top;

        refDoc.current.ontouchmove = function (e: React.TouchEvent) {
            isDragging.current = true;
            refDraggable.current.style.marginLeft = '0px';
            refDraggable.current.style.marginTop = '0px';
            refDraggable.current.style.left = (e.touches[0].pageX - deltaX) + 'px';
            refDraggable.current.style.top = (e.touches[0].pageY - deltaY) + 'px';
        }

        refDoc.current.ontouchend = function (e: MouseEvent) {

            setTimeout(() => { isDragging.current = false }, 500);
            refDoc.current.ontouchmove = null;
            refDoc.current.ontouchend = null;
        }
    }

    /*----------functions to restore unfinished game----------*/

    /**shows restore game menu*/
    const restoreGameMenu = () => dispatch({ type: 'showRestoreGameMenu' });

    /**
     * reacts on button click of restore game menu. Click on 'restore' button, calls restoreGame()
     */
    const restoreButtonClickHandler = (e: React.MouseEvent) => restoreGame();


    /**
     * reacts on button click of restore game menu.
     * click on 'new' button calls startNewGame({ minesNumber: undefined, boardWidth: undefined, boardHeight: undefined })
     */
    const newGameButtonClickHandler = (e: React.MouseEvent) => startNewGame({ minesNumber: undefined, boardWidth: undefined, boardHeight: undefined });

    /**
     * restores state from localStorage and restores not finished game.
     */
    const restoreGame = () => {

        const state = JSON.parse(localStorage.getItem('state')) as StateType;
        dispatch({ type: 'restore game', state });
        let timeNumber = getTimeNumber(state.timePanel.timeMessage);
        startTimer(timeNumber);
    };

    /*----------functions to register a user----------*/
    /**
     * register new user
     * @param inputVal - Name of the new user.
     */
    const registerButtonClickHandler = (inputVal: string, refToInput: React.MutableRefObject<HTMLInputElement>): void => {

        if (inputVal.trim() === '') {
            refToInput.current.blur();//this is for mobile mode. Shuts down virtual keyboard.
            showNotification("Your register name must not be empty!");
            return;
        }

        localStorage.clear();
        let userInfo: User = {
            user: inputVal,
            victories: 0,
            defeats: 0,
            gamesInfo: []
        };
        let userInfoStr = JSON.stringify(userInfo);
        localStorage.setItem(inputVal, userInfoStr);
        localStorage.setItem('user', inputVal);
        startNewGame({ minesNumber: undefined, boardWidth: undefined, boardHeight: undefined });
    }

    /**
     * cancels registration process and closes registration form.
     */
    const cancelRegisterClickHandler = (): void => dispatch({ type: 'close register form' });

    /*---------- function to manage statistics menu -------*/

    /**
     * opens statistics page.
     */
    const showStatisticsClickHandler = (): void => {

        const statData = getStatData(); //this data we will call second time when open chart or allGamesStat

        if (statData.fullInfo) {
            dispatch({ type: 'open statistics page', data: statData });
        } else if (statData.noUser) {
            showNotification('You are not registered! To collect statistics - register first');
        } else if (statData.noInfo) {
            showNotification(`This is your first game as ${statData.fullInfo.user}. No statistics available`);
        }
    };

    /**
     * close statistics page.
     */
    const closeStatTableClickHandler = (): void => dispatch({ type: 'close statistics page' });

    /**
     * open chart at the statistics page.
     */
    const openChartClickHandler = (): void => dispatch({ type: 'open statistics chart' });

    /**
     * open all games statistics table at the statistics page.
     */
    const openAllGamesStatClickHandler = (): void => dispatch({ type: 'open all games statistics' });

    /*---------- functions to replay game ----------*/

    /**
     * get information about played game from LocalStorage, restore gameboard of the game and calls replay with 1 second delay.
     * @param gameNumber - number of the played game.
     */
    const replayGame = (gameNumber: number): void => {
        clearInterval(state.timePanel.timerId);
        refDraggable.current.style = '';
        localStorage.setItem('state', '');
        replayMode.current = true;
        const games: GameToReplay[] = JSON.parse(localStorage.getItem('gamesToReplay'));
        const game = games[gameNumber];
        const replayState = game.initialState;
        dispatch({ type: 'restore game', state: replayState });

        setTimeout(() => replay(game), 1000);
    };

    /**
     * replays the chosen game.
     * @param game - object with information about the game.
     */
    const replay = (game: GameToReplay): void => {

        game.movesArray.forEach((val, i) => {
            let clickType = val.clickType;
            let event = createMouseEvent(clickType);
            let id = val.cellId;
            let s = setTimeout(() => {

                (cellsRef[id].current as HTMLElement).classList.add('board__cell_redColor');
                (cellsRef[id].current as HTMLElement).classList.add('board__cell_roundBorder');
            }, 2000 * i + 1000);

            let s1 = setTimeout(() => {

                (cellsRef[id].current as unknown as HTMLElement).dispatchEvent(event);
            }, 2000 * i + 1500);

            setTimesArray.current.push(s, s1);
        });
    };


    /* ---------- Hooks ----------*/

    /*prevent context menu when we click on document.*/
    useEffect(() => document.addEventListener('contextmenu', event => event.preventDefault()), []);

    /* saves initial state at the start of game */
    useEffect(() => {

        if (state.game.status == 'start' && movesCounterObj.current == 0) saveInitialStateForReplay();
    });

    useEffect(() => {//save current state of game in localStorsage to use it to restore game.

        if (state.game.status == 'startAnimationFirst' || state.game.status == 'startAnimationSecond' || state.game.status == 'restoreGameMenu' || state.game.status == "failureEnd" || state.game.status == "successEnd" || replayMode.current == true) return;

        window.localStorage.setItem('state', JSON.stringify(state));
    });

    /**
     * Check if game success. Registers listener for 'keydown' event. Close menu if Esc pressed.
     */
    useEffect(() => {//we call this after saving current state because we change in succesEndGame() localStorage.setItem('state','')
        //otherwise in useEffect will be called  window.localStorage.setItem('state', JSON.stringify(state)) because useEffect calls at this render when state.game.status=='start'
        if (checkIfGameSuccess()) successEndGame();
        document.addEventListener('keydown', documentKeyDownHandler);//can not be used on html elements. Only document.
        return () => { document.removeEventListener('keydown', documentKeyDownHandler); } // we need to remove listener to prevent stale state in 'documentKeyDownHandler'
    });

    let page: JSX.Element;
    if (state.game.status == 'startAnimationFirst') {

        page = <StartAnimationFirst clickBallHandler={() => { dispatch({ type: 'start second animation' }) }} />;
    } else if (state.game.status == 'startAnimationSecond') {

        page = <StartAnimationSecond startAudio={startAudioHandler} restoreGameMenu={restoreGameMenu} startNewGame={startNewGame} />;
    } else if (state.game.status == 'restoreGameMenu') {

        page = <RestoreGameMenu restoreButtonClickHandler={restoreButtonClickHandler} newGameButtonClickHandler={newGameButtonClickHandler} />
    } else {

        const classOuterFrame = state.settings.minesNumber == 10 ? 'outerFrameTenToTen' : (state.settings.minesNumber == 35) ? 'outerFrameTwentyToTwenty' : (state.settings.minesNumber == 75) && isScreenHorizontal() ? 'outerFrameFortyToTwenty' : 'outerFrameTwentyToForty';

        page = (
            <div className={'doc'} ref={refDoc} onClick={documentClickHandler} onContextMenu={documentClickHandler} onMouseDown={(e) => { e.preventDefault() /*prevent selection and defaulteDrag */ }}>
                <div draggable={true} className={classOuterFrame} ref={refDraggable} onMouseDown={dragMouseDownHandler} onTouchStart={dragTouchStartHandler}>
                    <Settings menuLabelClickHandler={settingsMenuClickHandler} itemClickHandler={settingsMenuItemClickHandler} menuRegClickHandler={settingsMenuRegClickHandler} openSettings={state.settings.openSettings} openRegMenu={state.settings.openRegMenu} registerButtonClickHandler={registerButtonClickHandler} cancelRegisterClickHandler={cancelRegisterClickHandler} showStatisticsClickHandler={showStatisticsClickHandler} />
                    <div className="gameBoardFrame">
                        <ControlPanel totalMines={state.settings.minesNumber} minesToCheck={state.game.minesToCheck} gameStatus={state.game.status} timerMessage={state.timePanel.timeMessage} buttonClickHandler={buttonClickHandler} refObj={refMineAndTimePanel} />
                        <Board cellRightClickHandler={cellRightClickHandler} cellLeftClickHandler={cellLeftClickHandler} cellsArray={state.cellsArray} minesNumber={state.settings.minesNumber} isScreenHorizontal={isScreenHorizontal()} cellsRef={cellsRef} />
                        <Notification notification={state.game.notification} />
                    </div>
                </div>
                <Statistics open={state.settings.openStatTable} closeStatTableClickHandler={closeStatTableClickHandler} openChart={state.settings.openChart} openChartClickHandler={openChartClickHandler} openAllGamesStatClickHandler={openAllGamesStatClickHandler} replayGame={replayGame} />
            </div>
        );
    }

    return page;
}

export default App;