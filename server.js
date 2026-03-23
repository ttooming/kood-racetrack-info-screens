// Setting up webserver, real-time utility
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

//Targets of saved raceState data
const raceState = require("./state/raceState");
const loadState = require("./utils/loadState");

//Services import
const raceService = require("./services/raceService");
const sessionService = require("./services/sessionService");
const lapService = require("./services/lapService");
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
if (raceState.raceMode === "SAFE") {
    // Incase of connection loss during timer countdown
    const remainder = raceState.timer;
    // Decision considering remainder time
    if (remainder > 0) {
        timer.startTimer(io, remainder, () => raceService.finishRace(io));
    } else {
        raceService.finishRace(io);
    }
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

// Output of server status
io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
    socket.emit("raceModeChanged", raceState.raceMode);
    socket.emit("timerUpdate", raceState.timer);

    // Incase of race state change
    socket.on("startRace", () => {
        console.log("Race started");
        raceService.startRace(io);
    });
    socket.on("changeRaceMode", (newMode) => {
        raceService.changeRaceMode(io, newMode);
    });
    socket.on("finishRace", () => {
        console.log("Race ended");
        raceService.finishRace(io);
    });
    socket.on("createSession", () => {
        sessionService.createSession(io);
    });
    socket.on("endSession", () => {
        console.log("Session ended");
        sessionService.endSession(io);
    });
    socket.on("lapTracked", (carNumber) => {
        lapService.recordLap(io, carNumber);
    })
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
