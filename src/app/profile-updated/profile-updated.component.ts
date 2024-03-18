import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import { SignInPostDto } from '../ps.loan.Models/SignInPostDto';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-updated',
  templateUrl: './profile-updated.component.html',
  styleUrls: ['./profile-updated.component.css']
})

export class ProfileUpdatedComponent implements OnInit 
{
        datePipe: DatePipe = new DatePipe('en-US');
        identification:string="";

        statusTitle:string ="";
        statusMessge:string ="";
        imageName:string = "";
        LoginLink:string = "";
        success:boolean = false;
        ResponseData: RespondMessageDto | undefined;

        RetirementDate:string ="";
        EmploymentDate:string ="";

        EmploymentFirstName:string ="";
        EmploymentMiddleName:string ="";
        EmploymentLastName:string =""; 
        EmploymentDateOfBirth:string ="";
        EmploymentPhoneNumber:string ="";
        EmploymentGender:string ="";
        EmploymentMaritalStatus:string ="";


        bvn: string = "";
        PhoneNumber: string = "";
        DateOfBirth: string = "";
        LastName: string = "";
        FirstName: string = "";

        transformDate: any ="";

      constructor(private loadingService: LoaderService, private PickerDate: DatePipe,private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanApiService) 
      {
        
      }

      public ngOnInit(): void  
      {
          try
          {
              this.identification = this.router.snapshot.queryParams["identification"];
              this.bvn = this.router.snapshot.queryParams["bvn"];
              this.PhoneNumber =  this.router.snapshot.queryParams["PhoneNumber"];
              this.DateOfBirth = this.router.snapshot.queryParams["DateOfBirth"];

              this.LastName =  this.router.snapshot.queryParams["LastName"];
              this.FirstName = this.router.snapshot.queryParams["FirstName"];

              if(this.FirstName == null || this.FirstName == undefined || this.FirstName == "" || this.LastName == null || this.LastName == undefined || this.LastName == "" || this.DateOfBirth == null || this.DateOfBirth == undefined || this.DateOfBirth == "" || this.PhoneNumber == null ||   this.PhoneNumber == undefined ||   this.PhoneNumber == "" ||  this.bvn == null || this.bvn == undefined || this.bvn == "" || this.identification == null || this.identification == undefined || this.identification == "")
              {
                  this.onNaviagateBack('/signin');
                  return;
              }

              this.EmploymentDateOfBirth = this.DateOfBirth;
              this.EmploymentPhoneNumber = this.PhoneNumber;
              this.EmploymentLastName =  this.LastName;
              this.EmploymentFirstName =  this.FirstName;

              this.CkeckEamilValidity1(this.identification);
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

      public CkeckEamilValidity() : void
      {

                if(this.EmploymentDate == undefined || this.EmploymentDate == null || this.EmploymentDate == "")
                {
                      Swal.fire({ title: '', text: "Employment Date is required", icon: 'warning', confirmButtonText: 'Ok' })
                      return;
                }

                if(this.RetirementDate == undefined || this.RetirementDate == null || this.RetirementDate == "")
                {
                      Swal.fire({ title: '', text: "Retirement Date is required", icon: 'warning', confirmButtonText: 'Ok' })
                      return;
                }

                if(this.EmploymentFirstName == undefined || this.EmploymentFirstName == null || this.EmploymentFirstName == "")
                {
                      Swal.fire({ title: '', text: "First Name is required", icon: 'warning', confirmButtonText: 'Ok' })
                      return;
                }

                if(this.EmploymentMiddleName == undefined || this.EmploymentMiddleName == null || this.EmploymentMiddleName == "")
                {
                      this.EmploymentMiddleName =  "";
                }

                if(this.EmploymentLastName == undefined || this.EmploymentLastName == null || this.EmploymentLastName == "")
                {
                      Swal.fire({ title: '', text: "Last Name is required", icon: 'warning', confirmButtonText: 'Ok' })
                      return;
                }

                if(this.EmploymentDateOfBirth == undefined || this.EmploymentDateOfBirth == null || this.EmploymentDateOfBirth == "")
                {
                      Swal.fire({ title: '', text: "Date-Of-Birth is required", icon: 'warning', confirmButtonText: 'Ok' })
                      return;
                }

                if(this.EmploymentPhoneNumber == undefined || this.EmploymentPhoneNumber == null || this.EmploymentPhoneNumber == "")
                {
                      Swal.fire({ title: '', text: "Phone Number is required", icon: 'warning', confirmButtonText: 'Ok' })
                      return;
                }

                if(this.EmploymentMaritalStatus == undefined || this.EmploymentMaritalStatus == null || this.EmploymentMaritalStatus == "")
                {
                      Swal.fire({ title: '', text: "Marital Status is required", icon: 'warning', confirmButtonText: 'Ok' })
                      return;
                }
                
                if(this.EmploymentGender == undefined || this.EmploymentGender == null || this.EmploymentGender == "")
                {
                      Swal.fire({ title: '', text: "Gender is required", icon: 'warning', confirmButtonText: 'Ok' })
                      return;
                }

                if(this.bvn == null || this.bvn == undefined || this.bvn == "")
                {
                      Swal.fire({ title: '', text: "BVN is required", icon: 'warning', confirmButtonText: 'Ok' })
                      return;
                }

                  if(this.EmploymentDate == this.RetirementDate)
                  {
                        Swal.fire({ title: '', text: "Employment Date and Retirement Date cannot be the same", icon: 'warning', confirmButtonText: 'Ok' })
                        return;
                  }
                // 2024 > 2025 
                 
                let Ryear = new Date(this.RetirementDate).getFullYear();
                let Eyear = new Date(this.EmploymentDate).getFullYear();
  
                let date = new Date();
                this.transformDate = this.datePipe.transform(date, 'yyyy-MM-dd')?.toString();
             
                let AvgAcceptYearR =  Ryear - Eyear;

                if(Ryear == Eyear)
                {
                              let message = "Retirement Date range should be 35 years.";
                              Swal.fire({ title: 'Warning!', text:  message, icon: 'warning', confirmButtonText: 'Ok'
                              });
                              return;
                }
          
                if(AvgAcceptYearR > 35 || AvgAcceptYearR < 35)
                {
                              let message = "Retirement Date range should be 35 years.";
                              Swal.fire({ title: 'Warning!', text:  message, icon: 'warning', confirmButtonText: 'Ok'});
                              return;
                }

                let year = new Date(this.EmploymentDateOfBirth).getFullYear();
                let date1 = new Date();
                this.transformDate = this.datePipe.transform(date1, 'yyyy-MM-dd')?.toString();
                let CurrentYear = new Date(this.transformDate).getFullYear();
                let AvgAcceptYear =  CurrentYear - year;
               
                if(AvgAcceptYear < StaticData.MinClientAgeRetirement || AvgAcceptYear > StaticData.MaxClientAgeRetirement)
                {
                              let message = "Date-Birth, Age between 18 - 65 years is valid to apply for this loan.";
                              Swal.fire({ title: 'Warning!', text:  message, icon: 'warning', confirmButtonText: 'Ok' });
                              return;
                }
                                
                let data = { EmploymentMaritalStatus : this.EmploymentMaritalStatus, Bvn : this.bvn , EmploymentGender : this.EmploymentGender, EmploymentFirstName: this.EmploymentFirstName,
                    EmploymentMiddleName: this.EmploymentMiddleName,
                    EmploymentLastName: this.EmploymentLastName,
                    EmploymentDateOfBirth: this.EmploymentDateOfBirth,
                    EmploymentPhoneNumber: this.EmploymentPhoneNumber, EmploymentDate: this.EmploymentDate, RetirementDate: this.RetirementDate, identification: this.identification }

                let data12 = JSON.stringify(data);

                this.loadingService.setLoading(true);
                this.LapoLoanService.UpdateProfileConnector(data12).subscribe({
                next:(res)=>
                {
                      this.loadingService.setLoading(false);
                      this.ResponseData = res;
                      if(this.ResponseData != null && this.ResponseData.isActive)
                      {

                           this.LoginLink = StaticData.SiginLink1();
                           this.success = true;
                           let username = this.ResponseData.dataLoad.username;
                           let password = this.ResponseData.dataLoad.password;

                  
                           Swal.fire({  title: 'Success!', text: 'Your account has been successfully activated. Continue to your dashboard', icon: 'success', confirmButtonText: 'Ok'}).then((result) => {if (result.isConfirmed) {  this.Submit( username , password ); return; }});
                            return;
                        //   this.route.navigate(['/emailaccountverify'], { queryParams: { identification : this.identification }});
                        //   return;
                      }
                      else
                      {
                          this.loadingService.setLoading(false);
                          Swal.fire({ title: 'Warning!', text:  this.ResponseData.tryCatchMessage , icon: 'warning', confirmButtonText: 'Ok' })
                          return;
                      }
                },
                error:(err:any)=>
                {
                        this.loadingService.setLoading(false);
                        Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

                        return;
                }
              });
      }

      public async Submit( username:string  , password:string): Promise<void>
      {            
            let  signin = new SignInPostDto();
            signin.EmailAddress = username;
            signin.Password = password;
            signin.RememberMe = true;
     
            this.LapoLoanService.SignInConnector(signin).subscribe({
             next:(res)=>
             {
                        this.loadingService.setLoading(false);
                        this.ResponseData = res;
                        
                       // StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
                      //  LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession );
                        
                        // this.router.navigate(['/loanbvnapp', { IsLoanApp: true }]);
                       //   let LoginSession = LocalStorageService.getLoginSessionIdentity(StaticData.LoanKeySession); 
                         
                        LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, username);
                        LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, res.dataLoad.id);
                        StaticData.properties = StaticData.properties;
                        this.route.navigate(['/dashboard'], { queryParams: { AccountId : res.dataLoad.id }});
                        return; 
              
                              // if(this.ResponseData != undefined && this.ResponseData != null && this.ResponseData.isActive &&   this.ResponseData.dataLoad.isTwoFactorAuth !=null  && this.ResponseData.dataLoad.isTwoFactorAuth)
                              // {
                              //       // LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, res.dataLoad.accountId);
                              //       // LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, username);
                              //       // LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, res.dataLoad.accountId);
                              //       // StaticData.properties = StaticData.properties;

                              //       // this.route.navigate(['/twofactorauth'],  { queryParams: {
                              //       // AcctId : res.dataLoad.accountId, 
                              //       // bvn:res.dataLoad.bvnVerification,
                              //       // code:"SDARERTWW",
                              //       // crDate:res.dataLoad.createdDate,
                              //       // expDate:res.dataLoad.expiredDateTime,
                              //       // gedDate:res.dataLoad.genaratedDateTime,
                              //       // id:res.dataLoad.id,
                              //       // expired:res.dataLoad.isActivexpired,
                              //       // TwoFactor:res.dataLoad.isTwoFactorAuth , page: '/signin'}} );
                              //       // return;
                              // }
                              // else if(this.ResponseData != null && this.ResponseData.isActive && this.ResponseData.dataLoad.allowLoginTwoFactor != null  &&  this.ResponseData.dataLoad.allowLoginTwoFactor != undefined  && this.ResponseData.dataLoad.allowLoginTwoFactor==false)
                              // {
                                   

                              //       // if(StaticData.propertie1 == StaticData.AppOnLoanAnswer || LoginSession == StaticData.LoanAppOnLoanAnswer)
                              //       // {
                              //       //       LocalStorageService.setLoginSessionIdentity(StaticData.LoanKeySession, StaticData.LoanKeySession);
                              //       //       LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, username);
                              //       //       LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, res.dataLoad.id );
                              //       //       StaticData.properties = StaticData.properties;
                              //       //       this.route.navigate(['/loanbvnapp'], { queryParams: { AccountId : res.dataLoad.id  }});
                              //       //       return;          
                              //       // }
                              //       // else
                              //       // {
                                         
                              //       // }

                              //       // return;
                              // }
                              // else
                              // {
                              //       StaticData.properties = StaticData.properties;
                              //       Swal.fire({  title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok'}).then((result) => {if (result.isConfirmed) {  this.onSignOut('/signin'); return; }});
                              //       return;
                              // }

             },
             error:(err:any)=>
             {
                        this.loadingService.setLoading(false);
                        StaticData.properties = StaticData.properties;
                        Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
                        return;
             }
           })
      }
     
      public onSignOut(event:any):void
      {
         this.onNaviagateBack(event);
      }

      private CkeckEamilValidity1(email:string) : void
      {
                  this.loadingService.setLoading(true);
                  this.LapoLoanService.CheckIfAcctIsActiveConnector(email).subscribe({
                  next:(res) =>
                  {
                        this.loadingService.setLoading(false);
                        this.ResponseData = res;
                  
                        if(this.ResponseData != null && this.ResponseData.isActive)
                        {
                              // this.statusTitle = "Your account has been activated.";
                              // this.statusMessge = this.ResponseData.tryCatchMessage;
                              // this.imageName = "messageSuccessImage.png";
                              // this.LoginLink= StaticData.SiginLink1;
                              this.route.navigate(['/acctalreadyinusing']);
                              return;
                        }
                        else
                        {
                              // this.statusTitle = "Your account has not been activate";
                              // this.statusMessge = this.ResponseData.tryCatchMessage;
                              // this.imageName = "messageErrorImage.png";
                              return;
                        }
                  },
                  error:(err:any)=>
                  {
                        this.loadingService.setLoading(false);
                        Swal.fire({ title: 'Uh-oh!',  text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
                              if (result.isConfirmed) { this.onNaviagateBack('/signin'); return; } });
                        return;
                  }
            })
      }
}

