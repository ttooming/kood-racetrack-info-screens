// Setting up raceMode transitions
function validTransition(from, to) {
    const allowed = {
        DANGER: ["SAFE"],
        SAFE: ["HAZARD", "DANGER", "FINISH"],
        HAZARD: ["DANGER", "FINISH"],
        FINISH: []
    }
    return allowed[from].includes(to);
}

module.exports = validTransition;