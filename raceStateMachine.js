// Setting up raceMode transitions
function validTransition(from, to) {
    const allowed = {
        DANGER: ["SAFE", "FINISH"],
        SAFE: ["HAZARD", "DANGER", "FINISH"],
        HAZARD: ["SAFE", "DANGER", "FINISH"],
        FINISH: []
    }
    return allowed[from].includes(to);
}

module.exports = validTransition;