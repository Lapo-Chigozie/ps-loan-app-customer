import { Component, OnInit } from '@angular/core';
import { StaticData } from '../ps.loan.Models/StaticData';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';

@Component({
  selector: 'app-app-email-account-verify',
  templateUrl: './app-email-account-verify.component.html',
  styleUrls: ['./app-email-account-verify.component.css']
})
export class AppEmailAccountVerifyComponent implements OnInit {

  identification:string="";

  statusTitle:string ="";
  statusMessge:string ="";
  imageName:string = "";
  LoginLink:string = "";
  success:boolean = false;
  ResponseData: RespondMessageDto | undefined;

  constructor(private loadingService: LoaderService, private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanApiService) {

  }

  public ngOnInit(): void  
  {
       try
       {
           this.identification = this.router.snapshot.queryParams["identification"];

           if(this.identification == undefined || this.identification == null || this.identification == "")
           {
               this.onNaviagateBack('/signin');
               return;
           }

           this.CkeckEamilValidity(this.identification);
       }
       catch(e:any)
       {
            this.onNaviagateBack('/signin');
            return;
       }
  }

  private onNaviagateBack(page:string)
  {
       this.route.navigate([page]);
  }

  private CkeckEamilValidity(email:string) : void
  {
               this.statusTitle = "Your account has been activated.";
               this.statusMessge = "Your account has been activated successfully. you can now login to your account.";
               this.imageName = "messageSuccessImage.png";
               this.LoginLink = StaticData.SiginLink1();
               this.success = true;
               return;

              //   this.loadingService.setLoading(true);
              //   this.LapoLoanService.VerifyNewAccountEmailConnector(email).subscribe({
              //   next:(res) =>
              //   {
              //     this.loadingService.setLoading(false);
              //     // console.log("poof! " + res);
              //     this.ResponseData = res;
              //     //  console.log(this.SignInResponseData);
                  
              //     if(this.ResponseData != null && this.ResponseData.isActive)
              //     {
              //         this.statusTitle = "Your account has been activated.";
              //         this.statusMessge = this.ResponseData.tryCatchMessage;
              //         this.imageName = "messageSuccessImage.png";
              //         this.LoginLink= StaticData.SiginLink1;
              //         this.success = true;
              //         return;
              //     }
              //     else
              //     {
              //         this.statusTitle = "Your account has not been activate";
              //         this.statusMessge = this.ResponseData.tryCatchMessage;
              //         this.imageName = "messageErrorImage.png";
              //         this.success = false;
              //         return;
              //     }
              
              //   },
              //   error:(err:any)=>
              //   {
              //       // console.log("no continue " + err);
              //       this.loadingService.setLoading(false);
              //       Swal.fire({ title: 'Error!', text: "An error occurred: " + err.message, icon: 'error', confirmButtonText: 'Ok' })
              //       return;
              //   }
              // })
  }
}
