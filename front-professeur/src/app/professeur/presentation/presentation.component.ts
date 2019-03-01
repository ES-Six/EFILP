import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../login/auth.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private toastr: ToastrService,
              private router: Router) {
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

    this.socket.on('NEW_PARTICIPANT', (participant) => {
      console.log('Nouveau participant', `${participant.nom} ${participant.prenom}`);
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id_session = params['id'];
      this.id_session_pad = String(this.id_session).padStart(8, '0');
      this.initQRCode();
    });
  }

  initQRCode() {
    this.qrcode_data = `${environment.url_frontal_apprenant}/qrcode/${this.id_session}`;
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sessionStart() {
    // todo
  }
}
