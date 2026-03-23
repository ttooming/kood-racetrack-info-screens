const raceState = require("../state/raceState");

function addDriver(sessionId, name, carNumber) {
    //Finding session
    const session = raceState.sessions.find(s => s.id === sessionId);

    if (!session)
        return io.emit("addedDriver", {
            success: false,
            message: "Session doesn't exist."
        });

    if (session.drivers.some(d => d.name.toLowerCase() === name.toLowerCase())) {
        return io.emit("addedDriver", {
            success: false,
            message: "Driver with that name already exists."
        });
    }

    if (session.driver.length >= 8) {
        return io.emit("addedDriver", {
            success: false,
            message: "Maximum 8 drivers allowed"
        });
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
    io.emit("addedDriver", {
        success: true,
        message: "Driver is added."
    }, raceState.sessions);
}

function editDriver(sessionId, newName, carNumber) {
    const session = raceState.sessions.find(s => s.id === sessionId);
    if (!session)
        return io.emit("editedDriver", {
            success: false,
            message: "Session doesn't exist."
        });

    const car = session.drivers.find(d => d.car === carNumber);
    if (!car)
        return io.emit("editedDriver", {
            success: false,
            message: "Car doesn't exist."
        });

    if (session.drivers.some(d => d.name.toLowerCase() === newName.toLowerCase())) {
        return io.emit("editedDriver", {
            success: false,
            message: "Driver with that name already exists."
        });
    }

    car.name = newName;
    io.emit("editedDriver", {
        success: true,
        message: "Driver is edited."
    }, raceState.sessions);
}

function removeDriver(sessionId, name) {
    const session = raceState.sessions.find(s => s.id === sessionId);
    if (!session)
        return io.emit("removedDriver", {
            success: false,
            message: "Session doesn't exist."
        });
    session.drivers = session.drivers.filter(d => d.name !== name);
    io.emit("removedDriver", {
        success: true,
        message: "Driver is removed."
    }, raceState.sessions);
}
function createSession(io, sessionTitle, sessionDate) {
    //Making object
    if (sessionTitle.trim().length < 5)
        return io.emit("createdSession", {
            success: false,
            message: "Session title is too short (min 5 characters)."
        });

    if (new Date(sessionDate.value) < new Date()) {
        return io.emit("createdSession", {
            success: false,
            message: "Session can't be in past!"
        });
    }
    const session = {
        id: raceState.sessions.length + 1,
        title: sessionTitle,
        date: sessionDate,
        drivers: [],
        cars: {}
    };
    raceState.sessions.push(session); //Adds to the array
    io.emit("createdSession", {
        success: true,
        message: "Session is created."
    }, raceState.sessions);
}

function removeSession(io, sessionTitle) {
    const session = raceState.sessions.find(s => s.title === sessionTitle);
    if (!session)
        return io.emit("removedSession", {
            success: false,
            message: "Session doesn't exist."
        });

    raceState.sessions = raceState.sessions.filter(s => s.title !== sessionTitle);//remove from the array
    io.emit("removedSession", {
        success: true,
        message: "Session is removed."
    }, raceState.sessions);
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