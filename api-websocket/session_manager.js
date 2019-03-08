const axios = require('axios');
const env = require('./environment.js');

module.exports = class SessionManager {
    constructor(mysqlclient, io, session, onDestroy) {
        this.destroy = onDestroy;
        this.io = io;
        this.mysqlclient = mysqlclient;
        this.session = session;
        this.participants = [];
        this.professeur = null;
        this.qcm = null;
        this.idxQuestion = 0;
        this.activeQuestionChrono = null;
        this.responsesMetrics = [];
        this.generatedAnimalNames = ['Cosmic', 'Bionic', 'Xenial', 'Trusty', 'Yakkety', 'Utopic', 'Precise', 'Oneiric', 'Lucid', 'Hoary'];
        this.generatedAuxiliaryNames = ['Cuttlefish', 'Beaver', 'Xerus', 'Tahr', 'Yak', 'Unicorn', 'Pangolin', 'Ocelot', 'Lynx', 'Hedgehog'];
    }

    addParticipant(participant, socket) {
        socket.join(`session_${this.session.id}`);
        socket.emit('AUTHENTICATION_SUCCESS', null);
        socket.on('GET_USERNAME', this.getUsername());

        if (this.session && this.session.config_generation_pseudo === 1) {
            if (!participant.username) {
                participant.username = `${this.generatedAnimalNames[Math.floor(Math.random() * this.generatedAnimalNames.length)]} ${this.generatedAuxiliaryNames[Math.floor(Math.random() * this.generatedAuxiliaryNames.length)]}`;
                if (this.professeur && this.professeur.socket) {
                    this.professeur.socket.emit('NEW_PARTICIPANT', {
                        id: participant.id,
                        username: participant.username
                    });
                }
            }
        }

        this.participants.push({...participant, socket});

        if (participant.username) {
            socket.emit('USERNAME_PARTICIPANT', participant.username);
            this.sendScoreToParticipant()(participant.id);
        }

        if (this.professeur && !participant.username) {
            if (this.session && this.session.config_generation_pseudo === 1) {
                console.log('new person: username auto');
                this.professeur.socket.emit('NEW_PARTICIPANT', {
                    id: participant.id,
                    username: participant.username
                });
            } else {
                console.log('new person: username manual');
                socket.on('SET_USERNAME', this.setUsername());
                socket.emit('REQUEST_USERNAME', null);
            }
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

    respondToQuestion() {
        return (response_data) => {
            if (this.qcm.questions[this.idxQuestion] &&
                this.qcm.questions[this.idxQuestion].reponses) {

                for (let i = 0; i < this.qcm.questions[this.idxQuestion].reponses.length; i++) {
                    if (this.qcm.questions[this.idxQuestion].reponses[i].id === response_data.id_reponse) {
                        this.responsesMetrics.push({
                            id_participant: response_data.id_participant,
                            id_reponse: response_data.id_reponse,
                            est_valide: this.qcm.questions[this.idxQuestion].reponses[i].est_valide
                        });
                    }
                }

                this.mysqlclient.query('INSERT INTO statistique_reponse (reponse_id, participant_id, session_id) VALUES (?, ?, ?)', [response_data.id_reponse, response_data.id_participant, this.session.id], (error, results, fields) => {
                    if (error) {
                        if (!error.Error === 'ER_DUP_ENTRY') {
                            console.error(error);
                        } else {
                            console.warn("L'utilisateur a répondu plus d'une fois");
                        }
                    }
                });
            }
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

    envoiClassementTop5() {
        return () => {
            const scores = [];
            // Créer le tableau des scores
            for (let i = 0; i < this.participants.length; i++) {
                scores.push({
                    score: this.getScoreParticipant(this.participants[i].id),
                    username: this.participants[i].username,
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

            this.io.to(`session_${this.session.id}`).emit('TOP_3', scores.splice(0, 5));
        };
    }

    removeSensitiveInfos(original_question) {
        // Force Deep copy of object
        if (!original_question) {
            return original_question;
        }
        let question = JSON.parse(JSON.stringify(original_question));
        if (question && question.reponses) {
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
                this.envoiClassementTop5()();
                this.idxQuestion ++;
            }, this.qcm.questions[this.idxQuestion].duree * 1000 || 10000);
        } else {
            this.io.to(`session_${this.session.id}`).emit('QCM_ENDED', null);
            this.mysqlclient.query('UPDATE session SET est_terminee = 1 WHERE id = ?', [this.session.id], (error, results, fields) => {
                if (error) {
                    if (!error) {
                        console.log("Session terminée");
                    } else {
                        console.error("Echec de fermeture de la session");
                    }
                    this.destroy(this.session.id);
                }
            });
        }
    }

    skipQuestion() {
        return () => {
            if (this.activeQuestionChrono) {
                try {
                    clearTimeout(this.activeQuestionChrono);
                    this.activeQuestionChrono = null;
                    this.io.to(`session_${this.session.id}`).emit('QUESTION_SKIPPED', this.removeSensitiveInfos(this.qcm.questions[this.idxQuestion]));
                    this.envoiClassementTop5()();
                    this.idxQuestion++;
                } catch (exception) {
                    console.error(exception);
                }
            }
        };
    }

    startMedia() {
        return () => {
            if (this.qcm.questions[this.idxQuestion] && this.qcm.questions[this.idxQuestion].media) {
                this.io.to(`session_${this.session.id}`).emit('START_MEDIA', this.removeSensitiveInfos(this.qcm.questions[this.idxQuestion]));
            } else {
                this.startQuestion();
            }
        };
    }

    skipMedia() {
        return () => {
            this.io.to(`session_${this.session.id}`).emit('NOTICE_SKIP_MEDIA', this.removeSensitiveInfos(this.qcm.questions[this.idxQuestion]));
            this.startQuestion();
        };
    }

    setUsername() {
        return (datas) => {
            for (let i = 0; i < this.participants.length; i++) {
                if (datas && this.session &&
                    this.participants[i].id === datas.id_participant &&
                    this.session.config_generation_pseudo === 0 &&
                    !this.participants[i].username) {

                    this.participants[i].username = datas.username;
                    if (this.professeur) {
                        this.professeur.socket.emit('NEW_PARTICIPANT', {
                            id: this.participants[i].id,
                            username: this.participants[i].username
                        });
                    }
                    break;
                }
            }
        };
    }

    getUsername() {
        return (id_participant) => {
            for (let i = 0; i < this.participants.length; i++) {
                if (this.participants[i].id === id_participant && this.participants[i].socket) {
                    this.participants[i].socket.emit('USERNAME_PARTICIPANT', this.participants[i].username);
                }
            }
        };
    }

    sendScoreToParticipant() {
        return (id_participant) => {
            for (let i = 0; i < this.participants.length; i++) {
                if (this.participants[i].id === id_participant && this.participants[i].socket) {
                    this.participants[i].socket.emit('SCORE_PARTICIPANT', this.getScoreParticipant(id_participant));
                }
            }
        };
    }

    startSession() {
        axios.get(`${env.parsed.URL_API_RESTFULL}/qcms/${this.session.qcm_id}`, {
            headers: {
                Authorization: `Bearer ${this.professeur.token}`
            }
        })
        .then(response => {
            console.log('QCM loaded');
            this.professeur.socket.on('REQUEST_STATS', this.envoiClassementTop5());
            this.professeur.socket.on('NEXT_SLIDE', this.startMedia());
            this.professeur.socket.on('SKIP_MEDIA', this.skipMedia());
            this.professeur.socket.on('SKIP_QUESTION', this.skipQuestion());
            for (let i = 0; i < this.participants.length; i ++) {
                this.participants[i].socket.on('REQUEST_STATS', this.envoiClassementTop5());
                this.participants[i].socket.on('REQUEST_SCORE', this.sendScoreToParticipant());
                this.participants[i].socket.on('SEND_RESPONSE', this.respondToQuestion());
            }

            this.qcm = response.data.results;

            this.startMedia()();
        })
        .catch(error => {
            console.log(error);
            this.io.to(`session_${this.session.id}`).emit('INTERNAL_ERROR', 'Echec de chargement distant du QCM');
        });
    }
};
