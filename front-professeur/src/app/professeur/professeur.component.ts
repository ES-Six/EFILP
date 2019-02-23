import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-professeur',
  templateUrl: './professeur.component.html',
  styleUrls: ['./professeur.component.css']
})
export class ProfesseurComponent implements OnInit {

  public userDropdownOpened = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/'], { replaceUrl: true });

  }

}
