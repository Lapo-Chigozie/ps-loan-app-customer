/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppFooterViewsComponent } from './app-footer-views.component';

describe('AppFooterViewsComponent', () => {
  let component: AppFooterViewsComponent;
  let fixture: ComponentFixture<AppFooterViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFooterViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFooterViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
