import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProfesseurService} from '../../professeur.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modale-creation',
  templateUrl: './modale-creation.component.html',
  styleUrls: ['./modale-creation.component.css']
})
export class ModaleCreationComponent implements OnInit {

  public formAjoutClasse: FormGroup = null;
  public isLoading = false;

  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private professeurService: ProfesseurService) {

    this.formAjoutClasse = this.fb.group({
      nom: ['', [Validators.required]],
    });


  }

  ngOnInit() {
  }

  creerClasse() {
    this.activeModal.close('classe_creee');
  }

  onSubmitAjouterClasse() {
    this.creerClasse();
  }

}
