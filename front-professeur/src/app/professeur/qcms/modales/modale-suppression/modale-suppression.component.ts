import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfesseurService } from '../../../professeur.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../loader.service';

@Component({
  selector: 'app-modale-suppression',
  templateUrl: './modale-suppression.component.html',
  styleUrls: ['./modale-suppression.component.css']
})
export class ModaleSuppressionComponent implements OnInit {

  @Input() id_qcm: number;

  public isLoading = false;

  constructor(public activeModal: NgbActiveModal,
              private toastr: ToastrService,
              private loaderService: LoaderService,
              private professeurService: ProfesseurService) { }

  ngOnInit() { }

  supprimerQCM() {
    this.isLoading = true;
    this.loaderService.setDisplayLoader(true);
    this.professeurService.deleteQCM(this.id_qcm).subscribe(
      (result) => {
        this.isLoading = false;
        this.loaderService.setDisplayLoader(false);
        this.toastr.success('QCM supprimé');
        this.activeModal.close('qcm_supprimé');
      },
      (error) => {
        this.toastr.error('Echec de suppression du QCM');
        console.error(error);
      }
    );
  }
}
