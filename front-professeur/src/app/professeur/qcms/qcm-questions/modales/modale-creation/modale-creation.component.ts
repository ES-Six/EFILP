import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ProfesseurService} from '../../../../professeur.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-modale-creation',
  templateUrl: './modale-creation.component.html',
  styleUrls: ['./modale-creation.component.css']
})
export class ModaleCreationComponent implements OnInit {

  @Input() id_qcm: number;

  public formAjoutQuestion: FormGroup = null;
  public isLoading = false;

  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private professeurService: ProfesseurService) {

    this.formAjoutQuestion = this.fb.group({
      titre: ['', [Validators.required]],
      duree: [30, [Validators.required]],
      reponses: this.fb.array([], Validators.required),
      has_media: [false, [Validators.required]],
      media: this.fb.group({
        type: ['VIDEO', [Validators.required]],
        url: ['', [Validators.required]],
      })
    });

    this.formAjoutQuestion.controls.media.disable();
  }

  ngOnInit() {
  }

  ajoutReponse() {
    const fbArray = this.formAjoutQuestion.controls.reponses as FormArray;
    fbArray.push(this.fb.group({
      nom: ['', [Validators.required]],
      est_valide: [false, [Validators.required]],
    }));
  }

  suppressionReponse(idx: number) {
    const fbArray = this.formAjoutQuestion.controls.reponses as FormArray;
    fbArray.removeAt(idx);
  }

  getReponsesFormArray() {
    const fbArray = this.formAjoutQuestion.controls.reponses as FormArray;
    return fbArray;
  }

  onChangeAfficherMedia(afficher_media: boolean) {
    if (afficher_media) {
      this.formAjoutQuestion.controls.media.enable();
    } else {
      this.formAjoutQuestion.controls.media.disable();
    }
  }

  createReponses(id_question: number) {
    const observables = [];
    const responsesFormArray = this.getReponsesFormArray();
    for (let i = 0; i < responsesFormArray.controls.length; i ++) {
      observables.push(this.professeurService.createReponse(this.id_qcm, id_question, responsesFormArray.controls[i].value));
    }
    forkJoin(observables).subscribe(
      (result) => {
        this.isLoading = false;
        this.activeModal.close('question_reponses_creees');
      },
      (error) => {
        console.error(error);
      }
    );
  }

  createMedia(id_question: number) {
    if (this.formAjoutQuestion.value.has_media) {
      this.professeurService.upsertMedia(this.id_qcm, id_question, this.formAjoutQuestion.value.media).subscribe(
        (result) => {
          this.createReponses(id_question);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.createReponses(id_question);
    }
  }

  createQuestion() {
    this.isLoading = true;
    this.professeurService.createQuestion(this.id_qcm, this.formAjoutQuestion.value).subscribe(
      (result) => {
        this.createMedia(result.id_question);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmitQuestion() {
    if (this.formAjoutQuestion.valid) {
      this.createQuestion();
    } else {
      this.professeurService.markAllFormlementsAsTouched(this.formAjoutQuestion);
    }
  }

}
