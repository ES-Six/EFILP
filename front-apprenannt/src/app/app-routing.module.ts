import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent} from './login/login-form/login-form.component';
import { PresentationComponent } from './presentation/presentation.component';
import { LoginQrcodeComponent } from './login/login-qrcode/login-qrcode.component';

/*
 * Ce fichier contient les routes vers les composants racines tel que
 * le logins, la participation à une session
 */
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: LoginComponent,
    children: [
      { path: 'login', component: LoginFormComponent },
      { path: 'qrcode', component: LoginQrcodeComponent },
      { path: 'qrcode/:code_session', component: LoginQrcodeComponent },
      { path: 'presentation', component: PresentationComponent },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

