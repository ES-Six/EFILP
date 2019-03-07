import {Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfesseurService } from '../../professeur.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-modale-confirmation-suppression',
  templateUrl: './modale-confirmation-suppression.component.html',
  styleUrls: ['./modale-confirmation-suppression.component.css']
})
export class ModaleConfirmationSuppressionComponent implements OnInit {

  @Input() id_classe: number;

  public isLoading = false;

  constructor(public activeModal: NgbActiveModal,
              private toastr: ToastrService,
              private loaderService: LoaderService,
              private professeurService: ProfesseurService) { }

  ngOnInit() {
  }

  supprimerClasse() {
    this.isLoading = true;
    this.loaderService.setDisplayLoader(true);
    this.professeurService.deleteClasse(this.id_classe).subscribe(
      (result) => {
        this.isLoading = false;
        this.loaderService.setDisplayLoader(false);
        this.toastr.success('Classe supprimée');
        this.activeModal.close('classe_supprimée');
      },
      (error) => {
        this.isLoading = false;
        this.loaderService.setDisplayLoader(false);
        this.toastr.error('Echec de suppression de la classe');
        console.error(error);
      }
    );
  }
}
