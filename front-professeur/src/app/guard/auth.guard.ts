import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../login/auth.service';

import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  handleError(state: RouterStateSnapshot, type: string) {
    console.log('Navitation !', state.url, type);
    this.router.navigate(['/login'], { queryParams: { reason: type } });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.getCurrentUser().pipe(map((data: any ) => {
      if (data instanceof HttpErrorResponse) {
        if (data.error.code === 401) {
          this.handleError(state, 'NOT_AUTHENTICATED');
        } else {
          this.handleError(state, 'UNKNOWN_ERROR');
        }
        return false;
      }

      return true;
    }));
  }
}
