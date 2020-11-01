import * as React from 'react';
import ToolTip from './ToolTip';


type Props={

    minesToCheck:number;
    refMinePanel:React.MutableRefObject<HTMLDivElement>
};

const MinePanel=({minesToCheck, refMinePanel}:Props):JSX.Element=>{

    return <div className='controlPanel__minePanel' ref={refMinePanel}>
    {`${minesToCheck} mines left`} 
    <ToolTip text={'You can drag and drop the game board'} className={'controlPanel__tooltiptext'} />
    </div>;
}

export default MinePanel;