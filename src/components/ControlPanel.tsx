import * as React from 'react';
import TimePanel from './TimePanel';
import MinePanel from './MinePanel';
import StartButton from './StartButton';

type Props = {
    minesToCheck:number,
    totalMines:number,
    gameStatus:'startAnimationFirst'|'startAnimationSecond'|'restoreGameMenu'|'start' | 'successEnd'|'failureEnd';
    timerMessage:string,
    refObj:{
        minePanel:React.MutableRefObject<HTMLDivElement>,
        timePanel:React.MutableRefObject<HTMLDivElement>
    }
    buttonClickHandler:()=>void
}

const ControlPanel = ({minesToCheck, totalMines, gameStatus, timerMessage, refObj, buttonClickHandler}: Props) => {
    return <div className='controlPanel'>
        <MinePanel minesToCheck={minesToCheck} refMinePanel={refObj.minePanel}/>
        <StartButton gameStatus={gameStatus} totalMines={totalMines} buttonClickHandler={buttonClickHandler}/>
        <TimePanel timerMessage={timerMessage} refTimePanel={refObj.timePanel}/>
    </div>
}

export default ControlPanel;