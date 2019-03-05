import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})
export class PresentationComponent implements OnInit, OnDestroy {

  private socket;
  private currentTimestamp: number;
  private endTimestamp: number;

  public mobileMenuOpened = false;
  public userDropdownOpened = false;
  public step: string;
  public formCollectParticipant: FormGroup = null;
  public formCollectUsername: FormGroup = null;
  public question: any = null;
  public chrono: any = null;
  public disableResponses = false;
  public top_5: any = [];
  public session: any = null;
  public username = '';
  public score = 0;

  constructor(private sessionService: SessionService,
              private fb: FormBuilder,
              private router: Router,) {
    this.step = 'LOADING';

    if (!this.sessionService.getSession()) {
      this.router.navigate(['login']);
    }

    this.formCollectParticipant = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]]
    });

    this.formCollectUsername = this.fb.group({
      username: ['', [Validators.required]]
    });

    if (this.sessionService.getCookieParticipantData()) {
      this.sessionService.collectExistingParticipantSession(this.sessionService.getCookieParticipantData().id).subscribe(
        (data) => {
          this.sessionService.setParticipant(data.results);
          this.step = 'WAITING_USER_INPUT_REQUIRED';
          this.connectionSessionWebsocket();
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.step = 'ASK_INFO_PARTICIPANT';
    }
  }

  static getTimestamp() {
    return ((new Date()).getTime() / 1000);
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
    if (this.chrono !== null) {
      clearTimeout(this.chrono);
      this.chrono = null;
    }
  }

  onSubmitCollectParticipant() {
    if (this.formCollectParticipant.valid) {
      this.sessionService.collectNewParticipantSession(this.formCollectParticipant.value.nom, this.formCollectParticipant.value.prenom).subscribe(
        (data) => {
          console.log(data);
          this.sessionService.setParticipant(data.results);
          this.sessionService.setCookieParticipantData(data.results);
          this.step = 'WAITING_USER_INPUT_REQUIRED';
          this.connectionSessionWebsocket();
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.formCollectParticipant.controls.prenom.markAsTouched();
      this.formCollectParticipant.controls.nom.markAsTouched();
    }
  }

  onSubmitCollectUsername() {
    if (this.formCollectUsername.valid) {
      this.step = 'WAITING_USER_INPUT_REQUIRED';
      this.socket.emit('SET_USERNAME', {
        id_participant: this.sessionService.getParticipant().id,
        username: this.formCollectUsername.value.username
      });
      this.username = this.formCollectUsername.value.username;
    } else {
      this.formCollectUsername.controls.username.markAsTouched();
    }
  }

  onAnswerToQuestion(reponse: any) {
    this.disableResponses = true;
    this.socket.emit('SEND_RESPONSE', {
      id_participant: this.sessionService.getParticipant().id,
      id_reponse: reponse.id
    })
  }

  connectionSessionWebsocket() {
    this.socket = io.connect('http://localhost:8080');

    this.socket.on('SESSION_ID_REQUESTED', () => {
      console.log('ID SESSION requested');
      this.socket.emit('SESSION_ID', this.sessionService.getSession().id);
    });

    this.socket.on('PARTICIPANT_ID_REQUESTED', () => {
      console.log('ID PARTIIPANT requested');
      this.socket.emit('PARTICIPANT_ID', this.sessionService.getParticipant().id);
    });

    this.socket.on('REQUEST_USERNAME', () => {
      this.step = 'ASK_USERNAME';
      this.socket.emit('REQUEST_SCORE', this.sessionService.getParticipant().id);
    });

    this.socket.on('USERNAME_PARTICIPANT', (username) => {
      this.username = username;
      this.socket.emit('REQUEST_SCORE', this.sessionService.getParticipant().id);
    });

    this.socket.on('START_MEDIA', (question) => {
      this.step = 'MEDIA';
      this.question = question;
      console.log(question);
    });

    this.socket.on('NOTICE_SKIP_MEDIA', () => {
      this.step = 'WAITING_USER_INPUT_REQUIRED';
    });

    this.socket.on('QUESTION_STARTED', (question) => {
      this.disableResponses = false;
      this.question = question;
      this.currentTimestamp = PresentationComponent.getTimestamp();
      this.endTimestamp = PresentationComponent.getTimestamp() + question.duree;
      this.chrono = setInterval(() => {
        const timestamp = PresentationComponent.getTimestamp();
        if (Math.trunc(this.endTimestamp - timestamp) > 0) {
          this.currentTimestamp = timestamp;
        } else {
          this.currentTimestamp = this.endTimestamp;
        }
      }, 250);
      this.step = 'QUESTION';
    });

    this.socket.on('QUESTION_SKIPPED', () => {
      this.disableResponses = false;
      clearTimeout(this.chrono);
      this.chrono = null;
      this.step = 'WAITING_USER_INPUT_REQUIRED';
      this.socket.emit('REQUEST_SCORE', this.sessionService.getParticipant().id);
    });

    this.socket.on('QUESTION_TIMEOUT', () => {
      this.disableResponses = false;
      clearTimeout(this.chrono);
      this.chrono = null;
      this.step = 'WAITING_USER_INPUT_REQUIRED';
      this.socket.emit('REQUEST_SCORE', this.sessionService.getParticipant().id);
    });

    this.socket.on('TOP_3', (top_5) => {
      this.session = this.sessionService.getSession();
      this.top_5 = top_5;
      this.socket.emit('REQUEST_SCORE', this.sessionService.getParticipant().id);
    });

    this.socket.on('QCM_ENDED', () => {
      if (this.session && this.session.config_affichage_classement === true) {
        this.step = 'FINAL_TOP_5';
      } else {
        this.router.navigate(['login']);
      }
    });

    this.socket.on('SCORE_PARTICIPANT', (score) => {
      if (score) {
        this.score = score;
      }
    });
  }
}
