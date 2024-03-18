/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppipService } from './appip.service';

describe('Service: Appip', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppipService]
    });
  });

  it('should ...', inject([AppipService], (service: AppipService) => {
    expect(service).toBeTruthy();
  }));
});
