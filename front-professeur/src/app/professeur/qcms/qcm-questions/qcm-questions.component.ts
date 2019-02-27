import { Component, OnInit } from '@angular/core';
import { QCM, Question } from '../../../app.models';
import { ActivatedRoute } from '@angular/router';
import { ProfesseurService } from '../../professeur.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModaleCreationComponent } from './modales/modale-creation/modale-creation.component';

@Component({
  selector: 'app-qcm-questions',
  templateUrl: './qcm-questions.component.html',
  styleUrls: ['./qcm-questions.component.css']
})
export class QcmQuestionsComponent implements OnInit {

  private id_qcm: number = null;
  private ajouterQuestionModalInstance: NgbModalRef = null;
  private editerQuestionModalInstance: NgbModalRef = null;
  private supprimerQuestionModalInstance: NgbModalRef = null;

  public qcm: QCM = null;

  constructor(private route: ActivatedRoute,
              private modalService: NgbModal,
              private professeurService: ProfesseurService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id_qcm = params['id'];
      this.refreshQCMContent();
    });
  }

  refreshQCMContent() {
    this.professeurService.getQCMContent(this.id_qcm).subscribe(
      (qcm: QCM) => {
        this.qcm = qcm;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  creerQuestion() {
    if (this.id_qcm) {
      this.ajouterQuestionModalInstance = this.modalService.open(ModaleCreationComponent, {
        centered: true,
      });

      this.ajouterQuestionModalInstance.componentInstance.id_qcm = this.id_qcm;
      this.ajouterQuestionModalInstance.result.then((result) => {
        // Confirmation acceptée : rafraichir la liste des classes du professeur
        this.qcm = null;
        this.refreshQCMContent();
      }, (reason) => {
        // Confirmation rejetée
      });
    }
  }

  editerQuestion(question) {

  }

  supprimerQuestion(id_question: number) {

  }

  drop(event: CdkDragDrop<Question[]>) {
    moveItemInArray(this.qcm.questions, event.previousIndex, event.currentIndex);
    for (let i = 0; i < this.qcm.questions.length; i ++) {
      this.qcm.questions[i].position = i + 1;
    }
    const updates = this.qcm.questions.map((question) => {
      return {
        id: question.id,
        position: question.position
      };
    });
    this.professeurService.updatePositionQuestionQCM(this.id_qcm, updates).subscribe(
      () => {

      },
      (error) => {
        console.error(error);
      }
    );
  }
}
