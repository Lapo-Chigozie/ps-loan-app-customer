/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LapoLoanApiService } from './lapo-loan-api.service';

describe('Service: LapoLoanApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LapoLoanApiService]
    });
  });

  it('should ...', inject([LapoLoanApiService], (service: LapoLoanApiService) => {
    expect(service).toBeTruthy();
  }));
});
