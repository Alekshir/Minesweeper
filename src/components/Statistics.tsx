import * as React from 'react';
import AllGamesStat from './AllGamesStat';
import Chart from './Chart';
import { User } from '../types/Types';


type Props = {
    open: boolean;
    closeStatTableClickHandler: () => void;
    openChart: boolean;
    openChartClickHandler: () => void;
    openAllGamesStatClickHandler: () => void;
    replayGame:(i:number) => void
}

const Statistics = ({ open, closeStatTableClickHandler, openChart, openChartClickHandler, openAllGamesStatClickHandler, replayGame}: Props) => {

    let statClassName='';
    let statPageClassName='';
    let bookMarkTableClassName = '';
    let bookMarkChartClassName = '';
    let page: JSX.Element=<div></div>;

    if(open) {
        statClassName='statistics statistics_open';
    
    openChart ? (statPageClassName='statistics__statPage statistics__statPage_chartColor', bookMarkTableClassName = 'statitstics__bookMarkTable', bookMarkChartClassName = 'statitstics__bookMarkChart statitstics__bookMarkChart_open') : (statPageClassName='statistics__statPage statistics__statPage_tableColor', bookMarkTableClassName = 'statitstics__bookMarkTable statitstics__bookMarkTable_open', bookMarkChartClassName = 'statitstics__bookMarkChart');

    const userName = localStorage.getItem('user');
    const statData: User = JSON.parse(localStorage.getItem(userName));

    openChart ? page = <Chart statData={statData}/> : page = <AllGamesStat statData={statData} replayGame={replayGame}/>;
    } else {
        statClassName='statistics';
    }


    return (<div className={statClassName} >
        <div className='statistics__wrapper' >
        <div className='statistics__bookMarkWrapper'>
        <div className={bookMarkTableClassName} onClick={openAllGamesStatClickHandler}>table</div><div className={bookMarkChartClassName} onClick={openChartClickHandler}>chart </div>
        </div>
        <div className={statPageClassName} >
            
            {page}
            
        </div>
        <button className={'statistics__statTableBtn'} onClick={closeStatTableClickHandler}>Back to game</button>
        </div>
    </div>);
}

export default Statistics;