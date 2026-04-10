const raceState = require("../state/raceState");
const saveState = require("../utils/saveState");

function addDriver(io, sessionId, name, carNumber) {
    //Finding session
    const session = raceState.sessions.find(s => s.id === Number(sessionId));

    if (!session)
        return io.emit("addedDriver", {
            success: false,
            message: "Session doesn't exist."
        }, raceState.sessions);

    //Excluding drivers having the same name
    if (session.drivers.some(d => d.name.toLowerCase() === name.toLowerCase())) {
        return io.emit("addedDriver", {
            success: false,
            message: "Driver with that name already exists."
        }, raceState.sessions);
    }

    //checking if name is not empty
    if (name.trim().length < 1)
        return io.emit("addedDriver", {
            success: false,
            message: "Driver name is too short (min 1 characters)."
        }, raceState.sessions);

    if (session.drivers.some(d => d.car === Number(carNumber))) {
        return io.emit("addedDriver", {
            success: false,
            message: "Driver with that car already exists."
        }, raceState.sessions);
    }

    if (session.drivers.length >= 8) {
        return io.emit("addedDriver", {
            success: false,
            message: "Maximum 8 drivers allowed"
        }, raceState.sessions);
    }
    //Adding into session object
    session.drivers.push({
        name: name,
        car: Number(carNumber)
    });

    //Sort drivers by car number
    session.drivers.sort((a, b) => a.car - b.car);

    //Car tracking
    session.cars[carNumber] = {
        laps: 0,
        fastestLap: null,
        lastLapTimestamp: null
    };

    saveState(raceState);
    io.emit("addedDriver", {
        success: true,
        message: "Driver is added."
    }, raceState.sessions);
}

function editDriver(io, sessionId, newName, carNumber) {
    const session = raceState.sessions.find(s => s.id === Number(sessionId));
    if (!session)
        return io.emit("editedDriver", {
            success: false,
            message: "Session doesn't exist."
        }, raceState.sessions);

    const car = session.drivers.find(d => d.car === Number(carNumber));

    if (!car)
        return io.emit("editedDriver", {
            success: false,
            message: "Car doesn't exist."
        }, raceState.sessions);

    if (session.drivers.some(d => d.name.toLowerCase() === newName.toLowerCase())) {
        return io.emit("editedDriver", {
            success: false,
            message: "Driver with that name already exists."
        }, raceState.sessions);
    }
    car.name = newName;
    saveState(raceState);

    io.emit("editedDriver", {
        success: true,
        message: "Driver is edited."
    }, raceState.sessions);
}

function removeDriver(io, sessionId, name) {
    const session = raceState.sessions.find(s => s.id === Number(sessionId));
    if (!session)
        return io.emit("removedDriver", {
            success: false,
            message: "Session doesn't exist."
        }, raceState.sessions);

    const driver = session.drivers.find(d => d.name.toLowerCase() === name.toLowerCase());
    if (!driver)
        return io.emit("removedDriver", {
            success: false,
            message: `Driver ${name} doesn't exist.`
        }, raceState.sessions);

    session.drivers = session.drivers.filter(d => d.name !== name);
    saveState(raceState);

    io.emit("removedDriver", {
        success: true,
        message: "Driver is removed."
    }, raceState.sessions);
}

function createSession(io, sessionTitle, sessionDate) {
    //Making object
    if (sessionTitle.trim().length < 1)
        return io.emit("createdSession", {
            success: false,
            message: "Session title is too short (min 1 characters)."
        }, raceState.sessions);

    const isSession = raceState.sessions.find(s => s.title === sessionTitle && s.date === sessionDate);

    if (isSession)
        return io.emit("createdSession", {
            success: false,
            message: "Session with that title and date already exists."
        }, raceState.sessions);


    const session = {
        id: raceState.sessions.length + 1,
        title: sessionTitle,
        date: sessionDate,
        drivers: [],
        cars: {}
    };
    raceState.sessions.push(session); //Adds to the array

    saveState(raceState);

    io.emit("createdSession", {
        success: true,
        message: "Session is created."
    }, raceState.sessions);
}

function removeSession(io, sessionTitle, sessionDate) {
    const session = raceState.sessions.find(s => s.title === sessionTitle && s.date === sessionDate);
    if (!session)
        return io.emit("removedSession", {
            success: false,
            message: "Session doesn't exist."
        }, raceState.sessions);

    raceState.sessions = raceState.sessions.filter(s => s.title !== sessionTitle);//remove from the array
    saveState(raceState);

    io.emit("removedSession", {
        success: true,
        message: "Session is removed."
    }, raceState.sessions);
}
// 
function endSession(io) {
    raceState.raceMode = "DANGER";
    raceState.isActive = false;
    raceState.currentSession = null;
    saveState(raceState);
    io.emit("raceModeChanged", "DANGER");
    io.emit("sessionEnded");
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