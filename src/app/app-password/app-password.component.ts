import { Component, OnInit } from '@angular/core';
import { StaticData } from '../ps.loan.Models/StaticData';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { PwrdChangeDto } from '../ps.loan.Models/PwrdChangeDto';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';

@Component({
  selector: 'app-app-password',
  templateUrl: './app-password.component.html',
  styleUrls: ['./app-password.component.css']
})
export class AppPasswordComponent implements OnInit {

  // Variable to store shortLink from api response
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  //appeditprofile
  message:any= ""; 
  ResponseData!: RespondMessageDto;
  AcctId:any = "";
  ProfileDetails:any;
  
  public Password!:string;
  public ConfirmPassword:string | undefined;

  constructor(private loadingService: LoaderService, private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanApiService) {

  }

  public  ngOnInit(): void 
  {
      this.SignOutApplication();
  }

  public onSignOut(event:any)
  {
      LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
      this.onNaviagateBack(event);
      return;
  }
  
  private onNaviagateBack(page:string)
  {
      this.route.navigate([page]);
      return;
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

              if(this.AcctId  === "" || this.AcctId  === undefined || this.AcctId  === null || this.AcctId  === StaticData.LoginKeySession)
              {
                  this.onSignOut("/signin");
                  return;
              }
              
              this.GetUserProfileDetails();
              return;
      }
      catch(error:any)
      {
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
     next:(res)=>{
     
       this.loadingService.setLoading(false);
        // console.log("poof! " + res);
       this.ResponseData = res;
       if(this.ResponseData != null && this.ResponseData.isActive)
       {
           this.ProfileDetails = this.ResponseData.dataLoad;
          //  this.Gender = this.ProfileDetails.userProfileDetails.gender;
          //  this.FirstName = this.ProfileDetails.userProfileDetails.firstName;
          //  this.Middle = this.ProfileDetails.userProfileDetails.middleName;
          //   this.LastName = this.ProfileDetails.userProfileDetails.lastName;
          //    this.EmailAddress = this.ProfileDetails.userProfileDetails.emailAddress; 
          //     this.PhoneNumber = this.ProfileDetails.userProfileDetails.phoneNumber; 
          //      this.AltPhoneNumber = this.ProfileDetails.userProfileDetails.altPhoneNumber;
          //     this.CurrentAddress = this.ProfileDetails.userProfileDetails.currentAddress; 
          //      this.Age = this.ProfileDetails.userProfileDetails.age; 
          //      // this.Gender == this.ProfileDetails.userProfileDetails.gender;
         
          //  console.log(this.FirstName);
           return;
       }
       else
       {
            //console.log(this.SignInResponseData.tryCatchMessage);
            Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
            return;
       }
  
     },
     error:(err)=>
     {
       // console.log("no continue " + err);
       this.loadingService.setLoading(false);
       Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
       return;
     }
   })
  }

  private reloadPage() :void
  {
    setTimeout(() =>
    {
      window.location.reload();
    }, 100);
    return;
  }

  public ViewProfileDetails(event:any) : void
  {
      this.onNaviagateBack("/appprofile");
      return;
  }

  public SavePassword(event:any):void
  {
        this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
   
        this.loadingService.setLoading(true);
        if(this.AcctId == undefined  || this.AcctId == StaticData.LoginKeySession || this.AcctId == null  || this.AcctId == ""){
          // this.alertify.error('Error saving Connection...')
          this.loadingService.setLoading(false);
          this.onNaviagateBack('/signin');
          return;
        }
       else if(this.Password == undefined || this.ConfirmPassword == undefined || this.Password == "" || this.ConfirmPassword == ""){

          // this.alertify.error('Error saving Connection...')
          this.message = "Your Password or Confirm Password is required";
          this.loadingService.setLoading(false);
          Swal.fire({
            title: 'Warning!',
            text:  this.message,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
        }
        else if(this.Password != this.ConfirmPassword){
          this.loadingService.setLoading(false);
          // this.alertify.error('Error saving Connection...')
          this.message = "Confirm Password don't match Password";
          Swal.fire({
            title: 'Warning!',
            text:  this.message,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
        }
        else{

          this.loadingService.setLoading(false);
          StaticData.properties = StaticData.properties;
          let emailAcct =  new PwrdChangeDto();
          emailAcct.Username = this.AcctId;
          emailAcct.Password = this.Password;
          emailAcct.ConfirmPassword = this.ConfirmPassword;
          this.LapoLoanService.InnerChangePasswordConnector(emailAcct).subscribe({
            next:(res)=>
            {
                    this.loadingService.setLoading(false);
                    StaticData.properties = StaticData.properties;
                    this.ResponseData = res;
                    if(this.ResponseData != null && this.ResponseData.isActive)
                    {
                        this.ConfirmPassword = "";
                        this.Password = "";
                        let message = this.ResponseData.tryCatchMessage;
                        StaticData.properties = StaticData.properties;
                        let statusMessge = message;

                        Swal.fire({
                          title: 'Password Updated?',
                          text: "Your password has been updated succcessfully, Do you want to sign out and login?",
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#f97c00',
                          cancelButtonColor: '#5b5b5b7f',
                          confirmButtonText: 'Yes, I want to Sign Out!',
                          cancelButtonText: "No, Don't Sign Out!"
                        }).then((result) => 
                        {
                          if (result.isConfirmed) 
                          {
                              setTimeout(()=> { 
                              LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
                              LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
                              this.onNaviagateBack('/signin'); return; 
                              }, 100);
                              return;
                          }
                        })
                      
                        return;

                        //this.router.navigate(['/apppasswordreststatus'], { queryParams: { messageTitle : messageTitle, statusMessge : statusMessge, imageName : imageName, SiginLink:  StaticData.SiginLink  }});
                        // this.route.navigate(['/forgetpwrd2'],  { queryParams: { Username : emailAcct.EmailAddress}});
                      // return;
                    }
                    else
                    {     
                        this.ConfirmPassword = "";
                        this.Password = "";
                        let message = this.ResponseData.tryCatchMessage;
                        let statusMessge = message;
                        Swal.fire({ title: 'Error!', text:  this.ResponseData.tryCatchMessage,  icon: 'error',  confirmButtonText: 'Ok' });
                        return;
                    }
            },
            error:(err:any) => {
    
                this.ConfirmPassword = "";
                this.Password = "";
                this.loadingService.setLoading(false);
                StaticData.properties = StaticData.properties;
                this.message = "An error has occur " + err.message;
                Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                return;
            }
          })
        }
  }

}
