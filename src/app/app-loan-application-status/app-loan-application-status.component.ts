import { Component, OnInit } from '@angular/core';
import { StaticData } from '../ps.loan.Models/StaticData';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { FileUploadService } from '../datatableservicehelper/file-upload.service';
import { DataSharedService } from '../ps.loan.Models/DataSharedService';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';

@Component({
  selector: 'app-app-loan-application-status',
  templateUrl: './app-loan-application-status.component.html',
  styleUrls: ['./app-loan-application-status.component.css']
})
export class AppLoanApplicationStatusComponent implements OnInit {

  identification:string = "";

  statusTitle:string = "";
  statusMessge:string = "";
  imageName:string = "";
  LoginLink:string = "";
  success:boolean = false;
  ResponseData: RespondMessageDto | undefined;
  showLink:boolean = false;

  public IsSessionActive :boolean = false;
  public Issuccessfully  :any = false;

  constructor(private fileUpload: FileUploadService, private loadingService: LoaderService, private  shared: DataSharedService, private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanApiService) {

  }

  ngAfterViewInit(): void 
  {
    
  }

 public onSignOut(event:any): void
 {

  LocalStorageService.setLoginSessionIdentity(StaticData.DateLoginKeySession, StaticData.DateLoginKeySession);
  LocalStorageService.setLoginSessionIdentity(StaticData.LoanAcctBankSession, StaticData.LoanAcctBankSession);
  LocalStorageService.setLoginSessionIdentity(StaticData.LoanReviewSession, StaticData.LoanReviewSession);
  LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);

  LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
  LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);  
  LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan); 
    this.onNaviagateBack(event);
}

public onSignOutSess() : void
{

    LocalStorageService.setLoginSessionIdentity(StaticData.LoanAcctBankSession, StaticData.LoanAcctBankSession);
    LocalStorageService.setLoginSessionIdentity(StaticData.LoanReviewSession, StaticData.LoanReviewSession);
    LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);

    LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, StaticData.AccountEmailSession);
    
    StaticData.propertie1 =  LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
    if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
    {
            //  LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
            LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);  
    }
    else
    {
            //  LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
            LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);  
    }

    return;
}

public CheckSession():boolean 
{
        //LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
        let SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
        // console.log("Session Result " + SessionResult);
        let twofactor = LocalStorageService.getLoginSessionIdentity(StaticData.TwoLoginKeySession);

        try
        {
                  if(SessionResult  == ""  || SessionResult  == undefined || SessionResult  == null || SessionResult  == StaticData.LoginKeySession)
                  {
                      StaticData.properties = StaticData.properties;
                     
                      this.onSignOut('/signin');
                      return true;
                  }

                  if(twofactor != StaticData.TwoLoginKeySession)
                  {
                    this.onSignOut('/signin');
                    return true;
                  }

                  this.IsSessionActive  = true;

                  return false;
        }
        catch(e)
        {
            this.IsSessionActive  = false;
            //console.log('Display: ' + e);
            this.onSignOut('/signin');
            return false;
        }
}

public onAutoSignOut() : void
{ 
  window.setInterval(() => 
  {
    this.CheckSession();
   
  }, 100);
  return;
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

          this.onAutoSignOut();
          this.CheckSession();

          this.statusTitle ="";
          this.statusMessge ="";
          this.imageName ="";
          this.Issuccessfully =false

          this.statusTitle = this.router.snapshot.queryParams["messageTitle"];
          this.statusMessge = this.router.snapshot.queryParams["statusMessge"];
          this.imageName = this.router.snapshot.queryParams["imageName"];

          this.Issuccessfully = this.router.snapshot.queryParams["Issuccessfully"];

          if(this.Issuccessfully == false)
          {
              this.onNaviagateBack('/signin');
              return;
          }

          if(this.statusTitle == null || this.statusMessge == null || this.imageName == null || this.statusTitle == null || this.statusMessge == null || this.imageName == null || this.statusTitle == undefined || this.statusMessge == undefined || this.imageName == undefined || this.statusTitle == "" || this.statusMessge == "" || this.imageName == "")
          {
              this.onNaviagateBack('/signin');
              return;
          }
         
          this.success = true;
 
          this.LoginLink = this.router.snapshot.queryParams["SiginLink"];

          if(this.LoginLink == undefined || this.LoginLink == "" || this.LoginLink == null)
          {
                this.showLink = false;
          }
          else
          {
                this.showLink = true;
          }

          if(this.IsSessionActive == true)
          {
                this.showLink = true;
                this.LoginLink = StaticData.DashboardLink();
          }
          else{

          }
         
          this.success = true;

          this.onSignOutSess();
          return;
    }
    catch(error:any)
    {
          this.IsSessionActive  = false;
          StaticData.properties = true;
          Swal.fire({ title: 'Uh-oh!',  text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
            if (result.isConfirmed) { this.onSignOut('/signin'); return; } });
          return;
    }
  }

  public onNaviagateBack(page:string) :void
  {
      this.route.navigate([page]);
  }

}
