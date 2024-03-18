/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RefineryService } from './refinery.service';

describe('Service: Refinery', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefineryService]
    });
  });

  it('should ...', inject([RefineryService], (service: RefineryService) => {
    expect(service).toBeTruthy();
  }));
});
