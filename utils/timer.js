//Race state objects
const raceState = require("../state/raceState");
const saveState = require("../utils/saveState");
function startTimer(io, countdown, onFinish) {
    //Timer runtime considering server execution syntax
    let remainingTime = countdown;
    raceState.timer = remainingTime;
    //Timer loop after every second
    const raceTimer = setInterval(() => { //Node.js built-in feature setInterval(function, milliseconds)
        if (raceState.raceMode === "DANGER") {
            return;
        }
        remainingTime--;
        raceState.timer = remainingTime;
        saveState(raceState);
        //Timer broadcast
        console.log(remainingTime);
        io.emit("timerUpdate", remainingTime);
        if (remainingTime <= 0 || raceState.raceMode === "FINISH") {
            clearInterval(raceTimer);
            onFinish(); //Callback
        }
    }, 1000);
}

module.exports = { startTimer }; 