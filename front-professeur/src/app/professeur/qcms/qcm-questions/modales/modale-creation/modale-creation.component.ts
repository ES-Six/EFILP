import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProfesseurService } from '../../../../professeur.service';
import { forkJoin } from 'rxjs';
import { ModaleConfigYoutubeEmbedComponent } from '../modale-config-youtube-embed/modale-config-youtube-embed.component';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../../loader.service';
import { YoutubeValidator } from '../../../../../validators/youtube.validator';

@Component({
  selector: 'app-modale-creation',
  templateUrl: './modale-creation.component.html',
  styleUrls: ['./modale-creation.component.css']
})
export class ModaleCreationComponent implements OnInit {

  @Input() id_qcm: number;

  private configurerLienYoutubeModalInstance: NgbModalRef = null;

  public formAjoutQuestion: FormGroup = null;
  public isLoading = false;
  public idYoutubeVideo: string = null;

  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private modalService: NgbModal,
              private loaderService: LoaderService,
              private professeurService: ProfesseurService) {

    this.formAjoutQuestion = this.fb.group({
      titre: ['', [Validators.required]],
      duree: [30, [Validators.required]],
      reponses: this.fb.array([], Validators.required),
      has_media: [false, [Validators.required]],
      media: this.fb.group({
        type: ['VIDEO', [Validators.required]],
        url: ['', [Validators.required, Validators.maxLength(2083), YoutubeValidator]],
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
        this.loaderService.setDisplayLoader(false);
        this.toastr.success('Toutes les réponses ont étés ajoutés à la question');
        this.activeModal.close('question_reponses_creees');
      },
      (error) => {
        this.loaderService.setDisplayLoader(false);
        this.isLoading = false;
        this.toastr.warning('Echec de création de certaines réponses de la question');
        this.activeModal.dismiss('partial_failure');
        console.error(error);
      }
    );
  }

  createMedia(id_question: number) {
    if (this.formAjoutQuestion.value.has_media) {
      this.professeurService.upsertMedia(this.id_qcm, id_question, this.formAjoutQuestion.value.media).subscribe(
        (result) => {
          this.toastr.success('Média ajouté à la question');
          this.createReponses(id_question);
        },
        (error) => {
          this.loaderService.setDisplayLoader(false);
          this.isLoading = false;
          this.toastr.error(`Echec de l'ajout du média à la question`);
          console.error(error);
        }
      );
    } else {
      this.createReponses(id_question);
    }
  }

  createQuestion() {
    this.isLoading = true;
    this.loaderService.setDisplayLoader(true);
    this.professeurService.createQuestion(this.id_qcm, this.formAjoutQuestion.value).subscribe(
      (result) => {
        this.toastr.success('Question créée avec succès');
        this.createMedia(result.id_question);
      },
      (error) => {
        this.loaderService.setDisplayLoader(false);
        this.isLoading = false;
        this.toastr.error('Echec de création de la question');
        console.error(error);
      }
    );
  }

  checkYoutubeLink() {
    if (this.formAjoutQuestion.value.media &&
      this.formAjoutQuestion.value.media.type === 'VIDEO') {
      this.idYoutubeVideo = ProfesseurService.YouTubeGetID(this.formAjoutQuestion.value.media.url);
    } else {
      this.idYoutubeVideo = null;
    }
  }

  configureYoutubeLink() {
    this.configurerLienYoutubeModalInstance = this.modalService.open(ModaleConfigYoutubeEmbedComponent, {
      centered: true,
    });

    this.configurerLienYoutubeModalInstance.componentInstance.id_video_youtube = this.idYoutubeVideo;
    this.configurerLienYoutubeModalInstance.componentInstance.url = this.formAjoutQuestion.value.media.url;

    this.configurerLienYoutubeModalInstance.result.then((url) => {
      this.formAjoutQuestion.controls.media.patchValue({
        url
      });
    }, (reason) => {
      // Confirmation rejetée
    });
  }

  onSubmitQuestion() {
    if (this.formAjoutQuestion.valid) {
      this.createQuestion();
    } else {
      this.professeurService.markAllFormlementsAsTouched(this.formAjoutQuestion);
    }
  }

  getMediaFormGroup() {
    return this.formAjoutQuestion.controls.media as FormGroup;
  }
}
