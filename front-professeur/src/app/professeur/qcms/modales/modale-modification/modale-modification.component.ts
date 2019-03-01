import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfesseurService } from '../../../professeur.service';
import { QCM } from '../../../../app.models';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-modale-modification',
  templateUrl: './modale-modification.component.html',
  styleUrls: ['./modale-modification.component.css']
})
export class ModaleModificationComponent implements OnInit {

  public formEditionQCM: FormGroup = null;
  public isLoading = false;

  @Input() qcm: QCM;

  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private professeurService: ProfesseurService) {

    this.formEditionQCM = this.fb.group({
      nom: ['', [Validators.required]],
    });

  }

  ngOnInit() {
    if (this.qcm) {
      this.formEditionQCM.patchValue({
        nom: this.qcm.nom
      });
    }
  }

  editerQCM() {
    this.isLoading = true;
    this.professeurService.updateQCM(this.qcm.id, this.formEditionQCM.value).subscribe(
      (result) => {
        this.isLoading = false;
        this.toastr.success('QCM mis à jour');
        this.activeModal.close('qcm_mise_a_jour');
      },
      (error) => {
        this.isLoading = false;
        this.toastr.error('Echec de la mise à jour du QCM');
        console.error(error);
      }
    );
  }

  onSubmitEditerQCM() {
    if (this.formEditionQCM.valid) {
      this.editerQCM();
    } else {
      this.professeurService.markAllFormlementsAsTouched(this.formEditionQCM);
    }
  }

}
