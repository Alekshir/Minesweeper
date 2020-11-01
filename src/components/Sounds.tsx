/// <reference path='../types/declaration.d.ts'/>
import startSound from '../sound/start.mp3'; //if we use import * as startSound we get module, not path to the audio file.
import explosionSound from '../sound/explosion.mp3';
import cheerSound from '../sound/cheer.mp3';

const Sounds = (function () {

    const audioObj = {
        start: new Audio(startSound),
        explosion: new Audio(explosionSound),
        success: new Audio(cheerSound)
    }

    return audioObj;
})();

export default Sounds;