import {Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../../login/auth.service';
import { ProfesseurService } from '../../professeur.service';
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-modale-suppression',
  templateUrl: './modale-suppression.component.html',
  styleUrls: ['./modale-suppression.component.css']
})
export class ModaleSuppressionComponent implements OnInit {

  @Input() id_session: number;

  public isLoading = false;

  constructor(public activeModal: NgbActiveModal,
              private router: Router,
              private authService: AuthService,
              private loaderService: LoaderService,
              private professeurService: ProfesseurService) { }

  ngOnInit() { }

  supprimerSession() {
    this.isLoading = true;
    this.loaderService.setDisplayLoader(true);
    this.professeurService.deleteSession(this.id_session).subscribe(
      (result) => {
        this.isLoading = false;
        this.loaderService.setDisplayLoader(false);
        this.activeModal.close('session_supprimée');
      },
      (error) => {
        this.isLoading = false;
        this.loaderService.setDisplayLoader(false);
        console.error(error);
      },
    );
  }
}
