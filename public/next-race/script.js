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
    paddockFooter.classList.add('hidden'); // Uus sõit algas, peidame bänneri
    //socket.emit("getRaceState"); // Uuendame kohe nimekirja järgmise grupi jaoks
});

socket.on("sessionEnded", () => {
    paddockFooter.classList.remove('hidden'); // Sessioon lõppes, kutsume järgmised paddockisse
});

/**
 * 4. VISUAALNE UUENDAMINE (F1 STIILIS KAARDID)
 */
function updateDriverList(state) {
    const sessions = state.sessions || [];
    const nextGroup = sessions[0]; // Võtame alati järgmise ootel oleva grupi

    listContainer.innerHTML = ""; // Tühjendame vana nimekirja

    if (nextGroup) {
        // Paneme pealkirjaks Denise'i valitud nime (nt "NEXT SESSION 2")
        mainTitle.innerText = (nextGroup.title || "NEXT RACE GROUP").toUpperCase();

        if (nextGroup.drivers && nextGroup.drivers.length > 0) {
            nextGroup.drivers.forEach(driver => {
                const carNum = driver.car || "-";
                // Loome uue musta kaardi (div), mitte tabeli rea
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
    }
}

// Küsime andmeid kohe lehe avamisel
//socket.emit("getRaceState");

socket.on("connect", () => {
    console.log("Next Race F1 Display Online");
});