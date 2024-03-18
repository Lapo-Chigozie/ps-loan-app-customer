/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SignInAcctComponent } from './sign-in-acct.component';

describe('SignInAcctComponent', () => {
  let component: SignInAcctComponent;
  let fixture: ComponentFixture<SignInAcctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInAcctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInAcctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
