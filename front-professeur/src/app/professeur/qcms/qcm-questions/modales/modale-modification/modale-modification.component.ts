import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfesseurService } from '../../../../professeur.service';
import { Question, Reponse} from '../../../../../app.models';
import {forkJoin, from, Observable} from 'rxjs';
import {concatMap} from 'rxjs/operators';

@Component({
  selector: 'app-modale-modification',
  templateUrl: './modale-modification.component.html',
  styleUrls: ['./modale-modification.component.css']
})
export class ModaleModificationComponent implements OnInit {

  @Input() id_qcm: number;
  @Input() question: Question;

  private reponsesToDelete: Reponse[] = [];

  public formModificationQuestion: FormGroup = null;
  public isLoading = false;

  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private professeurService: ProfesseurService) {

    this.formModificationQuestion = this.fb.group({
      id: [null],
      titre: ['', [Validators.required]],
      duree: [30, [Validators.required]],
      reponses: this.fb.array([], Validators.required),
      has_media: [false, [Validators.required]],
      media: this.fb.group({
        id: [null],
        type: ['VIDEO', [Validators.required]],
        url: ['', [Validators.required]],
      })
    });

    this.formModificationQuestion.controls.media.disable();
  }

  static runQueries(observables: Observable<any>[]): Observable<any> {
    return from(observables).pipe(
      concatMap(observable => observable)
    );
  }

  ngOnInit() {
    console.log(this.question);
    if (this.question) {
      console.log('QUESTION OK');
      this.formModificationQuestion.patchValue({
        titre: this.question.titre,
        duree: this.question.duree,
        has_media: !!this.question.media,
      });

      if (this.question.media) {
        console.log('MEDIA OK');

        this.formModificationQuestion.controls.media.patchValue({
          id: this.question.media.id,
          type: this.question.media.type,
          url: this.question.media.url
        });

        this.formModificationQuestion.controls.media.enable();
      }

      if (this.question.reponses instanceof Array) {
        const fbArray = this.formModificationQuestion.controls.reponses as FormArray;
        for (let i = 0; i < this.question.reponses.length; i ++) {
          fbArray.push(this.fb.group({
            id: [this.question.reponses[i].id],
            nom: [this.question.reponses[i].nom, [Validators.required]],
            est_valide: [this.question.reponses[i].est_valide, [Validators.required]],
          }));
        }
      }
    }
  }

  suppressionReponse(idx: number) {
    const fbArray = this.formModificationQuestion.controls.reponses as FormArray;
    const reponseFormGroup: FormGroup = fbArray.at(idx) as FormGroup;

    if (reponseFormGroup.getRawValue().id !== null) {
      this.reponsesToDelete.push(reponseFormGroup.getRawValue());
    }

    fbArray.removeAt(idx);
  }

  getReponsesFormArray() {
    const fbArray = this.formModificationQuestion.controls.reponses as FormArray;
    return fbArray;
  }

  onChangeAfficherMedia(afficher_media: boolean) {
    if (afficher_media) {
      this.formModificationQuestion.controls.media.enable();
    } else {
      this.formModificationQuestion.controls.media.disable();
    }
  }

  ajoutReponse() {
    const fbArray = this.formModificationQuestion.controls.reponses as FormArray;
    fbArray.push(this.fb.group({
      id: [null],
      nom: ['', [Validators.required]],
      est_valide: [false, [Validators.required]],
    }));
  }

  updateResponses() {
    const observables = [];
    const responsesFormArray = this.getReponsesFormArray();

    for (let i = 0; i < this.reponsesToDelete.length; i ++) {
      observables.push(this.professeurService.deleteReponse(this.id_qcm, this.question.id, this.reponsesToDelete[i].id));
    }

    for (let i = 0; i < responsesFormArray.controls.length; i ++) {
      if (responsesFormArray.controls[i].value.id !== null) {
        observables.push(this.professeurService.updateReponse(this.id_qcm,
          this.question.id,
          responsesFormArray.controls[i].value.id,
          responsesFormArray.controls[i].value));
      } else {
        observables.push(this.professeurService.createReponse(this.id_qcm, this.question.id, responsesFormArray.controls[i].value));
      }
    }

    forkJoin(ModaleModificationComponent.runQueries(observables)).subscribe(
      (results) => {
        console.log(results);
        this.isLoading = false;
        this.activeModal.close('question_mise_à_jour');
      },
      (errors) => {
        console.log(errors);
      }
    );

    /*
    forkJoin(observables).subscribe(
      (result) => {
        this.isLoading = false;
        this.activeModal.close('question_mise_à_jour');
      },
      (error) => {
        console.error(error);
      }
    );
    */
  }

  updateMedia() {
    if (this.formModificationQuestion.value.media) {
      this.professeurService.upsertMedia(this.id_qcm, this.question.id, this.formModificationQuestion.value.media).subscribe(
        (result) => {
          this.updateResponses();
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      if (this.question.media) {
        this.professeurService.deleteMedia(this.id_qcm, this.question.id).subscribe(
          (result) => {
            this.updateResponses();
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        this.updateResponses();
      }
    }
  }

  updateQuestion() {
    this.isLoading = true;
    this.professeurService.updateQuestion(this.id_qcm, this.question.id, this.formModificationQuestion.value).subscribe(
      (result) => {
        this.updateMedia();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmitQuestion() {
    if (this.formModificationQuestion.valid) {
      this.updateQuestion();
    } else {
      this.professeurService.markAllFormlementsAsTouched(this.formModificationQuestion);
    }
  }

}
