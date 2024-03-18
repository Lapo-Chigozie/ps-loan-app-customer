/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppNewLoanAuthComponent } from './app-new-loan-auth.component';

describe('AppNewLoanAuthComponent', () => {
  let component: AppNewLoanAuthComponent;
  let fixture: ComponentFixture<AppNewLoanAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppNewLoanAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppNewLoanAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
