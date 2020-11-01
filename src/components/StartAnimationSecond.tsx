import * as React from 'react';
import MinesCarousel from './MinesCarousel';
import StartLetters from './StartLetters';


type Props = {
    startAudio: () => void;
    restoreGameMenu: () => void;
    startNewGame:(settings:{minesNumber: number, boardWidth: number, boardHeight: number})=>void;
}

let StartAnimationSecond = ({startAudio, restoreGameMenu, startNewGame}: Props): JSX.Element => {
    
    if (localStorage.getItem('state')) {
        setTimeout(() => {
            restoreGameMenu();
        }, 6000);
    } else {
        setTimeout(() => {
            startNewGame({minesNumber: undefined, boardWidth: undefined, boardHeight: undefined});
        }, 6000);
    }

    startAudio();

    return (<div >
        <MinesCarousel />
        <StartLetters />
    </div>);
}

export default StartAnimationSecond;