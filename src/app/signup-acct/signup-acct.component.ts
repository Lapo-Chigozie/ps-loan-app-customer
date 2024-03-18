import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SignInPostDto } from '../ps.loan.Models/SignInPostDto';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegisterUserDto } from '../ps.loan.Models/RegisterUserDto';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup-acct',
  templateUrl: './signup-acct.component.html',
  styleUrls: ['./signup-acct.component.css']
})

export class SignUpAcctComponent implements OnInit
{
   @Output() compidToSend = new EventEmitter<any>()
   @Output() erpidToSend = new EventEmitter<any>()
  //  @ViewChild('UsernameInput') usernameInput!: ElementRef;
  //  @ViewChild('passwordInput') passwordInput!: ElementRef;
  //  @ViewChild('myCheckbox') myCheckbox: any;
 
   checkBoxValue: any = false;
   @Input() itm: SignInPostDto | undefined;
   @Input() itms: SignInPostDto[] = []; 

   public ConfirmPassword: string = '';
   public  Password: string = '';
   public  username: string = '';
   public  TermsAndConditions: boolean = false;
   public  PrivacyPolicy: boolean = false;
   testForm!: FormGroup;
   AcctLogDetails!: SignInPostDto;
   SignInResponseData!: RespondMessageDto;
   public signUp = new RegisterUserDto();
   
   constructor( private loadingService: LoaderService,private route:Router, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService) {

   }

  //###################################################################
    ngOnInit(): void 
    {

    //  this.testForm = this.formBuilder.group({
    //    Password: "",
    //    Username: "",
    //    Rememberme: "",
    //  });

    //  this.testForm.controls['Username'].setValue("JohnDel@example.com"); //here you can preset values if you wish.
       this.CheckSession();
    }

    public onSignOut(page:any):void
    {
       LocalStorageService.setLoginSessionIdentity(StaticData.LoanAcctBankSession, StaticData.LoanAcctBankSession);
       LocalStorageService.setLoginSessionIdentity(StaticData.LoanReviewSession, StaticData.LoanReviewSession);
       LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);
 
       LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);
       LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
       LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
       this.route.navigate([page]);
     }

  public CheckSession(): boolean 
  {
          StaticData.propertie1 =  LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
          let SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
          
          try
          {
                    if(SessionResult  != ""  && SessionResult  != undefined && SessionResult  != null && SessionResult  != StaticData.LoginKeySession)
                    {
                        StaticData.properties = StaticData.properties;
                        
                        if(StaticData.propertie1 != StaticData.AppOnLoanAnswer)
                        {
                            this.route.navigate(['/dashboard'], { queryParams: { AccountId : SessionResult }});
                            return true;
                        }
                        else if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
                        {
                            this.route.navigate(['/loanbvnapp'], { queryParams: { AccountId : SessionResult  }});
                            return true;
                        }
                    }

                    return false;
          }
          catch(e:any)
          {
              //console.log('Display: ' + e);
              this.onSignOut("/signin");
              return false;
          }
  }

 public onTermsAndConditions(event:any): void
 {
     // console.log(event.target.checked);
        if(event.target.checked) {
          this.TermsAndConditions= true;
        }
      else{
        this.TermsAndConditions= false;
      }
 }

 public onPrivacyPolicy(event:any):void
 {
    //   console.log(event.target.checked);
        if(event.target.checked) {
          this.PrivacyPolicy = true;
        }
      else{
        this.PrivacyPolicy = false;
      }
 }
 
 public async Submit(event:any): Promise<void>
 {
      // return event.target.player.value;
      // console.log('This signin api was called');

     

      if(this.username=='' || this.username==null) {

        this.loadingService.setLoading(false);
        Swal.fire({
          title: '',
          text: "E-mail address is required",
          icon: 'warning',
          confirmButtonText: 'Ok'
        })
        return;
      }

      if(this.Password=='' || this.Password==null) {
       
        this.loadingService.setLoading(false);
        Swal.fire({
          title: '',
          text: "Password is required",
          icon: 'warning',
          confirmButtonText: 'Ok'
        })
        return;
      }

      if(this.ConfirmPassword=='' || this.ConfirmPassword==null) {
        this.loadingService.setLoading(false);
        Swal.fire({
          title: '',
          text: "Confirm Password is required",
          icon: 'warning',
          confirmButtonText: 'Ok'
        })
        return;
      }

      if(this.ConfirmPassword != this.Password) 
      {
            this.loadingService.setLoading(false);
            Swal.fire({
              title: '',
              text: "Passwords do not match.",
              icon: 'warning',
              confirmButtonText: 'Ok'
            })
            return;
      }

      if(this.TermsAndConditions==false) 
      {
            this.loadingService.setLoading(false);
            Swal.fire({
              title: '',
              text: "You must accept Terms And Conditions",
              icon: 'warning',
              confirmButtonText: 'Ok'
            })
            return;
      }

      if(this.PrivacyPolicy==false) 
      {
          this.loadingService.setLoading(false);
          Swal.fire({
            title: '',
            text: "You must accept privacy policy",
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
      }
      
      StaticData.properties = StaticData.properties;
      this.signUp = new RegisterUserDto();
      this.signUp.EmailAddress = this.username;
      this.signUp.Password = this.Password;
      this.signUp.ConfirmPassword = this.ConfirmPassword;
      this.signUp.PrivacyPolicy = this.PrivacyPolicy;
      this.signUp.TermAndConditions = this.TermsAndConditions;
      this.loadingService.setLoading(true);

       this.LapoLoanService.RegisterCustomerConnector(this.signUp).subscribe({
        next:(res)=>
        {
              this.loadingService.setLoading(false);
              this.SignInResponseData = res;
              if(this.SignInResponseData != null && this.SignInResponseData.isActive == true && this.SignInResponseData.isTwoFactorAuth == false)
              {
                      let messageTitle = "Your account has been successfully created";
                      let statusMessge = `An activation link has been sent to your e-mail @${this.signUp.EmailAddress}`;
                      let imageName = "messageSuccessImage.png";
                      this.route.navigate(['/appstatus'], { queryParams: {messageTitle : messageTitle, statusMessge : statusMessge, imageName : imageName , IsEmailExit : false  }});
                   
                      return;

                      // const Toast = Swal.mixin({
                      //   toast: true,
                      //   position: 'top-end',
                      //   showConfirmButton: false,
                      //   timer: 2000,
                      //   timerProgressBar: true,
                      //   didOpen: (toast) => {
                      //     toast.addEventListener('mouseenter', Swal.stopTimer)
                      //     toast.addEventListener('mouseleave', Swal.resumeTimer)
                      //   }
                      // })
                      
                      // Toast.fire({
                      //   icon: 'success',
                      //   title: this.SignInResponseData.tryCatchMessage
                      // })
                      
              }
              else if(this.SignInResponseData != null && this.SignInResponseData.isActive == true && this.SignInResponseData.isTwoFactorAuth == true)
              {
                      let messageTitle = "An error has occured";
                      let statusMessge = this.SignInResponseData.tryCatchMessage;
                      let imageName = "messageErrorImage.png";
                      this.route.navigate(['/appstatus'], { queryParams: {messageTitle : messageTitle, statusMessge : statusMessge, imageName : imageName , IsEmailExit : true }});
                   
                      return;
              }
              else
              {
                      Swal.fire({
                        title: 'Error!',
                        text: this.SignInResponseData.tryCatchMessage,
                        icon: 'error',
                        confirmButtonText: 'Ok'  });
                      return;
              }
      
              //  this.compidToSend.emit(this.quickBooksAuthRequestId);
              //  this.erpidToSend.emit(this.erpcompanyId);
              
              //  console.log('Showed Response')
              //  console.log(this.compidToSend)
              //  console.log(this.erpidToSend)
                
              // saves the incoming details from quick books and api to storage
              // localStorage.setItem('compId', this.compid);
              // localStorage.setItem('erpId', this.erpid)
              // this.cookieService.set( 'compId', this.quickBooksAuthRequestId );
              // this.cookieService.set( 'erpId', this.erpcompanyId );
              return;
        },
        error:(err:any)=>
        {
              StaticData.properties = StaticData.properties;
              // this.alertify.error('Error saving Connection...')
              this.loadingService.setLoading(false);
              Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

             return;
        }
      })
 }

  onCheckboxChange(event: any) 
  {
      
    //  const selectedCountries = (this.form.controls['selectedCountries'] as FormArray);
    //  if (event.target.checked) {
    // //   // selectedCountries.push(new FormControl(event.target.value));
    //  } else {
    //   const index = selectedCountries.controls
    //    .findIndex(x => x.value === event.target.value);
    //    selectedCountries.removeAt(index);
    // }
  }

}
