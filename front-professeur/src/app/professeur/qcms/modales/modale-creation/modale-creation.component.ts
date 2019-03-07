import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfesseurService } from '../../../professeur.service';
import { ToastrService } from 'ngx-toastr';
import {LoaderService} from '../../../../loader.service';

@Component({
  selector: 'app-modale-creation',
  templateUrl: './modale-creation.component.html',
  styleUrls: ['./modale-creation.component.css']
})
export class ModaleCreationComponent implements OnInit {

  public formAjoutQCM: FormGroup = null;
  public isLoading = false;

  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private loaderService: LoaderService,
              private toastr: ToastrService,
              private professeurService: ProfesseurService) {

    this.formAjoutQCM = this.fb.group({
      nom: ['', [Validators.required]],
    });


  }

  ngOnInit() {
  }

  creerQCM() {
    this.isLoading = true;
    this.loaderService.setDisplayLoader(true);
    this.professeurService.createQCM(this.formAjoutQCM.value).subscribe(
      (result) => {
        this.isLoading = false;
        this.loaderService.setDisplayLoader(false);
        this.toastr.success('QCM créé');
        this.activeModal.close('qcm_creee');
      },
      (error) => {
        this.loaderService.setDisplayLoader(false);
        this.isLoading = false;
        this.toastr.error('Echec de création du QCM');
        console.error(error);
      }
    );
  }

  onSubmitAjouterQCM() {
    if (this.formAjoutQCM.valid) {
      this.creerQCM();
    } else {
      this.professeurService.markAllFormlementsAsTouched(this.formAjoutQCM);
    }
  }

}
