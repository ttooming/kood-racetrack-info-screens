const socket = io("http://localhost:3000", {
    auth: {
        token: prompt("Enter access key:"),
        role: "lap-line observer",
        interface: "lap-line-tracker"
    }
});

socket.on("connect_error", (err) => {
    alert(err + ". Please try again.");
    setTimeout(() => location.reload(), 500);
})

socket.on("connect", () => {
    const trackerContainer = document.getElementById("tracker-container");
    trackerContainer.style.display = "flex";
    console.log("Connected to Server - Lap Line Tracker");
})

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('lap-buttons-grid');
    const statusBanner = document.getElementById('status-banner');
    const sessionTitle = document.getElementById('session-title');
    const finishMessage = document.getElementById('finish-message');

    let currentMode = "OFF";
    let drivers = [];
    let finishedCars = new Set();
    let lastSessionId = null; // Lisame kontrolli, et mitte nuppe pidevalt üle joonistada

    // --- ANDMETE VASTUVÕTMINE ---
    socket.on("recieveRaceState", (state) => {
        console.log("State kätte saadud:", state);

        if (state.currentSession) {
            sessionTitle.innerText = state.currentSession.title || "RACE";
            drivers = [...state.currentSession.drivers].sort((a, b) => a.car - b.car);

           const currentSessionId = state.currentSession.title + drivers.length; 
            if (currentSessionId !== lastSessionId || grid.innerHTML === "") {
                renderButtons();
                lastSessionId = currentSessionId;
            }
        }

        if (state.raceMode) {
            currentMode = state.raceMode;
            updateUIByMode();
        }
    });

    socket.on("raceModeChanged", (mode) => {
        currentMode = mode;
        updateUIByMode();
    });

    function renderButtons() {
        grid.innerHTML = "";
        drivers.forEach(driver => {
            const btn = document.createElement('button');
            btn.className = 'lap-btn';
            btn.innerText = driver.car;
            btn.id = `btn-car-${driver.car}`;

            btn.onclick = () => {
                if (btn.disabled) return;
                btn.classList.add('btn-active-flash');
                setTimeout(() => btn.classList.remove('btn-active-flash'), 200);
                if (navigator.vibrate) navigator.vibrate(50);
                registerLap(driver.car, btn);
            };
            grid.appendChild(btn);
        });
        updateUIByMode();
    }

    function registerLap(carNumber, btnElement) {
        if (currentMode === 'FINISH') {
            if (finishedCars.has(carNumber)) return;
            finishedCars.add(carNumber);
            btnElement.disabled = true;
            btnElement.style.opacity = "0.2";
        }

        console.log(`Vajutati autot: ${carNumber}`);
        // MÄRKSÕNA PARANDUS: lapTriggered -> lapTracked
        socket.emit("lapTracked", carNumber);
    }

    function updateUIByMode() {
        statusBanner.innerText = currentMode;
        statusBanner.className = "";
        statusBanner.classList.add(`status-${currentMode.toLowerCase()}`);
        const allButtons = document.querySelectorAll('.lap-btn');

        if (currentMode === 'SAFE' || currentMode === 'HAZARD') {
            finishMessage.classList.add('hidden');
            allButtons.forEach(btn => btn.disabled = false);
        }
        else if (currentMode === 'DANGER') {
            allButtons.forEach(btn => btn.disabled = true);
        }
        else if (currentMode === 'OFF') {
            // OFF režiimis on bänner nüüd sinine (#007bff) tänu CSS-ile
            allButtons.forEach(btn => btn.disabled = true);
        }
        else if (currentMode === 'FINISH') {
            finishMessage.classList.add('hidden');
            allButtons.forEach(btn => {
                const carNum = parseInt(btn.innerText);
                btn.disabled = finishedCars.has(carNum);
            });
        }
    }

    socket.on('sessionEnded', () => {
        grid.innerHTML = "";
        finishedCars.clear();
        finishMessage.classList.remove('hidden');
        currentMode = "OFF";
        updateUIByMode();
    });

    //socket.emit("getRaceState");
});