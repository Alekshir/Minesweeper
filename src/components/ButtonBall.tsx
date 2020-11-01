import * as React from 'react';

type Props={
    clickBallHandler:()=>void
}

const ButtonBall=({clickBallHandler}:Props):JSX.Element=> <div onClick={clickBallHandler} className='circle'>CLICK ME!</div>;

export default ButtonBall;