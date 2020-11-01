import * as React from 'react';
import ButtonBall from './ButtonBall';

type Props={
    clickBallHandler:()=>void
}

const StartAnimationFirst=({clickBallHandler}:Props):JSX.Element=>{

    return (<div className='buttonBallFrame'>
    <ButtonBall clickBallHandler={clickBallHandler} />
    </div>);
}

export default StartAnimationFirst;