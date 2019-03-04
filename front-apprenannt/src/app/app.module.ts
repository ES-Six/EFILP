import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { PresentationComponent } from './presentation/presentation.component';
import { CookieService } from 'ngx-cookie-service';
import { LoginQrcodeComponent } from './login/login-qrcode/login-qrcode.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { TruncPipe } from './pipes/trunc.pipe';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginFormComponent,
    PresentationComponent,
    LoginQrcodeComponent,
    SafeUrlPipe,
    TruncPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
