import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private session: any;
  private participant: any;
  private code_dedoublonage: string;

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  setSession(session) {
    this.session = session;
  }

  getSession() {
    return this.session;
  }

  setCookieParticipantData(data_participation) {
    let expiration = (new Date());
    expiration.setTime(expiration.getTime() + (1000 * 365 * 24 * 60 * 60)); // + 1 an
    this.cookieService.set('data_participant', JSON.stringify(data_participation), expiration);
  }

  getCookieParticipantData() {
    if (this.cookieService.check('data_participant')) {
      return JSON.parse(this.cookieService.get('data_participant'));
    } else {
      return null;
    }
  }

  setParticipant(participant) {
    this.participant = participant;
  }

  getParticipant() {
    return this.participant
  }

  fetchSession(code_session: string) {
    return this.httpClient.get<any>(
      `${environment.api_base_url}/apprenant/sessions/${code_session}`,
      {
        observe: 'body',
        responseType: 'json'
      }
    );
  }

  collectNewParticipantSession(nom: string, prenom: string) {
    return this.httpClient.post<any>(
      `${environment.api_base_url}/apprenant/sessions/${this.session.id}/participant`,
      {
        nom,
        prenom
      },
      {
        observe: 'body',
        responseType: 'json'
      }
    );
  }

  collectExistingParticipantSession(code_dedoublonage: string) {
    return this.httpClient.post<any>(
      `${environment.api_base_url}/apprenant/sessions/${this.session.id}/participant`,
      {
        code_dedoublonage
      },
      {
        observe: 'body',
        responseType: 'json'
      }
    );
  }
}
