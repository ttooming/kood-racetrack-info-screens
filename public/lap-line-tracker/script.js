const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('lap-buttons-grid');
    const statusBanner = document.getElementById('status-banner');
    const sessionTitle = document.getElementById('session-title');
    const finishMessage = document.getElementById('finish-message');

    let currentMode = "OFF";
    let drivers = [];
    let finishedCars = new Set();

    // --- ANDMETE VASTUVÕTMINE ---
    socket.on("recieveRaceState", (state) => {
        console.log("State kätte saadud:", state);

        if (state.currentSession) {
            sessionTitle.innerText = state.currentSession.title || "RACE";
            drivers = [...state.currentSession.drivers].sort((a, b) => a.car - b.car);

            if (state.raceMode !== 'OFF') {
                renderButtons();
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
                setTimeout(() => btn.classList.remove('btn-active-flash'), 100);
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