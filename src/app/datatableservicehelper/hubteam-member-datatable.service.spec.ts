/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HubteamMemberDatatableService } from './hubteam-member-datatable.service';

describe('Service: HubteamMemberDatatable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HubteamMemberDatatableService]
    });
  });

  it('should ...', inject([HubteamMemberDatatableService], (service: HubteamMemberDatatableService) => {
    expect(service).toBeTruthy();
  }));
});
