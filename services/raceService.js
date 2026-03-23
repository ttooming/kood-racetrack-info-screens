//Dependencies
const validTransition = require("../raceStateMachine"); // Import state machine for control
const { startTimer } = require("../utils/timer");
const raceState = require("../state/raceState");
const saveState = require("../utils/saveState");
const countdown = process.env.NODE_ENV === "development" ? 60 : 600;

// Every change is directed to server
function changeRaceMode(io, newMode) {
    //If new mode is not allowed, make no changes
    if (!validTransition(raceState.raceMode, newMode)) {
        return;
    }
    // Possibilities of new mode as "HAZARD" or "DANGER"
    raceState.raceMode = newMode;
    saveState(raceState);
    io.emit("raceModeChanged", newMode);
}

function startRace(io) {
    raceState.raceMode = "SAFE";
    //Data for loadState function
    raceState.duration = countdown;

    startTimer(io, countdown, () => {
        finishRace(io);
    });
    //Selects first item
    raceState.currentSession = raceState.sessions.shift();
    saveState(raceState);
    io.emit("raceStarted", raceState.currentSession)
    io.emit("raceModeChanged", "SAFE")
}

function resumeRace(io, remainingTime) {
    raceState.raceMode = "SAFE";
    startTimer(io, remainingTime, () => {
        finishRace(io);
    });
    saveState(raceState);
    io.emit("raceModeChanged", "SAFE");
}

function finishRace(io) {
    if (raceState.raceMode === "FINISH")
        return;
    raceState.raceMode = "FINISH";
    saveState(raceState);
    io.emit("raceModeChanged", "FINISH")
}

//Accessible elsewhere
module.exports = {
    startRace,
    changeRaceMode,
    finishRace
};