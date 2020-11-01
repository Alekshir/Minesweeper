import * as React from 'react';
import { useRef, useLayoutEffect } from 'react';
import { User } from '../types/Types';

type Props = {
    statData: User
}

const Chart = ({ statData }: Props) => {
    //second rotate
    const secondElRef = useRef<HTMLDivElement>(null);

    const victories: number = statData.victories;
    const defeats: number = statData.defeats;
    
    let victoryRatio: number, defeatsRatio:number;

    if(victories===defeats&&victories===0) {
        victoryRatio=0;
        defeatsRatio=0;
    } else {
    victoryRatio= Math.round(victories / (victories + defeats)*100);
    defeatsRatio= Math.round(100 - victoryRatio);
    }
    let ratio: number;
    let color:string;
    let anotherColor:string;
    (statData.defeats > statData.victories) ? (ratio=victoryRatio*360/100, color='color', anotherColor='anotherColor') : (ratio=defeatsRatio*360/100,  color='redColor', anotherColor='blueColor');

    useLayoutEffect(() => {
        secondElRef.current.style.transform = `rotate(${ratio}deg)`;
    });

    return (<div className='chart'>
        <div className='chart__legend'>
            <div className='chart__victories'>victories {victories} ({victoryRatio}%) </div><div className='chart__defeats'>defeats {defeats} ({defeatsRatio}%)</div>
        </div>
        <div className="chart__container">
            <div className={`chart__third chart__third_${anotherColor}`}></div>
            <div className={`chart__first chart__first_${color}`}></div>
            <div className={`chart__second chart__second_${color}`} ref={secondElRef}></div>
        </div>
    </div>);
};

export default Chart;