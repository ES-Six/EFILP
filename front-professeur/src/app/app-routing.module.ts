import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { AuthGuard } from './guard/auth.guard';
import { ProfesseurComponent } from './professeur/professeur.component';
import { HomeComponent } from './professeur/home/home.component';
import { ClassesComponent } from './professeur/classes/classes.component';
import { QcmsComponent } from './professeur/qcms/qcms.component';
import { QcmQuestionsComponent } from './professeur/qcms/qcm-questions/qcm-questions.component';

/*
** Ce fichier contient les routes vers les composants racines tel que
* le login, les classes, etc...
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
  { path: 'professeur', redirectTo: 'professeur/home', pathMatch: 'full' },
  {
    path: 'professeur',
    component: ProfesseurComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'classes', component: ClassesComponent },
      { path: 'qcms', component: QcmsComponent },
      { path: 'qcms/:id', component: QcmQuestionsComponent },
    ]
  },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

