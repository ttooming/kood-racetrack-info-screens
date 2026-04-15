const socket = io("http://localhost:3000", {
    auth: {
        token: 12345,
        role: "guest",
        interface: "leader-board"
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const timerDisplay = document.getElementById('race-timer');
    const leaderboardBody = document.getElementById('leaderboard-body');
    const raceTitle = document.getElementById('race-title');
    const statusBanner = document.getElementById('status-banner');

    /**
     * Vormindab millisekundid tekstiks mm:ss.SSS
     */
    function formatLapTime(ms) {
        if (!ms || ms === 0) return "--:--.---";
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const millis = ms % 1000;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
    }

    /**
     * Taimeri uuendamine (Next Race ja Session Timer loogika)
     */
    socket.on("timerUpdate", (seconds) => {
        if (seconds !== undefined) {
            const mins = Math.floor(Math.abs(seconds) / 60);
            const secs = Math.floor(Math.abs(seconds) % 60);
            const prefix = seconds < 0 ? "-" : "";
            timerDisplay.innerText = `${prefix}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            // Kui aeg on läbi, paneb taimeri vilkuma
            if (seconds <= 0) {
                timerDisplay.classList.add('timer-blink');
            } else {
                timerDisplay.classList.remove('timer-blink');
            }
        }
    });

    /**
     * Põhifunktsioon edetabeli ja bänneri joonistamiseks
     */
    function renderLeaderboard(state) {
        if (!state) return;

        // 1. UUENDAME BÄNNERIT (Toimub alati, ka siis kui sessioon on null)
        const mode = state.raceMode || "OFF";
        if (statusBanner) {
            statusBanner.innerText = mode === "OFF" ? "SESSION ENDED - WAIT FOR START" : mode;
            statusBanner.className = `alert-banner status-${mode.toLowerCase()}`;
        }

        // 2. KONTROLLIME SESSIOONI OLEMASOLU
        // Kui sessiooni andmeid pole (vajutati End Session), siis me EI PUUTU nimekirja.
        // See jätab viimased tulemused ekraanile "külmutatult".
        if (!state.currentSession) {
            console.log("Sessioon on lõppenud. Säilitame vana nimekirja, aga bänner on uuendatud.");
            // Valikuliselt võid siin muuta pealkirja, et viidata lõpptulemustele:
            // raceTitle.innerText = "FINAL STANDINGS"; 
            return;
        }

        // 3. KUI SESSIOON ON AKTIIVNE, JOONISTAME TABELI ÜMBER
        raceTitle.innerText = (state.currentSession.title || "RACE SESSION").toUpperCase();

        let leaderboardData = [];
        const cars = state.currentSession.cars || {};
        const drivers = state.currentSession.drivers || [];

        drivers.forEach(driver => {
            const carData = cars[driver.car] || {};
            leaderboardData.push({
                number: driver.car,
                name: driver.name,
                laps: carData.laps || 0,
                lastLap: carData.lastLapTime || 0,
                bestLap: carData.fastestLap || 0
            });
        });

        // SORTEERIMINE: Parima ringi järgi (Fastest Lap)
        leaderboardData.sort((a, b) => {
            if (a.bestLap === 0) return 1;
            if (b.bestLap === 0) return -1;
            return a.bestLap - b.bestLap;
        });

        // Joonistame uue nimekirja
        leaderboardBody.innerHTML = "";
        leaderboardData.forEach((d, index) => {
            // --- ALIIS MUUTIS: Outlap loogika ---
            // Kui ringe on 0, kuvame "OUTLAP", muul juhul numbri.
            const lapsDisplay = d.laps === 0 ? "OUTLAP" : d.laps;
            const card = `
                <div class="driver-card">
                    <div class="pos-num">${index + 1}</div>
                    <div class="driver-name">${d.name.toUpperCase()}</div>
                    <div class="car-number">${d.number.toString().padStart(2, '0')}</div>
                    <div class="laps-count">${lapsDisplay}</div>                    
                    <div class="last-lap">${formatLapTime(d.lastLap)}</div>
                    <div class="best-lap">${formatLapTime(d.bestLap)}</div>
                </div>`;
            leaderboardBody.innerHTML += card;
        });
    }

    // KUULAJAD
    socket.on("receiveRaceState", (state) => {
        renderLeaderboard(state);
    });

    socket.on("raceModeChanged", (newMode) => {
        console.log("Režiim muutus:", newMode);
        //socket.emit("getRaceState"); // Küsime värske seisundi, et bänner kohe uueneks
    });

    socket.on("lapRecorded", () => {
        //socket.emit("getRaceState");
    });

    // Küsime algseisu kohe lehe laadimisel
    //socket.emit("getRaceState");
});
// Küsime algseisu kohe lehe laadimisel
//socket.emit("getRaceState");

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