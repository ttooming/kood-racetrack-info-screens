//Race state constructor
const raceState = require("../state/raceState");

//Server runtime considering execution syntax
//60 seconds in dev mode, 600 seconds in normal production
const countdown = process.env.NODE_ENV === "development" ? 60 : 600;

function startTimer(io, countdown, onFinish) {
    let remainingTime = countdown;

    //Timer loop after every second
    const raceTimer = setInterval(() => { //Node.js built-in feature setInterval(function, milliseconds)
        remainingTime--;

        //Timer broadcast
        io.emit("timerUpdate", remainingTime)

        if (remainingTime <= 0) {
            clearInterval(raceTimer);
            onFinish(); //Callback
        }
    }, 1000);
}

module.exports = { startTimer }; 