const socket = io("http://localhost:3000", {
    auth: {
        token: 12345,
        role: "guest",
        interface: "race-flags"
    }
});
const overlay = document.getElementById('flag-overlay');
const fullBtn = document.getElementById('fullscreen-btn');

/**
 * TÄISEKRAANI FUNKTSIONAALSUS (Peidab nupu täisekraanil)
 */
if (fullBtn) {
    fullBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error: ${err.message}`);
            });
            // Peidame nupu kohe pärast klikki
            fullBtn.classList.add('hidden-btn');
        }
    });
}

// Jälgime täisekraani olekut (kui tullakse Esc-ga tagasi)
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        // Kui täisekraanilt väljutakse (Esc), toome nupu tagasi
        fullBtn.classList.remove('hidden-btn');
    }
});

/**
 * LIPU REŽIIMIDE KUULAMINE
 */

socket.on('raceModeChanged', (mode) => {

    overlay.className = '';

    if (mode === 'SAFE') {
        overlay.classList.add('flag-safe');
    } else if (mode === 'HAZARD') {
        overlay.classList.add('flag-hazard');
    } else if (mode === 'DANGER') {
        overlay.classList.add('flag-danger');
    } else if (mode === 'FINISH') {
        overlay.classList.add('flag-finish');
    }
});

