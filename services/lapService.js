const raceState = require("../state/raceState");

/**
 * Records a lap crossing for a specific car.
 * Handles lap counting, lap time calculation, and fastest lap tracking.
 */
function recordLap(io, carNumber) {
    const session = raceState.currentSession;

    // Ensure there is an active session
    if (!session) {
        return { error: "No active session" };
    }

    // Race must not be in DANGER mode (no active racing)
    if (raceState.raceMode === "DANGER") {
        return { error: "Race not active" };
    }

    // Ensure the car exists in the current session
    if (!session.cars || !session.cars[carNumber]) {
        return { error: "Unknown car" };
    }

    const now = Date.now();
    const car = session.cars[carNumber];

    let lapTime = null;

    if (car.lastLapTimestamp === null) {
        // First crossing: lap 1 starts, no lap time recorded yet
        car.laps = 1;
        car.lastLapTimestamp = now;
    } else {
        // Subsequent crossings: complete current lap, start next lap
        lapTime = now - car.lastLapTimestamp;
        car.laps += 1;

        // Update fastest lap if this is the first completed lap or a new best
        if (car.fastestLap === null || lapTime < car.fastestLap) {
            car.fastestLap = lapTime;
        }

        car.lastLapTimestamp = now;
    }

    io.emit("lapRecorded", {
        carNumber,
        laps: car.laps,
        fastestLap: car.fastestLap,
        lapTime
    });
}

/**
 * Formats a duration in milliseconds to mm:ss.SSS string format.
 */
function formatLapTime(ms) {
    if (ms === null || ms === undefined) return "--:--.---";

    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = ms % 1000;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

/**
 * Retrieves the sorted leaderboard for the current race session.
 */
function getLeaderboard() {
    const session = raceState.currentSession;

    // Return empty leaderboard if no session is active
    if (!session) {
        return [];
    }

    const leaderboard = [];

    // Build array of car data
    for (const carKey in session.cars) {
        const carData = session.cars[carKey];
        // Ensure carNumber is an integer for comparison
        const carNumInt = parseInt(carKey, 10);

        // Find corresponding driver to get their name
        const driverObj = session.drivers.find(d => parseInt(d.car, 10) === carNumInt);
        const driverName = driverObj ? driverObj.name : "Unknown";

        leaderboard.push({
            carNumber: carNumInt,
            driverName,
            laps: carData.laps,
            fastestLap: carData.fastestLap,
            formattedFastestLap: formatLapTime(carData.fastestLap)
        });
    }

    // Sort leaderboard by fastest lap ascending (quickest time first)
    // Cars without a fastest lap (null) go to the bottom
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
