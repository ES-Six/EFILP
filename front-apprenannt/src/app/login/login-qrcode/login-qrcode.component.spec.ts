import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginQrcodeComponent } from './login-qrcode.component';

describe('LoginQrcodeComponent', () => {
  let component: LoginQrcodeComponent;
  let fixture: ComponentFixture<LoginQrcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginQrcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
