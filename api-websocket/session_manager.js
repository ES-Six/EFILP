const axios = require('axios');
const env = require('./environment.js');

module.exports = class SessionManager {
    constructor(mysqlclient, session) {
        this.mysqlclient = mysqlclient;
        this.session = session;
        this.participants = [];
        this.professeur = null;
        this.QCMManager = null;
    }

    addParticipant(participant, socket) {
        this.participants.push({...participant, socket});
        if (this.professeur) {
            console.log('nouveau participant notif');
            this.professeur.socket.emit('NEW_PARTICIPANT', participant);
        }
    }

    delParticipant(participant) {
        // this.participants.splice(idx, -1);
    }

    getParticiants() {
        return this.participants;
    }

    setProfesseur(professeur, socket) {
        this.professeur = professeur;
        this.professeur.socket = socket;
    }

    getProfesseur() {
        return this.professeur;
    }

    getSession() {
        return this.session;
    }

    startSession() {
        this.QCMManager = null;
    }
};