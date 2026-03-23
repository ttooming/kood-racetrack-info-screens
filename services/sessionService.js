const raceState = require("../state/raceState");
const saveState = require("../utils/saveState");

function addDriver(sessionId, name, carNumber) {
    //Finding session
    const session = raceState.sessions.find(s => s.id === sessionId);

    if (!session) return;

    //Excluding drivers having the same name
    if (session.drivers.some(d => d.name.toLowerCase() === name.toLowerCase())) {
        return { error: "Driver with that name already exists" };
    }
    // Capacity control
    if (session.driver.length >= 8) {
        return { error: "Maximum 8 drivers allowed" };
    }
    //Adding into session object
    session.drivers.push({
        name: name,
        car: carNumber
    });
    //Car tracking
    session.cars[carNumber] = {
        laps: 0,
        fastestLap: null,
        lastLapTimestamp: null
    };
    saveState(raceState);
}

function editDriver(sessionId, newName, carNumber) {
    const session = raceState.sessions.find(s => s.id === sessionId);
    if (!session) return;

    const car = session.drivers.find(d => d.car === carNumber);
    if (!car) return;

    if (session.drivers.some(d => d.name.toLowerCase() === newName.toLowerCase())) {
        return { error: "Driver with that name already exists" };
    }

    car.name = newName;
}

function removeDriver(sessionId, name) {
    //Finding current session
    const session = raceState.sessions.find(s => s.id === sessionId);
    if (!session) return;
    //Filtering our unwanted driver
    session.drivers = session.drivers.filter(d => d.name !== name);
    saveState(raceState);
}
function createSession(io, sessionDate) {
    //Making object
    const session = {
        id: raceState.sessions.length + 1,
        title: "session " + raceState.sessions.length + 1,
        date: sessionDate,
        drivers: [],
        cars: {}
    };
    raceState.sessions.push(session); //Adds to the array
    saveState(raceState);
    io.emit("createdSession");
    return session;
}

function removeSession(io, sessionId) {
    const session = raceState.sessions.find(s => s.id === sessionId);
    if (!session) return;

    raceState.sessions.filter(s => s.id !== sessionId);//remove from the array
    io.emit("removedSession");
}
// 
function endSession(io) {
    raceState.raceMode = "DANGER";
    raceState.currentSession = null;
    saveState(raceState);
    io.emit("raceModeChanged", "DANGER");
    io.emit("sessionEnded");//nextRace and leaderBoard
}
//Accessible elsewhere
module.exports = {
    addDriver,
    editDriver,
    removeDriver,
    createSession,
    removeSession,
    endSession
}