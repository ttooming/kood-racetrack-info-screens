const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENDID ---
    const modeDisplay = document.getElementById('current-mode');
    const startBtn = document.getElementById('start-btn');
    const endBtn = document.getElementById('end-btn');
    const viewDriversBtn = document.getElementById('view-drivers-btn');
    const flagButtons = document.querySelectorAll('.btn-f1');

    // Modal elemendid
    const modal = document.getElementById('next-session-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalList = document.getElementById('modal-driver-list');
    const closeModal = document.getElementById('close-modal');
    const confirmBtn = document.getElementById('modal-confirm-btn');

    // --- ANDMED ---
    let isSessionActive = false;
    let activeDrivers = []; // Need, kes on hetkel rajal (currentSession)
    let nextDrivers = [];   // Need, kes on järjekorras ootel (sessions[0])

    // --- ABI-FUNKTSIOONID ---

    const setFlagsDisabled = (status) => {
        flagButtons.forEach(btn => btn.disabled = status);
    };

    const updateStatusColor = (mode) => {
        if (!modeDisplay) return;
        const colors = {
            'SAFE': '#00c21d',
            'HAZARD': '#FFF700',
            'DANGER': '#FF1801',
            'FINISH': '#ffffff'
        };
        modeDisplay.style.color = colors[mode] || '#ffffff';
        modeDisplay.style.textDecoration = (mode === 'FINISH') ? 'underline' : 'none';
    };

    // Funktsioon, mis joonistab nimekirja pop-up aknasse
    const renderModalList = (type) => {
        modalList.innerHTML = "";
        let drivers = (type === 'current') ? activeDrivers : nextDrivers;

        if (type === 'current' && drivers.length === 0 && nextDrivers.length > 0) {
            drivers = nextDrivers;
            modalTitle.innerText = "NEXT SESSION (READY TO START)";
        } else if (type === 'current') {
            modalTitle.innerText = "DRIVERS ON TRACK";
        } else {
            modalTitle.innerText = "NEXT SESSION (CALL TO PADDOCK)";
        }

        // MUUDATUS: Nüüd on alati nupu tekstiks "CLOSE"
        confirmBtn.innerText = "CLOSE";

        if (drivers && drivers.length > 0) {
            drivers.forEach(d => {
                modalList.innerHTML += `
                    <div class="modal-driver-row">
                        <span class="modal-car">${d.car || '-'}</span>
                        <span class="modal-name">${d.name.toUpperCase()}</span>
                    </div>`;
            });
        } else {
            modalList.innerHTML = "<div style='color:orange; padding:20px; text-align:center;'>NO DRIVERS IN SYSTEM</div>";
        }
    };

    const showDriverModal = (type) => {
        renderModalList(type);
        modal.classList.remove('hidden');
    };

    // --- UI UUENDAMINE REŽIIMI JÄRGI ---

    const updateUIByMode = (mode) => {
        if (!mode) mode = "DANGER";
        if (modeDisplay) modeDisplay.innerText = mode;
        updateStatusColor(mode);

        if (mode === 'FINISH') {
            startBtn.disabled = true;
            endBtn.disabled = false;
            setFlagsDisabled(true);
        }
        else if (mode === 'DANGER' || mode === 'OFF') {
            if (!isSessionActive) {
                startBtn.disabled = false;
                endBtn.disabled = true;
                setFlagsDisabled(true);
            } else {
                startBtn.disabled = true;
                endBtn.disabled = true;
                setFlagsDisabled(false);
            }
        }
        else if (mode === 'SAFE' || mode === 'HAZARD') {
            isSessionActive = true;
            startBtn.disabled = true;
            endBtn.disabled = true;
            setFlagsDisabled(false);
        }
    };

    // --- SOCKET KUULAJAD ---

    socket.on("recieveRaceState", (state) => {
        // Uuendame andmed kohalikes muutujates
        activeDrivers = state.currentSession ? state.currentSession.drivers : [];
        nextDrivers = (state.sessions && state.sessions.length > 0) ? state.sessions[0].drivers : [];
        // Kui pop-up on lahti, värskendame selle sisu reaalajas
        if (!modal.classList.contains('hidden')) {
            const currentView = modalTitle.innerText.includes("ON TRACK") ? 'current' : 'next';
            renderModalList(currentView);
        }

        if (state && state.raceMode) updateUIByMode(state.raceMode);
    });

    socket.on('raceModeChanged', (mode) => updateUIByMode(mode));

    socket.on('sessionEnded', () => {
        isSessionActive = false;
        // Me ei tee reload(), vaid küsime lihtsalt uued andmed
        //socket.emit("getRaceState"); 
    });

    // --- NUPPUDE VAJUTUSED ---

    viewDriversBtn.onclick = () => showDriverModal('current');

    startBtn.onclick = () => {
        isSessionActive = true;
        socket.emit("startRace");
    };

    endBtn.onclick = () => {
        if (confirm("End current session?")) {
            socket.emit("endSession");
            // Näitame kohe järgmise grupi nimekirja
            setTimeout(() => showDriverModal('next'), 300);
        }
    };

    // Lipunupud
    document.getElementById("safe").onclick = () => socket.emit("changeRaceMode", "SAFE");
    document.getElementById("hazard").onclick = () => socket.emit("changeRaceMode", "HAZARD");
    document.getElementById("danger").onclick = () => socket.emit("changeRaceMode", "DANGER");
    document.getElementById("finish").onclick = () => socket.emit("changeRaceMode", "FINISH");

    // Modal sulgemine
    confirmBtn.onclick = () => modal.classList.add('hidden');

    // KÜSIME ANDMEID ALGUSES
    //socket.emit("getRaceState");

    // Leia element lehe laadimisel
    const timerDisplay = document.getElementById('race-timer');

    // Taimeri uuendamise kuulaja
    socket.on("timerUpdate", (seconds) => {
        if (seconds !== undefined && timerDisplay) {
            const mins = Math.floor(Math.abs(seconds) / 60);
            const secs = Math.floor(Math.abs(seconds) % 60);
            const prefix = seconds < 0 ? "-" : "";

            timerDisplay.innerText = `${prefix}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

            // Kui aeg on 0 või miinuses, pane see vilkuma
            if (seconds <= 0) {
                timerDisplay.classList.add('timer-blink');
            } else {
                timerDisplay.classList.remove('timer-blink');
            }
        }
    });
});