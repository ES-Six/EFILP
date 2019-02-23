import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleCreationComponent } from './modale-creation.component';

describe('ModaleCreationComponent', () => {
  let component: ModaleCreationComponent;
  let fixture: ComponentFixture<ModaleCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaleCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaleCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
