const http = require('http');
const fs = require('fs');
let buzzers_enabled = true;

// Création d'un serveur HTTP basique
var server = http.createServer(function(req, res) {

});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('client connected');
});


server.listen(8080);

console.log('Server listening on port 8080');
