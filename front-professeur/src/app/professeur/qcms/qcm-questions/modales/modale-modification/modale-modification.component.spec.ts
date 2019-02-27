import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleModificationComponent } from './modale-modification.component';

describe('ModaleModificationComponent', () => {
  let component: ModaleModificationComponent;
  let fixture: ComponentFixture<ModaleModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaleModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaleModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
