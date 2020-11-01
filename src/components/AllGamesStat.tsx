import * as React from 'react';
import { User, GameDescription } from '../types/Types';
import {getRandomInt} from './Helpers';

type Props = {
    statData: User;
    replayGame:(i:number)=>void
}
const AllGamesStatComponent = ({statData, replayGame}:Props) => {

    const rows = (statData.gamesInfo).map((val: GameDescription, i) => {
        return (<div className='tableRow' key={`${i}--${getRandomInt(10000)}`}>
            <div className='tableColumn one'>{val.date}</div><div className='tableColumn two'>{val.time}</div><div className='tableColumn three'>{val.result}</div><div className='tableColumn four'>{val.moves}</div><div className='tableColumn five'><button onClick={()=>replayGame(i)}>replay</button></div>
        </div>);
    });

    return (<>
        <div className='tableRow'>
            <div className='tableColumn one'>date</div><div className='tableColumn two'><p>game</p><p>durartion</p></div><div className='tableColumn three'>result</div><div className='tableColumn four'>moves</div><div className='tableColumn five'>replay game</div>
        </div>
        {rows}
    </>);
}

function areEqual(prevProps: any, nextProps: any) {

    if (nextProps.statData.victories != prevProps.statData.victories||nextProps.statData.defeats != prevProps.statData.defeats) {

        return false;
    } else {

        return true;
        /*
        return true if passing nextProps to render would return
        the same result as passing prevProps to render,
        otherwise return false
        */
    }
}

const AllGamesStat =React.memo(AllGamesStatComponent, areEqual);

export default AllGamesStat;