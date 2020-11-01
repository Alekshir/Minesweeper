import * as React from 'react';

type Props={
notification:string;
}

const Notification=({notification}:Props)=>{
    
    const message=notification=='none'?'':notification;
    const className=message!=''?'messageWrapper messageWrapper_Expand':'messageWrapper';
    return <div className={className}><div className='message'>{message}</div></div>;
}

export default Notification;