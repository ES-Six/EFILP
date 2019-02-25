import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProfesseurService} from '../../../professeur.service';

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
              private professeurService: ProfesseurService) {

    this.formAjoutQCM = this.fb.group({
      nom: ['', [Validators.required]],
    });


  }

  ngOnInit() {
  }

  creerQCM() {
    this.isLoading = true;
    this.professeurService.createQCM(this.formAjoutQCM.value).subscribe(
      (result) => {
        this.isLoading = false;
        this.activeModal.close('qcm_creee');
      },
      (error) => {
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
