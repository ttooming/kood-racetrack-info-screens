//Race state objects
const raceState = require("../state/raceState");
const saveState = require("../utils/saveState");
function startTimer(io, countdown, onFinish) {
    //Timer runtime considering server execution syntax
    let remainingTime = countdown;
    raceState.timer = remainingTime;
    let finished = false;
    //Timer loop after every second
    const raceTimer = setInterval(() => { //Node.js built-in feature setInterval(function, milliseconds)
        if (finished) return;
        // Hold during DANGER
        if (raceState.raceMode === "DANGER") {
            return;
        }
        remainingTime--;
        // Incase of button press
        if (raceState.raceMode === "FINISH") {
            clearInterval(raceTimer);
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
            onFinish(); //Callback to finishRace
            return;
        }
    }, 1000);
}

module.exports = { startTimer }; 