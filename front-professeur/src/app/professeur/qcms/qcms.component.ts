import { Component, OnInit } from '@angular/core';
import { QCM } from '../../app.models';
import { ProfesseurService } from '../professeur.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModaleCreationComponent } from './modales/modale-creation/modale-creation.component';
import { ModaleSuppressionComponent } from './modales/modale-suppression/modale-suppression.component';
import { ModaleModificationComponent } from './modales/modale-modification/modale-modification.component';

@Component({
  selector: 'app-qcms',
  templateUrl: './qcms.component.html',
  styleUrls: ['./qcms.component.css']
})
export class QcmsComponent implements OnInit {

  public qcms: QCM[] = [];

  private ajouterQCMModalInstance: NgbModalRef = null;
  private editerQCMModalInstance: NgbModalRef = null;
  private supprimerQCMModalInstance: NgbModalRef = null;

  constructor(private professeurService: ProfesseurService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.refreshQCMs();
  }

  refreshQCMs() {
    this.professeurService.getQCMs().subscribe(
      (qcms: QCM[]) => {
        this.qcms = qcms;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  creerQCM() {
    this.ajouterQCMModalInstance = this.modalService.open(ModaleCreationComponent, {
      centered: true,
    });

    this.ajouterQCMModalInstance.result.then((result) => {
      // Confirmation acceptée : rafraichir la liste des classes du professeur
      this.qcms = [];
      this.refreshQCMs();
    }, (reason) => {
      // Confirmation rejetée
    });

  }

  editerQCM(qcm: QCM) {
    this.editerQCMModalInstance = this.modalService.open(ModaleModificationComponent, {
      centered: true,
    });

    this.editerQCMModalInstance.componentInstance.qcm = qcm;
    this.editerQCMModalInstance.result.then((result) => {
      // Confirmation acceptée : rafraichir la liste des classes du professeur
      this.qcms = [];
      this.refreshQCMs();
    }, (reason) => {
      // Confirmation rejetée
    });
  }

  supprimerQCM(id_qcm: number) {
    this.supprimerQCMModalInstance = this.modalService.open(ModaleSuppressionComponent, {
      centered: true,
    });

    this.supprimerQCMModalInstance.componentInstance.id_qcm = id_qcm;
    this.supprimerQCMModalInstance.result.then((result) => {
      // Confirmation acceptée : rafraichir la liste des classes du professeur
      this.qcms = [];
      this.refreshQCMs();
    }, (reason) => {
      // Confirmation rejetée
    });
  }

}
