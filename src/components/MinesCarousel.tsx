import * as React from 'react';

const MinesCarousel=():JSX.Element=>{

    return (<div className="carouselBackground">
    <div className="main">
    <div className="row r-one">
        <div className="cellMine r-one_cell-one"></div>
    </div>
    <div className="row r-two">
        
        <div className="cellMine r-two_cell-one"></div>
        <div className="cellMine r-two_cell-two"></div>
        <div className="margin-bottom"></div>
    </div>
    <div className="row r-three">
    </div>
    <div className="row r-four">
        <div className="cellMine r-four_cell-one"></div>
        <div className="cellMine r-four_cell-two"></div>
        <div className="cellMine r-four_cell-three"></div>
    </div>
    <div className="row r-five">
    </div>
    <div className="row r-six">
            
        <div className="cellMine r-six_cell-one"></div>
        <div className="cellMine r-six_cell-two"></div>
        <div className="margin-bottom"></div>
    </div>
    <div className="row r-seven">
            <div className="cellMine r-seven_cell-one"></div>
    </div>
</div>
</div>);
}

export default MinesCarousel;