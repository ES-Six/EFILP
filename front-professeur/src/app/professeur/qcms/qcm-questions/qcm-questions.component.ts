import { Component, OnInit } from '@angular/core';
import { QCM } from '../../../app.models';
import { ActivatedRoute } from '@angular/router';
import { ProfesseurService } from '../../professeur.service';

@Component({
  selector: 'app-qcm-questions',
  templateUrl: './qcm-questions.component.html',
  styleUrls: ['./qcm-questions.component.css']
})
export class QcmQuestionsComponent implements OnInit {

  private id_qcm: number = null;
  public qcm :QCM = null;

  constructor(private route: ActivatedRoute,
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

  }

  editerQuestion(question) {

  }

  supprimerQuestion(id_question: number) {

  }
}
