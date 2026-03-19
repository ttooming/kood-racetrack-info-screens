const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Kasutaja ühendatud!');

    // Kuulame stardi nupuvajutust
    socket.on('startRace', () => {
        console.log('Sõit algas!');
        io.emit('raceModeChanged', 'SAFE'); // Saadame kõigile info: Roheline!
    });

    // Kuulame režiimi muutust (Hazard, Danger jne)
    socket.on('changeRaceMode', (newMode) => {
        console.log('Uus režiim:', newMode);
        io.emit('raceModeChanged', newMode); // Saadame selle kohe kõigile laiali
    });

    // Kuulame ringide lugemist
    socket.on('lapCompleted', (data) => {
        console.log('Ring läbitud:', data);
        io.emit('lapUpdate', data);
    });
});

http.listen(3000, () => {
    console.log('TEST-SERVER JOOKSEB PORDIL 3000');
});