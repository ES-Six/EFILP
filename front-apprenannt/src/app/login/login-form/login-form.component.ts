import { Component, HostBinding, OnInit } from '@angular/core';
import { ApiAuthResponse } from '../../app.models';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {SessionService} from '../../session.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  @HostBinding('class') hostClass = 'vertical-center';

  public formCodeConnectionParticipant: FormGroup = null;
  public isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sessionService: SessionService,
    private route: ActivatedRoute) {
    this.formCodeConnectionParticipant = this.fb.group({
      code: ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  connectionSession(code: string) {
    this.sessionService.fetchSession(code).subscribe(
      (data) => {
        this.sessionService.setSession(data.results);
        this.router.navigate(['presentation']);
      },
      (error) => {
        this.formCodeConnectionParticipant.controls.code.setErrors({badSession: true});
        console.log(error);
      }
    )
  }

  onSubmitConnectionSession() {
    if (this.formCodeConnectionParticipant.valid) {
      this.connectionSession(this.formCodeConnectionParticipant.value.code);
    } else {
      this.formCodeConnectionParticipant.controls.code.markAsTouched();
    }
  }
}
