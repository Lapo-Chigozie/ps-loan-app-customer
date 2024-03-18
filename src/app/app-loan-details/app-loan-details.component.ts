import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { PrintService } from '../datatableservicehelper/print.service';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';

@Component({
  selector: 'app-app-loan-details',
  templateUrl: './app-loan-details.component.html',
  styleUrls: ['./app-loan-details.component.css']
})
export class AppLoanDetailsComponent implements OnInit {

   // Variable to store shortLink from api response
   shortLink: string = "";
   loading: boolean = false; // Flag variable
   //appeditprofile
   message:any= ""; 
   ResponseData!: RespondMessageDto;
   AcctId:any = "";
   ProfileDetails:any;
 
   headerId:any = undefined;
   IppisNumber:any = undefined;
 
   LoanDetails:any = undefined;
 
   public LoanScheduleData:any=undefined;
   public IsLoadingData:boolean = true;
   // ClientNetPayDto
   constructor(private printService: PrintService ,private loadingService: LoaderService,private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService) 
   {
       //headerId: item.headerId , IppisNumber: item.ippisNumber 
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


                 this.SignOutApplication();
                 this.route.queryParams.subscribe(params => 
                   {
                   
                     this.headerId = params['headerId'];
                     this.IppisNumber = params['IppisNumber'];
             
                     if(this.headerId == undefined ||  this.headerId == undefined ||  this.headerId == '' || this.headerId == ''){
                       this.onSignOut('/signin');
                     }
                  
                   }
               );
 
               this.Getloanappdetails();  
        }
        catch(e:any)
        {
             //console.log('Display: ' + e);
             this.onSignOut('/signin');
        }
   }
 
   public async onCancelLoanApp(headerId :any):Promise<void>
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
             }).then( (result) => 
             {
                   if (result.isConfirmed) 
                   {
                         this.CancelLoanApp(headerId);
                         return;
                   }
             });
   }
 
   public async CancelLoanApp(headerId :any):Promise<void>
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
                   
                       let AppData =   {  "AccountId" : this.AcctId, "Comment": "Cancel by customer", "LoadHeaderId" : headerId  }
                   
                       await this.LapoLoanService.CancelLoanAppConnector(AppData).subscribe({
                       next:(res)=>{
                       
                         this.loadingService.setLoading(false);
                         this.ResponseData = res;
                         this.Getloanappdetails();
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
                     });
         }
         catch(exp:any)
         {
           Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
           return;
 
         }
   }
 
   public onSignOut(event:any)
   {
       LocalStorageService.setLoginSessionIdentity(StaticData.DateLoginKeySession, StaticData.DateLoginKeySession);
       LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
       this.onNaviagateBack(event);
       return;
   }
   
   private onNaviagateBack(page:string)
   {
       this.router.navigate([page]);
   }
   
   public SignOutApplication():void
   {
       try{
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
     this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
    
     if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
     {
         this.onSignOut("/signin");
         return;
     }
 
     this.loadingService.setLoading(true);
     await this.LapoLoanService.GetUserProfileDetails(parseInt(this.AcctId)).subscribe({
      next:(res:any)=>{
      
        this.loadingService.setLoading(false);
         // console.log("poof! " + res);
        this.ResponseData = res;
        if(this.ResponseData != null && this.ResponseData.isActive){
            this.ProfileDetails = this.ResponseData.dataLoad;
            // console.log(this.ProfileDetails);
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
        Swal.fire({ title: 'Error!', text: "An error occurred: " + err, icon: 'error', confirmButtonText: 'Ok' })
        return;
      }
    })
   }
 
   public async Getloanappdetails(): Promise<void> 
   {
         this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
       
         if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
         {
             this.onSignOut("/signin");
             return;
         }
         
         this.IsLoadingData = true;
         //  this.loadingService.setLoading(true);
         await this.LapoLoanService.GetLoanAppDetails(this.headerId, this.AcctId).subscribe({
         next:(res:any) =>
         {
           this.loadingService.setLoading(false);
           this.ResponseData = res;
           this.IsLoadingData = false;
           if(this.ResponseData != null && this.ResponseData.isActive)
           {
               this.LoanDetails = this.ResponseData.dataLoad;
               this.onLoanTenureChanged();
               // Swal.fire({ title: 'Success!',  text: this.ResponseData.tryCatchMessage, icon: 'success', confirmButtonText: 'Ok' }).then((result) => { if (result.isConfirmed) {  return; } })
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
             this.IsLoadingData = false;
           
           this.loadingService.setLoading(false);
           Swal.fire({ title: 'Error!', text: "An error occurred: " + err.message, icon: 'error', confirmButtonText: 'Ok' })
           return;
         }
       })
     }
 
     public onPrintsLoanData(LoanDetail:any): void
     {
         LoanDetail.loanAppReviewStatus.approvedBy = "Pending";
         LoanDetail.loanAppReviewStatus.comment = "Pending";
         this.printService.GetPrintServiceConnector(LoanDetail);
     }
 
     private reloadPage() :void
     {
       setTimeout(()=>{
         window.location.reload();
       }, 100);
       return;
     }
 
     public async onLoanTenureChanged() : Promise<void>
     { 
       var selectedTenured = this.LoanDetails.loanDetailsData.ternor;
       
       try
       {
                 this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
             
                 if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
                 {
                     this.onSignOut("/signin");
                     return;
                 }
 
                 this.loadingService.setLoading(true);
                 let DataChange = {'IPPISNumber': this.LoanDetails.clientDetail.pfNumber, 'AccountId': this.AcctId, 'Amount': this.LoanDetails.loanDetailsData.loanAmount , 'Tenure': selectedTenured };
 
               await this.LapoLoanService.CalculateScheduledLoanAmount(DataChange).subscribe({
                 next:(res) => 
                 {
                 
                   this.loadingService.setLoading(false);
                   this.ResponseData = res;
                   if(this.ResponseData != null && this.ResponseData.isActive)
                   {
                       this.LoanScheduleData = this.ResponseData.dataLoad;
                       // console.log('Loan Schedule Data ', this.LoanScheduleData);
                     
                       return;
                   }
                   else
                   {
                     this.loadingService.setLoading(false);
                     Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                     return;
                   }
                 },
                 error:(err:any):any=>
                 {
                     this.loadingService.setLoading(false);
                     Swal.fire({ title: 'Error!', text: "An error occurred: " + err.message, icon: 'error', confirmButtonText: 'Ok' })
                     return;
                 }
               })
       }
       catch(errx:any)
       {
           this.loadingService.setLoading(false);
           Swal.fire({ title: 'Error!', text: "An error occurred: " + errx.message, icon: 'error', confirmButtonText: 'Ok' })
           return;
       }
     } 

}
