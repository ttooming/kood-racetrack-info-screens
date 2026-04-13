require('dotenv').config();
//Check the access key defining the role of the user and give access to the corresponding features
const requiredAccessKeys = ["safety_key", "observer_key", "receptionist_key"];
const missingKeys = requiredAccessKeys.filter(key => !process.env[key]);

if (missingKeys.length > 0) {
    console.error(`Missing required access keys: ${missingKeys.join(', ')}. Please set them.`);
    process.exit(1);
}

// Setting up webserver, real-time utility
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

//Targets of saved raceState data
const raceState = require("./state/raceState");
const loadState = require("./utils/loadState");

//Services import
const raceService = require("./services/raceService");
const lapService = require("./services/lapService");
const sessionService = require("./services/sessionService");
const timer = require("./utils/timer");

//Execution of program
const app = express();
const server = http.createServer(app);// Server with express
const io = new Server(server);// Socket + Express

//Loading values to persist data after server restart
const savedState = loadState();

if (savedState) {
    Object.assign(raceState, savedState);
}

// Incase of connection loss during timer countdown
const remainder = raceState.timer;
// Decision considering remainder time
if (remainder > 0) {
    timer.startTimer(io, remainder, () => raceService.finishRace(io));
} else {
    raceService.finishRace(io);
}

const receptionistKey = process.env.receptionist_key;
const observerKey = process.env.observer_key;
const safetyKey = process.env.safety_key;

// Express route handler
app.use(express.static("public"));// Base directory
app.get("/", (req, response) => {
    response.send("Racetrack server is running");
});
app.get("/front-desk", (req, response) => {
    response.sendFile(__dirname + "/public/front-desk/index.html");
});
app.get("/race-control", (req, response) => {
    response.sendFile(__dirname + "/public/race-control/index.html");
});
app.get("/lap-line-tracker", (req, response) => {
    response.sendFile(__dirname + "/public/lap-line-tracker/index.html");
});
app.get("/leader-board", (req, response) => {
    response.sendFile(__dirname + "/public/leader-board/index.html");
});
app.get("/next-race", (req, response) => {
    response.sendFile(__dirname + "/public/next-race/index.html");
});
app.get("/race-countdown", (req, response) => {
    response.sendFile(__dirname + "/public/race-countdown/index.html");
});
app.get("/race-flags", (req, response) => {
    response.sendFile(__dirname + "/public/race-flags/index.html");
});

//Define roles and their access keys
const roles = {
    [safetyKey]: "safety official",
    [observerKey]: "lap-line observer",
    [receptionistKey]: "receptionist",
    12345: "guest"
}

// check the access key for each connection and assign role
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const accessRole = socket.handshake.auth.role;
    const interface = socket.handshake.auth.interface;
    const role = roles[token];

    if (role && role === accessRole) {
        socket.role = role;
        console.log(`Client connected to ${interface} with role: ${role}`);
        next();
    } else {
        setTimeout(() => {
            if (token)
                console.log(`Client failed to authenticate with token: '${token}' in ${interface}`);
            next(new Error("Invalid access key"));
        }, 500);
    }
})

// Incase of race state change
// Output of server status
io.on("connection", (socket) => {

    // works continiounly
    const stateInterval = setInterval(() => {
        io.emit("recieveRaceState", raceState);
    }, 1000);

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(stateInterval);
    });

    // Returning this so the table is immediately visible when the page loads.
    // Used when data needs to be sent only once.
    socket.on("getRaceState", () => {
        //read the raceState from state.json
        io.emit("sendedRaceState", raceState);
    });
    //Flags requests
    socket.emit("raceModeChanged", raceState.raceMode);
    socket.emit("timerUpdate", raceState.timer);

    // Incase of race state change
    socket.on("startRace", () => {
        console.log("Race started");
        raceService.startRace(io);
    });
    socket.on("changeRaceMode", (newMode) => {
        console.log("MODE:", newMode)
        raceService.changeRaceMode(io, newMode);
    });
    socket.on("finishRace", () => {
        console.log("Race ended");
        raceService.finishRace(io);
    });

    //Lap requests
    socket.on("lapTracked", (carNumber) => {
        lapService.recordLap(io, carNumber);
    });

    //Session requests
    socket.on("addSession", (sessionTitle, sessionDate) => {
        sessionService.createSession(io, sessionTitle, sessionDate);
    })
    socket.on("removeSession", (sessionTitle, sessionDate) => {
        sessionService.removeSession(io, sessionTitle, sessionDate);
    })
    socket.on("endSession", () => {
        console.log("Session ended");
        sessionService.endSession(io);
    });

    //driver requests
    socket.on("addDriver", (sessionId, driverName, carNumber) => {
        sessionService.addDriver(io, sessionId, driverName, carNumber);
    })
    socket.on("editDriver", (sessionId, driverName, carNumber) => {
        sessionService.editDriver(io, sessionId, driverName, carNumber);
    })
    socket.on("removeDriver", (sessionId, driverName) => {
        sessionService.removeDriver(io, sessionId, driverName);
    })

    //change buttons lapTrackeris
    socket.on("pressButton", (carNumber) => {
        io.emit("pressedButton", carNumber);
    })

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
