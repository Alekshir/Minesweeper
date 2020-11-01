import * as React from 'react';

type Props = {

    restoreButtonClickHandler: (e:React.MouseEvent) => void;
    newGameButtonClickHandler: (e:React.MouseEvent) => void
};

const RestoreGameMenu=({restoreButtonClickHandler, newGameButtonClickHandler}:Props)=>{

    return <div className={'restoreGameMenu'}>
    <section className={'restoreGameMenu_title'}>
    <p>Last game is not finished.</p>
    <p> Want to restore?</p>
    </section>
    <section className={'restoreGameMenu_buttons'}>
    <button className={'restoreGameMenu_restoreGameButton'} onClick={restoreButtonClickHandler}>restore</button>
    <button className={'restoreGameMenu_newGameButton'} onClick={newGameButtonClickHandler}>new</button>
    </section>
    </div>;
}

export default RestoreGameMenu;