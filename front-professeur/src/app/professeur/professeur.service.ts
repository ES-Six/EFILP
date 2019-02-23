import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {ApiErrorResponse, ApiSuccessResponse, Classe} from '../app.models';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../app.models';
import { AuthService } from '../login/auth.service';

@Injectable()
export class ProfesseurService {

  constructor(private httpClient: HttpClient, private authService: AuthService) {

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

}

