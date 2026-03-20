//Race state constructor
const raceState = require("../state/raceState");

function startTimer(io, countdown, onFinish) {
    let remainingTime = countdown;

    //Timer loop after every second
    const raceTimer = setInterval(() => { //Node.js built-in feature setInterval(function, milliseconds)
        remainingTime--;
        //Timer broadcast
        io.emit("timerUpdate", remainingTime);//LeaderBoard
        if (remainingTime <= 0) {
            clearInterval(raceTimer);
            onFinish(); //Callback
        }
    }, 1000);
}

module.exports = { startTimer }; 