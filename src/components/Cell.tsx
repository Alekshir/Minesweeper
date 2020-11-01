import * as React from 'react';

type Props = {
    cellClass: string,
    cellValue: string,
    cellId: string,
    animationExplosionClass: string,
    rightClickHandler: (e:React.MouseEvent, id: string) => void,
    leftClickHandler: (e:React.MouseEvent, id: string) => void,
    refObj: React.MutableRefObject<HTMLDivElement>
};

const CellComponent = ({refObj,  cellClass, cellValue ,cellId, animationExplosionClass, rightClickHandler,leftClickHandler}: Props): JSX.Element => (<div ref={refObj} id={cellId} className={cellClass} onContextMenu={(e)=>rightClickHandler(e, cellId)} onClick={(e)=>leftClickHandler(e, cellId)}>
        <div className={animationExplosionClass} ></div>
        {cellValue}</div>);

function areEqual(prevProps: Props, nextProps: Props) {

    if (nextProps.cellClass != prevProps.cellClass || nextProps.animationExplosionClass != prevProps.animationExplosionClass || nextProps.cellValue != prevProps.cellValue || nextProps.cellId != prevProps.cellId) {

        return false;
    } else {

        //return true;
        /*
        return true if passing nextProps to render would return
        the same result as passing prevProps to render,
        otherwise return false
        */
    }
}


const Cell = React.memo(CellComponent, areEqual);

export default Cell;