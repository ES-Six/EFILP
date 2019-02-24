import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcmsComponent } from './qcms.component';

describe('QcmsComponent', () => {
  let component: QcmsComponent;
  let fixture: ComponentFixture<QcmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
