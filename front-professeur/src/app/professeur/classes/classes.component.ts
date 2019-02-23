import { Component, OnInit } from '@angular/core';
import { ProfesseurService } from '../professeur.service';
import { Classe } from '../../app.models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModaleCreationComponent } from './modale-creation/modale-creation.component';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {

  public classes: Classe[] = [];

  private ajouterClasseModalInstance: NgbModalRef = null;

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
}
