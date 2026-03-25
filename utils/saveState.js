const fs = require("fs");
// Saves our raceState object parameters.
function saveState(state) {
    fs.writeFileSync("state.json", JSON.stringify(state, null, 2));
}
module.exports = saveState;