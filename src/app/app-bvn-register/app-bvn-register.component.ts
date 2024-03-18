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
  selector: 'app-app-bvn-register',
  templateUrl: './app-bvn-register.component.html',
  styleUrls: ['./app-bvn-register.component.css']
})
export class AppBvnRegisterComponent implements OnInit {

  
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

  Identification1:string="";

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

  AccountId:string="";
  EmailAddress:string="";

  constructor(private loadingService: LoaderService, private  shared: DataSharedService,private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanApiService) 
  {

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
          
          // console.log("Code Paste", this.Code1, this.Code2, this.Code3,  this.Code4,   this.Code5,    this.Code6 );
        
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
      
    }, 100);
    return;
  } 
  
  async ngOnInit(): Promise<void>  
  {
       try
       {

              LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
              LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);
              LocalStorageService.setLoginSessionIdentity(StaticData.LoanAcctBankSession, StaticData.LoanAcctBankSession);
              LocalStorageService.setLoginSessionIdentity(StaticData.LoanReviewSession, StaticData.LoanReviewSession);
              LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);

              this.onAutoSignOut();


              this.router.queryParams
              .subscribe(params => {  this.Identification1 = params['identification'];
                if(this.Identification1 == undefined || this.Identification1 == null || this.Identification1 == '')
                {
                    this.onNaviagateBack('/signin');
                    return;
                }

                this.CkeckEamilValidity(this.Identification1);
              }
            );
       }
       catch(e:any)
       {
          this.onNaviagateBack('/signin');
          return;
       }
  }
  
  public onSignOut(event:any):void
  {
    this.onNaviagateBack(event);
  }

  private onNaviagateBack(page:string):void
  {
       this.route.navigate([page]);
       return;
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

  public onContinue(event:any):void
  {
        this.loadingService.setLoading(true);
        if(this.Code1 == "" || this.Code2 == "" || this.Code3 == "" || this.Code4 == "" || this.Code5 == "" || this.Code6 == "")
        {
           this.loadingService.setLoading(false);
            this.message = "Enter the bvn OTP Code";
            Swal.fire({  title: 'Warning!', text:  this.message, icon: 'warning',  confirmButtonText: 'Ok'
            })
            return;
        }
        else if(this.BvnResponds.FirstName==null || this.BvnResponds.FirstName=="" || this.BvnResponds.FirstName==undefined || this.BvnResponds.LastName==null || this.BvnResponds.LastName=="" || this.BvnResponds.LastName==undefined )
        {
                   this.message = "We couldn't get the First and Last name from your bvn. Please try again";
                  Swal.fire({  title: 'Warning!', text:  this.message, icon: 'warning',  confirmButtonText: 'Ok'
                })
                return;
        }
        else if(this.BvnResponds==null|| this.BvnResponds==undefined|| this.BvnResponds.DateOfBirth==null || this.BvnResponds.DateOfBirth==undefined || this.BvnResponds.DateOfBirth==""|| this.BvnResponds.PhoneNumber1==null || this.BvnResponds.PhoneNumber1==undefined || this.BvnResponds.PhoneNumber1=="" ||   this.Identification1 == null || this.Identification1 == "" || this.Identification1 == undefined || this.BvnResponds.BVN == null || this.BvnResponds.BVN == undefined || this.BvnResponds.BVN == "")
        {
          this.loadingService.setLoading(false);
            this.onNaviagateBack('/signin');
            return;
        }
        else
        {
          let code = this.Code1 +  this.Code2 +   this.Code3 +  this.Code4 +  this.Code5 +  this.Code6;
          let SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);

          let codeResult = new BvnCodeDto();
          codeResult.code = code;

          this.LapoLoanService.VerifyBvnOtpCodeConnector(codeResult).subscribe({
            next:(res)=>
            {
                this.loadingService.setLoading(false);
                this.ResponseData = res;
                if(this.ResponseData != null && this.ResponseData.isActive)
                {
                    LocalStorageService.setLoginSessionIdentity(StaticData.LoanAcctBankSession, StaticData.LoanAcctBankSession);
                    LocalStorageService.setLoginSessionIdentity(StaticData.LoanReviewSession, StaticData.LoanReviewSession);
                    LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);
                    LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
                    
                    this.route.navigate(['/profileupdated'], { queryParams: { identification : this.Identification1, bvn: this.BvnResponds.BVN, PhoneNumber: this.BvnResponds.PhoneNumber1, DateOfBirth: this.BvnResponds.DateOfBirth, FirstName: this.BvnResponds.FirstName , LastName: this.BvnResponds.LastName}});
                    return;
                }
                 else
                 {

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
            error:(err:any) =>
            {

              this.loadingService.setLoading(false);
              this.Code1 = "";
              this. Code2 = "";
              this. Code3 = "";
              this. Code4 = "";
              this. Code5 = "";
              this. Code6 = "";
              this.inputEl1?.nativeElement.focus();
              this.loadingService.setLoading(false);
              
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
                if(this.Identification1 == undefined || this.Identification1 == null || this.Identification1 == '')
                {
                    this.onNaviagateBack('/signin');
                    return;
                }
   
    let codeResult = new BvnCodeDto();
   
    this.BvnCode1 = bvn;
    var newBvn = new BvnRequestDto();
    newBvn.BvnRequest = bvn;
    newBvn.AcctId  = this.Identification1;

    this.loadingService.setLoading(true);

    try
    {
        this.LapoLoanService.BvnSettledmentConnector(newBvn).subscribe({
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

                this.AccountId = this.ResponseData.dataLoad.accountId;
                this.EmailAddress =  this.ResponseData.dataLoad.emailAddress;

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
    else   if(this.BvnCode1.length >= 11)
    {
          this.GetVerifyBvn(this.BvnCode1);
          return;
    }
    
  }

  private  SendCode(): void
  {
                if( this.AccountId == null ||  this.AccountId == undefined || this.AccountId == "" ||   this.EmailAddress == null ||  this.EmailAddress == undefined || this.EmailAddress == "")
                {
                    this.onNaviagateBack('/signin');
                    return;
                }
               
      this.bvnAuth = new BvnAuthDto();
      this.bvnAuth.Phone = this.BvnResponds.PhoneNumber1;
      this.bvnAuth.AccountId = this.AccountId;
      this.bvnAuth.BVN = this.BvnResponds.BVN;
      this.bvnAuth.EmailAddress = this.EmailAddress;

      try
      {
        this.loadingService.setLoading(true);
        this.LapoLoanService.SendBvnAuthConnector(this.bvnAuth).subscribe({
        next:(res)=>{
      
          // console.log("poof! " + res);
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

              Swal.fire({ title: 'Uh-oh!',  text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
            if (result.isConfirmed) { this.onSignOut('/signin'); return; } });
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
  
  public onPasteHandler(event:any): void
  {
    // if(event.target.value.length == 6)
    // {
    //    this.onPasteHandlers(event.target.value);
    //    return;
    // }
  }

  private CkeckEamilValidity(email:string) : void
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
                        if (result.isConfirmed) { this.onSignOut('/signin'); return; } });
                      return;
                 }
               })
  }

}
