console.log("Countdown script loaded!"); // See peab konsoolis näha olema

document.addEventListener("DOMContentLoaded", () => {
    const socket = io("http://localhost:3000", {
        auth: {
            token: 12345,
            role: "guest",
            interface: "race-countdown"
        }
    });
    const timerDisplay = document.getElementById('timer');
    const endOverlay = document.getElementById('end-session-overlay');
    const fullBtn = document.getElementById('fullscreen-btn'); // Leiame nupu

    console.log("DOM fully loaded and parsed");

    socket.on("timerUpdate", (seconds) => {
        if (seconds !== undefined && seconds !== null) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);

            if (timerDisplay) {
                timerDisplay.innerText =
                    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }

            if (seconds <= 0) {
                if (timerDisplay) timerDisplay.classList.add('blink');
                if (endOverlay) endOverlay.classList.remove('hidden');
            } else {
                if (timerDisplay) timerDisplay.classList.remove('blink');
                if (endOverlay) endOverlay.classList.add('hidden');
            }
        }
    });

    socket.on('raceStarted', () => {
        console.log("Race started signal received");
        if (endOverlay) endOverlay.classList.add('hidden');
    });

    socket.on('sessionEnded', () => {
        console.log("Session ended signal received");
        if (timerDisplay) timerDisplay.innerText = "00:00";
        if (endOverlay) endOverlay.classList.remove('hidden');
    });

    socket.on("connect", () => {
        console.log("Connected to server via Socket.io");
    });

    /**
     * TÄISEKRAANI FUNKTSIONAALSUS
     */
    if (fullBtn) {
        fullBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Viga täisekraanile minekul: ${err.message}`);
                });
                // Peidame nupu kohe pärast klikki
                fullBtn.classList.add('hidden-btn');
            }
        });
    }

    // Jälgime täisekraani olekut (Esc klahvi jaoks)
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            // Kui täisekraanilt väljutakse, toome nupu tagasi
            fullBtn.classList.remove('hidden-btn');
        }
    });
});