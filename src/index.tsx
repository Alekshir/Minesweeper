/// <reference path='./types/declaration.d.ts'/>
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from './components/App'; 

//pre cash images and chear sound.
let img=new Image(), img1=new Image(), img2=new Image(), img3=new Image(), img4=new Image(), img5=new Image(), img6=new Image(), img7=new Image(), img8=new Image();
img.src='./src/img/cell.jpg', img1.src='./src/img/cellEmpty.jpg', img2.src='./src/img/mineRed.jpg', img3.src='./src/img/mineRedCross.jpg', img4.src='./src/img/flag.jpg', img5.src='./src/img/happysmile.jpg', img6.src='./src/img/sorry.jpg', img7.src='./src/img/succesSmile.jpg', img8.src='./src/img/explosion.png';

let audio=new Audio();
audio.src='./src/sound/cheer.mp3';

  ReactDOM.render(
    <App />,
    document.getElementById('entry')
  );
  