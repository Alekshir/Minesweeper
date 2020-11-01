import * as React from 'react';
import Registration from './Registration';

type Props = {

    menuLabelClickHandler: () => void;
    itemClickHandler: (minesNumber: number, boardWidth: number, boardHeight: number) => void;
    menuRegClickHandler:() => void;
    showStatisticsClickHandler:() => void;
    openSettings: boolean;
    openRegMenu:boolean;
    registerButtonClickHandler:(inputVal:string, refToInput:React.MutableRefObject<HTMLInputElement>)=>void;
    cancelRegisterClickHandler:()=>void;
}

const Settings = ({itemClickHandler, menuLabelClickHandler, openSettings, openRegMenu, registerButtonClickHandler, menuRegClickHandler, cancelRegisterClickHandler, showStatisticsClickHandler}: Props):JSX.Element => {

    const cssOpenOrCloseSettings=(openSettings == true ? 'menu menu_open' : 'menu menu_close');

    return (<React.Fragment>
        <div className='settings' onClick={(e) => menuLabelClickHandler()}>
            settings
            </div>
        <div className={cssOpenOrCloseSettings}>
            <div className='menu__item' onClick={(e) => itemClickHandler(10, 10, 10)}  > 10 Mines Size 10x10</div>
            <div className='menu__item' onClick={(e) =>  itemClickHandler(35, 20, 20)}> 35 Mines Size 20x20</div>
            <div className='menu__item' onClick={(e) => itemClickHandler(75, 40, 20)}> 75 Mines 40x20 OR 20x40</div>
            <div className='menu__item' onClick={menuRegClickHandler}> Registration </div>
            <div className='menu__item' onClick={showStatisticsClickHandler}> Statistics </div>
        </div>
        <Registration open={openRegMenu} registerButtonClickHandler={registerButtonClickHandler} cancelRegisterClickHandler={cancelRegisterClickHandler}/>
    </React.Fragment>);
}

export default Settings;
