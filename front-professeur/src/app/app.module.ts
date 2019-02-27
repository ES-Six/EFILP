import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { AuthService } from './login/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ProfesseurComponent } from './professeur/professeur.component';
import { HomeComponent } from './professeur/home/home.component';
import { ClassesComponent } from './professeur/classes/classes.component';
import { ProfesseurService } from './professeur/professeur.service';
import { ModaleCreationComponent as ModaleCreationClasseComponent } from './professeur/classes/modale-creation/modale-creation.component';
import {
  ModaleConfirmationSuppressionComponent as ModaleConfirmationSuppressionClasseComponent
} from './professeur/classes/modale-confirmation-suppression/modale-confirmation-suppression.component';
import {
  ModaleModificationComponent as ModaleModificationClasseComponent
} from './professeur/classes/modale-modification/modale-modification.component';
import { QcmsComponent } from './professeur/qcms/qcms.component';
import { QcmQuestionsComponent } from './professeur/qcms/qcm-questions/qcm-questions.component';
import {
  ModaleCreationComponent as ModaleCreationQCMComponent
} from './professeur/qcms/modales/modale-creation/modale-creation.component';
import {
  ModaleModificationComponent as ModaleModificationQCMComponent
} from './professeur/qcms/modales/modale-modification/modale-modification.component';
import {
  ModaleSuppressionComponent as ModaleConfirmationSuppressionQCMComponent
} from './professeur/qcms/modales/modale-suppression/modale-suppression.component';
import {
  ModaleCreationComponent as ModaleCreationQuestionComponent
} from './professeur/qcms/qcm-questions/modales/modale-creation/modale-creation.component';
import {
  ModaleSuppressionComponent as ModaleSuppressionQuestionComponent
} from './professeur/qcms/qcm-questions/modales/modale-suppression/modale-suppression.component';
import {
  ModaleModificationComponent as ModaleModificationQuestionComponent
} from './professeur/qcms/qcm-questions/modales/modale-modification/modale-modification.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginFormComponent,
    ProfesseurComponent,
    HomeComponent,
    ClassesComponent,
    ModaleCreationClasseComponent,
    ModaleConfirmationSuppressionClasseComponent,
    ModaleModificationClasseComponent,
    QcmsComponent,
    QcmQuestionsComponent,
    ModaleCreationQCMComponent,
    ModaleModificationQCMComponent,
    ModaleConfirmationSuppressionQCMComponent,
    ModaleCreationQuestionComponent,
    ModaleSuppressionQuestionComponent,
    ModaleModificationQuestionComponent,
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [AuthService, CookieService, ProfesseurService],
  bootstrap: [AppComponent],
  entryComponents: [
    ModaleCreationClasseComponent,
    ModaleConfirmationSuppressionClasseComponent,
    ModaleModificationClasseComponent,
    ModaleCreationQCMComponent,
    ModaleModificationQCMComponent,
    ModaleConfirmationSuppressionQCMComponent,
    ModaleCreationQuestionComponent,
    ModaleSuppressionQuestionComponent,
    ModaleModificationQuestionComponent,
  ]
})
export class AppModule { }
