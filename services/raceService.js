//Dependency
const validTransition = require("../../raceStateMachine"); // Import state machine for control
const startTimer = require("../../utils/timer");

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
    startTimer(io);
    raceState.currentSession = raceState.sessions.shift();
    io.emit("raceModeChanged", raceState.currentSession)
}

function finishRace(io) {
    if (raceState.raceMode = "FINISH")
        return;
    io.emit("raceModeChanged", "FINISH")
}

//Accessible elsewhere
module.exports = {
    startRace,
    changeRaceMode,
    finishRace
};