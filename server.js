const express = require("express");// webserver
const http = require("http");
const { Server } = require("socket.io");//realtime connection

const app = express();
const server = http.createServer(app);// Server with express
const io = new Server(server);// Socket + Express

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

//Service constructor
const raceService = require("./services/raceService");
const lapService = require("./services/lapService");
const sessionService = require("./services/sessionService");
const raceState = require("./state/raceState");

// Incase of race state change
io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    socket.on("getRaceState", () => {
        io.emit("recieveRaceState", raceState);
    })
    //Flags requests
    socket.on("startRace", () => {
        raceService.startRace(io);
    });
    socket.on("changeRaceMode", (newMode) => {
        raceService.changeRaceMode(io, newMode);
    });
    socket.on("finishRace", () => {
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

    //Racer requests
    socket.on("addRacer", (sessionId, racerName, carNumber) => {
        sessionService.addDriver(io, sessionId, racerName, carNumber);
    })
    socket.on("editRacer", (sessionId, racerName, carNumber) => {
        sessionService.editDriver(io, sessionId, racerName, carNumber);
    })
    socket.on("removeRacer", (sessionId, racerName) => {
        sessionService.removeDriver(io, sessionId, racerName);
    })
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
