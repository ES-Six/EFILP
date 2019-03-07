import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfesseurService } from '../../professeur.service';
import { Classe } from '../../../app.models';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-modale-modification',
  templateUrl: './modale-modification.component.html',
  styleUrls: ['./modale-modification.component.css']
})
export class ModaleModificationComponent implements OnInit, OnChanges {
  public formEditionClasse: FormGroup = null;
  public isLoading = false;

  @Input() classe: Classe;

  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private loaderService: LoaderService,
              private professeurService: ProfesseurService) {

    this.formEditionClasse = this.fb.group({
      nom: ['', [Validators.required]],
    });

  }

  ngOnInit() {
    if (this.classe) {
      this.formEditionClasse.patchValue({
        nom: this.classe.nom
      });
    }
  }

  ngOnChanges() {
    if (this.classe) {
      this.formEditionClasse.patchValue({
        nom: this.classe.nom
      });
    }
  }

  editerClasse() {
    this.isLoading = true;
    this.loaderService.setDisplayLoader(true);
    this.professeurService.updateClasse(this.classe.id, this.formEditionClasse.value).subscribe(
      (result) => {
        this.isLoading = false;
        this.loaderService.setDisplayLoader(false);
        this.toastr.success('Classe mise à jour');
        this.activeModal.close('classe_mise_a_jour');
      },
      (error) => {
        this.isLoading = false;
        this.loaderService.setDisplayLoader(false);
        this.toastr.error('Echec de mise à jour de la classe');
        console.error(error);
      }
    );
  }

  onSubmitEditerClasse() {
    if (this.formEditionClasse.valid) {
      this.editerClasse();
    } else {
      this.professeurService.markAllFormlementsAsTouched(this.formEditionClasse);
    }
  }
}
