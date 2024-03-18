import { Component, OnInit } from '@angular/core';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import { EmailAcctDto } from '../ps.loan.Models/EmailAcctDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-recover-step1',
  templateUrl: './password-recover-step1.component.html',
  styleUrls: ['./password-recover-step1.component.css']
})


export class Passwordrecoverstep1Component implements OnInit {

  Username:string ="";
  ResponseData!: RespondMessageDto;
  constructor(private loadingService: LoaderService, private route: Router, private LapoLoanService: LapoLoanApiService) {

  }

  ngOnInit(): void 
  {
    this.onSignOut("");
  }

  public onSignOut(event:any)
  {
    LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
    this.onNaviagateBack('/forgetpwrd');
    return;
  }
 

  onNaviagateBack(page:string)
  {
    if(page == StaticData.SignInPage)
    {
      LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);
      LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
      LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
    }
    this.route.navigate([page]);
  }

  onContinueLoading(event:any):void
  {
    
        this.loadingService.setLoading(true);
        if(this.Username == "")
        {
              // this.alertify.error('Error saving Connection...')
              this.loadingService.setLoading(false);
              Swal.fire({ title: '',  text: "E-mail address is required", icon: 'warning',   confirmButtonText: 'Ok' });
              return;
        }
        else{

          let emailAcct =  new EmailAcctDto();
          emailAcct.EmailAddress = this.Username;
          this.LapoLoanService.CheckIfEmailExitConnector(emailAcct).subscribe({
            next:(res)=>{

             // console.log(res);
            // this.sweetalert.timedNofication('Connection Saved Successfully...')
            this.loadingService.setLoading(false);
            this.ResponseData = res;
            console.log(this.ResponseData);
            if(this.ResponseData!=null && this.ResponseData.isActive){

              StaticData.properties = StaticData.properties;
              let messageTitle = "A reset link has been sent to your email.";
              let statusMessge = "Login to your email to complete your password reset.";
              let imageName = "messageSuccessImage.png";
              this.route.navigate(['/apppasswordreststatus'], { queryParams: { messageTitle : messageTitle, statusMessge : statusMessge, imageName : imageName, SiginLink: ""  }});
              // this.route.navigate(['/forgetpwrd2'],  { queryParams: { Username : emailAcct.EmailAddress}});
              return;
            }
            else
            {
              StaticData.properties = StaticData.properties;
              let messageTitle = "An error has occurred";
              let statusMessge = this.ResponseData.tryCatchMessage;
              let imageName = "messageErrorImage.png";
              this.route.navigate(['/apppasswordreststatus'], { queryParams: { messageTitle : messageTitle, statusMessge : statusMessge, imageName : imageName, SiginLink: "" }});
              return;
            }

              return;

            },
            error:(err)=>
            {
                    // this.alertify.error('Error saving Connection...') 
                    this.loadingService.setLoading(false);
                    Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

                    return;
            }
          })
        }
  }
}

