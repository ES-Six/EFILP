const axios = require('axios');
const env = require('./environment.js');

module.exports = class SessionManager {
    constructor(mysqlclient, io, session) {
        this.io = io;
        this.mysqlclient = mysqlclient;
        this.session = session;
        this.participants = [];
        this.professeur = null;
        this.qcm = null;
        this.idxQuestion = 0;
        this.activeQuestionChrono = null;
        this.responsesMetrics = [];
    }

    addParticipant(participant, socket) {
        socket.join(`session_${this.session.id}`);
        this.participants.push({...participant, socket});
        if (this.professeur) {
            console.log('nouveau participant notif');
            this.professeur.socket.emit('NEW_PARTICIPANT', participant);
        }
    }

    delParticipant(idx) {
        this.participants.splice(idx, 1);
    }

    getParticiants() {
        return this.participants;
    }

    setProfesseur(professeur, socket) {
        this.professeur = professeur;
        this.professeur.socket = socket;
        this.professeur.socket.join(`session_${this.session.id}`);
    }

    getProfesseur() {
        return this.professeur;
    }

    getSession() {
        return this.session;
    }

    respondToQuestion(response_data) {
        if (question.reponses) {
            for (let i = 0; i < question.reponses.length; i ++) {
                if (question.reponses[i].id === response_data.id_reponse) {
                    this.responsesMetrics.push({
                        id_participant: response_data.id_participant,
                        id_reponse: response_data.id_reponse,
                        est_valide: question.reponses[i].est_valide
                    });
                }
            }

            connection.query('INSERT INTO statistique_reponse (reponse_id, participant_id) VALUES (?, ?)', [response_data.id_reponse, response_data.id_participant], (error, results, fields) => {
                if (error) {
                    socket.emit('INTERNAL_ERROR', null);
                    console.error(error);
                }
            });
        }
    }

    getScoreParticipant(id_participant) {
        let score = 0;
        for (let i = 0; i < this.responsesMetrics.length; i ++) {
            if (id_participant === this.responsesMetrics[i].id_participant && this.responsesMetrics[i].est_valide) {
                score ++;
            }
        }
        return score;
    }

    envoiClassementTop3() {
        const scores = [];
        // Créer le tableau des scores
        for (let i = 0; i < this.participants.length; i ++) {
            scores.push({
                score: this.getScoreParticipant(this.participants[i].id),
                id_participant: this.participants[i].id
            });
        }

        // trier le tableau des scores
        scores.sort((participant_1, participant_2) => {
            if (participant_1.score < participant_2.score) {
                return -1;
            } else if (participant_1.score > participant_2.score) {
                return 1;
            } else {
                return 0;
            }
        });
        socket.emit('TOP_3', null);
    }

    removeSensitiveInfos(question) {
        if (question.reponses) {
            for (let i = 0; i < question.reponses.length; i ++) {
                delete question.reponses[i].est_valide;
                delete question.reponses[i].statistique_reponses;
            }
        }
        return question;
    }

    startQuestion() {
        if (this.qcm.questions[this.idxQuestion]) {
            this.io.to(`session_${this.session.id}`).emit('QUESTION_STARTED', this.removeSensitiveInfos(this.qcm.questions[this.idxQuestion]));
            this.activeQuestionChrono = setTimeout(() => {
                this.io.to(`session_${this.session.id}`).emit('QUESTION_TIMEOUT', this.removeSensitiveInfos(this.qcm.questions[this.idxQuestion]));
                this.idxQuestion ++;
            }, this.qcm.questions[this.idxQuestion].duree * 1000 || 10000);
        }
    }

    skipQuestion() {
        if (this.activeQuestionChrono) {
            try {
                clearTimeout(this.activeQuestionChrono);
                this.activeQuestionChrono = null;
                this.io.to(`session_${this.session.id}`).emit('QUESTION_SKIPPED', this.removeSensitiveInfos(this.qcm.questions[idx]));
                this.idxQuestion++;
            } catch (exception) {
                console.error(exception);
            }
        }
    }

    startMedia() {
        if (this.qcm.questions[this.idxQuestion] && this.qcm.questions[this.idxQuestion].media) {
            this.io.to(`session_${this.session.id}`).emit('START_MEDIA', this.removeSensitiveInfos(this.qcm.questions[idx]));
        } else {
            this.startQuestion();
        }
    }

    skipMedia() {
        if (this.qcm.questions[this.idxQuestion].media) {
            this.io.to(`session_${this.session.id}`).emit('SKIP_MEDIA', this.removeSensitiveInfos(this.qcm.questions[idx]));
        }
    }

    startSession() {
        axios.get(`${env.parsed.URL_API_RESTFULL}/qcms/${this.session.qcm_id}`, {
            headers: {
                Authorization: `Bearer ${this.professeur.token}`
            }
        })
        .then(response => {
            console.log('QCM', response.data.results);
            this.qcm = response.data.results;
            this.startMedia();
        })
        .catch(error => {
            console.log(error);
        });
    }
};