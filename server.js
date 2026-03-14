const express = require("express");// webserver
const http = require("http");
const { Server } = require("socket.io");//realtime connection

const app = express();
const server = http.createServer(app);// Server with express
const io = new Server(server);//Socket + Express

// Express route handler
app.use(express.static("public"));// Directory
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

// Incase of server connection
io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});

//Link to race state
const raceState = require("./state/raceState");

//Server runtime considering execution syntax
//60 seconds in dev mode, 600 seconds in normal production
const countdown = process.env.NODE_ENV === "development" ? 60 : 600;

//Racetimer from "countdown" 
let raceTimer = null;

function startTimer() {
    let remainingTime = countdown;
    raceState.timer = remainingTime;

    //Timer loop
    raceTimer = setInterval(() => {
        remainingTime--;
        raceState.timer = remainingTime;

        io.emit("timerUpdate", remainingTime)

        if (remainingTime <= 0) {
            clearInterval(raceTimer);
            finishRace(); //Declared in service/raceService.js
        }
    }, 1000);
}