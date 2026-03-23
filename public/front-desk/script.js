const socket = io();

socket.emit("getRaceState");

//request a server for configure sessions and racers
const addSession = (title, date) => {
    console.log("Requesting add the session:", title);

    if (new Date(date.value) < new Date()) {
        alert("Session can't be in past!");
        return;
    }

    socket.emit("addSession", title, date);
}
const removeSession = (title) => {
    console.log("Requesting remove the session:", title);
    socket.emit("removeSession", title);
}

const addRacer = (sessionId, racerName, carNumber) => {
    console.log("Requesting add the racer:", racerName);
    socket.emit("addRacer", sessionId, racerName, carNumber);
}
const editRacer = (sessionId, racerName, carNumber) => {
    console.log("Requesting edit the racer:", racerName);
    socket.emit("editRacer", sessionId, racerName, carNumber);
}
const removeRacer = (sessionId, racerName) => {
    console.log("Requesting remove the racer:", racerName);
    socket.emit("removeRacer", sessionId, racerName);
}


document.getElementById("add-session").onclick = () => {
    const sessionTitle = document.getElementById("session-title").value;
    const sessionDate = document.getElementById("session-date").value;
    addSession(sessionTitle, sessionDate);
}
document.getElementById("remove-session").onclick = () => {
    const sessionTitle = document.getElementById("session-title").value;
    removeSession(sessionTitle);
}

document.getElementById("add-racer").onclick = () => {
    const racerName = document.getElementById("racer-name").value;
    const carNumber = document.getElementById("existed-cars").value;
    const sessionId = document.getElementById("existed-sessions").value;
    addRacer(sessionId, racerName, carNumber);
}
document.getElementById("edit-racer").onclick = () => {
    const racerName = document.getElementById("racer-name").value;
    const carNumber = document.getElementById("existed-cars").value;
    const sessionId = document.getElementById("existed-sessions").value;
    editRacer(sessionId, racerName, carNumber);
}
document.getElementById("remove-racer").onclick = () => {
    const racerName = document.getElementById("racer-name").value;
    const sessionId = document.getElementById("existed-sessions").value;
    removeRacer(sessionId, racerName);
}


const fillSessionAndCarSelector = (sessions) => {
    const sessionSelector = document.getElementById("existed_sessions");

    if (!sessionSelector) return;

    const noneOption = document.createElement("option");
    noneOption.value = "none";
    noneOption.textContent = "-None-";
    sessionSelector.append(noneOption);

    for (const session of sessions) {
        const option = document.createElement("option");
        option.value = session.title;
        option.textContent = session.title;
        sessionSelector.append(option);
    }
}

const createTableHead = () => {
    const table = document.getElementById("upcoming-sessions");
    const headRow = `<caption>UPCOMING SESSIONS</caption>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Racers</th>
                    </tr>
                </thead>`;
    table.insertAdjacentHTML("beforeend", headRow);
}

const updateTable = (sessions) => {
    const table = document.getElementById("upcoming-sessions");
    table.replaceChildren();

    createTableHead();

    const tableBody = document.createElement("tbody");
    table.append(tableBody);

    for (const session of sessions) {
        const row = document.createElement("tr");
        tableBody.append(row);
        for (let i = 0; i < 4; i++) {
            const col = document.createElement("td");
            switch (i) {
                case 0:
                    col.textContent = session.id;
                    break;
                case 1:
                    col.textContent = session.date;
                    break;
                case 2:
                    col.textContent = session.title;
                    break;
                default:
                    col.textContent = session.drivers.join(", ");
            }
            row.append(col);
        }
    }
    console.log("Table is updated.")
}

socket.on("recieveRaceState", (raceState) => {
    fillSessionAndCarSelector(raceState.sessions);
    updateTable(raceState.sessions);
})

socket.on("createdSession", (response, sessions) => {
    console.log(response.message);

    if (response.success) {
        updateTable(sessions);
    }
})
socket.on("removedSession", (response, sessions) => {
    console.log(response.message);

    if (response.success) {
        updateTable(sessions);
    }
})

socket.on("addedDriver", (response, sessions) => {
    console.log(response.message);

    if (response.success) {
        updateTable(sessions);
    }
})
socket.on("editedDriver", (response, sessions) => {
    console.log(response.message);

    if (response.success) {
        updateTable(sessions);
    }
})
socket.on("removedDriver", (response, sessions) => {
    console.log(response.message);

    if (response.success) {
        updateTable(sessions);
    }
})

socket.on("connect", () => {
    console.log("Connected to Server - Front desk");
});