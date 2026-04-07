//Race state objects
const raceState = require("../state/raceState");
const saveState = require("../utils/saveState");
let raceTimer = null;

function startTimer(io, countdown, onFinish) {
    // If there is previous session to be continued, allow that timer.
    if (raceTimer) {
        return;
    }
    //Timer runtime considering elapsed or not elapsed timer
    let remainingTime = countdown ?? raceState.timer;
    raceState.timer = remainingTime;
    let finished = false;
    //Timer loop after every second
    raceTimer = setInterval(() => { //Node.js built-in feature setInterval(function, milliseconds)
        if (finished) return;
        // Hold during DANGER
        if (raceState.raceMode === "DANGER") {
            return;
        }
        remainingTime--;
        // Incase of button press
        if (raceState.raceMode === "FINISH") {
            clearInterval(raceTimer);
            raceTimer = null;
            io.emit("timerUpdate", 0);
            return;
        }
        raceState.timer = remainingTime;
        saveState(raceState);
        //Timer broadcast
        console.log(remainingTime);
        io.emit("timerUpdate", remainingTime);//LeaderBoard
        if (remainingTime <= 0) {
            finished = true;
            console.log("Race ended");
            clearInterval(raceTimer);
            raceTimer = null;
            onFinish(); //Callback to finishRace
            return;
        }
    }, 1000);
}

function stopTimer() {
    // If previous timer already exists
    if (raceTimer) {
        clearInterval(raceTimer);
        raceTimer = null;
    }
}

module.exports = { startTimer, stopTimer }; 