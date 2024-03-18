/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoanBvnAppComponent } from './loan-bvn-app.component';

describe('LoanBvnAppComponent', () => {
  let component: LoanBvnAppComponent;
  let fixture: ComponentFixture<LoanBvnAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanBvnAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanBvnAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
