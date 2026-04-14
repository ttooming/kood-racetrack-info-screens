const raceState = require("../state/raceState");
const saveState = require("../utils/saveState");

/**
 * Salvestab ringi läbimise konkreetse auto jaoks.
 * Loogika: Esimene klikk = 0-punkt (start), järgmised klikid = ringiaeg.
 */
function recordLap(io, carNumber) {
    const session = raceState.currentSession;

    // Kontrollime, kas sessioon on aktiivne
    if (!session) {
        return io.emit("lapRecorded", false, { error: "No active session" });
    }

    // DANGER režiimis ringe ei loeta
    if (raceState.raceMode === "DANGER") {
        return io.emit("lapRecorded", false, { error: "Race not active" });
    }

    // Kontrollime, kas auto eksisteerib sessioonis
    if (!session.cars || !session.cars[carNumber]) {
        return io.emit("lapRecorded", false, { error: "Unknown car" });
    }

    const now = Date.now();
    const car = session.cars[carNumber];

    let lapTime = null;

    // --- ALIIS MUUTIS RINGIAJA LOOGIKAT---


    if (car.lastLapTimestamp === null) {
        // ESIMENE ÜLETUS: Fikseerime 0-punkti. Ringide arv jääb 1.
        car.laps = 1;
        car.lastLapTimestamp = now;
        console.log(`Auto ${carNumber}: Sõit algas (0-punkt fikseeritud)`);
    } else if (!car.finished) {
        // JÄRGMISED ÜLETUSED: Arvutame ringiaja eelmisest ületusest
        lapTime = now - car.lastLapTimestamp;

        if (raceState.raceMode === "FINISH") {
            car.finished = true;
            console.log(`Car ${carNumber}: Race Finished!`);
        } else {
            car.laps += 1; // Move to next lap
        }

        // Kontrollime, kas on uus kiireim ring (Fastest Lap)
        if (car.fastestLap === null || lapTime < car.fastestLap) {
            car.fastestLap = lapTime;
        }

        // Uuendame viimast märget järgmise ringi jaoks
        car.lastLapTimestamp = now;
        car.lastLapTime = lapTime; // Salvestame ka viimase ringi aja
        console.log(`Auto ${carNumber}: Ring ${car.laps} läbitud ajaga ${lapTime}ms`);
    }

    // Salvestame muudatused faili (state.json)
    saveState(raceState);

    // Teavitame kõiki liideseid (Leaderboard, Tracker jne) uuest seisust
    io.emit("recieveRaceState", raceState);

    // Lisaks saadame spetsiifilise sündmuse (vajadusel teiste moodulite jaoks)
    io.emit("lapRecorded", true, {
        carNumber,
        laps: car.laps,
        fastestLap: car.fastestLap,
        lapTime
    });
}

/**
 * Vormindab millisekundid tekstiks mm:ss.SSS
 */
function formatLapTime(ms) {
    if (ms === null || ms === undefined || ms === 0) return "--:--.---";

    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = ms % 1000;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

/**
 * Genereerib sorteeritud edetabeli kiireima ringi põhjal.
 */
function getLeaderboard() {
    const session = raceState.currentSession;
    if (!session) return [];

    const leaderboard = [];

    for (const carKey in session.cars) {
        const carData = session.cars[carKey];
        const carNumInt = parseInt(carKey, 10);

        const driverObj = session.drivers.find(d => parseInt(d.car, 10) === carNumInt);
        const driverName = driverObj ? driverObj.name : "Unknown";

        leaderboard.push({
            carNumber: carNumInt,
            driverName,
            laps: carData.laps,
            fastestLap: carData.fastestLap,
            formattedFastestLap: formatLapTime(carData.fastestLap),
            lastLapTime: carData.lastLapTime
        });
    }

    // SORTEERIMINE: Ainult kiireima ringi järgi.
    // Sõitjad, kellel pole veel ringiaega (null), lähevad tabeli lõppu.
    leaderboard.sort((a, b) => {
        if (a.fastestLap === null && b.fastestLap === null) return 0;
        if (a.fastestLap === null) return 1;
        if (b.fastestLap === null) return -1;
        return a.fastestLap - b.fastestLap;
    });

    return leaderboard;
}

module.exports = {
    recordLap,
    getLeaderboard,
    formatLapTime
};
