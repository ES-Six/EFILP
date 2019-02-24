import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcmQuestionsComponent } from './qcm-questions.component';

describe('QcmQuestionsComponent', () => {
  let component: QcmQuestionsComponent;
  let fixture: ComponentFixture<QcmQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcmQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcmQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
