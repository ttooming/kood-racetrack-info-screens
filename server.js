// Setting up webserver, real-time utility
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const ngrok = require("@ngrok/ngrok");

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

// Incase of race state change
// Output of server status
io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    socket.on("getRaceState", () => {
        //read the raceState from state.json
        io.emit("recieveRaceState", raceState);
    })
    //Flags requests
    socket.emit("raceModeChanged", raceState.raceMode);
    socket.emit("timerUpdate", raceState.timer);
    socket.emit("recieveRaceState", raceState);

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
    socket.on("removeSession", (sessionTitle) => {
        sessionService.removeSession(io, sessionTitle);
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
});

server.listen(3000, async () => {
    console.log("Server running on port 3000");
    // Start ngrok tunnel automatically for the demo
    try {
        const listener = await ngrok.forward({
            addr: 3000,
            authtoken: process.env.NGROK_AUTHTOKEN
        });
        console.log(`\n======================================================`);
        console.log(`🚀 Public URL: ${listener.url()}`);
        console.log(`======================================================\n`);
    } catch (error) {
        console.error("Failed to start ngrok tunnel:", error.message);
    }
});
