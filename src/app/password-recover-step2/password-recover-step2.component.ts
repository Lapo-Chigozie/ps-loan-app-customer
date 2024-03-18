import { Component, OnInit } from '@angular/core';
import { StaticData } from '../ps.loan.Models/StaticData';
import Swal from 'sweetalert2';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { PwrdChangeDto } from '../ps.loan.Models/PwrdChangeDto';

@Component({
  selector: 'app-password-recover-step2',
  templateUrl: './password-recover-step2.component.html',
  styleUrls: ['./password-recover-step2.component.css']
})

export class Passwordrecoverstep2Component implements OnInit
{
  
  Username:string = "";
  ConfirmPassword:string = "";
  Password:string = "";
  ResponseData!: RespondMessageDto;
  message:string = "";

  constructor(private loadingService: LoaderService,private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanApiService) {


  }

  ngOnInit(): void 
    
  {
       try
       {

            this. onSignOut("");
            this.router.queryParams.subscribe(params => {
              // console.log(params); 
              this.Username = params['Username'];
              if(this.Username == '' ||  this.Username == '' || this.Username == null){
                this.onNaviagateBack('/signin');
              }
            }
          );
       }
       catch(e){
        //console.log('Display: ' + e);
          this.onNaviagateBack('/signin');
       }
  }

  public onSignOut(event:any)
  {
    LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
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

  onContinue(event:any)
  {
        this.loadingService.setLoading(true);
        if(this.Username == null  || this.Username == ""){
          // this.alertify.error('Error saving Connection...')
          this.loadingService.setLoading(false);
          this.onNaviagateBack('/signin');
          return;
        }
       else if(this.Password == "" || this.ConfirmPassword == ""){

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
          emailAcct.Username = this.Username;
          emailAcct.Password = this.Password;
          emailAcct.ConfirmPassword = this.ConfirmPassword;
          this.LapoLoanService.ChangePasswordConnector(emailAcct).subscribe({
            next:(res)=>{

           this.loadingService.setLoading(false);
             // console.log(res);
            // this.sweetalert.timedNofication('Connection Saved Successfully...')
            StaticData.properties = StaticData.properties;
            this.ResponseData = res;
            console.log(this.ResponseData);
            //this.onNaviagateBack('/signin');
            if(this.ResponseData!=null && this.ResponseData.isActive){
              this.Username="";
              this.Password = "";
              let message = this.ResponseData.tryCatchMessage;
              StaticData.properties = StaticData.properties;
              let messageTitle = "Success!";
              let statusMessge = message;
              let imageName = "messageSuccessImage.png";
              this.route.navigate(['/apppasswordreststatus'], { queryParams: { messageTitle : messageTitle, statusMessge : statusMessge, imageName : imageName, SiginLink:  StaticData.SiginLink1  }});
              // this.route.navigate(['/forgetpwrd2'],  { queryParams: { Username : emailAcct.EmailAddress}});
              return;
            }
            else{
             
              let message = this.ResponseData.tryCatchMessage;
              StaticData.properties = StaticData.properties;
              let messageTitle = "An error has occur!";
              let statusMessge = message;
              let imageName = "messageErrorImage.png";
              this.route.navigate(['/apppasswordreststatus'], { queryParams: { messageTitle : messageTitle, statusMessge : statusMessge, imageName : imageName, SiginLink: "" }});
              return;
            }

            },
            error:(err)=>{
    
              this.loadingService.setLoading(false);
                StaticData.properties = StaticData.properties;
                this.message = "An error has occur " + err.message ;
                Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

                return;
            }
          })
        }
  }

}

