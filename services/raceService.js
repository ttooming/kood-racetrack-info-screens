//Dependency
const validTransition = require("../raceStateMachine"); // Import state machine for control
const { startTimer } = require("../utils/timer");
const raceState = require("../state/raceState");
//Server runtime considering execution syntax
//60 seconds in dev mode, 600 seconds in normal production
const countdown = process.env.NODE_ENV === "development" ? 60 : 600;

//"io" is our brain of operation
function changeRaceMode(io, newMode) {
    //If new mode is not allowed, make no changes
    if (!validTransition(raceState.raceMode, newMode)) {
        return;
    }
    // Possibilities of new mode as "HAZARD" or "DANGER"
    raceState.raceMode = newMode;
    io.emit("raceModeChanged", newMode);
}

function startRace(io) {
    raceState.raceMode = "SAFE";
    startTimer(io, countdown, () => {
        finishRace(io);
    });
    raceState.currentSession = raceState.sessions.shift();
    io.emit("raceStarted", raceState.currentSession);//go to leader board and next race
    io.emit("raceModeChanged", "SAFE");
}

function finishRace(io) {
    if (raceState.raceMode === "FINISH") {
        return;
    }
    raceState.raceMode = "FINISH";
    io.emit("raceModeChanged", "FINISH")
}

//Accessible elsewhere
module.exports = {
    startRace,
    changeRaceMode,
    finishRace
};