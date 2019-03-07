import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../session.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-login-qrcode',
  templateUrl: './login-qrcode.component.html',
  styleUrls: ['./login-qrcode.component.css']
})
export class LoginQrcodeComponent implements OnInit, OnDestroy {

  private scanner = null;
  private cameraIdx = 0;

  public isLoading = false;
  public noCamera = false;
  public multipleCamera = false;

  cameraSwitched: Subject<any> = new Subject<any>();

  constructor(private route: ActivatedRoute,
              private sessionService: SessionService,
              private router: Router) {

    this.cameraSwitched.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value =>  {
      if (this.scanner !== null) {
        this.scanner.stop();
        this.scanner = null;
        this.cameraIdx ++;
        this.enableQrcodeScanner();
      }
    });

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const code_session = params['code_session'];
      if (code_session) {
        this.isLoading = true;
        this.sessionService.fetchSession(code_session).subscribe(
          (data) => {
            if (data.results.est_terminee === true) {
              this.router.navigate(['/']);
              return;
            }
            this.sessionService.setSession(data.results);
            this.router.navigate(['presentation']);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        this.enableQrcodeScanner();
      }
    });
  }

  enableQrcodeScanner() {
    this.scanner = new Instascan.Scanner({
      video: document.getElementById('camera-view'),
      scanPeriod: 1
    });

    this.scanner.addListener('scan', (qr_code_content: string) => {
      LoginQrcodeComponent.onQrCodeScanned(qr_code_content);
    });

    Instascan.Camera.getCameras().then((cameras) => {
      if (cameras.length > 0) {
        if (cameras.length > 1) {
          this.multipleCamera = true;
        }
        this.scanner.start(cameras[this.cameraIdx % cameras.length]);
      } else {
        this.noCamera = true;
        console.error('No cameras found.');
      }
    }).catch((e) => {
      this.noCamera = true;
      console.error('Unable to initialize instascan.js');
    });
  }

  onClickSwitchCamera() {
    this.cameraSwitched.next(this.cameraIdx);
  }

  static onQrCodeScanned(qr_code_content: string): void {
    if (qr_code_content.startsWith(`${environment.url_frontal_apprenant}/qrcode`, 0)) {
      console.log(qr_code_content);
      window.location.href = qr_code_content;
    }
  }

  ngOnDestroy() {
    if (this.scanner !== null) {
      this.scanner.stop();
    }
  }
}
