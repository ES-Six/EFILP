import { Component, OnInit } from '@angular/core';
import { QCM } from '../../app.models';
import { ProfesseurService } from '../professeur.service';

@Component({
  selector: 'app-qcms',
  templateUrl: './qcms.component.html',
  styleUrls: ['./qcms.component.css']
})
export class QcmsComponent implements OnInit {

  public qcms: QCM[] = [];

  constructor(private professeurService: ProfesseurService) { }

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

  }

  editerQCM(qcm) {

  }

  editerContenuQCM(qcm) {

  }

  supprimerQCM(id_qcm: number) {

  }

}
