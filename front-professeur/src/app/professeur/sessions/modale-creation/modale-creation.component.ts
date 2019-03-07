import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProfesseurService } from '../../professeur.service';
import { AuthService } from '../../../login/auth.service';
import { Classe, QCM } from '../../../app.models';
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-modale-creation',
  templateUrl: './modale-creation.component.html',
  styleUrls: ['./modale-creation.component.css']
})
export class ModaleCreationComponent implements OnInit {

  public formAjoutSession: FormGroup = null;
  public isLoading = false;
  public classes: Classe[] = [];
  public qcms: QCM[] = [];

  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private authService: AuthService,
              private loaderService: LoaderService,
              private professeurService: ProfesseurService) {

    this.formAjoutSession = this.fb.group({
      nom: ['', [Validators.required]],
      generer_pseudo: [false, [Validators.required]],
      afficher_classement: [false, [Validators.required]],
      id_classe: ['', [Validators.required]],
      id_qcm: ['', [Validators.required]]
    });

  }

  ngOnInit() {
    this.professeurService.getClasses().subscribe(
      (classes: Classe[]) => {
        this.classes = classes;
      },
      (error) => {
        console.error(error);
      }
    );

    this.professeurService.getQCMs().subscribe(
      (qcms: QCM[]) => {
        this.qcms = qcms;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  creerSession() {
    this.isLoading = true;
    this.loaderService.setDisplayLoader(true);
    this.professeurService.createSession(this.authService.getUserInfo().id, this.formAjoutSession.value).subscribe(
      (result) => {
        this.isLoading = false;
        this.loaderService.setDisplayLoader(false);
        this.toastr.success('Session créée');
        this.activeModal.close('session_creee');
      },
      (error) => {
        this.isLoading = false;
        this.loaderService.setDisplayLoader(false);
        this.toastr.error('Echec de création de la session');
        console.error(error);
      }
    );
  }

  onSubmitAjouterSession() {
    if (this.formAjoutSession.valid) {
      this.creerSession();
    } else {
      this.professeurService.markAllFormlementsAsTouched(this.formAjoutSession);
    }
  }

}
