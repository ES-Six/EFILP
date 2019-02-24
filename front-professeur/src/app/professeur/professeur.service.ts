import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiErrorResponse, ApiSuccessResponse, Classe } from '../app.models';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../app.models';
import { AuthService } from '../login/auth.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class ProfesseurService {

  constructor(private httpClient: HttpClient, private authService: AuthService) {

  }

  markAllFormlementsAsTouched(form: FormGroup) {
    for (const key in form.controls) {
      if (form.controls.hasOwnProperty(key)) {
        if (form.controls[key] instanceof FormArray) {
          form.controls[key].markAsTouched();
          (<FormArray>form.controls[key]).controls.forEach((form_array_element) => {
            if (form_array_element instanceof FormGroup) {
              this.markAllFormlementsAsTouched(<FormGroup>form_array_element);
            } else if (form_array_element instanceof FormControl) {
              form_array_element.markAsTouched();
            }
          });
        } else if (form.controls[key] instanceof FormGroup) {
          this.markAllFormlementsAsTouched(<FormGroup>form.controls[key]);
        } else {
          form.controls[key].markAsTouched();
        }
      }
    }
  }

  getClasses() {
    return this.httpClient.get<ApiSuccessResponse<Classe[]>>(
      `${environment.api_base_url}/professeurs/${this.authService.getUserInfo().id}/classes`,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<Classe[]>) => {
          return data.results;
        })
      );
  }

  createClasse(classe) {
    return this.httpClient.post<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/professeurs/${this.authService.getUserInfo().id}/classes`,
      classe,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<any>) => {
          return data.results;
        })
      );
  }

  updateClasse(id_classe, data_classe) {
    return this.httpClient.put<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/professeurs/${this.authService.getUserInfo().id}/classes/${id_classe}`,
      data_classe,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<any>) => {
          return data.results;
        })
      );
  }

  deleteClasse(id_classe) {
    return this.httpClient.delete<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/professeurs/${this.authService.getUserInfo().id}/classes/${id_classe}`,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<any>) => {
          return data.results;
        })
      );
  }

}

