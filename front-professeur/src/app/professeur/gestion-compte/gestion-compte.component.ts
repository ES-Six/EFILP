import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfesseurService } from '../professeur.service';
import { AuthService } from '../../login/auth.service';
import { User } from '../../app.models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ModaleSuppressionComponent } from './modale-suppression/modale-suppression.component';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-gestion-compte',
  templateUrl: './gestion-compte.component.html',
  styleUrls: ['./gestion-compte.component.css']
})
export class GestionCompteComponent implements OnInit {

  public formEditionInformationsPersonelles: FormGroup = null;
  public formChangementMotPasse: FormGroup = null;

  private supprimerProfesseurModalInstance: NgbModalRef = null;
  public isLoading = false;

  constructor(private fb: FormBuilder,
              private modalService: NgbModal,
              private router: Router,
              private toastr: ToastrService,
              private authService: AuthService,
              private loaderService: LoaderService,
              private professeurService: ProfesseurService) {

    this.formEditionInformationsPersonelles = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      username: ['', [Validators.required]]
    });

    this.formChangementMotPasse = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmationPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    const user: User = this.authService.getUserInfo();
    this.formEditionInformationsPersonelles.patchValue({
      username: user.username,
      nom: user.nom,
      prenom: user.prenom
    });
  }

  onSubmitInformationsPersonelles() {
    if (this.formEditionInformationsPersonelles.valid) {
      this.isLoading = true;
      this.loaderService.setDisplayLoader(true);
      const oldUsername = this.authService.getUserInfo().username;

      this.professeurService.updateProfesseur(this.authService.getUserInfo().id, this.formEditionInformationsPersonelles.value).subscribe(
        (result) => {
          this.loaderService.setDisplayLoader(false);
          this.toastr.success('Informations mises à jour');
          // Si le nom d'utilisateur a changé il faut se déconnecter pour
          // obtenir un nouveau token car le token courrant n'est plus valide
          this.isLoading = false;
          if (oldUsername !== this.formEditionInformationsPersonelles.value.username) {
            this.authService.logout();
            this.router.navigate(['/'], { replaceUrl: true });
          }
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
          this.loaderService.setDisplayLoader(false);
          if (error.status === 409) {
            this.formEditionInformationsPersonelles.controls.username.setErrors({usernameAlreadyExist: true});
          } else {
            this.toastr.error('Echec de la mises à jour des informations personelles');
          }
        }
      );
    } else {
      this.professeurService.markAllFormlementsAsTouched(this.formEditionInformationsPersonelles);
    }
  }

  validatePasswordConfirmation() {
    if (this.formChangementMotPasse.value.newPassword !== this.formChangementMotPasse.value.confirmationPassword) {
      this.formChangementMotPasse.controls.confirmationPassword.setErrors({passwordsNotMatching: true});
      this.professeurService.markAllFormlementsAsTouched(this.formChangementMotPasse);
      return false;
    }
    return true;
  }

  onSubmitPasswordChange() {
    if (this.formChangementMotPasse.valid) {
      if (!this.validatePasswordConfirmation()) {
        return;
      }
      this.isLoading = true;
      this.loaderService.setDisplayLoader(true);
      this.authService.changePassword(this.authService.getUserInfo().id, this.formChangementMotPasse.value).subscribe(
        (result) => {
          this.loaderService.setDisplayLoader(false);
          this.toastr.success('Le mot de passe a été mis à jour');
          this.formChangementMotPasse.reset();
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.loaderService.setDisplayLoader(false);
          console.error(error);
          if (error.status === 403) {
            this.formChangementMotPasse.controls.currentPassword.setErrors({invalidCurrentPassword: true});
          } else {
            this.toastr.error('Echec de la mises à jour du mot de passe');
          }
        }
      );
    } else {
      this.validatePasswordConfirmation();
      this.professeurService.markAllFormlementsAsTouched(this.formChangementMotPasse);
    }
  }

  supprimerProfesseur() {
    this.supprimerProfesseurModalInstance = this.modalService.open(ModaleSuppressionComponent, {
      centered: true,
    });
  }
}
