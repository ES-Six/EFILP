const env = require('./environment.js');
const http = require('http');
const port = env.parsed.SERVER_PORT;
const mysql = require('mysql');
const axios = require('axios');
const SessionManager = require('./session_manager');
const connection = mysql.createConnection({
    host     : env.parsed.DB_HOST,
    port     : env.parsed.DB_PORT,
    user     : env.parsed.DB_USER,
    password : env.parsed.DB_PASS,
    database : env.parsed.DB_NAME
});
// Création d'un serveur HTTP basique
const server = http.createServer((req, res) => {

});
// Chargement de socket.io
const io = require('socket.io').listen(server);
const sessions = [];

connection.connect();
server.listen(port);
console.log(`Server listening on port ${port}`);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', (socket) => {
    if (!socket.off) {
        socket.off = socket.removeListener;
    }
    console.log('client connected');
    let session = null;

    const sessionIdCallback = (session_id) => {
        connection.query('SELECT * FROM session WHERE id = ?', [session_id], (error, results, fields) => {
            if (error) {
                socket.emit('INTERNAL_ERROR', null);
                console.error(error);
            }
            if (results.length === 0) {
                return socket.emit('BAD_SESSION_ERROR', null);
            } else {
                session = results[0];
                console.log('Id session validé: ', session.id);
                // Empecher le changement de la session
                socket.off('SESSION_ID', sessionIdCallback);
                socket.on('PARTICIPANT_ID', participantIdCallback);
                socket.on('TOKEN_PROFESSEUR', tokenProfesseurCallback);
                // Demander de s'authentifier...
                socket.emit('PARTICIPANT_ID_REQUESTED', null);
            }
        });
    };

    const participantIdCallback = (participant_id) => {
        socket.off('TOKEN_PROFESSEUR', tokenProfesseurCallback);
        connection.query('SELECT * FROM participant WHERE id = ?', [participant_id], (error, results, fields) => {
            if (error) {
                socket.emit('INTERNAL_ERROR', null);
                console.error(error);
            }
            if (results.length === 0) {
                return socket.emit('BAD_PARTICIPANT_ERROR', null);
            } else {
                const participant = results[0];
                console.log('Id participant validé:', participant.id);
                // Empêcher le changement du participant
                socket.off('PARTICIPANT_ID', participantIdCallback);

                // Ajout du participant dans la session
                sessions.forEach((session_manager) => {
                    if (session_manager.getSession().id === session.id) {
                        const participants = session_manager.getParticiants();
                        for (let i = 0; i < participants.length; i ++) {
                            if (participants[i].id === participant.id) {
                                session_manager.delParticipant(i);
                            }
                        }
                        console.log('ajout participant');
                        session_manager.addParticipant(participant, socket);
                    }
                })
            }
        });
    };

    const destroySession = (id_session) => {
        for (let i = 0; i < sessions.length; i ++) {
            if (sessions[i].getSession().id === id_session) {
                sessions.splice(i, 1);
            }
        }
    };

    const tokenProfesseurCallback = (token) => {
        socket.off('PARTICIPANT_ID', participantIdCallback);
        axios.get(`${env.parsed.URL_API_RESTFULL}/professeurs/current`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 200) {
                console.log('Token Pofesseur validé, id:', response.data.results.id);
                // Empêcher le changement du professseur
                socket.off('TOKEN_PROFESSEUR', tokenProfesseurCallback);

                // Empecher la creation de session en doublon
                let session_exist = false;
                for (let i = 0; i < sessions.length; i ++) {
                    if (sessions[i].getSession().id === session.id) {
                        session_exist = true;
                    }
                }
                if (!session_exist) {
                    sessions.push(new SessionManager(connection, io, session, destroySession));
                }

                // Assigner le professeur dans sa session
                sessions.forEach((session_manager) => {
                    if (session_manager.getSession().id === session.id) {
                        console.log('definir professeur');
                        response.data.results.token = token;
                        session_manager.setProfesseur(response.data.results, socket);
                        socket.emit('AUTHENTICATION_SUCCESS', null);
                        socket.on('SESSION_START', () => {
                            session_manager.startSession();
                        })
                    }
                })
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    socket.on('SESSION_ID', sessionIdCallback);
    socket.emit('SESSION_ID_REQUESTED', null);
});
