import { Component, HostBinding, OnInit } from '@angular/core';
import { ApiAuthResponse } from '../../app.models';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  @HostBinding('class') hostClass = 'vertical-center';

  public formLogin: FormGroup = null;
  public isLoading = false;
  public showIsSuccess: string = null;
  public formError: { reason: string } | null = null;

  private lastUrl: string = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
    this.formLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  goToUserPanel() {

  }

  onSubmitFormLogin() {
    this.formError = null;
    if (this.formLogin.valid) {

    } else {
      console.log('invalid form');
    }
  }
}
