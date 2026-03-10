const express = require("express");//ekspress rakendus moodul
const webPage = require("http");//aadressi moodul
const { Server } = require("socket.io");//realtime uhendus moodul

const app = express();
const server = webPage.createServer(app);//meie lahendus
const io = new Server(server);//realtime tulemus

app.use(express.static("public"));//kasuta weebilehte kaustast
app.get("/", (reg, res) => {
    res.send("Racetrack server is running");
});

io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});