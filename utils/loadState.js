const fs = require("fs");
//Option to resume server values after server restart
function loadState() {
    //If state.json hasn't created yet, do nothing
    if (!fs.existsSync("state.json")) return null;
    // File service grants data from .json
    const data = fs.readFileSync("state.json");
    return JSON.parse(data);
}
module.exports = loadState;