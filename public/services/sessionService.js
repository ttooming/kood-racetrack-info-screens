const raceState = require("../state/raceState");

function addDriver(sessionId, name, carNumber) {
    //Finding session
    const session = raceState.sessions.find(s => s.id === sessionId);

    if (!session) return;

    if (session.drivers.some(d => d.name.toLowerCase() === name.toLowerCase())) {
        return { error: "Driver with that name already exists" };
    }

    if (session.driver.length >= 8) {
        return { error: "Maximum 8 drivers allowed" };
    }
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
}
function removeDriver(sessionId, name) {
    const session = raceState.sessions.find(s => s.id === sessionId);
    if (!session) return;
    session.drivers = session.drivers.filter(d => d.name !== name);
}
function createSession(io) {
    //Making object
    const session = {
        id: raceState.sessions.length + 1,
        drivers: [],
        cars: {}
    };
    raceState.sessions.push(session); //Adds to the array
    return session;
}

function endSession(io) {
    raceState.raceMode = "DANGER";
    raceState.currentSession = null;
    io.emit("sessionEnded");
}
//Accessible elsewhere
module.exports = {
    addDriver,
    removeDriver,
    createSession,
    endSession
}