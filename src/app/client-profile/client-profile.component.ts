import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {

// Variable to store shortLink from api response
shortLink: string = "";
loading: boolean = false; // Flag variable
//appeditprofile
message:any= ""; 
ResponseData!: RespondMessageDto;
AcctId:any = "";
ProfileDetails:any;
// ClientNetPayDto
constructor(private loadingService: LoaderService,private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService) 
{

}

ngOnInit(): void 
{
     this.SignOutApplication();
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
             //console.log("Session Result " + this.AcctId );

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
          this.loadingService.setLoading(true);
          this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
        
          if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
          {
              this.onSignOut("/signin");
              return;
          }

          await this.LapoLoanService.GetUserProfileDetails(parseInt(this.AcctId)).subscribe({
          next:(res) =>
          {
            
            this.loadingService.setLoading(false);
            this.ResponseData = res;

            if(this.ResponseData != null && this.ResponseData.isActive)
            {
                this.ProfileDetails = this.ResponseData.dataLoad;
                return;
            }
            else
            {
                Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                return;
            }
          },
          error:(err)=>
          {
                this.loadingService.setLoading(false);
                Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                return;
          }
      });
}

public editProfileDetails(event:any):void
{
    this.onNaviagateBack("/appeditprofile");
    return;
}

public async TwoFactorActivator(event:any): Promise<void> 
{
      this.loadingService.setLoading(true);
      await this.LapoLoanService.UserTwoFactorActivatorConnector(this.AcctId).subscribe({
      next:(res)=>{
      
        this.loadingService.setLoading(false);
          // console.log("poof! " + res);
        this.ResponseData = res;
        if(this.ResponseData != null && this.ResponseData.isActive)
        {
            Swal.fire({ title: 'Success!',  text: this.ResponseData.tryCatchMessage, icon: 'success', confirmButtonText: 'Ok'
            }).then((result) => { if (result.isConfirmed) { this.reloadPage(); return; } })
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
  setTimeout(()=>{
    window.location.reload();
  }, 100);
  return;
}
}
