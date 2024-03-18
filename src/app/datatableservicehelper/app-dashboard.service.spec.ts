/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppDashboardService } from './app-dashboard.service';

describe('Service: AppDashboard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppDashboardService]
    });
  });

  it('should ...', inject([AppDashboardService], (service: AppDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
