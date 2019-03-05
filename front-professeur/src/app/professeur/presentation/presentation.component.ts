import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../login/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Question, Session } from '../../app.models';
import { ProfesseurService } from '../professeur.service';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})
export class PresentationComponent implements OnInit, OnDestroy {

  private id_session: number;
  private socket;

  public frontal_apprenant_base_url = environment.url_frontal_apprenant;
  public qrcode_data: string;
  public id_session_pad: string;
  public question: Question;
  public session: Session;
  public step: string;
  public currentTimestamp: number;
  public endTimestamp: number;
  public chrono: any = null;
  public top_5: any = null;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    maintainAspectRatio: true,
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          beginAtZero: true,
          stepSize: 1
        }
      }]
    }
  };
  public barChartLabels: string[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public displayStats = false;
  public barChartData: any[] = [
    {data: [], label: 'Nombre de réponses'}
  ];

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private professeurService: ProfesseurService,
              private toastr: ToastrService,
              private router: Router) {

    this.step = 'LOADING';
  }

  static getTimestamp() {
    return ((new Date()).getTime() / 1000);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id_session = params['id'];
      this.id_session_pad = String(this.id_session).padStart(8, '0');

      this.professeurService.fetchSessionParticipant(this.id_session_pad).subscribe(
        (session: Session) => {
          this.session = session;
          this.websocketConnection();
          this.initQRCode();
        },
        (error) => {
          console.log(error);
          this.router.navigate(['/professeur/home']);
        }
      );
    });
  }

  websocketConnection() {
    this.socket = io.connect('http://localhost:8080');

    this.socket.on('SESSION_ID_REQUESTED', () => {
      console.log('ID SESSION requested');
      this.socket.emit('SESSION_ID', this.id_session);
    });

    this.socket.on('PARTICIPANT_ID_REQUESTED', () => {
      console.log('TOKEN_PROFESSEUR requested');
      this.socket.emit('TOKEN_PROFESSEUR', this.authService.getAuthToken());
    });

    this.socket.on('INTERNAL_ERROR', () => {
      this.toastr.error('Une erreur interne est survenue');
    });

    this.socket.on('BAD_SESSION_ERROR', () => {
      this.toastr.error('Echec de connection, ID de session incorrect');
      this.router.navigate(['/professeur/home']);
    });

    this.socket.on('AUTHENTICATION_SUCCESS', () => {
      this.step = 'WAITING_FOR_PARTICIPANTS';
    });

    this.socket.on('NEW_PARTICIPANT', (participant) => {
      this.toastr.info(`${participant.username} s'est connecté à la session`);
      console.log('Nouveau participant', `${participant.nom} ${participant.prenom}`);
    });
  }

  initQRCode() {
    this.qrcode_data = `${environment.url_frontal_apprenant}/qrcode/${this.id_session}`;
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
    if (this.chrono !== null) {
      clearTimeout(this.chrono);
      this.chrono = null;
    }
  }

  goToNextSlide() {
    this.displayStats = false;
    this.socket.emit('NEXT_SLIDE', null);
  }

  skipQuestion() {
    this.socket.emit('SKIP_QUESTION', null);
  }

  skipMedia() {
    this.socket.emit('SKIP_MEDIA', null);
  }

  sessionStart() {
    this.socket.emit('SESSION_START', this.id_session);

    this.socket.on('START_MEDIA', (question) => {
      this.step = 'MEDIA';
      this.question = question;
      console.log(question);
    });

    this.socket.on('NOTICE_SKIP_MEDIA', () => {
      this.step = 'LOADING';
    });

    this.socket.on('QUESTION_STARTED', (question) => {
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
      clearTimeout(this.chrono);
      this.chrono = null;
      this.step = 'LOADING';
    });

    this.socket.on('QUESTION_TIMEOUT', () => {
      clearTimeout(this.chrono);
      this.chrono = null;
      this.step = 'LOADING';
    });

    this.socket.on('QCM_ENDED', () => {
      this.router.navigate(['/professeur/home']);
    });

    this.socket.on('TOP_3', (top_5) => {
      console.log(top_5);
      this.top_5 = top_5;
      this.professeurService.fetchStatistiquesReponsesParQuestionParSession(this.question.id, this.id_session).subscribe(
        (results) => {
          if (results instanceof Array) {

            const nb_reponses = [];
            this.barChartLabels = [];

            for (let i = 0; i < results.length; i ++) {
              if (results[i].reponse) {
                this.barChartLabels.push(results[i].reponse.nom);
                nb_reponses.push(results[i].nbr_reponses);
              }
            }

            this.barChartData = [
              {data: nb_reponses, label: 'Nombre de réponses'}
            ];

            this.displayStats = true;
          }
        },
        (error) => {
          console.error(error);
        }
      );
      this.step = 'STATS';
    });
  }
}
