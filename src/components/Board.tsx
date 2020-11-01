import * as React from 'react';
import { CellType } from '../types/Types';
import Cell from './Cell';

type Props = {
    cellRightClickHandler: (e:React.MouseEvent, id: string) => void;
    cellLeftClickHandler: (e:React.MouseEvent, id: string) => void;
    cellsArray: CellType[];
    minesNumber: number;
    isScreenHorizontal:boolean;
    cellsRef: React.MutableRefObject<HTMLDivElement>[];
};

const Board = ({ cellRightClickHandler, cellLeftClickHandler, cellsArray, minesNumber, isScreenHorizontal, cellsRef}: Props): JSX.Element => {

    const cells = cellsArray.map((val, i) => {

        const cellStatus: string = val.status;

        let cellClass = (minesNumber == 10) ? 'board__cell board__cell_TenToTen' : (minesNumber == 35) ? 'board__cell board__cell_TwentyToTwenty' : (minesNumber == 75&&isScreenHorizontal) ? 'board__cell board__cell_FortyToTwenty' : 'board__cell board__cell_TwentyToForty';

        cellClass = (cellStatus === 'untouched') || (cellStatus === 'mineTouched') ? 
        `${cellClass}` : 
        (cellStatus === 'empty') ? 
        `${cellClass} board__cell_NoMine` : 
        (cellStatus === 'mine') ? 
        `${cellClass} board__cell_HasMine` : (cellStatus === 'flag') ?
         `${cellClass} board__cell_Flaged` : `${cellClass} board__cell_CheckedMine`;

        cellClass = ((cellStatus === 'empty') && (val.minesAround > 0)) ? (val.minesAround == 1 ? `${cellClass} board__cell_BlueFont` : (val.minesAround == 2 ? `${cellClass} board__cell_GreenFont` : `${cellClass} board__cell_RedFont`)) : cellClass;

        const animationExplosionClass = cellStatus == 'mineTouched' ? 'AnimationExplosion showAnimationExplosion' : 'AnimationExplosion';

        const cellValue = cellStatus === 'untouched' || cellStatus === 'flag' ? '' : (val.minesAround === 0 ? '' : String(val.minesAround));

        return <Cell key={val.id} refObj={cellsRef[i]} rightClickHandler={cellRightClickHandler} leftClickHandler={cellLeftClickHandler} cellClass={cellClass} animationExplosionClass={animationExplosionClass} cellValue={cellValue} cellId={val.id} />;
    });

    return <div onContextMenu={(e: React.MouseEvent) => e.preventDefault()} className='board'>{cells}</div>;
};

export default Board;