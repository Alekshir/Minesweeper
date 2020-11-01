Implementation of minesweeper game using React and Typescript.


Rules of the game:

Mark  all mines at the game board with flags .

LINK TO GIF game.gif

Controls:

Desktop 
 left-click an empty cell to open it.
 right-click a cell to flag it.
 right-click a cell with flag to remove this flag.

 left-click the smile-button to restart game.
 left-click the "settings" bookmark to open game settings.

Mobile
 tap an empty cell to reveal it.
 long-press a cell to flag it.
 long-press a cell with flag to remove this flag.

Settings
 You can choose of three modes of the game.
  10 mines and 10X10 game board size.
  35 mines and 20X20 game board size.
  75 mines and 40X20 or 20X40 board size.

  LINK TO GIF gameSettings

You can register by any name and monitor statistics of your games. All data will be saved in the localStorage of your browser.
There are two options for statistics data:
 1) Table of the played games.
 2) Chart.

 LINK TO GIF gameStat.gif

Table represents list of played games. There are date, game duration, result, number of moves and button "replay" for each game.
Button "replay" invoke imitation of the played game. All moves will be repeated.
Chart represents ratio of victories and ratio of defeats to all played games.
You can drag and drop game board . Just point mouse at the time panel or mine panel, press mouse left button and move mouse. Then release mouse left button. For mobile, press the time panel or mine panel and pull.Then release it.

If game will be interrupted inadvertently by computer turn off or browser shutting down or web page reloading, current state of your game will be saved and at the new game start you will see menu with to options:
1) restore previous game.
2) start new game.

LINK TO GIF


folders structure of the project.

public____dist
    |_____src_____css
           |______img 
           |______sound

src____components
   |___initialState
   |___reducers
   |___sound
   |___types


   public - folder contains index.html file and other files of build project. Loading index.html in browser starts the game.

   src - folder contains entry point index.tsx  and all source files of the project.

   To run the game:

    npm start

    Opens browser at localhost:3000

   To build the application:

    npm run build

    creates new bundle.js in the "public/dist" folder.

   

   
          







