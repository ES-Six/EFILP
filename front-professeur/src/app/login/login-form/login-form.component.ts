import { Component, HostBinding, OnInit } from '@angular/core';
import { ApiAuthResponse } from '../../app.models';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  @HostBinding('class') hostClass = 'vertical-center';

  public isLoading = false;
  public formError: { reason: string } | null = null;
  public formLogin: FormGroup = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute) {
    this.formLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  requestLogin() {
    this.isLoading = true;
    this.authService.sendAuthRequest(this.formLogin.value).subscribe(
      (results: ApiAuthResponse) => {
        this.isLoading = false;
        console.log('Authentication success, token obtained');
        this.formError = null;
        this.router.navigate(['/professeur/home']);
      },
      (response) => {
        this.isLoading = false;
        console.error(response);
        if (response.error.code === 401) {
          this.formError = {reason: 'BAD_CREDENTIALS'};
        } else {
          this.formError = {reason: 'UNKNOWN_ERROR'};
        }
      }
    );

  }

  onSubmitFormLogin() {
    if (this.formLogin.valid) {
      console.log('valid form');
      this.requestLogin();
    } else {
      console.log('invalid form');
    }
  }
}
