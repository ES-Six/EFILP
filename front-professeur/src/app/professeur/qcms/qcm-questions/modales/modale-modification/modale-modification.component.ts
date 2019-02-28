import { Component, Input, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfesseurService } from '../../../../professeur.service';
import { Media, Question } from '../../../../../app.models';

@Component({
  selector: 'app-modale-modification',
  templateUrl: './modale-modification.component.html',
  styleUrls: ['./modale-modification.component.css']
})
export class ModaleModificationComponent implements OnInit {

  @Input() id_qcm: number;
  @Input() question: Question;

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

  onSubmitQuestion() {
    if (this.formModificationQuestion.valid) {
      // todo
      console.log('Envoyer tout ça');
    } else {
      this.professeurService.markAllFormlementsAsTouched(this.formModificationQuestion);
    }
  }

}
