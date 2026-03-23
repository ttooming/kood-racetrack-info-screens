const socket = io();
const modeDisplay = document.getElementById('current-mode');

socket.on("connect", () => {
    console.log("Connected to Server - Race Control Active");
});

document.getElementById("start-btn").onclick = () => {
    console.log("Requesting Start Race...");
    socket.emit("startRace");
};

const changeMode = (mode) => {
    console.log("Requesting mode change:", mode);
    socket.emit("changeRaceMode", mode);
};

document.getElementById("safe").onclick = () => changeMode("SAFE");
document.getElementById("hazard").onclick = () => changeMode("HAZARD");
document.getElementById("danger").onclick = () => changeMode("DANGER");
document.getElementById("finish").onclick = () => {
    socket.emit("finishRace");
}
    ;

socket.on('raceModeChanged', (mode) => {
    modeDisplay.innerText = mode;

    if (mode === 'SAFE') modeDisplay.style.color = '#00D21D';
    else if (mode === 'HAZARD') modeDisplay.style.color = '#FFF200';
    else if (mode === 'DANGER') modeDisplay.style.color = '#FF0000';
    else modeDisplay.style.color = '#fff';
});