import { Component, OnInit } from '@angular/core';
import { Session } from '../../app.models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProfesseurService } from '../professeur.service';
import { ModaleSuppressionComponent } from './modale-suppression/modale-suppression.component';
import { ModaleCreationComponent } from './modale-creation/modale-creation.component';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {

  public sessions: Session[] = [];

  private ajouterSessionModalInstance: NgbModalRef = null;
  private supprimerSessionModalInstance: NgbModalRef = null;

  constructor(private professeurService: ProfesseurService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.refreshSessions();
  }

  refreshSessions() {
    this.professeurService.getSessions().subscribe(
      (sessions: Session[]) => {
        this.sessions = sessions;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  creerSession() {
    this.ajouterSessionModalInstance = this.modalService.open(ModaleCreationComponent, {
      centered: true,
    });
    this.ajouterSessionModalInstance.result.then((result) => {
      // Session créée : rafraichir la liste des sessions du professeur
      this.sessions = [];
      this.refreshSessions();
    }, (reason) => {
      // Confirmation rejetée
    });
  }

  supprimerSession(id_session: number) {
    this.supprimerSessionModalInstance = this.modalService.open(ModaleSuppressionComponent, {
      centered: true,
    });

    this.supprimerSessionModalInstance.componentInstance.id_session = id_session;
    this.supprimerSessionModalInstance.result.then((result) => {
      // Confirmation acceptée : rafraichir la liste des sessions du professeur
      this.sessions = [];
      this.refreshSessions();
    }, (reason) => {
      // Confirmation rejetée
    });
  }
}
