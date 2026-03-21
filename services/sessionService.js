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
    const session = raceState.sessions.find(s => s.id === sessionId);
    if (!session) return;
    session.drivers = session.drivers.filter(d => d.name !== name);
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
    io.emit("createdSession");
}

function removeSession(io, sessionId) {
    const session = raceState.sessions.find(s => s.id === sessionId);
    if (!session) return;

    raceState.sessions.filter(s => s.id !== sessionId);//remove from the array
    io.emit("removedSession");
}

function endSession(io) {
    raceState.raceMode = "DANGER";
    raceState.currentSession = null;
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