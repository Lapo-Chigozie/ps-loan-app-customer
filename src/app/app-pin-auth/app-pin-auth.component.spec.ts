/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppPinAuthComponent } from './app-pin-auth.component';

describe('AppPinAuthComponent', () => {
  let component: AppPinAuthComponent;
  let fixture: ComponentFixture<AppPinAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPinAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPinAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
