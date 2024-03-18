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
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import { Compiler } from '@angular/core';

@Component({
  selector: 'app-client-top',
  templateUrl: './client-top.component.html',
  styleUrls: ['./client-top.component.css']
})
export class ClientTopComponent implements OnInit {

  public title = 'LapoLoan Clients';
  public href: string = "";
  public ShowRouteLet: boolean = false;
  public ShowAdminRouteLet: boolean = false;
  private AppId:any;
  // private _compiler: Compiler,
  constructor(private _compiler: Compiler,private loadingService: LoaderService,private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService) { }

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

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.showUp();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
  
  public CheckSession():boolean 
  {
          //LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
          let SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
          // console.log("Session Result " + SessionResult);
          let twofactor = LocalStorageService.getLoginSessionIdentity(StaticData.TwoLoginKeySession);
  
          try
          {
                    if(SessionResult  == ""  || SessionResult  == undefined || SessionResult  == null || SessionResult  == StaticData.LoginKeySession)
                    {
                        StaticData.properties = StaticData.properties;
                        
                        this.onNaviagateBack('/signin');
                        return true;
                    }
  
                    
                     twofactor = LocalStorageService.getLoginSessionIdentity(StaticData.TwoLoginKeySession);
  
                    if(twofactor != StaticData.TwoLoginKeySession)
                    {
                      this.onNaviagateBack('/signin');
                      return true;
                    }
  
                    return false;
          }
          catch(e)
          {
              //console.log('Display: ' + e);
              this.onNaviagateBack('/signin');
              return false;
          }
  }

  public ngOnInit() :void
  {
       this. CheckIfSessionExit();
       return;
  }

  private showUp(): void 
  {
   // this.contentPage2?.nativeElement.scrollTo( -0, -0 );
     // this.contentPage?.nativeElement.scrollIntoView();
     window.scroll(0,0);
  }

  private onNaviagateBack(page:string)
  {
      this.router.navigate([page]);
  }

  public clickSignInLink(event:any): void
  {
      LocalStorageService.setLoginSessionIdentity(StaticData.LoanAcctBankSession, StaticData.LoanAcctBankSession);
      LocalStorageService.setLoginSessionIdentity(StaticData.LoanReviewSession, StaticData.LoanReviewSession);
      LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);

      LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, StaticData.AccountEmailSession);
      LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);
      LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
      LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
     
      if(this._compiler != null)
      {
        this._compiler.clearCache();
      }
      
      StaticData.SignOutClient(this.router,'/signin');
     return;
  }

  public CheckIfSessionExit(): void 
  {
          this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
          let AdminTwoLoginKey = LocalStorageService.getLoginSessionIdentity(StaticData.TwoLoginKeySession);
          // console.log("Session Result " + this.SessionResult);

          try
          {
                    if(this.SessionResult  == "" || this.SessionResult  == undefined || this.SessionResult  == null || this.SessionResult  == StaticData.LoginKeySession)
                    {
                        this.onNaviagateBack("/signin");
                        return;
                    }

                    if(AdminTwoLoginKey != StaticData.TwoLoginKeySession){
                      this.onNaviagateBack("/signin");
                      return;
                    }

                    this.SignApplicationDetails();
                    return;
          }
          catch(e)
          {
              //console.log('Display: ' + e);
              this.onNaviagateBack("/signin");
               ///this.ReloadPage();
              return;
          }
  }

  private ReloadPage() :void
  {
    setTimeout(()=>{
      window.location.reload();return;
    }, 100);
    return;
  }

  public SignApplicationDetails():void
    {
        try{
                this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
                // console.log("Session Result " + this.SessionResult );

                if(this.SessionResult  === "" || this.SessionResult  === undefined || this.SessionResult  === null || this.SessionResult  === StaticData.LoginKeySession)
                {
                  this.showUp();
                  this.onNaviagateBack("/signin");
                    return;
                }
                
                this.FetchUserDetails(this.SessionResult);
                return;
        }
        catch(error){
          this.onNaviagateBack("/signin");
          return;
        }
    }

    private async FetchUserDetails(AccountId:string):Promise<void>
    {
          this.Username = '';
          this.loadingService.setLoading(true);
          await this.LapoLoanService.FetchAccountDetailsConnector(AccountId).subscribe({
            next:(res:any)=>
            {
              this.loadingService.setLoading(false);
              // console.log(res);
              this.ResponseData = res;
              // console.log( this.ResponseData);

              if(this.ResponseData != null && this.ResponseData.isActive)
              {
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
              //  Swal.fire({ title: 'Error!', text:  this.ResponseData.tryCatchMessage,  icon: 'error', confirmButtonText: 'Ok' });
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

}
