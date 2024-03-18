import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoanAppAccountModel } from '../ps.loan.Models/LoanAppAccountModel';
import { BvnRespondsDto } from '../ps.loan.Models/BvnRespondsDto';
import { AccountDetailsDto } from '../ps.loan.Models/AccountInfoDto';
import { BvnAuthDto } from '../ps.loan.Models/BvnAuthDto';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { DataSharedService } from '../ps.loan.Models/DataSharedService';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import { BvnCodeDto } from '../ps.loan.Models/BvnCodeDto';
import { BvnRequestDto } from '../ps.loan.Models/BvnRequestDto';
import { NumberValidator } from '../ps.loan.Models/NumberValidator';

@Component({
  selector: 'app-loan-bvn-app',
  templateUrl: './loan-bvn-app.component.html',
  styleUrls: ['./loan-bvn-app.component.css']
})

export class LoanbvnappComponent implements OnInit
{
  Username:string = "";
  ConfirmPassword:string = "";
  Password:string = "";
 
  message:string = "";
  BvnSend:any= false;
  BvnCodeTyped:any= false;
  BvnCode:string="";
  
  AcctId:string ="";
  bvn:string ="";
  code:string ="";
  crDate ="";
  expDate ="";
  gedDate:any ="";
  id:string ="";
  expired:boolean = false;
  TwoFactor:boolean = false;

  Code1:string = "";
  Code2:string = "";
  Code3:string = "";
  Code4:string = "";
  Code5:string = "";
  Code6:string = "";

  IsDisplayTimeCount:boolean = false;
  timeCount = "00:00";
  MaxtimeCount: any = 300;
  MintimeCount: any = 0;
  tim :any=0;
  IsStartTimer = false;
  TokenMessage:string="";
  ButtonCondition:any=false;
  BtnIsActive= false;

  CodeA1:any=false;
  CodeA2:any=false;
  CodeA3:any=false;
  CodeA4:any=false;
  CodeA5:any=false;
  CodeA6:any=false;

  ResponseData!: RespondMessageDto;
  accountLogin!: LoanAppAccountModel;
  BvnResponds !:BvnRespondsDto;
  acctDetails !:AccountDetailsDto;
  bvnAuth!: BvnAuthDto 

  BvnCode1:string="";

  public AllCustomerHasBlocked:boolean = true;
  public IsSessionActive:boolean = true;
  public StatusMessge!:string;
  public ImageName:string  = "Messagewarning.png";
  
  //BvnDetail : BvnDetails | undefined;
  @ViewChild('input1') inputEl1: ElementRef | undefined;
  @ViewChild('input2') inputEl2: ElementRef | undefined;
  @ViewChild('input3') inputEl3: ElementRef | undefined;
  @ViewChild('input4') inputEl4: ElementRef | undefined;
  @ViewChild('input5') inputEl5: ElementRef | undefined;
  @ViewChild('input6') inputEl6: ElementRef | undefined;

  constructor(private loadingService: LoaderService, private  shared: DataSharedService,private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanApiService) {

  }

  private IsKeyPast:boolean = false;
  public onPasteHandlers(code:any): void
  {
      if(code.length == 6)
      {
          this.IsKeyPast = true;
          let x = code;

          // console.log(x.substring(0, 1));

          this.Code1 = "";
          this.Code2 = "";
          this.Code3 = "";
          this.Code4 = "";
          this.Code5 = "";
          this.Code6 = "";

          console.log("Code", code);

          this.Code1 = x[0];
          this.Code2 = x[1];
          this.Code3 = x[2];
          this.Code4 = x[3];
          this.Code5 = x[4];
          this.Code6 = x[5];
          
          if(this.Code6.length >= 1 && this.IsKeyPast == true)
          {
            this.IsKeyPast = false;
            this.onContinue(event);
          }
          
          console.log("Code Paste", this.Code1, this.Code2, this.Code3,  this.Code4,   this.Code5,    this.Code6 );
        
          return;
      }

    return;
  }

  public keyupEventInputEl1(event: any):void
  {
    let bvn = event.target.value;

    if(event.target.value.length == 6)
    {
       this.onPasteHandlers(event.target.value);
       return;
    }
    
    if(event.target.value.length >=1 && this.IsKeyPast == false)
    {
      //this.Code1 = "";
      this.Code1 = bvn;
      this.Code2 = "";
      setTimeout(() => this.inputEl2?.nativeElement.focus());
    }

    if(event.target.value.length == 0)
    {
        this.Code1 = "";
        this.Code2 = "";
        this.Code3 = "";
        this.Code4 = "";
        this.Code5 = "";
        this.Code6 = "";
        return;
    }
    // console.log('keyup: '+ event.target.value);
  }

  public keyupEventInputEl2(event: any):void
  {
    let bvn = event.target.value;

    if(event.target.value.length >=1 && this.IsKeyPast == false)
    {
      this.Code2 = bvn;
      this.Code3 = "";
      setTimeout(() => this.inputEl3?.nativeElement.focus());
    }
   
    // console.log('keyup: '+ event.target.value);
  }

  public keyupEventInputEl3(event: any):void
  {
    let bvn = event.target.value;

    if(event.target.value.length >=1 && this.IsKeyPast == false)
    {
      this.Code3 = bvn;
       this.Code4 = "";
       setTimeout(() => this.inputEl4?.nativeElement.focus());
    }
  
    // console.log('keyup: '+ event.target.value);
  }

  public keyupEventInputEl4(event: any):void
  {
    let bvn = event.target.value;

    if(event.target.value.length >=1 && this.IsKeyPast == false)
    {
      this.Code4 = bvn;
      this.Code5 = "";
      setTimeout(() => this.inputEl5?.nativeElement.focus());
    }
   
    // console.log('keyup: '+ event.target.value);
  }

  public keyupEventInputEl5(event: any):void
  {
    let bvn = event.target.value;

    if(event.target.value.length >=1 && this.IsKeyPast == false)
    {
      this.Code5 = bvn;
      this.Code6 = "";
      setTimeout(() => this.inputEl6?.nativeElement.focus());
    }
   
   // console.log('keyup: '+ event.target.value);
  }

  public keyupEventInputEl6(event: any):void
  {
    let bvn = event.target.value;
    this.IsKeyPast = false;
    if(event.target.value.length >=1 && this.IsKeyPast == false)
    {
      this.Code6 = bvn;
      this.onContinue(event);
    }
     // console.log('keyup: '+ event.target.value);
  }

  public ChangeEventInputEl1(event: any):void
  {
     let bvn = event.target.value;
     if(event.target.value.length >=1 && this.IsKeyPast == true)
     {
      setTimeout(() => this.inputEl2?.nativeElement.focus());
     }
     return;
    // console.log('keyup: '+ event.target.value);
  }

  public ChangeEventInputEl2(event: any):void
  {
    let bvn = event.target.value;
    
     if(event.target.value.length >=1 && this.IsKeyPast == true)
     {
      setTimeout(() => this.inputEl3?.nativeElement.focus());
     }
     return;
    // console.log('keyup: '+ event.target.value);
  }

  public ChangeEventInputEl3(event: any):void
  {
    let bvn = event.target.value;
    
    if(event.target.value.length >=1 && this.IsKeyPast == true)
    {
      setTimeout(() => this.inputEl4?.nativeElement.focus());
    }
    return;
    // console.log('keyup: '+ event.target.value);
  }

  public ChangeEventInputEl4(event: any):void
  {
    let bvn = event.target.value;
   
    if(event.target.value.length >=1 && this.IsKeyPast == true)
    {
      setTimeout(() => this.inputEl5?.nativeElement.focus());
    }
    return;
    // console.log('keyup: '+ event.target.value);
  }

  public ChangeEventInputEl5(event: any):void
  {
    let bvn = event.target.value;

    if(event.target.value.length >=1 && this.IsKeyPast == true)
    {
      setTimeout(() => this.inputEl6?.nativeElement.focus());
    }
   // console.log('keyup: '+ event.target.value);
  }

  public ChangeEventInputEl6(event: any):void
  {
    let bvn = event.target.value;
    if(event.target.value.length >=1 && this.IsKeyPast == true)
    {
      this.IsKeyPast = false;
      this.onContinue(event);
    }
     // console.log('keyup: '+ event.target.value);
  }

   ngAfterViewInit(): void 
   {
      setTimeout(() => this.inputEl1?.nativeElement.focus()); 
   }

  public onAutoSignOut() : void
  { 
    window.setInterval(() => 
    {
      this.CheckSession();
     
    }, 100);
    return;
  } 
  
  async ngOnInit(): Promise<void>  
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



              await this.GetLoanSettings();
              let IsLoan = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
              let IsLoan11 = LocalStorageService.getLoginSessionIdentity(StaticData.LoanKeySession);
            
              if(IsLoan == StaticData.AppOnLoanAnswer || IsLoan11 == StaticData.LoanAppOnLoanAnswer)
              {
                  
              }
              else
              {
                 this.onNaviagateBack('/signin');
                 return;
              }

              LocalStorageService.setLoginSessionIdentity(StaticData.LoanAcctBankSession, StaticData.LoanAcctBankSession);
              LocalStorageService.setLoginSessionIdentity(StaticData.LoanReviewSession, StaticData.LoanReviewSession);
              LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);

              this.onAutoSignOut();
              this.CheckSession();

              this.accountLogin = new LoanAppAccountModel();
              this.router.queryParams
              .subscribe(params => {  this.accountLogin.Account = params['AccountId'];
                if(this.accountLogin.Account == undefined || this.accountLogin.Account == null || this.accountLogin.Account == '')
                {
                    this.onNaviagateBack('/signin');
                    return;
                }
                else
                {
                    this.FetchUserDetails(this.accountLogin.Account);
                }
              }
            );

       }
       catch(e)
       {
          this.onNaviagateBack('/signin');
          return;
       }
  }

  public onSignOut(event:any)
  {
    LocalStorageService.setLoginSessionIdentity(StaticData.DateLoginKeySession, StaticData.DateLoginKeySession);
    this.onSignOutSess();
    this.onNaviagateBack(event);
  }

  public onSignOutSess() : void
  {
    if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
    {
      LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
      LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);  
      // LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);  
    }
    else{
      LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
      LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);  
     // LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);  
    }
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

                    if(twofactor!=StaticData.TwoLoginKeySession)
                    {
                      this.onSignOut('/signin');
                      return true;
                    }

                    return false;
          }
          catch(e)
          {
              //console.log('Display: ' + e);
              this.onSignOut('/signin');
              return false;
          }
  }

  private  async FetchUserDetails(AccountId:string):Promise<void>
    {
          this.Username = '';
          this.loadingService.setLoading(true);
          await this.LapoLoanService.FetchAccountDetailsConnector(AccountId).subscribe({
            next:(res)=>{
              this.loadingService.setLoading(false);
              // console.log(res);
              this.ResponseData = res;
              // console.log( this.ResponseData);

              if(this.ResponseData!=null && this.ResponseData.isActive){
                
                this.acctDetails = new AccountDetailsDto();
                this.acctDetails.AccountId = this.ResponseData.dataLoad.accountId;
                this.acctDetails.AccountType = this.ResponseData.dataLoad.accountType;
                this.acctDetails.Address = this.ResponseData.dataLoad.address;
                
                this.acctDetails.Age = this.ResponseData.dataLoad.age;
                this.acctDetails.AltPhone = this.ResponseData.dataLoad.altPhone;
                this.acctDetails.CurrentAddress = this.ResponseData.dataLoad.currentAddress;
    
                this.acctDetails.Email = this.ResponseData.dataLoad.email;
                this.acctDetails.FirstName = this.ResponseData.dataLoad.firstName;
                this.acctDetails.Gender = this.ResponseData.dataLoad.gender;
    
                this.acctDetails.LastName = this.ResponseData.dataLoad.lastName;
                this.acctDetails.MiddleName = this.ResponseData.dataLoad.middleName;
                this.acctDetails.Phone = this.ResponseData.dataLoad.phone;
                return;
              }
              else{
                this.loadingService.setLoading(false);
                Swal.fire({
                  title: 'Error!',
                  text:  this.ResponseData.tryCatchMessage,
                  icon: 'error',
                  confirmButtonText: 'Ok'
                })
                return;
              }
              

              // console.log(  this.acctDetails.AccountType);
              // acctDetails = this.ResponseData.dataLoad as AccountDetailsDto;
              // this.sweetalert.timedNofication('Connection Saved Successfully...')
            
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
              this.loadingService.setLoading(false);
              Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });      
            }
          })

  }

  onNaviagateBack(page:string)
  {
    this.route.navigate([page]);
  }

  onStartTimeCountDown()
  {
      
      this.timeCount = "00:00";
      //  let countdown = window.setTimeout( () => {
          
      //     if(this.IsStartTimer){
      //       this.onTimeIncreased();
      //     }

      //     this.tim++;
      //   // console.log("poof!" + this.tim);

      //   }, 30000);

       window.setInterval(() => {
       
        if(this.IsStartTimer){
          this.onTimeIncreased();
        }

        this.tim++;
        //  console.log("poof!" + this.tim);

        }, 1500);

  }

  onTimeIncreased():void
  {
      let RemainCount = this.MaxtimeCount - this.tim;
      this.timeCount = RemainCount.toString();
      if(RemainCount == this.MintimeCount){
        this.onStopCount();
      }
  }

  onStopCount(): void 
  {
    
    this.tim=0;
    this.timeCount = "00:00";
    this. IsStartTimer = false;
    this. ButtonCondition = false;
    this. BtnIsActive = true;
    this.IsDisplayTimeCount = false;
    this.TokenMessage="Your time for login auth has expired, Pleae click the resend button to resend the code";
    this.BvnSend=false;
    this.BvnCodeTyped=false;
    this.Code1 = "";
    this.Code2 = "";
      this.Code3 = "";
    this.Code4 = "";
      this.Code5 = "";
    this.Code6 = "";
          
  }

  onRestartCount():void {
    this.tim = 0;
    this.timeCount = "00:00";
    this. IsStartTimer = true;
    this.TokenMessage="";
    this. ButtonCondition = false;
    this. BtnIsActive = false;
    this.onStartTimeCountDown();
  }

  onContinue(event:any)
  {
        this.loadingService.setLoading(true);
        if(this.Code1 == "" || this.Code2 == "" || this.Code3 == "" || this.Code4 == "" || this.Code5 == "" || this.Code6 == "")
        {
            // this.alertify.error('Error saving Connection...')
            this.message = "Enter the bvn OTP Code";
            Swal.fire({  title: 'Warning!', text:  this.message, icon: 'warning',  confirmButtonText: 'Ok'
            })
            return;
        }
        else{

          let code = this.Code1 +  this.Code2 +   this.Code3 +  this.Code4 +  this.Code5 +  this.Code6;
          let SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);

          let codeResult = new BvnCodeDto();
          codeResult.code= code;
         /// codeResult.AccoundId = SessionResult;

          this.LapoLoanService.VerifyBvnOtpCodeConnector(codeResult).subscribe({
            next:(res)=>{

              this.loadingService.setLoading(false);
             // console.log(res);
            // this.sweetalert.timedNofication('Connection Saved Successfully...')
          //  console.log(res);
            this.ResponseData = res;
           if(this.ResponseData != null && this.ResponseData.isActive)
           {
               StaticData.BvnDetail  = this.BvnResponds;
               StaticData.AcctDetail = this.acctDetails;
               StaticData.properties = StaticData.properties;

               // new BvnRespondsDto();
               // console.log(StaticData.AcctDetail.AccountId);
               // console.log(StaticData.BvnDetail.BVN);
               //  console.log(StaticData.BvnDetail.ResponseCode);

              //  let navigationExtras: NavigationExtras = {
              //   state: {
              //     BvnDetail: this.BvnResponds,
              //     AcctDetail: this.acctDetails
              //   },
              // };

              this.acctDetails.Phone = this.BvnResponds.PhoneNumber1;
              this.shared.setBvnData(this.BvnResponds)
              this.shared.setDetailData(this.acctDetails)
              this.shared.setPersonalDetails(this.acctDetails)

              LocalStorageService.setLoginSessionIdentity(StaticData.LoanAcctBankSession, StaticData.LoanAcctBankSession);
              LocalStorageService.setLoginSessionIdentity(StaticData.LoanReviewSession, StaticData.LoanReviewSession);
              LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);

              this.route.navigate(["/loanpersonaldetails"]);
              return;
           }
            else{

              this.Code1 = "";
              this. Code2 = "";
              this. Code3 = "";
              this. Code4 = "";
              this. Code5 = "";
              this. Code6 = "";
              this.inputEl1?.nativeElement.focus();
                this.message = this.ResponseData.tryCatchMessage;
                Swal.fire({
                  title: 'Error!',
                  text:  this.message,
                  icon: 'error',
                  confirmButtonText: 'Ok'
                })
                return;
            }
           
            },
            error:(err:any)=>{

              this.Code1 = "";
              this. Code2 = "";
              this. Code3 = "";
              this. Code4 = "";
              this. Code5 = "";
              this. Code6 = "";
              this.inputEl1?.nativeElement.focus();
              this.loadingService.setLoading(false);
                // this.alertify.error('Error saving Connection...')
              //  console.log(err);
                this.message = err.message;
                Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
                return ;
            }
          })
        }
  }

  public pasteEvent(event:any):void
  {
    let bvn = event.target.value;

    if(event.target.value.length >=11){
      if(this.IsProcessingBvn==false){
        this.IsProcessingBvn=true;
        this.GetVerifyBvn(event.target.value);
      }
    }
  }

  public keyupEvent(event: any)
  {
    let bvn = event.target.value;

    if(event.target.value.length >=11 ){
      if(this.IsProcessingBvn==false){
        this.IsProcessingBvn=true;
        this.GetVerifyBvn(event.target.value);
      }
    }
    
   // console.log('keyup: '+ event.target.value);
  }

  public changeEvent1(event:any):void
  {
    let bvn = event.target.value;
   // console.log('change: '+ event.target.value);
    if(event.target.value.length >=11){
      if(this.IsProcessingBvn==false){
        this.IsProcessingBvn=true;
        this.GetVerifyBvn(event.target.value);
      }
    }
  }

  public onTextChange6(event:any)
  {
    if(event.target.value.length >=11 )
    {
      if(this.IsProcessingBvn==false){
        this.IsProcessingBvn=true;
        this.GetVerifyBvn(event.target.value);
      }
    }
   // console.log('onTextChange6: '+ event.target.value);
  }

  private IsProcessingBvn = false;
  public otpmessage:string = "";
  private GetVerifyBvn(bvn:string): void
  {
      if(bvn == "" || this.BvnCode == null || bvn == undefined)
      {
          Swal.fire({
            title: 'Warning!',
            text:  "Provide 11 digit Bank Verification Number",
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
      }

    if(!NumberValidator.number(bvn))
    {
        Swal.fire({
          title: 'Warning!',
          text:  "Your BVN must be a number",
          icon: 'warning',
          confirmButtonText: 'Ok' });
        return;
    }

    if(this.acctDetails == undefined ||  this.accountLogin == undefined || this.accountLogin.Account == undefined || this.accountLogin.Account == null || this.accountLogin.Account == '')
    {
        this.onNaviagateBack('/signin');
        return;
    }
   
    let codeResult = new BvnCodeDto();
    let SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);

    this.BvnCode1 = bvn;
    var newBvn = new BvnRequestDto();
    newBvn.BvnRequest = bvn;
    newBvn.AcctId  = SessionResult;

    this.loadingService.setLoading(true);

    try
    {
      this.LapoLoanService.RequestBvnConnector(newBvn).subscribe({
        next:(res)=>
        {
              this.loadingService.setLoading(false); 
            //console.log(res);
            // this.sweetalert.timedNofication('Connection Saved Successfully...')
            this.IsProcessingBvn=false;
            this.ResponseData = res;
            if(this.ResponseData != null && this.ResponseData.isActive)
            {
                this.otpmessage =this.ResponseData.tryCatchMessage;
                this.BvnResponds = new BvnRespondsDto();
                this.BvnResponds.BVN = this.ResponseData.dataLoad.bvn;
                this.BvnResponds.DateOfBirth = this.ResponseData.dataLoad.dateOfBirth;
                this.BvnResponds.EnrollmentBank = this.ResponseData.dataLoad.enrollmentBank;
                this.BvnResponds.EnrollmentBranch = this.ResponseData.dataLoad.enrollmentBranch;
                this.BvnResponds.FirstName = this.ResponseData.dataLoad.firstName;
                this.BvnResponds.LastName = this.ResponseData.dataLoad.lastName;
                this.BvnResponds.MiddleName = this.ResponseData.dataLoad.middleName;
                this.BvnResponds.PhoneNumber1 = this.ResponseData.dataLoad.phoneNumber1;
                this.BvnResponds.RegistrationDate = this.ResponseData.dataLoad.registrationDate;
                this.BvnResponds.ResponseCode = this.ResponseData.dataLoad.responseCode;
                this.BvnResponds.WatchListed = this.ResponseData.dataLoad.watchListed;
                this.IsProcessingBvn = false;
                this.SendCode();
                this.BvnCode = "";
            }
            else
            {
                  this.BvnCode="";
                  this.loadingService.setLoading(false);
                  Swal.fire({
                    title: 'Error!',
                    text:  this.ResponseData.tryCatchMessage,
                    icon: 'error', confirmButtonText: 'Ok' });
                  this.IsProcessingBvn=false;
                  return;
            }
  
        },
        error:(err:any)=>
        {
          this.BvnCode="";
          this.IsProcessingBvn=false;
          this.loadingService.setLoading(false);
            this.message = err.message;                   
              Swal.fire({ title: 'Uh-oh!',  text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
              if (result.isConfirmed) { this.onSignOut('/signin'); return; } });
            return;
            }
      })
    }
    catch(exx:any)
    {
      this.BvnCode="";
      this.loadingService.setLoading(false);
      Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

      this.IsProcessingBvn=false;
      return;
    }
    
  }

  public onResendCode(event:any)
  {
    if(this.BvnCode.length >= 11)
    {
        this.GetVerifyBvn(this.BvnCode);
        return;
    }
    else  if(this.BvnCode1.length >= 11){
      this.GetVerifyBvn(this.BvnCode1);
      return;
     
    }
    
  }

  private  SendCode(): void
  {
                if(this.acctDetails == undefined || this.accountLogin == undefined || this.accountLogin.Account == undefined || this.accountLogin.Account == null || this.accountLogin.Account == '')
                {
                    this.onNaviagateBack('/signin');
                    return;
                }
               
                this.bvnAuth = new BvnAuthDto();
                this.bvnAuth.Phone = this.BvnResponds.PhoneNumber1;
                this.bvnAuth.AccountId = this.acctDetails.AccountId;
                this.bvnAuth.BVN = this.BvnResponds.BVN;
                this.bvnAuth.EmailAddress = this.acctDetails.Email;

      try
      {

        this.loadingService.setLoading(true);
        this.LapoLoanService.SendBvnAuthConnector(this.bvnAuth).subscribe({
        next:(res)=>{
      
          this.loadingService.setLoading(false);
          this.ResponseData = res;
          this.IsDisplayTimeCount = true;
  
          if(this.ResponseData != null && this.ResponseData.isActive)
          {
              this.onRestartCount();
              this.BvnSend = true;
              this.BvnCodeTyped = true;
              return;
        
          }
          else
          {
                this.TokenMessage = this.ResponseData.tryCatchMessage ?? "Error has occurred, check your internet connection and try again";
               
                this.loadingService.setLoading(false);
                Swal.fire({ title: 'Error!', text:  this.TokenMessage,  icon: 'error', confirmButtonText: 'Ok'  });
                return;
          }
        },
        error:(err:any)=>
        {
              this.loadingService.setLoading(false);
              this.TokenMessage = "An errror occured " + err.message ?? "Error has occurred, check your internet connection and try again";
            
 Swal.fire({ title: 'Uh-oh!',  text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
  if (result.isConfirmed) { this.onSignOut('/signin'); return; } });
return;
        }
        })
      }
      catch(error:any)
      {
              this.TokenMessage = "Error has occurred, check your internet connection and try again";
              this.loadingService.setLoading(false);
              Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
              return;
      }
  }
  
  public onPasteHandler(event:any): void
  {
    // if(event.target.value.length == 6)
    // {
    //    this.onPasteHandlers(event.target.value);
    //    return;
    // }
  }

  public async GetLoanSettings():Promise<void>
  {
        try
        {
             this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
           
             // console.log("Loan Settings 1: ", this.AcctId);
           
             if(this.AcctId  == ""  || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
             {
                 this.IsSessionActive = false;
                 return;
             }
            
              this.loadingService.setLoading(true);
              await this.LapoLoanService.GetLoanSettings(parseInt(this.AcctId)).subscribe({
              next:(res:any) =>
              {
                this.loadingService.setLoading(false);
                this.ResponseData = res;
                // console.log("Loan Settings: ", this.ResponseData);
                if(this.ResponseData != null && this.ResponseData.isActive)
                {
                    this.StatusMessge = this.ResponseData.dataLoad.message;
                    this.ImageName = "Messagewarning.png";
                    this.AllCustomerHasBlocked = this.ResponseData.dataLoad.isBlockLoanPortal;

                    if(this.AllCustomerHasBlocked)
                    {
                          this.onNaviagateBack('/apploannotices');
                          return;
                    }
                    
                    return;
                }
                else
                {
                      Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                      return;
                }
              },
              error:(err:any) =>
              {
                  this.loadingService.setLoading(false);
                  Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
                  return;
              }
            })
        }
        catch(error:any)
        {
            this.loadingService.setLoading(false);
            Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
            return;
        }
  }
}

