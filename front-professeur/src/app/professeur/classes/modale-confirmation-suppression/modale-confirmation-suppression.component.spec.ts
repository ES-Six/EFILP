import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleConfirmationSuppressionComponent } from './modale-confirmation-suppression.component';

describe('ModaleConfirmationSuppressionComponent', () => {
  let component: ModaleConfirmationSuppressionComponent;
  let fixture: ComponentFixture<ModaleConfirmationSuppressionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaleConfirmationSuppressionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaleConfirmationSuppressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
