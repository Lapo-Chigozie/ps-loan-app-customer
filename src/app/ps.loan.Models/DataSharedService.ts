import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataSharedService 
{

    BvnData : any;
    DetailData : any;
    PersonalDetails: any;
    LoanDetails: any;

  constructor() {

   }

   setLoanDetailsData(data: any){
    this.LoanDetails = data;
  }

  setBvnData(data: any){
    this.BvnData = data;
  }

  setDetailData(data: any){
    this.DetailData = data;
  }

  setPersonalDetails(data: any){
    this.PersonalDetails = data;
  }

  getPersonalDetails(): any {
    return this.PersonalDetails;
  }

  getBvnData(): any {
    return this.BvnData;
  }

  getDetailData(): any {
    return this.DetailData;
  }

  getLoanDetailsData(): any {
    return this.LoanDetails;
  }
}
