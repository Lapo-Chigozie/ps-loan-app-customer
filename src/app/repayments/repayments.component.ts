import { Component, OnInit } from '@angular/core';
import { AppBasedComponent } from '../app-based/app-based.component';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoginUserPermissionModel } from '../PagenationModel/LoginUserPermissionModel';
import { LoanAppAccountModel } from '../ps.loan.Models/LoanAppAccountModel';
import { BvnRespondsDto } from '../ps.loan.Models/BvnRespondsDto';
import { AccountDetailsDto } from '../ps.loan.Models/AccountInfoDto';
import { BvnAuthDto } from '../ps.loan.Models/BvnAuthDto';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { AppRouterService } from '../datatableservicehelper/app-router.service';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import { ApiHostComponent } from '../environment/Environment';
import Swal from 'sweetalert2';
import {  Inject, LOCALE_ID } from '@angular/core';
import { DecimalPipe, Location, formatNumber } from '@angular/common';
import { HubteamMemberDatatableService } from '../datatableservicehelper/hubteam-member-datatable.service';
import { AppConfig } from '../../assets/images/defaultSettings';

@Component({
  selector: 'app-repayments',
  templateUrl: './repayments.component.html',
  styleUrls: ['./repayments.component.css']
})



export class RepaymentsComponent  extends AppBasedComponent implements OnInit 
{
  private AppId:any;
  private SessionResult:any;

  Username:string = "";
  ConfirmPassword:string = "";
  Password:string = "";
 
  message:string = "";
  BvnSend:any= false;
  BvnCodeTyped:any= false;
  BvnCode:string="";
  
  tot:any | undefined;

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

   override ResponseData!: RespondMessageDto;
   override  LoginUserPermission!:LoginUserPermissionModel;
   override AcctId:string ="";

  accountLogin!: LoanAppAccountModel;
  BvnResponds !:BvnRespondsDto;
  acctDetails !:AccountDetailsDto;
  bvnAuth!: BvnAuthDto 
  public   DashboardLoanApps: any;
  public expressionLoading: boolean = true;

  public LoanApps:any = [];

  public urlhost : string = "";
 
  // constructor(public appDashboard: AppDashboardDtService, private loadingService: SpinnerService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,private LapoLoanService: AdminserviceService) { }
  constructor(@Inject(LOCALE_ID)  override locale: string,  override location: Location,   override appRouter: AppRouterService,   override  loadingService: LoaderService,  override  router: Router,  override  route: ActivatedRoute,  override  formBuilder: FormBuilder, override  LapoLoanService: LapoLoanApiService, public appDashboard: HubteamMemberDatatableService) 
  {
       super( locale, location, appRouter, loadingService,router, route, formBuilder, LapoLoanService);
  }

  public override ngOnInit(): void 
  {
        // this.router.navigate(['/repayments?header=' + headerId + "&IPPSNumber=" + IPPSNumber]);
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

        this.route.queryParams
        .subscribe(params => {

          let header = params['headerId'];
          let IPPSNumber = params['IPPSNumber'];
         
          if(header == undefined ||  header == null   || header == '')
          {
              this.onSignOut(null)
          }

          this.ngOnLoanInit();
          this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
          this.urlhost = ApiHostComponent.GetHostUrl(0); 
  
          this.appDashboard.IsAcceptId = true;
          this.appDashboard.AppId = header;
        
          // this.appDashboard.onLoad(this.AcctId, this.urlhost);

          }
        );

        
        this.urlhost += AppConfig.AcctSecurity + '/AllOngoingAndCompletedLoanAppList';
       
        this.appDashboard.MaxStatusRetriever = "All";
        this.appDashboard.OnDataTableFinished.subscribe((object:any) => 
        {
             this.OnDataTableFinished(object.sender, object.object);  
        });
  }

  public OnDataTableFinished(sender:any, object:any): void
  {
        // this.GetDashboardAllLoanApplys();   
        // this.GetAllLoanApplys1();
  }

  public override OnLoadedProfileFinished(sender:any, object:any): void
  {
      // this.appDashboard.AppId = 1;
      this.appDashboard.IsAcceptId = true;
      this.appDashboard.AppId = this.appDashboard.AppId;
      this.LoadSessionInit();
      // this.appDashboard.onLoad(this.AcctId, this.urlhost);
  }

  ngAfterContentInit(): void 
  {
      
  }

  override ngAfterViewInit(): void 
  {
      
  }

  public override OnLoadedPermissionFinishedEvent(sender:any, object:LoginUserPermissionModel): void
  {
          this.appDashboard.SearchData.PermissionPage = new LoginUserPermissionModel();
          this.appDashboard.SearchData.PermissionPage = object;
        
         // console.log("ng On Loan Init",  "01234567890");
          // this.appDashboard.onLoad(this.AcctId);
  }

  public async CancelLoanApp(headerId: any, ippisNumber: any):Promise<void>
  {
        Swal.fire({
          title: 'Warning?',
          text:  'Are you sure that you want to cancel the loan request.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#f97c00',
          cancelButtonColor: '#5b5b5b7f',
          confirmButtonText: 'Yes!',
          cancelButtonText: "No!"
        }).then(async (result) => 
        {
              if (result.isConfirmed) 
              {
                    let AcctId1 = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
                    this.loadingService.setLoading(true);
                
                    let AppData =   {  "AccountId" : AcctId1, "Comment": "Cancel by Admin", "LoadHeaderId" : headerId  }
                
                    this.LapoLoanService.CancelLoanAppConnector(AppData).subscribe({
                  next: (res) => {

                    this.loadingService.setLoading(false);
                    this.ResponseData = res;

                    this.appDashboard.IsAcceptId = true;
                    this.appDashboard.AppId = this.appDashboard.AppId;
                    this.AcctId = this.appDashboard.AppId;
                    this.appDashboard.onLoad(this.AcctId, this.urlhost);

                    if (this.ResponseData != null && this.ResponseData.isActive) {
                      Swal.fire({ title: 'Warning!', text: 'Loan request has been cancelled successfully.', icon: 'warning', confirmButtonText: 'Ok' });
                      return;
                    }

                    else {
                      Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' });
                      return;
                    }
                  },
                  error: (err): any => 
                  {
                      this.appDashboard.IsAcceptId = true;
                      this.appDashboard.AppId = this.appDashboard.AppId;
                      this.AcctId = this.appDashboard.AppId;
                      this.appDashboard.onLoad(this.AcctId, this.urlhost);

                      this.loadingService.setLoading(false);
                      Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

                      return;
                  }
                });
                    return;
              }
        });

  }

  public LoadSessionInit(): void
  {
          try
          {
                this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
                //  console.log("Session Result Bend" , this.SessionResult );
                this.AppId = this.SessionResult;
           
                if(this.SessionResult  == "" || this.SessionResult  == undefined || this.SessionResult  == null || this.SessionResult  == StaticData.LoginKeySession)
                {
                    this.onSignOut(null);
                    return;
                }

                      this.appDashboard.IsAcceptId = true;
                      this.appDashboard.AppId = this.appDashboard.AppId;
                      this.AcctId = this.appDashboard.AppId;
                      this.appDashboard.onLoad(this.AcctId, this.urlhost);
                return;
        }
        catch(e:any)
        {
                this.appDashboard.IsAcceptId = true;
                this.appDashboard.AppId = this.appDashboard.AppId;
                this.AcctId = this.appDashboard.AppId;
                this.appDashboard.onLoad(this.AcctId, this.urlhost);
                this.onSignOut(null);
            return;
        }
  }

  public onSignOut(event:any)
  {
      LocalStorageService.setLoginSessionIdentity(StaticData.DateLoginKeySession, StaticData.DateLoginKeySession);
      this.onNaviagateBack('/signin');
  }

  private async GetDashboardAllLoanApplys(): Promise<void> 
  {
        this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
        //  this.loadingService.setLoading(true);
        let AppData = {  "CustomerId" : this.AcctId, "PFNumber": ""};

        this.expressionLoading = true;
        this.LapoLoanService.GetAdminLoanDetailsConnector(AppData).subscribe({
        next: (res) => 
        {
          this.ResponseData = res;
          if (this.ResponseData != null && this.ResponseData.isActive) {
            this.expressionLoading = false;
            this.loadingService.setLoading(false);
            this.DashboardLoanApps = this.ResponseData.dataLoad;
            // console.log("Dashboard Loan Apps! ", this.DashboardLoanApps);
            return;
          }
          else if (this.ResponseData != null && this.ResponseData.isActive == false) 
          {
              this.expressionLoading = false;
              this.loadingService.setLoading(false);
              // console.log(this.ResponseData);
              // Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
              return;
          }

        },
        error: (err): any => 
        {
                this.expressionLoading = false;
                this.loadingService.setLoading(false);
                // Swal.fire({ title: 'Error!', text: "An error occurred: " + err.message, icon: 'error', confirmButtonText: 'Ok' })
                return;
        }
    })
  }
}