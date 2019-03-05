import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { User } from '../app.models';
import { ProfesseurService } from './professeur.service';

@Component({
  selector: 'app-professeur',
  templateUrl: './professeur.component.html',
  styleUrls: ['./professeur.component.css']
})
export class ProfesseurComponent implements OnInit {

  public userDropdownOpened = false;
  public mobileMenuOpened = false;
  public user: User = null;

  constructor(private router: Router,
              private authService: AuthService,
              public professeurService: ProfesseurService) { }

  ngOnInit() {
    this.user = this.authService.getUserInfo();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/'], { replaceUrl: true });
  }

}
