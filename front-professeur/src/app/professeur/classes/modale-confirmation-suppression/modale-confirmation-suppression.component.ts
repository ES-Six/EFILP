import {Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfesseurService } from '../../professeur.service';

@Component({
  selector: 'app-modale-confirmation-suppression',
  templateUrl: './modale-confirmation-suppression.component.html',
  styleUrls: ['./modale-confirmation-suppression.component.css']
})
export class ModaleConfirmationSuppressionComponent implements OnInit {

  @Input() id_classe: number;

  public isLoading = false;

  constructor(public activeModal: NgbActiveModal,
              private professeurService: ProfesseurService) { }

  ngOnInit() {
  }

  supprimerClasse() {
    this.isLoading = true;
    this.professeurService.deleteClasse(this.id_classe).subscribe(
      (result) => {
        this.isLoading = false;
        this.activeModal.close('classe_supprimée');
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
