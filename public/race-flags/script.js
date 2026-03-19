const socket = io();
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
    console.log("F1 Flag Update:", mode);
    
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

socket.on("connect", () => {
    console.log("F1 Flag Display Online");
});