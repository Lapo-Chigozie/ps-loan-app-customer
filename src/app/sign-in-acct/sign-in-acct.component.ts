import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SignInPostDto } from '../ps.loan.Models/SignInPostDto';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { StaticData } from '../ps.loan.Models/StaticData';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { Compiler } from '@angular/core';

@Component({
  selector: 'app-sign-in-acct',
  templateUrl: './sign-in-acct.component.html',
  styleUrls: ['./sign-in-acct.component.css']
})

export class SignInAcctComponent implements OnInit
{
   @Output() compidToSend = new EventEmitter<any>()
   @Output() erpidToSend = new EventEmitter<any>()
  //  @ViewChild('UsernameInput') usernameInput!: ElementRef;
  //  @ViewChild('passwordInput') passwordInput!: ElementRef;
  //  @ViewChild('myCheckbox') myCheckbox: any;
 
   checkBoxValue: any = false;
   @Input() itm: SignInPostDto | undefined;
   @Input() itms: SignInPostDto[] = []; 
   list: any[] = [];

   public  Password: string = '';
   public  Username: string = '';
   public  Rememberme: boolean = false;
   testForm!: FormGroup;
   AcctLogDetails!: SignInPostDto;
   ResponseData!: RespondMessageDto;
   public login = new Login();
   public signin = new SignInPostDto();
   public typeSelected: string;
  //  private spinnerService: NgxSpinnerService,
  //private _compiler: Compiler,
   constructor(private _compiler: Compiler,private loadingService: LoaderService,private router: ActivatedRoute,  private route:Router, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService) {
      this.typeSelected = "ball-fussion";
   }

   public  async LoadProgressBarType()
   {
        //LoadSpinnerRound
        await this.LapoLoanService.GetLoadSpinnerLoadingConnector(StaticData.SpriningListStype.length - 1).subscribe({
          next:(res)=>{
           
                this.ResponseData = res;
                if( this.ResponseData != null && this.ResponseData.isActive){
                  this.typeSelected = this.ResponseData.dataLoad;
                }
                else{

                  Swal.fire({
                    title: 'Error!',
                    text: this.ResponseData.tryCatchMessage,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });

                }
    
          },
          error:(err:any)=>{
    
            Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
            return;
    
          }
        })
   }

   public onSignOut(page:any):void
   {
      LocalStorageService.setLoginSessionIdentity(StaticData.LoanAcctBankSession, StaticData.LoanAcctBankSession);
      LocalStorageService.setLoginSessionIdentity(StaticData.LoanReviewSession, StaticData.LoanReviewSession);
      LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);

      //  LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.AppOnLoan);
      LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
      LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
      this.route.navigate([page]);
    }

  public CheckSession(): boolean 
  {
          StaticData.propertie1 =  LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
          let SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
          // console.log("Session Result " + SessionResult);
          try
          {
                    if(SessionResult  != ""  && SessionResult  != undefined && SessionResult  != null && SessionResult  != StaticData.LoginKeySession)
                    {
                            StaticData.properties = StaticData.properties;

                            LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
                            return true;

                            // if(StaticData.propertie1 != StaticData.AppOnLoanAnswer)
                            // {
                            //     this.route.navigate(['/dashboard'], { queryParams: { AccountId : SessionResult }});
                            //     return true;
                            // }
                            // else if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
                            // {
                            //   this.route.navigate(['/loanbvnapp'], { queryParams: { AccountId : SessionResult  }});
                            //     return true;
                            // }
                    }

                    return false;
          }
          catch(e)
          {
              //console.log('Display: ' + e);
              this.onSignOut("/signin");
              return false;
          }
  }

   public ngOnInit(): void 
   {

       if(this._compiler != null)
       {
          this._compiler.clearCache();
       }

      //  this.testForm = this.formBuilder.group({
      //    Password: "",
      //    Username: "",
      //    Rememberme: "",
      //  });

      //  this.testForm.controls['Username'].setValue(8"JohnDel@example.com"); //here you can preset values if you wish.
       
      try
      {
            // this.router.queryParams
            //     .subscribe(params => {
            //       let IsLoanApp = params['IsLoanApp'];
            //       let appresult =   this.router.snapshot.paramMap.get('IsLoanApp');
            //      console.log("IsLoanApp  " + IsLoanApp + appresult);
            //       if(IsLoanApp != undefined &&  IsLoanApp == "false")
            //       {
            //         StaticData.properties = false;
            //          // this.onSignOutSess("");
            //       }
            //     });

        let Sesslog =  this.CheckSession();
       
         // let appresult =   this.router.snapshot.paramMap.get('IsLoanApp');
          // if(appresult == "false"){
             
          //  }
          // else{
          //    StaticData.properties = StaticData.properties;
          // }

        
      }
      catch(err){
        StaticData.properties = StaticData.properties;
      }

      this.ngOnInitCreateAccount();
      this.LoadProgressBarType();
    }

  async ngOnInitCreateAccount(): Promise<void> 
  {
    //  this.Username = '';
    
    await this.LapoLoanService.AutoCreateAccountConnector("sihsaihosaklsasskjsnsasasasas").subscribe({
      next:(res)=>{
       
        // console.log(res)
        
      // this.sweetalert.timedNofication('Connection Saved Successfully...')
      // this.SignInResponseData = res
      // this.route.navigate(['/login']);
      
      //  this.compidToSend.emit(this.quickBooksAuthRequestId);
      //  this.erpidToSend.emit(this.erpcompanyId);
       
      //  console.log('Showed Response')
      //  console.log(this.compidToSend)
      //  console.log(this.erpidToSend)
        
      // saves the incoming details from quick books and api to storage
      //  localStorage.setItem('compId', this.compid);
      //  localStorage.setItem('erpId', this.erpid)
      // this.cookieService.set( 'compId', this.quickBooksAuthRequestId );
      // this.cookieService.set( 'erpId', this.erpcompanyId );

      },
      error:(err:any)=>{

        // this.alertify.error('Error saving Connection...')

        Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

        return;

      }
    })
  }

  pushAllData()
  {
    this.list = [
      {
        id: 1,
        country: 'India',
        checked: true,
      },
      {
        id: 2,
        country: 'France',
        checked: false,
      },
      {
        id: 3,
        country: 'USA',
        checked: true,
      },
      {
        id: 4,
        country: 'Germany',
        checked: false,
      },
    ]
  }

  get result() {
    return this.list.filter(item => item.checked);
  }

  public async Submit(event: any): Promise<void>
  {
        // return event.target.player.value;
      // console.log('This signin api was called');
        const name = this.login.userName;
        const password=this.login.password;
      
        this.loadingService.setLoading(true);

        if(this.Username == '' || this.Username == null || this.Username == undefined) {

          this.loadingService.setLoading(false);
          Swal.fire({
          title: '',
            text: 'E-mail address is required',
          icon: 'warning',
            confirmButtonText: 'Ok'
          });

          return;
        }

        if(this.Password == '' || this.Password == null || this.Password == undefined) {
      
          this.loadingService.setLoading(false);
          Swal.fire({
            title: '',
            text: 'Password is required',
            icon: 'warning',
            confirmButtonText: 'Ok'
          });
          return;
        }

        if(this.Rememberme){
        
        }

        StaticData.properties = StaticData.properties;

        this.signin = new SignInPostDto();
        this.signin.EmailAddress = this.Username;
        this.signin.Password = this.Password;
        this.signin.RememberMe = this.Rememberme;

        this.LapoLoanService.SignInConnector(this.signin).subscribe({
          next:(res)=>{

          this.loadingService.setLoading(false);
          this.ResponseData = res;
         // console.log( res.dataLoad);
          if(this.ResponseData != undefined && this.ResponseData != null && this.ResponseData.isActive &&   this.ResponseData.dataLoad.isTwoFactorAuth !=null  && this.ResponseData.dataLoad.isTwoFactorAuth)
          {

              let today = new Date();
              let DateSet = today.getMonth() + "/" + today.getDay() + "/" + today.getFullYear();
              // let TimeSet = "12/31/" + today.getFullYear() + " 11:59:00 PM";
              LocalStorageService.setLoginSessionIdentity(StaticData.DateLoginKeySession, DateSet);

              LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, res.dataLoad.accountId);
              LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, this.Username);
              LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, res.dataLoad.accountId);
              StaticData.properties = StaticData.properties;
              // this.router.navigate(['/structure/profile']);
              // this.route.navigate(['/structure/profile', res.dataLoad.accountId],{ state: { example: 'emp_no' } });
                this.route.navigate(['/twofactorauth'],  { queryParams: {
                  AcctId : res.dataLoad.accountId, 
                  bvn:res.dataLoad.bvnVerification,
                  code:"SDARERTWW",
                  crDate:res.dataLoad.createdDate,
                  expDate:res.dataLoad.expiredDateTime,
                  gedDate:res.dataLoad.genaratedDateTime,
                  id:res.dataLoad.id,
                  expired:res.dataLoad.isActivexpired,
                  TwoFactor:res.dataLoad.isTwoFactorAuth , page: '/signin'}} );
                  return;
          
                //res.dataLoad.code
                // this.route.navigate( ['twofactorauth'], {queryParams:{order:’popular’,’price-range’:’expensive’’}} );  }
            
                //const { redirect } = window.history.state;
                // this.route.navigateByUrl(redirect || '/');

                //this.route.navigate(['twofactorauth']);
                // this.route.navigateByUrl('/twofactorauth', { state: { redirect: url } });
          }
          else if(this.ResponseData != null && this.ResponseData.isActive && this.ResponseData.dataLoad.allowLoginTwoFactor != null  &&  this.ResponseData.dataLoad.allowLoginTwoFactor != undefined  && this.ResponseData.dataLoad.allowLoginTwoFactor==false)
          {

              let today = new Date();
              let DateSet = today.getMonth() + "/" + today.getDay() + "/" + today.getFullYear();
              // let TimeSet = "12/31/" + today.getFullYear() + " 11:59:00 PM";
              LocalStorageService.setLoginSessionIdentity(StaticData.DateLoginKeySession, DateSet);

              StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
              LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession );
              if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
              {
                  LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, this.Username);
                  LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, res.dataLoad.id );
                  StaticData.properties = StaticData.properties;
                  this.route.navigate(['/loanbvnapp'], { queryParams: { AccountId : res.dataLoad.id  }});
                  return;          
              }
              else
              {
                  LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, this.Username);
                  LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, res.dataLoad.id);
                  StaticData.properties = StaticData.properties;
                  this.route.navigate(['/dashboard'], { queryParams: { AccountId : res.dataLoad.id }});
                  return;
                }
                return;
          }
          else{
            
              StaticData.properties = StaticData.properties;
              Swal.fire({  title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok'}).then((result) => {if (result.isConfirmed) {  this.onSignOut('/signin'); return; }});
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
    
          },
          error:(err:any)=>{

            this.loadingService.setLoading(false);
            StaticData.properties = StaticData.properties;
            Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

            return;
            // this.alertify.error('Error saving Connection...')
          }
        })
  }

  changeCheckbox(event: any) {
    console.log(event.target);
    if (event.target.checked) {
      this.Rememberme = true;
      event.value = 'true';
      //   // selectedCountries.push(new FormControl(event.target.value));
      } else {
        this.Rememberme = false;
        event.value = 'false';
      }
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

  public onChange(optionValue : any)
  {
      // console.log(`selected`, optionValue.value)
  }

  public change(event: any) 
  {
      console.log(event.target.value);
  }

  onchecked(event: any)
  {
      console.log(event.target.checked)
  }

  blurEvent(event: any)
  {
      // this.myusername = event.target.value;
  }

  //  public showSpinner(): void {
  //   this.spinnerService.show();

  // }

  // public hideSpinner(): void {
  //   setTimeout(() => {
  //     this.spinnerService.hide();
  //   }, 5000); // 5 seconds
  // }

  // public AcctNumberkeyPress(event: any) 
  // {
  //         const pattern = ^-?[0-9]\\d*(\\.\\d{1,2})?$';
  //         // const pattern = [0-9\]/;
  //         // [0-9\]/;
  //         // event.keyCode != 8 &&
  //         // let inputChar = String.fromCharCode(event.target.value);
  //         // pattern.test(inputChar)
  //         //  Validators.pattern(pattern)
  //         if(Validators.pattern(pattern)) 
  //         {
  //            alert("Hhhhh!!! ----- iiii");
  //            event.preventDefault();
  //         }
  // }
}

export class Login 
{
    public userName: string="";
    public password: string="";
}
