import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService 
{
  constructor() { }

  public static setLoginSessionIdentity(LoginKeySession: string, accountId: any):boolean {
     try{
      localStorage.setItem(LoginKeySession, accountId);
      return true;
     }catch(e){
      return false;
     }
  }

  public static getLoginSessionIdentity(LoginKeySession: string): any {
    try{
      return localStorage.getItem(LoginKeySession);
    }
    catch(err){
      return "";
    }
  }

 

  public setItem(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  public  getItem(key: string): any {
    try{
      return localStorage.getItem(key);
    }
    catch(err){
      return null;
    }
  }

  public setBool(key: string, value: boolean) {
    localStorage.setItem(key, String(value));
  }

  public getBool(key: string): boolean {
    return localStorage.getItem(key) === 'true';
  }

  public setObject(key: string, value: object) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public static setLoanAppObject(key: string, value: object) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public static  getLoanAppObject(key: any): any {

    let LoanAppData !: any;
    LoanAppData = localStorage.getItem(key);
    let Data2 =JSON.parse(LoanAppData);
    return  Data2 ;
   }
  // getObject(key: string): object {
  //   return JSON.parse(localStorage.getItem(key));
  // }
}
