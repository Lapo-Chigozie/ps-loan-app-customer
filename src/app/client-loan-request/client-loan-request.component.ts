import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import { AppDashboarddtService } from '../datatableservicehelper/AppDashboarddt.service';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';

@Component({
  selector: 'app-client-loan-request',
  templateUrl: './client-loan-request.component.html',
  styleUrls: ['./client-loan-request.component.css']
})
export class ClientLoanRequestComponent implements OnInit {

  // Variable to store shortLink from api response
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  //appeditprofile
  message:any= ""; 
  ResponseData!: RespondMessageDto;
  AcctId:string = "";
  ProfileDetails:any;
  
  public FirstName!:string;
  public Middle:string | undefined;
  public LastName:string | undefined;
  public EmailAddress:string | undefined;
  public PhoneNumber:string | undefined;
  public AltPhoneNumber:string | undefined;
  public CurrentAddress:string | undefined;
  public Age:string | undefined;
  public Gender:string | undefined;

  constructor(public appDashboard: AppDashboarddtService, private loadingService: LoaderService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService) 
  {

  }

  ngOnInit(): void 
  {
      this.SignOutApplication();
  }

  public onSignOut(event:any)
  {
      LocalStorageService.setLoginSessionIdentity(StaticData.DateLoginKeySession, StaticData.DateLoginKeySession);
      LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
      LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
      this.onNaviagateBack(event);
      return;
  }
  
  private onNaviagateBack(page:string)
  {
      this.router.navigate([page]);
      return;
  }

  public onApplyLoan():void
  {
     // LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoanAnswer);
      // LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
     
      LocalStorageService.setLoginSessionIdentity(StaticData.LoanAcctBankSession, StaticData.LoanAcctBankSession);
      LocalStorageService.setLoginSessionIdentity(StaticData.LoanReviewSession, StaticData.LoanReviewSession);
      LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);

     // LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession,  this.EmailAddress);
     // LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
     
      LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoanAnswer);   
       LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
       LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
       this.onNaviagateBack('/apppinauthentication');
      this.onNaviagateBack('/apppinauthentication');
      return;
  }

  public SignOutApplication() : void
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

              this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
              console.log("Session Result " + this.AcctId );

              if(this.AcctId  === "" || this.AcctId  === undefined || this.AcctId  === null || this.AcctId  === StaticData.LoginKeySession)
              {
                  this.onSignOut("/signin");
                  return;
              }
              
              this.GetUserProfileDetails();
              return;
      }
      catch(error){
        this.onSignOut("/signin");
        return;
      }
  }

  public async GetUserProfileDetails(): Promise<void> 
  {
       try
       {
        this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
        this.loadingService.setLoading(true);
        await this.LapoLoanService.GetUserProfileDetails(parseInt(this.AcctId)).subscribe({
         next:(res)=>{
         
          this.appDashboard.onLoad(this.AcctId);
           this.loadingService.setLoading(false);
            // console.log("poof! " + res);
           this.ResponseData = res;
           if(this.ResponseData != null && this.ResponseData.isActive)
           {
               this.ProfileDetails = this.ResponseData.dataLoad;
               this.Gender = this.ProfileDetails.userProfileDetails.gender;
               this.FirstName = this.ProfileDetails.userProfileDetails.firstName;
               this.Middle = this.ProfileDetails.userProfileDetails.middleName;
                this.LastName = this.ProfileDetails.userProfileDetails.lastName;
                 this.EmailAddress = this.ProfileDetails.userProfileDetails.emailAddress; 
                  this.PhoneNumber = this.ProfileDetails.userProfileDetails.phoneNumber; 
                   this.AltPhoneNumber = this.ProfileDetails.userProfileDetails.altPhoneNumber;
                  this.CurrentAddress = this.ProfileDetails.userProfileDetails.currentAddress; 
                   this.Age = this.ProfileDetails.userProfileDetails.age; 
                   // this.Gender == this.ProfileDetails.userProfileDetails.gender;
             
               return;
           }
           else
           {
                //console.log(this.SignInResponseData.tryCatchMessage);
                Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                return;
           }
      
         },
         error:(err:any)=>
         {
           // console.log("no continue " + err);
           this.appDashboard.onLoad(this.AcctId);
           this.loadingService.setLoading(false);
           Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                return;
         }
       })
       }
       catch(exs:any)
       {

       }
  }

  // private async GetAllLoanApplys(): Promise<void> 
  // {
  //   //   GetLoanAppDetails
  
  //   this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
  //   this.loadingService.setLoading(true);
  //   await this.LapoLoanService.GetAllLoanApp(parseInt(this.AcctId)).subscribe({
  //    next:(res)=>{
     
  //      this.loadingService.setLoading(false);
  //      this.ResponseData = res;
  //      if(this.ResponseData != null && this.ResponseData.isActive)
  //      {
  //          this.LoanApps = this.ResponseData.dataLoad;
  //          // console.log("Poof Loan Apps! " , this.LoanApps);
  //          return;
  //      }
  //      else
  //      {
  //          // console.log(this.ResponseData);
  //           Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
  //           return;
  //      }
  
  //    },
  //    error:(err):any=>
  //    {
  //       // console.log("no continue " + err);
  //       this.loadingService.setLoading(false);
  //       Swal.fire({ title: 'Error!', text: "An error occurred: " + err.message, icon: 'error', confirmButtonText: 'Ok' })
  //       return;
  //    }
  //  })
  // }

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
      if (result.isConfirmed) {
       

        this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
        this.loadingService.setLoading(true);
    
        let AppData =   {  "AccountId" : this.AcctId, "Comment": "Cancel by customer", "LoadHeaderId" : headerId  }
     
        await this.LapoLoanService.CancelLoanAppConnector(AppData).subscribe({
         next:(res)=>{
         
           this.appDashboard.onLoad(this.AcctId);
           this.loadingService.setLoading(false);
           this.ResponseData = res;
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
    });
  }

  private reloadPage() :  void
  {
    setTimeout(()=>{  window.location.reload(); }, 100);
    return;
  }

  public ViewProfileDetails(event:any) : void
  {
      this.onNaviagateBack("/appviewdetails");
      return;
  }

  public async SaveProfileDetails(event:any): Promise<void>
  {
        try
        {
               this.loadingService.setLoading(true);
             
                // console.log('profile edit');
               
                // console.log('profile edit FirstName', this.FirstName);
                // console.log('profile edit Middle', this.Middle);
                // console.log('profile edit LastName', this.LastName);

                // console.log('profile edit EmailAddress', this.EmailAddress);
                // console.log('profile edit PhoneNumber', this.PhoneNumber);
                // console.log('profile edit AltPhoneNumber', this.AltPhoneNumber);

                // console.log('profile edit', this.CurrentAddress);
                // console.log('profile edit Gender', this.Gender);
                // console.log('profile edit Age', this.Age);

                let data:any = {
                  'FirstName': this.FirstName,
                  'Middle': this.Middle,
                  'LastName': this.LastName,
                  'EmailAddress': this.EmailAddress,
                  'PhoneNumber': this.PhoneNumber,
                  'AltPhoneNumber': this.AltPhoneNumber,
                  'CurrentAddress': this.CurrentAddress,
                  'Age': this.Age?.toString(),
                  'Gender': this.Gender,
                  'AcctId': this.AcctId
                }

          
                await this.LapoLoanService.ChangeProfileDetailsConnector(data).subscribe({
                  next:(res)=>{
                  
                    this.ResponseData = res;
                    this.loadingService.setLoading(false);
                     // console.log("poof! " + res);
                 
                    if(this.ResponseData != null && this.ResponseData.isActive)
                    {
                        this.ProfileDetails = this.ResponseData.dataLoad;
                       // console.log(this.ProfileDetails);
                        Swal.fire({
                          title: 'Success!',  text: this.ResponseData.tryCatchMessage, icon: 'success', confirmButtonText: 'Ok'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            this.onNaviagateBack("/appprofile");
                            return;
                          }
                        })
                        return;
                    }
                    else
                    {
                         //console.log(this.SignInResponseData.tryCatchMessage);
                         Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                         return;
                    }
                  },
                  error:(err:any)=>
                  {
                    // console.log("no continue " + err);
                    this.loadingService.setLoading(false);
                    Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                    return;
                  }
                })

                return;
        }
        catch(error:any){
          this.loadingService.setLoading(false);
          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
          return;
        }
  }

  public async ViewRepayments(headerId: any, IPPSNumber: any):Promise<void>
  {
      try
      {
          this.router.navigate(['/repayments'], { queryParams: { headerId : headerId, IPPSNumber:IPPSNumber }});
          return;
      }
      catch(ex:any)
      { 
        Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
        return;
      }
  }
}
