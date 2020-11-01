import * as React from 'react';
import ToolTip from './ToolTip';


type Props = {
    timerMessage:string,
    refTimePanel:React.MutableRefObject<HTMLDivElement>
};
  
const TimePanel =({timerMessage, refTimePanel}:Props)=> {

    return <div className='controlPanel__timer' ref={refTimePanel}> 
    {timerMessage}
    <ToolTip text={'You can drag and drop the game board'} className={'controlPanel__tooltiptext'} />
    </div>;
}

export default TimePanel;