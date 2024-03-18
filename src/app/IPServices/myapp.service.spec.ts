/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyappService } from './myapp.service';

describe('Service: Myapp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyappService]
    });
  });

  it('should ...', inject([MyappService], (service: MyappService) => {
    expect(service).toBeTruthy();
  }));
});
