import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent} from './login/login-form/login-form.component';
/*
** Ce fichier contient les routes vers les composants racines tel que
* le logins, récupération de mot de passe, etc...
*/
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: LoginComponent,
    children: [
      { path: 'login', component: LoginFormComponent },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

