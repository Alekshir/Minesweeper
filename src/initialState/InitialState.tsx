import {StateType} from '../types/Types';

const InitialState: StateType = {
    cellsArray: [],
    timePanel: {
        timeMessage: '00 : 00 : 00',
        timerId: null
    },
    game: {
        status: 'startAnimationFirst',
        minesToCheck: 10,
        notification: 'none'
    },
    settings: {
        boardHeight: 10,
        boardWidth: 10,
        minesNumber: 10,
        openSettings: false,
        openRegMenu:false,
        openStatTable:false,
        openChart:false,
    }
};

export default InitialState;