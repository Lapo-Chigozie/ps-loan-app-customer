/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppHeaderViewsComponent } from './app-header-views.component';

describe('AppHeaderViewsComponent', () => {
  let component: AppHeaderViewsComponent;
  let fixture: ComponentFixture<AppHeaderViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppHeaderViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHeaderViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
