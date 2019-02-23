import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { AuthService } from './login/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ProfesseurComponent } from './professeur/professeur.component';
import { HomeComponent } from './professeur/home/home.component';
import { ClassesComponent } from './professeur/classes/classes.component';
import { ProfesseurService } from './professeur/professeur.service';
import { ModaleCreationComponent as ModaleCreationClasseComponent } from './professeur/classes/modale-creation/modale-creation.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginFormComponent,
    ProfesseurComponent,
    HomeComponent,
    ClassesComponent,
    ModaleCreationClasseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [AuthService, CookieService, ProfesseurService],
  bootstrap: [AppComponent],
  entryComponents: [ModaleCreationClasseComponent]
})
export class AppModule { }
