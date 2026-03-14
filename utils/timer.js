//Race state constructor
const { finishRace } = require("../public/services/raceService");
const raceState = require("../state/raceState");

//Server runtime considering execution syntax
//60 seconds in dev mode, 600 seconds in normal production
const countdown = process.env.NODE_ENV === "development" ? 60 : 600;

//Racetimer from "countdown" 
let raceTimer = null;

function startTimer(io) {
    let remainingTime = countdown;
    raceState.timer = remainingTime;

    //Timer loop after every second
    raceTimer = setInterval(() => { //Node.js built-in feature setInterval(function, milliseconds)
        remainingTime--;
        raceState.timer = remainingTime;

        //Timer broadcast
        io.emit("timerUpdate", remainingTime)

        if (remainingTime <= 0) {
            clearInterval(raceTimer);
            finishRace(io); //Declared in service/raceService.js
        }
    }, 1000);
}

module.exports = startTimer;