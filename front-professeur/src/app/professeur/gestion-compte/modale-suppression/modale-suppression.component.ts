import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfesseurService } from '../../professeur.service';
import { AuthService } from '../../../login/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-modale-suppression',
  templateUrl: './modale-suppression.component.html',
  styleUrls: ['./modale-suppression.component.css']
})
export class ModaleSuppressionComponent implements OnInit {

  public isLoading = false;

  constructor(public activeModal: NgbActiveModal,
              private router: Router,
              private authService: AuthService,
              private loaderService: LoaderService,
              private professeurService: ProfesseurService) { }

  ngOnInit() { }

  supprimerProfesseur() {
    this.isLoading = true;
    this.loaderService.setDisplayLoader(true);
    this.professeurService.deleteUser(this.authService.getUserInfo().id).subscribe(
      (result) => {
        this.authService.logout();
        this.isLoading = false;
        this.loaderService.setDisplayLoader(false);
        this.router.navigate(['/'], { replaceUrl: true });
        this.activeModal.close();
      },
      (error) => {
        this.isLoading = false;
        this.loaderService.setDisplayLoader(false);
        console.error(error);
      },
    );
  }
}
