import { Component, OnInit } from '@angular/core';
import { ProfesseurService } from '../professeur.service';
import { Classe } from '../../app.models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModaleCreationComponent } from './modale-creation/modale-creation.component';
import { ModaleConfirmationSuppressionComponent } from './modale-confirmation-suppression/modale-confirmation-suppression.component';
import {ModaleModificationComponent} from './modale-modification/modale-modification.component';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {

  public classes: Classe[] = [];

  private ajouterClasseModalInstance: NgbModalRef = null;
  private editerClasseModalInstance: NgbModalRef = null;
  private supprimerClasseModalInstance: NgbModalRef = null;

  constructor(private professeurService: ProfesseurService,
              private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.refreshClasses();
  }

  refreshClasses() {
    this.professeurService.getClasses().subscribe(
      (classes: Classe[]) => {
        this.classes = classes;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  creerClasse() {
    this.ajouterClasseModalInstance = this.modalService.open(ModaleCreationComponent, {
      centered: true,
    });

    this.ajouterClasseModalInstance.result.then((result) => {
      // Confirmation acceptée : rafraichir la liste des classes du professeur
      this.classes = [];
      this.refreshClasses();
    }, (reason) => {
      // Confirmation rejetée
    });

  }

  editerClasse(classe: Classe) {
    this.editerClasseModalInstance = this.modalService.open(ModaleModificationComponent, {
      centered: true,
    });

    this.editerClasseModalInstance.componentInstance.classe = classe;
    this.editerClasseModalInstance.result.then((result) => {
      // Confirmation acceptée : rafraichir la liste des classes du professeur
      this.classes = [];
      this.refreshClasses();
    }, (reason) => {
      // Confirmation rejetée
    });

  }

  supprimerClasse(id_classe: number) {
    this.supprimerClasseModalInstance = this.modalService.open(ModaleConfirmationSuppressionComponent, {
      centered: true,
    });

    this.supprimerClasseModalInstance.componentInstance.id_classe = id_classe;
    this.supprimerClasseModalInstance.result.then((result) => {
      // Confirmation acceptée : rafraichir la liste des classes du professeur
      this.classes = [];
      this.refreshClasses();
    }, (reason) => {
      // Confirmation rejetée
    });

  }
}
