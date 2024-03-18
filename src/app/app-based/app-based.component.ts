import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import { Subscription } from 'rxjs';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoginUserPermissionModel } from '../PagenationModel/LoginUserPermissionModel';
import { AppRouterService } from '../datatableservicehelper/app-router.service';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { FormBuilder } from '@angular/forms';
import { DecimalPipe, Location, formatNumber } from '@angular/common';
import {   Inject,  LOCALE_ID, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-app-based',
  templateUrl: './app-based.component.html',
  styleUrls: ['./app-based.component.css']
})
export class AppBasedComponent implements OnInit {

  public ShortLink: string = "";
  public Loading: boolean = false; // Flag variable
  //appeditprofile
  public Message:any= ""; 
  protected ResponseData!: RespondMessageDto;
  protected AcctId:any = "";

  public ProfileDetails:any;

  public LoginUserPermission!:LoginUserPermissionModel
                   
  protected InfiniteSubscriptions: Array<Subscription>;

  protected readonly Subscriptions: Subscription[] = [];

  @Input() public someInput: any = 'something';
  @Output() public someOutput: EventEmitter<void> = new EventEmitter<void>();

  @Input() RoundRules = '1.0-2' ?? '1.2-2';
  public DecimalPipe!: DecimalPipe;

  @Output() public OnProfileLoadedFinished= new EventEmitter<{sender: any, object: any}>();
  
  @Output() public OnPermissionLoadedFinished= new EventEmitter<{sender: any, object: LoginUserPermissionModel}>();
  
  constructor( @Inject(LOCALE_ID) public locale: string, public location: Location,  public appRouter: AppRouterService,  public  loadingService: LoaderService, public  router: Router, public  route: ActivatedRoute, public  formBuilder: FormBuilder, public  LapoLoanService: LapoLoanApiService) 
  {
      this.InfiniteSubscriptions = [];
      //headerId: item.headerId , IppisNumber: item.ippisNumber 
  }

  private BasedTransformDecimal(num:any):any | number
  {
    return this.DecimalPipe.transform(num, this.RoundRules) ?? '0';
  }

  public BasedGetTransformDecimal(num:any):any 
  {
    return (this.BasedTransformDecimal(num));
  }

  public BasedGetFormatNumber(num:any):any 
  {
     try
     {
        var formarttedNumber = formatNumber(num, this.locale, this.RoundRules);
        return formarttedNumber;
     }
     catch(ex:any)
     {
          return false;
     }
  }

  public ngOnInit(): void 
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
                    this.BasedonSignOut("/signin");
                    return;
                  }
                  else if(loginDate != DateSet)
                  {
                    this.BasedonSignOut("/signin");
                    return;
                  }
          }
          catch(err:any)
          {
              this.BasedonSignOut("/signin");
              return;
          }


              this.OnProfileLoadedFinished.subscribe((object:any) => 
              {
                  this.OnLoadedProfileFinished(object.sender, object.object);  
              });

              this.OnPermissionLoadedFinished.subscribe((object:any) => 
              {
                  this.OnLoadedPermissionFinishedEvent(object.sender, object.object);  
              });

              this.BasedSignOutApplication();
              // this.appDashboard.onLoad(this.AcctId);
        }
        catch(e:any)
        {
            this.BasedonSignOut('/signin');
        }
  }

  public ngOnLoanInit(): void 
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
                        this.BasedonSignOut("/signin");
                        return;
                      }
                      else if(loginDate != DateSet)
                      {
                        this.BasedonSignOut("/signin");
                        return;
                      }
              }
              catch(err:any)
              {
                  this.BasedonSignOut("/signin");
                  return;
              }


              this.OnProfileLoadedFinished.subscribe((object:any) => 
              {
                  this.OnLoadedProfileFinished(object.sender, object.object);  
              });

              this.OnPermissionLoadedFinished.subscribe((object:any) => 
              {
                  this.OnLoadedPermissionFinishedEvent(object.sender, object.object);  
              });
             
              this.BasedSignOutApplication();
        }
        catch(e:any)
        {
            this.BasedonSignOut('/signin');
        }
  }

  public  OnLoadedProfileFinished(sender:any, object:any): void
  {
      
  }

  public OnLoadedPermissionFinishedEvent(sender:any, object:LoginUserPermissionModel): void
  {
      
  }

  public BasedonSignOut(event:any):void
  {
      LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
      this.BasedonNaviagateBack(event);
      return;
  }
  
  private BasedonNaviagateBack(page:string):void
  {
      this.router.navigate([page]);
  }
  
  public BasedSignOutApplication():void
  {
      try
      {
              this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
               //console.log("Session Result " + this.AcctId );

              if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
              {
                  this.BasedonSignOut("/signin");
                  return;
              }
             
              this.BasedGetUserProfileDetails();
              return;
      }
      catch(data:any)
      {
        this.BasedonSignOut("/signin");
        return;
      }
  }

  private async BasedGetUserProfileDetails() : Promise<void> 
  {
        try
        {

            this.loadingService.setLoading(true);
            this.LapoLoanService.GetUserProfileDetails(parseInt(this.AcctId)).subscribe({
            next: (res: any) => 
            {
              this.loadingService.setLoading(false);
              this.ResponseData = res;
              this.OnProfileLoadedFinished.emit({ sender: this, object: this.ResponseData });
            
              if (this.ResponseData != null && this.ResponseData.isActive) 
              {
                    this.ProfileDetails = this.ResponseData.dataLoad;
                    return;
              }
              else 
              {
                    Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' });
                    return;
              }

              return;
            },
            error: (err: any) => 
            {
                    this.loadingService.setLoading(false);
                    this.OnProfileLoadedFinished.emit({ sender: this, object: err });
                    Swal.fire({ title: 'Error!', text: "An error occurred: " + err.message, icon: 'error', confirmButtonText: 'Ok' });
                    return;
            }
          })
        }
        catch(error:any)
        {    
                     this.OnProfileLoadedFinished.emit({sender: this, object: error});
        }
  }

  private async BasedGetUserPermissions(): Promise<void> 
  {
        try
        {
           
           this.loadingService.setLoading(true);
           await this.LapoLoanService.GetUserPermissionDetails(parseInt(this.AcctId)).subscribe({
           next:(res:any) =>
           {
                  this.loadingService.setLoading(false);
                  this.ResponseData = res;
                  
                  if(this.ResponseData != null && this.ResponseData.isActive)
                  {
                   
                    this.LoginUserPermission = new LoginUserPermissionModel();
                    this.LoginUserPermission.GroupId = this.ResponseData.dataLoad.groupId;
                    this.LoginUserPermission.GroupName = this.ResponseData.dataLoad.groupName;
                    this.LoginUserPermission.IsASSISTANTHEADOFOPERATION = this.ResponseData.dataLoad.isASSISTANTHEADOFOPERATION;
                      
                    this.LoginUserPermission.IsCustomerLoanPermission = this.ResponseData.dataLoad.isCustomerLoanPermission;
                      
                    this.LoginUserPermission.IsDISBURSEMENTOFFICER = this.ResponseData.dataLoad.isDISBURSEMENTOFFICER;

                    this.LoginUserPermission.IsGROUPHEAD = this.ResponseData.dataLoad.isGROUPHEAD;

                    this.LoginUserPermission.IsGeneralPermissionsAccessRight = this.ResponseData.dataLoad.isGeneralPermissionsAccessRight;
                  
                    this.LoginUserPermission.IsHEADOFOPERATIONS = this.ResponseData.dataLoad.isHEADOFOPERATIONS;

                    this.LoginUserPermission.IsLoanSettingAccessRight = this.ResponseData.dataLoad.isLoanSettingAccessRight;

                    this.LoginUserPermission.IsNetPaysAccessRight = this.ResponseData.dataLoad.isNetPaysAccessRight;

                    this.LoginUserPermission.IsRECONCILIATIONANDACCOUNTOFFICER = this.ResponseData.dataLoad.isRECONCILIATIONANDACCOUNTOFFICER;

                    this.LoginUserPermission.IsRELATIONSHIPOFFICER = this.ResponseData.dataLoad.isRELATIONSHIPOFFICER;

                    this.LoginUserPermission.IsTEAMLEADS = this.ResponseData.dataLoad.isTEAMLEADS;

                    this.LoginUserPermission.IsTenureAccessRight = this.ResponseData.dataLoad.isTenureAccessRight;
                    this.LoginUserPermission.TeamId = this.ResponseData.dataLoad.teamId;

                    this.LoginUserPermission.IsDeveloperTeam = this.ResponseData.dataLoad.isDeveloperTeam;
                    this.LoginUserPermission.AccessRightToAnonymousLoanApplication = this.ResponseData.dataLoad.accessRightToAnonymousLoanApplication;
                  
                    this.LoginUserPermission.AccessRightToApprovedLoan = this.ResponseData.dataLoad.accessRightToApprovedLoan;
                    this.LoginUserPermission.AccessRightToCancelLoan = this.ResponseData.dataLoad.accessRightToCancelLoan;

                   
                    this.LoginUserPermission.AccessRightToExportDISBURSEMENTLoan = this.ResponseData.dataLoad.accessRightToExportDISBURSEMENTLoan;
                    this.LoginUserPermission.AccessRightToUploadBackDISBURSEMENTLoan= this.ResponseData.dataLoad.accessRightToUploadBackDISBURSEMENTLoan;
                   
                    this.LoginUserPermission.AccessRightToViewLoan= this.ResponseData.dataLoad.accessRightToViewLoan;
                    this.LoginUserPermission.AccessRightToUploadBackRepaymentLoan = this.ResponseData.dataLoad.accessRightToUploadBackRepaymentLoan;
                  
                    this.LoginUserPermission.AccessRightToViewUploadBackRepaymentLoan = this.ResponseData.dataLoad.accessRightToViewUploadBackRepaymentLoan;
                   
                    this.LoginUserPermission.AccessRightToViewDisbursementLoan = this.ResponseData.dataLoad.accessRightToViewDisbursementLoan;
                    
                    this.LoginUserPermission.AccessRightToPrintLoan = this.ResponseData.dataLoad.accessRightToPrintLoan;
                   
                    this.LoginUserPermission.AccessRightToProceedLoan = this.ResponseData.dataLoad.accessRightToProceedLoan;
                    
                    this.OnPermissionLoadedFinished.emit({ sender: this , object: this.LoginUserPermission });

                    /// alert("AccessRightToProceedLoan");
                    // public  AccessRightToProceedLoan :boolean  = false;
                    // console.log('Login User Permission: ', this.LoginUserPermission);
                    return;
                  }
                  else
                  {
                        Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                        return;
                  }
                  return;
           },
           error:(err:any)=>
           {
              this.OnPermissionLoadedFinished.emit({sender: this, object: err});
              this.loadingService.setLoading(false);
              Swal.fire({ title: 'Error!', text: "An error occurred: " + err.message, icon: 'error', confirmButtonText: 'Ok' })
              return;
           }
         })
        }
        catch(error:any)
        {
             this.OnPermissionLoadedFinished.emit({sender: this, object: error});
             this.loadingService.setLoading(false);
             Swal.fire({ title: 'Error!', text: "An error occurred: " + error.message, icon: 'error', confirmButtonText: 'Ok' })
             return;
        }
  }

  public BasedReloadPage() :void
  {
      setTimeout(()=>{
        window.location.reload();
      }, 100);
      return;
  }
  
  public openPageByUrl(routename: string): void 
  {
      this.router.navigateByUrl(`/${routename}`);
      return;
  }

  public ngOnDestroy() 
  {
    try
    {
        this.InfiniteSubscriptions.forEach((subscription) => 
        { subscription.unsubscribe(); });
        this.InfiniteSubscriptions.length = 0; // release memory
    
        this.Subscriptions.forEach(x => x.unsubscribe());
        this.Subscriptions.length = 0; // release memory
    }
    catch(ex:any)
    {

    }
  }

  public BasedRegisterSubscription(sub: Subscription) :any
  {
          try
          {
                this.InfiniteSubscriptions.push(sub);
                this.Subscriptions.push(sub);
          }
          catch(ex:any)
          {

          }
  }

  public BasedGetSessinId():any
  {
      try
      {
              this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
             
              if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
              {
                  this.BasedonSignOut("/signin");
                  return;
              }
              
              this.BasedSignOutApplication();
              return this.AcctId;
      }
      catch(data:any)
      {
        this.BasedonSignOut("/signin");
        return this.AcctId;
      }

      this.AcctId
  }

  public BasedshowUp(): void 
  {
      // this.contentPage2?.nativeElement.scrollTo( -0, -0 );
      // this.contentPage?.nativeElement.scrollIntoView();
      window.scroll(0,0);
   }

  public  ngAfterViewInit(): void 
  { 
      this.BasedshowUp();
  }

  public GetCurrentUrl(): string 
  { 
        return this.appRouter.GetCurrentUrl();
  } 
    
  public GetPreviousUrl(): string 
  { 
        return this.appRouter.GetPreviousUrl();
  } 

  public GoBackPreviousPage(): void 
  {
      if (this.location.back() == undefined)
      {
          this.router.navigate(['/']);
      }
      else
      {   
          this.appRouter.GoBack()
          this.location.back();
      }
  } 

  public GoBackPreviousPage1(): void 
  { 
     this.router.navigate([this.appRouter.previousRoutePath.value]);
  }
  
  public onFastSignOut(){
    this.onNaviagateBack1('/signin');
  }

  private  onNaviagateBack1(page:string):void 
  {
    this.router.navigate([page]);
  }

  public onNaviagateBack(page : string):void
  {

     LocalStorageService.setLoginSessionIdentity(StaticData.DateLoginKeySession, StaticData.DateLoginKeySession);
      this.router.navigate([page]);
      return;
  }

  public ReloadPage() :void
  {
    setTimeout(()=>{
      window.location.reload();
    }, 100);
    return;
  }
}
