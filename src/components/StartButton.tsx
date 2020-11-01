import * as React from 'react';
import { useRef } from 'react';
import { isScreenHorizontal } from './Helpers';
import ToolTip from './ToolTip';

type Props = {
    gameStatus: 'startAnimationFirst' | 'startAnimationSecond' | 'restoreGameMenu' | 'start' | 'successEnd' | 'failureEnd';
    totalMines: number,
    buttonClickHandler: () => void
};

const StartButton = ({ gameStatus, totalMines, buttonClickHandler }: Props): JSX.Element => {

    const ref = useRef(null);

    const mouseDownHandler = () => {
        ref.current.style.cssText = 'border: 5px inset;';
    }

    const mouseUpHandler = () => {
        ref.current.style = '';
    }

    const status = gameStatus;
    let className = status == 'start' ? 'controlPanel__smile' : status == 'successEnd' ? 'controlPanel__smile controlPanel__smile_happy' : 'controlPanel__smile controlPanel__smile_sorry';

    return <div className='controlPanel__buttonWrapper'>
        <button className={className} onClick={buttonClickHandler} onMouseDown={mouseDownHandler} onMouseUp={mouseUpHandler} ref={ref}></button>
        <ToolTip text={'Click to start new Game'} className={'controlPanel__tooltiptext'} />
    </div>;
}

export default StartButton;