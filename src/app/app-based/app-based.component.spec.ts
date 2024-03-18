/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppBasedComponent } from './app-based.component';

describe('AppBasedComponent', () => {
  let component: AppBasedComponent;
  let fixture: ComponentFixture<AppBasedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppBasedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppBasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
