/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppAcctAlreadyInUsingComponent } from './app-acct-already-in-using.component';

describe('AppAcctAlreadyInUsingComponent', () => {
  let component: AppAcctAlreadyInUsingComponent;
  let fixture: ComponentFixture<AppAcctAlreadyInUsingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAcctAlreadyInUsingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAcctAlreadyInUsingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
