const socket = io();

socket.emit("getRaceState");

//request a server for configure sessions and drivers
const addSession = (title, date) => {
    console.log("Requesting add the session:", title);

    if (new Date(date) < new Date()) {
        alert("Session can't be in past!");
        return;
    }

    socket.emit("addSession", title, date);
}
const removeSession = (title, date) => {
    console.log("Requesting remove the session:", title);
    socket.emit("removeSession", title, date);
}

const addDriver = (sessionId, driverName, carNumber) => {
    console.log("Requesting add the driver:", driverName);
    socket.emit("addDriver", sessionId, driverName, carNumber);
}
const editDriver = (sessionId, driverName, carNumber) => {
    console.log("Requesting edit the driver:", driverName);
    socket.emit("editDriver", sessionId, driverName, carNumber);
}
const removeDriver = (sessionId, driverName) => {
    console.log("Requesting remove the driver:", driverName);
    socket.emit("removeDriver", sessionId, driverName);
}


document.getElementById("add-session").onclick = () => {
    const sessionTitle = document.getElementById("session-title").value;
    const sessionDate = document.getElementById("session-date").value;
    addSession(sessionTitle, sessionDate);
}
document.getElementById("remove-session").onclick = () => {
    const sessionTitle = document.getElementById("session-title").value;
    const sessionDate = document.getElementById("session-date").value;
    removeSession(sessionTitle, sessionDate);
}

document.getElementById("add-driver").onclick = () => {
    const driverName = document.getElementById("driver-name").value;
    const carNumber = document.getElementById("existed-cars").value;
    const sessionId = document.getElementById("existed-sessions").value;
    addDriver(sessionId, driverName, carNumber);
}
document.getElementById("edit-driver").onclick = () => {
    const driverName = document.getElementById("driver-name").value;
    const carNumber = document.getElementById("existed-cars").value;
    const sessionId = document.getElementById("existed-sessions").value;
    editDriver(sessionId, driverName, carNumber);
}
document.getElementById("remove-driver").onclick = () => {
    const driverName = document.getElementById("driver-name").value;
    const sessionId = document.getElementById("existed-sessions").value;
    removeDriver(sessionId, driverName);
}


const fillSessionSelector = (sessions) => {
    const sessionSelector = document.getElementById("existed-sessions");
    sessionSelector.replaceChildren();

    if (!sessionSelector) return;

    const noneOption = document.createElement("option");
    noneOption.value = "none";
    noneOption.textContent = "-None-";
    sessionSelector.append(noneOption);

    for (const session of sessions) {
        const option = document.createElement("option");
        option.value = session.id;
        option.textContent = session.title;
        sessionSelector.append(option);
    }
}

const fillCarSelector = (carCount) => {
    const sessionSelector = document.getElementById("existed-cars");
    sessionSelector.replaceChildren();

    if (!sessionSelector) return;

    const noneOption = document.createElement("option");
    noneOption.value = "none";
    noneOption.textContent = "-None-";
    sessionSelector.append(noneOption);

    for (let i = 1; i <= carCount; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        sessionSelector.append(option);
    }
}

const createTableHead = () => {
    const table = document.getElementById("upcoming-sessions");
    const headRow = `<thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Title</th>
                        <th>Drivers</th>
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
    sessions.sort((a, b) => new Date(a.date) - new Date(b.date));

    for (const session of sessions) {
        const row = document.createElement("tr");
        tableBody.append(row);
        for (let i = 0; i < 4; i++) {
            const col = document.createElement("td");
            switch (i) {
                case 0:
                    col.textContent = session.date.split("T")[0];
                    break;
                case 1:
                    col.textContent = session.date.split("T")[1];
                    break;
                case 2:
                    col.textContent = session.title;
                    break;
                default:
                    col.textContent = session.drivers.map(d => `${d.name} in the car ${d.car}`).join(", ");
            }
            row.append(col);
        }
    }
    console.log("Table is updated.")
}

socket.on("recieveRaceState", (raceState) => {
    console.log(raceState)
    fillSessionSelector(raceState.sessions);//first time fill the session creates or remove update this selector
    fillCarSelector(8);// add 8 cars
    updateTable(raceState.sessions);
    //check git
})

socket.on("createdSession", (response, sessions) => {
    console.log(response.message);

    if (response.success) {
        updateTable(sessions);
        fillSessionSelector(sessions);
    } else {
        alert(response.message);
    }
})
socket.on("removedSession", (response, sessions) => {

    if (response.success) {
        updateTable(sessions);
        fillSessionSelector(sessions);

    } else {
        alert(response.message);
    }
})

socket.on("addedDriver", (response, sessions) => {
    console.log(response.message);

    if (response.success) {
        updateTable(sessions);
    } else {
        alert(response.message);
    }
})
socket.on("editedDriver", (response, sessions) => {
    console.log(response.message);

    if (response.success) {
        updateTable(sessions);
    } else {
        alert(response.message);
    }

})
socket.on("removedDriver", (response, sessions) => {
    console.log(response.message);

    if (response.success) {
        updateTable(sessions);
    } else {
        alert(response.message);
    }
})

socket.on("connect", () => {
    console.log("Connected to Server - Front desk");
});