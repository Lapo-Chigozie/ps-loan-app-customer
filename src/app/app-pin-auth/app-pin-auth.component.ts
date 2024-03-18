import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SignInPostDto } from '../ps.loan.Models/SignInPostDto';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StaticData } from '../ps.loan.Models/StaticData';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-app-pin-auth',
  templateUrl: './app-pin-auth.component.html',
  styleUrls: ['./app-pin-auth.component.css']
})
export class AppPinAuthComponent implements OnInit {

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
  constructor(private loadingService: LoaderService,private router: ActivatedRoute,  private route:Router, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService) {
     this.typeSelected = "ball-fussion";
  }

  public  async LoadProgressBarType(): Promise<void>
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
         error:(err)=>{
   
           Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
           return;
   
         }
       })
  }

  public onSignOut(page:any):void
  {
     LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, StaticData.AccountEmailSession);
     LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
     LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
     this.route.navigate([page]);
 }

 public CheckSession():boolean 
 {
         //LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
         let SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
         // console.log("Session Result " + SessionResult);
 
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

   ngOnInit(): void 
   {
     //  this.testForm = this.formBuilder.group({
     //    Password: "",
     //    Username: "",
     //    Rememberme: "",
     //  });

     //  this.testForm.controls['Username'].setValue(8"JohnDel@example.com"); //here you can preset values if you wish.
      
     try{
       
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

           this.Username =  LocalStorageService.getLoginSessionIdentity(StaticData.AccountEmailSession);
           if(this.Username == StaticData.AccountEmailSession)
           {
               this.onSignOut("/signin");
           }

           let apploan =  LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
           if(apploan != StaticData.AppOnLoanAnswer)
           {
               this.onSignOut("/signin");
           }

         ///  let Sesslog =  this.CheckSession();
      
        // let appresult =   this.router.snapshot.paramMap.get('IsLoanApp');
         // if(appresult == "false"){
            
         //  }
         // else{
         //    StaticData.properties = StaticData.properties;
         // }

         this.ngOnInitCreateAccount();
         this.LoadProgressBarType();

     }
     catch(err:any)
     {
       this.onSignOut("/signin");
       StaticData.properties = StaticData.properties;
       return;
     }
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
       error:(err)=>{

         // this.alertify.error('Error saving Connection...')

         Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
           return;

       }
     })
   }

     async Submit(event: any):Promise<void>
     {
           // return event.target.player.value;
       
           this.loadingService.setLoading(true);

           if(this.Username == '' || this.Username == null || this.Username == undefined) {

             this.loadingService.setLoading(false);
             Swal.fire({ title: 'Warning!', text: 'Username or email address is required',   icon: 'warning',  confirmButtonText: 'Ok' });
             return;
           }

           if(this.Password == '' || this.Password == null || this.Password == undefined) {
         
             this.loadingService.setLoading(false);
             Swal.fire({ title: 'Warning!',  text: 'Password is required', icon: 'warning',  confirmButtonText: 'Ok' });
             return;
           }

           if(this.Rememberme)
           {
           
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
             //  console.log(res.dataLoad);
             if(this.ResponseData != undefined && this.ResponseData != null && this.ResponseData.isActive)
             {
                 StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan );
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
                 Swal.fire({ title: 'Warning!',  text: this.ResponseData.tryCatchMessage,  icon: 'warning', confirmButtonText: 'Ok'  }).then((result) => {
                   if (result.isConfirmed) {   return; }});
                   return;
             }
             
             },
             error:(err:any)=>{

               this.loadingService.setLoading(false);
               StaticData.properties = StaticData.properties;
               Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
               return;
               // this.alertify.error('Error saving Connection...')
             }
           })
     }

     changeCheckbox(event: any):void {
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

     public onChange(optionValue : any)
     {
         // console.log(`selected`, optionValue.value)
     }

     public change(event: any) :void
     {
         // console.log(event.target.value);
     }

     onchecked(event: any){
       console.log(event.target.checked)
     }

     blurEvent(event: any)
     {
         // this.myusername = event.target.value;
     }

}

export class Login 
{
 public userName: string="";
 public password: string="";
}