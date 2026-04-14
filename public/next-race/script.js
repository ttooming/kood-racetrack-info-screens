const socket = io("http://localhost:3000", {
    auth: {
        token: 12345,
        role: "guest",
        interface: "next-race"
    }
});

// DOM elemendid
const listContainer = document.getElementById('driver-list');
const mainTitle = document.getElementById('main-title');
const paddockFooter = document.getElementById('paddock-footer');
const sessionTimer = document.getElementById('session-timer');

/**
 * 1. REAALAJALINE ANDMETE UUENDAMINE
 */
const eventsToListen = ["recieveRaceState", "createdSession", "removedSession", "addedDriver", "editedDriver", "removedDriver"];

eventsToListen.forEach(eventName => {
    socket.on(eventName, (data, sessions) => {
        // Kui Denis saadab uue sessioonide massiivi, kasutame seda
        const stateData = sessions ? { sessions: sessions } : data;
        updateDriverList(stateData);
    });
});

/**
 * 2. TAIMERI UUENDAMINE
 */
socket.on("timerUpdate", (seconds) => {
    if (seconds !== undefined) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        sessionTimer.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        // Vilkumine, kui aeg on läbi
        seconds <= 0 ? sessionTimer.classList.add('timer-blink') : sessionTimer.classList.remove('timer-blink');
    }
});

/**
 * 3. SESSIOONI JA SÕIDU LOOGIKA
 */
socket.on("raceStarted", () => {
    paddockFooter.classList.add('hidden'); // Peidame bänneri, kui uus sõit algab
});

socket.on("sessionEnded", () => {
    // KONTROLL: Näitame bännerit vaid siis, kui ekraanil on mõni auto/sessioon ootel
    if (listContainer.children.length > 0 && !listContainer.innerHTML.includes("AWAITING DRIVERS")) {
        paddockFooter.classList.remove('hidden');
    }
});

/**
 * 4. VISUAALNE UUENDAMINE 
 */
function updateDriverList(state) {
    let sessions = state.sessions || [];
    
    // Sorteerime kellaaja järgi
    sessions.sort((a, b) => new Date(a.date) - new Date(b.date));

    const nextGroup = sessions[0];
    listContainer.innerHTML = "";

    if (nextGroup) {
        mainTitle.innerText = (nextGroup.title || "NEXT RACE GROUP").toUpperCase();

        if (nextGroup.drivers && nextGroup.drivers.length > 0) {
            nextGroup.drivers.forEach(driver => {
                const carNum = driver.car || "-";
                const card = `
                    <div class="driver-card">
                        <div class="car-number">${carNum.toString().padStart(2, '0')}</div>
                        <div class="driver-name">${driver.name.toUpperCase()}</div>
                    </div>`;
                listContainer.innerHTML += card;
            });
        } else {
            listContainer.innerHTML = "<div style='text-align:center; padding-top:50px; color:#333;'>AWAITING DRIVERS...</div>";
        }
    } else {
        mainTitle.innerText = "NO UPCOMING SESSIONS";
        listContainer.innerHTML = "";
        paddockFooter.classList.add('hidden'); // Kui sessioone pole, peidame alati
    }
}

// Küsime andmeid kohe lehe avamisel
socket.emit("getRaceState");

socket.on("connect", () => {
    console.log("Next Race Display Online");
});

/**
     * TÄISEKRAANI FUNKTSIONAALSUS (Peidab nupu täisekraanil)
     */
    const fullBtn = document.getElementById('fullscreen-btn');

    if (fullBtn) {
        fullBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Viga: ${err.message}`);
                });
                // Peidame nupu kohe pärast klikki
                fullBtn.classList.add('hidden-btn');
            }
        });
    }

    // Jälgime täisekraani olekut (kui tullakse Esc-ga tagasi)
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            // Kui täisekraanilt väljutakse, toome nupu tagasi
            fullBtn.classList.remove('hidden-btn');
        }
    });