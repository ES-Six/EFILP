import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleConfigYoutubeEmbedComponent } from './modale-config-youtube-embed.component';

describe('ModaleConfigYoutubeEmbedComponent', () => {
  let component: ModaleConfigYoutubeEmbedComponent;
  let fixture: ComponentFixture<ModaleConfigYoutubeEmbedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaleConfigYoutubeEmbedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaleConfigYoutubeEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
