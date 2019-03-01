import {Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-modale-config-youtube-embed',
  templateUrl: './modale-config-youtube-embed.component.html',
  styleUrls: ['./modale-config-youtube-embed.component.css']
})
export class ModaleConfigYoutubeEmbedComponent implements OnInit {

  @Input() id_video_youtube: string;
  @Input() url: string;

  public formConfigurationVideo: FormGroup = null;

  constructor(private fb: FormBuilder,
              public activeModal: NgbActiveModal) {

    this.formConfigurationVideo = this.fb.group({
      disable_start_after: [true, [Validators.required]],
      start_after: ['0', [Validators.required]],
      disable_end_after: [true, [Validators.required]],
      end_after: ['0', [Validators.required]],
      enable_auto_hide_controls: [false, [Validators.required]],
      enable_controls: [false, [Validators.required]],
      enable_auto_play: [false, [Validators.required]]
    });

    this.formConfigurationVideo.controls.start_after.disable();
    this.formConfigurationVideo.controls.end_after.disable();
  }

  ngOnInit() {
    // Récupérer la configuration actuelle dans l'URL
    const urlParams = new URLSearchParams(this.url);
    const autoplay = urlParams.get('autoplay');
    const autohide = urlParams.get('autohide');
    const start = urlParams.get('start');
    const end = urlParams.get('end');
    const controls = urlParams.get('controls');

    console.log('START', start);
    console.log('END', end);

    if (autoplay === '1') {
      this.formConfigurationVideo.controls.enable_auto_play.setValue(true);
    }

    if (autohide === '1') {
      this.formConfigurationVideo.controls.enable_auto_hide_controls.setValue(true);
    }

    if (controls === '1') {
      this.formConfigurationVideo.controls.enable_controls.setValue(true);
    }

    if (start && Number(start) && Number(start) > 0) {
      this.formConfigurationVideo.controls.disable_start_after.setValue(false);
      this.formConfigurationVideo.controls.start_after.setValue(start);
      this.formConfigurationVideo.controls.start_after.enable();
    }

    if (end && Number(end) && Number(end) > 0) {
      this.formConfigurationVideo.controls.disable_end_after.setValue(false);
      this.formConfigurationVideo.controls.end_after.setValue(end);
      this.formConfigurationVideo.controls.end_after.enable();
    }
  }

  onDisableStartAfterChanges(is_disabled: boolean) {
    if (is_disabled) {
      this.formConfigurationVideo.controls.start_after.disable();
    } else {
      this.formConfigurationVideo.controls.start_after.enable();
    }
  }

  onDisableEndAfterChanges(is_disabled: boolean) {
    if (is_disabled) {
      this.formConfigurationVideo.controls.end_after.disable();
    } else {
      this.formConfigurationVideo.controls.end_after.enable();
    }
  }

  configurer() {
    const auto_play = this.formConfigurationVideo.value.enable_auto_play ? '&autoplay=1' : '&autoplay=0';
    const auto_hide_controls = this.formConfigurationVideo.value.enable_auto_hide_controls ? '&autohide=1' : '&autohide=0';
    const start = !this.formConfigurationVideo.value.disable_start_after ? `&start=${this.formConfigurationVideo.value.start_after}` : '';
    const end = !this.formConfigurationVideo.value.disable_end_after ? `&end=${this.formConfigurationVideo.value.end_after}` : '';
    const controls = this.formConfigurationVideo.value.enable_controls ? '&controls=1' : '&controls=0';
    const params = `showinfo=0${auto_play}${auto_hide_controls}${start}${end}${controls}&rel=0`;
    const embed_url = `https://www.youtube.com/embed/${this.id_video_youtube}?${params}`;
    this.activeModal.close(embed_url);
  }
}
