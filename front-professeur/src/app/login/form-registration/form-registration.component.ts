import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {ProfesseurService} from '../../professeur/professeur.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-form-registration',
  templateUrl: './form-registration.component.html',
  styleUrls: ['./form-registration.component.css']
})
export class FormRegistrationComponent implements OnInit {

  public isLoading = false;
  public formRegistration: FormGroup = null;

  constructor(private fb: FormBuilder,
              private router: Router,
              private professeurService: ProfesseurService,
              private toastr: ToastrService,
              private authService: AuthService) {
    this.formRegistration = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
      prenom: ['', Validators.required],
      nom: ['', Validators.required]
    });
  }

  ngOnInit() { }

  createAccount() {
    this.isLoading = true;
    this.authService.createAccount(this.formRegistration.value).subscribe(
      (good) => {
        this.isLoading = false;
        this.toastr.success('Informations mises à jour');
        this.router.navigate(['../login']);
      },
      (error) => {
        this.isLoading = false;
        if (error.status === 409) {
          this.formRegistration.controls.username.setErrors({usernameAlreadyExist: true});
          this.toastr.warning(`Le nom d'utilisateur est déjà utilisé`, 'Echec de la création du compte');
        } else {
          console.error(error);
          this.toastr.error('Echec de la création du compte', 'Une erreur interne est survenue');
        }
      }
    );
  }

  validatePasswordConfirmation() {
    if (this.formRegistration.value.password !== this.formRegistration.value.confirm_password) {
      this.formRegistration.controls.confirm_password.setErrors({passwordsNotMatching: true});
      this.professeurService.markAllFormlementsAsTouched(this.formRegistration);
      return false;
    }
    return true;
  }

  onSubmitFormRegistration() {
    if (this.formRegistration.valid) {
      if (!this.validatePasswordConfirmation()) {
        return;
      }
      this.createAccount();
    } else {
      this.professeurService.markAllFormlementsAsTouched(this.formRegistration);
      this.validatePasswordConfirmation();
    }
  }

}
