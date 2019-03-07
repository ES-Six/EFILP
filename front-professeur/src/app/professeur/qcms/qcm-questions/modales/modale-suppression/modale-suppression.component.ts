import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfesseurService } from '../../../../professeur.service';
import { ToastrService } from 'ngx-toastr';
import {LoaderService} from '../../../../../loader.service';

@Component({
  selector: 'app-modale-suppression',
  templateUrl: './modale-suppression.component.html',
  styleUrls: ['./modale-suppression.component.css']
})
export class ModaleSuppressionComponent implements OnInit {

  @Input() id_qcm: number;
  @Input() id_question: number;

  public isLoading = false;

  constructor(public activeModal: NgbActiveModal,
              private toastr: ToastrService,
              private loaderService: LoaderService,
              private professeurService: ProfesseurService) {

  }

  ngOnInit() { }

  supprimerQuestion() {
    this.isLoading = true;
    this.loaderService.setDisplayLoader(true);
    this.professeurService.deleteQuestion(this.id_qcm, this.id_question).subscribe(
      (result) => {
        this.isLoading = false;
        this.loaderService.setDisplayLoader(false);
        this.toastr.success('La question a été supprimée');
        this.activeModal.close('question_supprimée');
      },
      (error) => {
        this.loaderService.setDisplayLoader(false);
        this.toastr.error('Echec de suppression de la question');
        console.error(error);
      }
    );
  }
}
