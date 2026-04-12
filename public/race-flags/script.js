const socket = io("http://localhost:3000", {
    auth: {
        token: 12345,
        role: "guest",
        interface: "race-flags"
    }
});
const overlay = document.getElementById('flag-overlay');
const fullBtn = document.getElementById('fullscreen-btn');

fullBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error: ${err.message}`);
        });
        fullBtn.innerText = "Exit";
    } else {
        document.exitFullscreen();
        fullBtn.innerText = "Full Screen";
    }
});

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

