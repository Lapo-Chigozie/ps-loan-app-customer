import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoanAppAccountModel } from '../ps.loan.Models/LoanAppAccountModel';
import { BvnRespondsDto } from '../ps.loan.Models/BvnRespondsDto';
import { AccountDetailsDto } from '../ps.loan.Models/AccountInfoDto';
import { BvnAuthDto } from '../ps.loan.Models/BvnAuthDto';
import { StaticData } from '../ps.loan.Models/StaticData';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';

@Component({
  selector: 'app-client-menu',
  templateUrl: './client-menu.component.html',
  styleUrls: ['./client-menu.component.css']
})
export class ClientMenuComponent implements OnInit {

  constructor(private loadingService: LoaderService,private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService) {

  }

  Username:string = "";
  ConfirmPassword:string = "";
  Password:string = "";
 
  message:string = "";
  BvnSend:any= false;
  BvnCodeTyped:any= false;
  BvnCode:string="";
  
  AcctId:string ="";
  bvn:string ="";
  code:string ="";
  crDate ="";
  expDate ="";
  gedDate:any ="";
  id:string ="";
  expired:boolean = false;
  TwoFactor:boolean = false;

  Code1:string = "";
  Code2:string = "";
  Code3:string = "";
  Code4:string = "";
  Code5:string = "";
  Code6:string = "";

  IsDisplayTimeCount:boolean = false;
  timeCount = "00:00";
  MaxtimeCount: any = 200;
  MintimeCount: any = 0;
  tim :any=0;
  IsStartTimer = false;
  TokenMessage:string="";
  ButtonCondition:any=false;
  BtnIsActive= false;

  CodeA1:any=false;
  CodeA2:any=false;
  CodeA3:any=false;
  CodeA4:any=false;
  CodeA5:any=false;
  CodeA6:any=false;

  ResponseData!: RespondMessageDto;
  accountLogin!: LoanAppAccountModel;
  BvnResponds !:BvnRespondsDto;
  acctDetails !:AccountDetailsDto;
  bvnAuth!: BvnAuthDto ;
  SessionResult!:string ;

 public ngOnInit():void 
  {
        this.SignOutApplication();
        StaticData.properties = true;
        this.FetchUserDetails(this.SessionResult);
        return;
  }
  
  public SignOutApplication():void
  {
       try{
              this. SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
             // console.log("Session Result " + this.SessionResult );

             let twofactor = LocalStorageService.getLoginSessionIdentity(StaticData.TwoLoginKeySession);

              if(this.SessionResult  === "" || this.SessionResult  === undefined || this.SessionResult  === null || this.SessionResult  === StaticData.LoginKeySession)
              {
                  this.onSignOut(null);
                  return;
              }

              if(twofactor!=StaticData.TwoLoginKeySession)
              {
                  this.onSignOut(null);
                  return;
              }

              return;
       }
       catch(error)
       {
          return;
       }
  }

  private onNaviagateBack(page:string):void
  {
      // this.router.navigate([page]);
      StaticData.SignOutClient(this.router, page);
      return;
  }

  public onSignOut(event:any):void
  {
        // LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);
        LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, StaticData.AccountEmailSession);
        LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
        LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
       this.onNaviagateBack('/signin');
      return;
  }

  // public onChangePassword(event:any):void
  // {
  //      // LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);
  //      LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
  //      LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
  //      this.onNaviagateBack('/forgetpwrd');
  //     return;
  // }

  public onChangePassword(event:any):void
  {   
      // LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, StaticData.AppOnLoan);
      // LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);
      // LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
      // LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
      this.onNaviagateBack('/apppassworddashboard');
      return;
  }

  public LoanApplications(event:any):void
  {
    // LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoanAnswer);
    //  LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
    // LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
    this.onNaviagateBack('/clientloanRequest');
    return;
  }

  public RequestLoan(event:any):void
  {
      LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, this.acctDetails.Email);
      LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoanAnswer);   
      //  LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
      //  LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
       this.onNaviagateBack('/apppinauthentication');
       return;
  }
   
  private async FetchUserDetails(AccountId:string):Promise<void>
  {
        this.Username = '';
        this.loadingService.setLoading(true);
        await this.LapoLoanService.FetchAccountDetailsConnector(AccountId).subscribe({
          next:(res:any)=>
          {
            this.loadingService.setLoading(false);
          
            this.ResponseData = res;
            
            if(this.ResponseData != null && this.ResponseData.isActive)
            {
              if(this.ResponseData.dataLoad==undefined || this.ResponseData.dataLoad == null)
              {
                 return;
              }

              StaticData.properties = true;
              this.acctDetails = new AccountDetailsDto();
              this.acctDetails.AccountId = this.ResponseData.dataLoad.accountId;
              this.acctDetails.AccountType = this.ResponseData.dataLoad.accountType;
              this.acctDetails.Address = this.ResponseData.dataLoad.address;
              
              this.acctDetails.Age = this.ResponseData.dataLoad.age;
              this.acctDetails.AltPhone = this.ResponseData.dataLoad.altPhone;
              this.acctDetails.CurrentAddress = this.ResponseData.dataLoad.currentAddress;
  
              this.acctDetails.Email = this.ResponseData.dataLoad.email;
              this.acctDetails.FirstName = this.ResponseData.dataLoad.firstName;
              this.acctDetails.Gender = this.ResponseData.dataLoad.gender;
  
              this.acctDetails.LastName = this.ResponseData.dataLoad.lastName;
              this.acctDetails.MiddleName = this.ResponseData.dataLoad.middleName;
              this.acctDetails.Phone = this.ResponseData.dataLoad.phone;
              return;
            }
            else
            {
              this.loadingService.setLoading(false);
              // Swal.fire({ title: 'Error!', text:  this.ResponseData.tryCatchMessage,  icon: 'error', confirmButtonText: 'Ok' });
              return;
            }
          },
          error:(err:any)=>
          {
            // this.alertify.error('Error saving Connection...')
            this.loadingService.setLoading(false);
            // Swal.fire({ title: 'Error!', text:  "An error occurred " + err.message, icon: 'error',  confirmButtonText: 'Ok'});
            return;
          }
        })
  }

  public currentChoice: string = "home";
  public GetActive(choice: string) : string
  {
      if(this.currentChoice == choice)
          return "active";
      else
          return "not";
  }

  public SetActive(choice: string): void
  {
        this.currentChoice = choice;
  }
}
