import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleSuppressionComponent } from './modale-suppression.component';

describe('ModaleSuppressionComponent', () => {
  let component: ModaleSuppressionComponent;
  let fixture: ComponentFixture<ModaleSuppressionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaleSuppressionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaleSuppressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
