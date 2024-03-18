import { Component, OnInit } from '@angular/core';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoanAppAccountModel } from '../ps.loan.Models/LoanAppAccountModel';
import { BvnRespondsDto } from '../ps.loan.Models/BvnRespondsDto';
import { AccountDetailsDto } from '../ps.loan.Models/AccountInfoDto';
import { BvnAuthDto } from '../ps.loan.Models/BvnAuthDto';
import { AppDashboardService } from '../datatableservicehelper/app-dashboard.service';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import Swal from 'sweetalert2';
import { AppDashboarddtService } from '../datatableservicehelper/AppDashboarddt.service';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {

  private AppId:any;
  private SessionResult:any;

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

  DashboardLoanApps: any;

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
  bvnAuth!: BvnAuthDto 
  
  constructor(public appDashboard: AppDashboarddtService, private loadingService: LoaderService,private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService) 
  { 

  }

  ngAfterContentInit(): void 
  {
      //Called after ngOnInit when the component's or directive's content has been initialized.
      //Add 'implements AfterContentInit' to the class.
  }

  ngAfterViewInit(): void 
  {
      //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
      //Add 'implements AfterViewInit' to the class.
  }

  public ngOnInit() : void
  {
      this.LoadSessionInit();
  }

  public LoadSessionInit(): void
  {
        try
        {


          try
          {
                  let today = new Date();
                  
                  let DateSet = today.getMonth() + "/" + today.getDay() + "/" + today.getFullYear();
                  // let TimeSet = "12/31/" + today.getFullYear() + " 11:59:00 PM";
                  let loginDate = LocalStorageService.getLoginSessionIdentity(StaticData.DateLoginKeySession);
        
                  if(loginDate == null || loginDate == undefined || loginDate == StaticData.DateLoginKeySession)
                  {
                    this.onSignOut("/signin");
                    return;
                  }
                  else if(loginDate != DateSet)
                  {
                    this.onSignOut("/signin");
                    return;
                  }
          }
          catch(err:any)
          {
              this.onSignOut("/signin");
              return;
          }



          this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
          
          this.AppId = this.SessionResult;
          this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
        
          if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
          {
              this.onSignOut("/signin");
              return;
          }

          let twofactor = LocalStorageService.getLoginSessionIdentity(StaticData.TwoLoginKeySession);
          if(twofactor != StaticData.TwoLoginKeySession)
          {
            this.onNaviagateBack('/signin');
            return ;
          }

          if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
          {
              this.AppId = this.route.snapshot.queryParams["AccountId"];
          
              if(this.AppId == "" || this.AppId == undefined || this.AppId == null)
              {
                  this.onSignOut(null);
                  return;
              }
          }
        
          this.FetchUserDetails(this.AppId);
          return;
      }
      catch(e:any)
      {
          //console.log('Display: ' + e);
          this.onSignOut(null);
          return;
      }
  }

  public onSignOut(event:any):void
  {
    LocalStorageService.setLoginSessionIdentity(StaticData.DateLoginKeySession, StaticData.DateLoginKeySession);
     LocalStorageService.setLoginSessionIdentity(StaticData.DateLoginKeySession, StaticData.DateLoginKeySession);
     this.onNaviagateBack('/signin');
  }

  private onNaviagateBack(page:string):void
  {
    // this.router.navigate([page]);
    this.router.navigate([page],  { queryParams: { IsLoanApp: false }} );
    return;
  }
  
  private async FetchUserDetails(AccountId:string):Promise<void>
  {
        this.Username = '';
        this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
        
        this.AppId = this.SessionResult;

        this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
        if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
        {
            this.onSignOut("/signin");
            return;
        }

        AccountId = this.AcctId;

        this.loadingService.setLoading(true);
        await this.LapoLoanService.FetchAccountDetailsConnector(AccountId).subscribe({
          next:(res:any)=>
          {
            this.loadingService.setLoading(false);
            // console.log(res);
            this.ResponseData = res;
            this.appDashboard.onLoad(this.SessionResult);
            this.GetDashboardAllLoanApplys();
            // console.log( this.ResponseData);

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
                  Swal.fire({ title: 'Error!', text:  this.ResponseData.tryCatchMessage,  icon: 'error', confirmButtonText: 'Ok' });
                  return;
            }
          },
          error:(err:any)=>
          {
                // this.alertify.error('Error saving Connection...')
                this.appDashboard.onLoad(this.SessionResult);
                this.GetDashboardAllLoanApplys();
                this.loadingService.setLoading(false);
                Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                return;
          }
        })
  }

  public async CancelLoanApp(headerId :any ,  ippisNumber:any):Promise<void>
  {
        Swal.fire({
          title: 'Notices?',
          text: "Are you sure that you want to cancel this loan application?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#f97c00',
          cancelButtonColor: '#5b5b5b7f',
          confirmButtonText: 'Yes, Cancel!',
          cancelButtonText: "No, Don't Cancel!"
        }).then(async (result) => {
              if (result.isConfirmed) 
              {
              
                try
                {
                  this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
                  this.loadingService.setLoading(true);
              
                  let AppData =   {  "AccountId" : this.AcctId, "Comment": "Cancel by customer", "LoadHeaderId" : headerId  }
              
                  await this.LapoLoanService.CancelLoanAppConnector(AppData).subscribe({
                  next:(res)=>{
                  
                    this.loadingService.setLoading(false);
                    this.ResponseData = res;
                    this.appDashboard.onLoad(this.SessionResult);
                    if(this.ResponseData != null && this.ResponseData.isActive)
                    {
                        // console.log("Poof Loan Apps! " , this.LoanApps);
                        Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                        return;
                    }
                    else
                    {
                          // console.log(this.ResponseData);
                          Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                          return;
                    }
                  },
                  error:(err):any=>
                  {
                      // console.log("no continue " + err);
                      this.loadingService.setLoading(false);
                      Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                      return;
                  }
                })
                }
                catch(ex:any){
                  this.loadingService.setLoading(false);
                  Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                  return;
                }
              

              }
        });
  }

  private async GetDashboardAllLoanApplys(): Promise<void> 
  {
      try
      {
        this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
    
        if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
        {
            this.onSignOut("/signin");
            return;
        }
        
        this.loadingService.setLoading(true);
    
        let AppData = {  "CustomerId" : this.AcctId, "PFNumber": ""};
    
        await this.LapoLoanService.GetAdminLoanDetailsConnector(AppData).subscribe({
         next:(res)=>{
         
          this.loadingService.setLoading(false);
           this.ResponseData = res;
           if(this.ResponseData != null && this.ResponseData.isActive)
           {
               this.DashboardLoanApps = this.ResponseData.dataLoad;
               // console.log("Poof Loan Apps! " , this.DashboardLoanApps);
               return;
           }
           else
           { 
                this.loadingService.setLoading(false);
               // console.log(this.ResponseData);
               // Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                return;
           }
      
         },
         error:(err):any=>
         {
            // console.log("no continue " + err);
            this.loadingService.setLoading(false);
          //  Swal.fire({ title: 'Error!', text: "An error occurred: " + err.message, icon: 'error', confirmButtonText: 'Ok' })
            return;
         }
       })
      }
      catch(errorch:any)
      {
        this.loadingService.setLoading(false);
      }
  }

  public async ViewRepayments(headerId: any, IPPSNumber: any):Promise<void>
  {
      try
      {
          this.router.navigate(['/repayments'], { queryParams: { headerId : headerId, IPPSNumber : IPPSNumber}});
          return;
      }
      catch(ex:any)
      { 
          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
          return;
      }
  }

  public OnOngoingLoan():void  
  {
      this.appDashboard.MaxStatusRetriever  = "Ongoing";
      this.appDashboard.onLoad(this.SessionResult);
  }

  public OnApprovedLoan():void  
  {
      this.appDashboard.MaxStatusRetriever  = "Approved";
      this.appDashboard.onLoad(this.SessionResult);
  }

  public OnDeclinedLoan():void  
  {
      this.appDashboard.MaxStatusRetriever  = "Cancelled";
      this.appDashboard.onLoad(this.SessionResult);
  }

  public OnPendingLoan():void  
  {
      this.appDashboard.MaxStatusRetriever  = "Pending";
      this.appDashboard.onLoad(this.SessionResult);
  }

  public OnCompletedLoan():void  
  {
      this.appDashboard.MaxStatusRetriever  = "Completed";
      this.appDashboard.onLoad(this.SessionResult);
  }

}
