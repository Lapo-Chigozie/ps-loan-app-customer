import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoanAppAccountModel } from '../ps.loan.Models/LoanAppAccountModel';
import { BvnRespondsDto } from '../ps.loan.Models/BvnRespondsDto';
import { AccountDetailsDto } from '../ps.loan.Models/AccountInfoDto';
import { BvnAuthDto } from '../ps.loan.Models/BvnAuthDto';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { FormBuilder } from '@angular/forms';
import { StaticData } from '../ps.loan.Models/StaticData';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import Swal from 'sweetalert2';


import {  NavigationCancel, NavigationEnd, NavigationError, NavigationSkipped, NavigationStart } from '@angular/router';




@Component({
  selector: 'app-app-header-views',
  templateUrl: './app-header-views.component.html',
  styleUrls: ['./app-header-views.component.css']
})
export class AppHeaderViewsComponent implements OnInit {

  public showApply: boolean = true;
  public showSignIn: boolean = false;
  public showsignup: boolean = true;
  public IsSign: boolean = false;

  public ShowSignOut:boolean   = false;
  public SessionResult :any;

  public title = 'LapoLoan Clients';
  public href: string = "";
  public ShowRouteLet: boolean = false;
  public ShowAdminRouteLet: boolean = false;
  private AppId:any;

 
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
  MaxtimeCount: any = 200;
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
  bvnAuth!: BvnAuthDto ;

  ProfileName!:any;
  //@ViewChild('goUp', {static: false}) contentPage2: ElementRef | undefined;

  @ViewChild('goUp', { static: true }) contentPage: ElementRef | undefined;
 
  constructor(private loadingService: LoaderService,private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService) { }

  ngAfterViewInit(): void 
  { 
      this.showUp();
  }

  private showUp(): void {
   // this.contentPage2?.nativeElement.scrollTo( -0, -0 );
     // this.contentPage?.nativeElement.scrollIntoView();
     window.scroll(0,0);
  }

  public  ngOnInit() :void
  {
    // this.DisplayFrontViews(this.router.url, this.router.url);

    StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
    this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
    StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
    this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
    this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
    StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
    this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
    StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
    this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
    StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
    this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
    StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
    this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
    StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
    StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
    this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
    StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
    this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);

    this.showSignIn = false;
    this.showsignup = true;
    StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan)
    if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
    {
        this.showApply = false;
        this.showsignup = false;
        this.showSignIn = false;
        this.showApply = false;
        StaticData.properties = true;

       this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
       if(this.SessionResult  == "" || this.SessionResult  == undefined || this.SessionResult  == null || this.SessionResult  == StaticData.LoginKeySession)
       {
              this.showSignIn = true;
              this.showsignup = false;
              this.IsSign=false;

              if(this.router.url.includes("/signin") || this.router.url.includes("/signin"))
              {
                  this.showSignIn = false;
                  this.showsignup = true;
              }
       }
        else
        {
                this.IsSign=true;
                this.showsignup = false;
                this.showSignIn = false;
        }

       if(this.router.url.includes("/home") || this.router.url.includes("/Home"))
       {
            this.showApply = true;
       }

       if(this.router.url.includes("/apppasswordreststatus") || this.router.url.includes("/appstatus") || this.router.url.includes("/forgetpwrd") || this.router.url.includes("/forgetpwrd2") || this.router.url.includes("/forgetpwrd2"))
       {
          this.showSignIn = true;
          this.showsignup = false;
       }

       if(this.router.url.includes("/appstatus") || this.router.url.includes("/emailaccountverify"))
       {
          this.showsignup = false;
          this.showSignIn = true;
          this.showApply=false;
          this.IsSign = false;
       }
    }
    else
    {
        this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
          if(this.SessionResult  == "" || this.SessionResult  == undefined || this.SessionResult  == null || this.SessionResult  == StaticData.LoginKeySession)
          {
            this.showSignIn = false;
            this.showsignup = true;
            this.IsSign=false;

            if(this.router.url.includes("/signin") || this.router.url.includes("/signin"))
            {
              this.showSignIn = false;
              this.showsignup = true;
            }
          }
        else
        {
          this.IsSign=true;
          this.showsignup = false;
          this.showSignIn = false;
        }

        if(this.router.url.includes("/apppasswordreststatus") || this.router.url.includes("/appstatus") || this.router.url.includes("/forgetpwrd") || this.router.url.includes("/forgetpwrd2") || this.router.url.includes("/forgetpwrd")){
          this.showSignIn = true;
          this.showsignup = false;
        }

        if(this.router.url.includes("/appstatus") || this.router.url.includes("/emailaccountverify"))
        {
           this.showsignup = false;
           this.showSignIn = true;
           this.showApply=false;
           this.IsSign = false;
        }

        StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan)
        if(StaticData.propertie1 != StaticData.AppOnLoanAnswer)
        {
            this.showApply = true;
        }

    }

    this.DisplayFrontView();
     // this.DisplayFrontViews(this.router.url, this.router.url);
    this.SignInApplication();
  }

  public clickSignInLink(event:any)
  {
       this.onSignOutSess999(event);
       StaticData.SignOutClient(this.router, "/signin");
       return;
  }

  public onSignOutSess999(page:any) : void
  {
    LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, StaticData.AccountEmailSession);
    StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
      if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
      {
        LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
        LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);  
        // LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);  
      }
      else
      {
        LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
        LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);  
       // LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);  
      }
      
      StaticData.SignOutClient(this.router, "/signin");
  }

  public RemoveSessionLoan1() : void
  {
      StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan)
      if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
      {
         LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);
         this.reloadPage();  
      }
      else{
        
      }
  }

  private reloadPage() :void
  {
    setTimeout(()=>{
      window.location.reload();
    }, 100);
    return;
  }

  private async DisplayFrontViews(url:any, url1:any):Promise<void> {
    try
    {

      // this.router.events.forEach(async (event) => {

      // let event1 = event as NavigationStart;
       // console.log(event1.url.includes); 
      //  console.log(StaticData.propertie1); 
     
       
        if(url.includes("/signin")){
         this.showsignup = true;
         this.showSignIn = false;
         this.showApply=true;
        }

          if(url.includes("/appstatus")){
          this.showsignup = false;
          this.showSignIn = false;
          this.showApply=false;
         }
        

        if(url.includes("/apppinauthentication"))
        {
           this.showsignup = false;
           this.showSignIn = true;
           this.showApply=true;
           this.IsSign = false;

            StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
           if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
           {
               this.showSignIn = false;
               this.IsSign = false;
               this.showApply = false;
            }

           this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
           if(this.SessionResult  != "" || this.SessionResult  != undefined || this.SessionResult  != null || this.SessionResult  != StaticData.LoginKeySession)
           {
              this.IsSign = true;
              this.showSignIn = false;
           }
        }
       
      // if (event instanceof NavigationStart || event instanceof NavigationSkipped || event instanceof NavigationError || event instanceof NavigationCancel || event instanceof NavigationEnd) 
      // {
         
       //  console.log( this.SessionResult);
         if(url.includes('/loanbvnapp;IsLoanApp=true')|| url.includes('/loanbvnapp?IsLoanApp=true'))
         {
           
            LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoanAnswer);
            this.showUp();
            this.reloadPage();
         }

         if(url.includes('/signin?IsLoanApp=false') || url.includes('/signup;IsLoanApp=false'))
         {
             this.showsignup = false;
             this.showSignIn = false;
              this.showUp();
              this.RemoveSessionLoan1();

         }
        
         // console.log("Dat-Big-O " + this.acctDetails  + "-" + StaticData.propertie1); 
         // console.log("Dat-Big " + this.acctDetails  + "-" + this.SessionResult); 
         // console.log("loan app details " + event.url); 
        
         if(url.includes("/apploanapplicationStatus") || url.includes("/loanappdetails") || url.includes("/apploanreview")   || url.includes("/loanbvnapp") || url.includes("/loanpersonaldetails"))
         {
             this.showUp();
             this.IsSign = false;
             let ResultQ =  await this.LoadSessionInit();
            // console.log("loan app SECOND " + ResultQ); 
            this.showsignup = false;
            

             StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
             if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
             {
                 this.showSignIn = false;
                 this.IsSign = false;
                 this.showApply = false;
              }

             this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
             if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
             {
                this.IsSign = true;
                this.showSignIn = false;
                this.showsignup = false;
             }

      }
         //|| event.url.includes('/signin?IsLoanApp=false') || event.url.includes('/signup;IsLoanApp=false')
       else  if(url.includes("/appstatus") ||  url.includes("/forgetpwrd") || url.includes("/apppasswordreststatus") || url.includes("/forgetpwrd2") )
         {
           this.showUp();
          
           this.showsignup = false;
           this.showSignIn = true;
           this.IsSign = false;
           this.showApply = true;
         
           StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
           if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
           {
               this.showSignIn = false;
               this.IsSign = false;
               this.showApply = false;
            }

           this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
           if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
           {
              this.IsSign = true;
              this.showSignIn = false;
              this.showsignup = false;
           }
          
         }
         else  if(url.includes("/signin") )
         {
           this.showUp();
           let Sesslog = await this.CheckSession();
           if(Sesslog === 1 && this.SessionResult != undefined){
           
             // this.onNaviagateBack('/signup');
           }

           this.showsignup = true;
           this.showSignIn = false;
           this.IsSign = false;
           this.showApply = true;
           StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
           if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
           {
               this.showSignIn = false;
               this.IsSign = false;
               this.showApply = false;
            }

           this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
           if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
           {
              this.IsSign = true;
              this.showSignIn = false;
              this.showsignup = false;
           }

           /// this.reloadPage();
         }
         else  if( url.includes("/apppinauthentication"))
         {
              this.showUp();
              let Sesslog = await this.CheckSession();
              if(Sesslog === 1 && this.SessionResult != undefined){
              
                // this.onNaviagateBack('/signup');
              }

              this.showsignup = false;
              this.showSignIn = true;
              this.IsSign = false;
              this.showApply = true;
              StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
              if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
              {
                  this.showSignIn = false;
                  this.IsSign = false;
                  this.showApply = false;
              }

              this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
              if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
              {
                  this.IsSign = true;
                  this.showSignIn = false;
                  this.showsignup = false;
              }
         }
         else if(url.includes('/signup'))
         {
             this.showUp();
             let Sesslog = await this.CheckSession();
             if(Sesslog === 1 && this.SessionResult != undefined)
             {
                 // this.onNaviagateBack('/signup');
             }

             this.IsSign = false;
             this.showsignup = false;
             this.showSignIn = true;
             this.showApply = true;
             StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
             if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
             {
                 this.showSignIn = false;
                 this.IsSign = false;
                 this.showApply = false;
              }

             this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
             if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
             {
                this.IsSign = true;
                this.showSignIn = false;
                this.showsignup = false;
             }
          }
          else  if(url.includes('/twofactorauth'))
          {
             // let Sesslog = await this.CheckSession();
             // if(Sesslog === 1){
             //   this.onSignOut("/signin");
             // }
              this.showUp();
              this.IsSign = false;
              this.showsignup = true;
              this.showSignIn = false;
              this.showApply = true;
              StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
             if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
             {
                 this.showSignIn = false;
                 this.IsSign = false;
                 this.showApply = false;
             }
             
             this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
             if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
             {
               this.IsSign = true;
               this.showSignIn = false;
               this.showsignup = false;
             }
           }
          else if(url.includes('/Home'))
          {
             this.showUp();
             let Sesslog = await this.CheckSession();
             if(Sesslog === 1){
               this.onNaviagateBack('/Home');
             }

              this.IsSign = false;
              this.showsignup = false;
              this.showSignIn = true;
              this.showApply = true;
              StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
               if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
               {
                   this.showSignIn = true;
                   this.IsSign = false;
                   this.showApply = true;
               }

               this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
               if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
               {
                 this.IsSign = true;
                 this.showSignIn = false;
                 this.showsignup = false;
               }
               else{
                 this.showSignIn = true;
               }
           }   
           else
           {
                this.showUp();
                // let Sesslog = await this.CheckSession();

           
                //   this.showApply = true;
                //   StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
                //  if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
                //  {
                //      this.showSignIn = false;
                //      this.IsSign = false;
                //      this.showApply = false;
                //   }

                //  this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
                //  if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
                //  {
                //     this.IsSign = true;
                //     this.showSignIn = false;
                //     this.showsignup = false;
                //  }

            
           } 
     //  }
    // });

     this.showUp();
    }
    catch(ex)
    {
        StaticData.SignOutClient1(this.router, "/signin");
        return;
    }
}

  private DisplayFrontView():void 
  {
       try
       {

          this.router.events.forEach(async (event) => {

          let event1 = event as NavigationStart;
          // console.log(event1.url.includes); 
         //  console.log(StaticData.propertie1); 
        
           if(event1.url.includes("/signin"))
           {
                this.showsignup = true;
                this.showSignIn = false;
                this.showApply=false;
           }

           if(event1.url.includes("/signin"))
           {
                this.showsignup = true;
                this.showSignIn = false;
                this.showApply=true;
           }

           if(event1.url.includes("/apppinauthentication"))
           {
              this.showsignup = false;
              this.showSignIn = true;
              this.showApply=true;
              this.IsSign = false;

            
              if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
              {
                  this.showSignIn = false;
                  this.IsSign = false;
                  this.showApply = false;
               }

           
              if(this.SessionResult  != "" || this.SessionResult  != undefined || this.SessionResult  != null || this.SessionResult  != StaticData.LoginKeySession)
              {
                 this.IsSign = true;
                 this.showSignIn = false;
              }
           }
          
          if (event instanceof NavigationStart || event instanceof NavigationSkipped || event instanceof NavigationError || event instanceof NavigationCancel || event instanceof NavigationEnd) 
          {
            
                if(event.url.includes('/loanbvnapp;IsLoanApp=true')|| event.url.includes('/loanbvnapp?IsLoanApp=true'))
                {
                    LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoanAnswer);
                    this.showUp();
                    this.reloadPage();
                }

                if(event.url.includes('/signin?IsLoanApp=false') || event.url.includes('/signup;IsLoanApp=false'))
                {
                      this.showsignup = false;
                      this.showSignIn = false;
                      this.showUp();
                   // this.RemoveSessionLoan();
                }
           
            // console.log("Dat-Big-O " + this.acctDetails  + "-" + StaticData.propertie1); 
            // console.log("Dat-Big " + this.acctDetails  + "-" + this.SessionResult); 
            // console.log("loan app details " + event.url); 
           
            if(event.url.includes("/apploanapplicationStatus") || event.url.includes("/loanappdetails") || event.url.includes("/apploanreview")   || event.url.includes("/loanbvnapp") || event.url.includes("/loanpersonaldetails"))
            {
                this.showUp();
                this.IsSign = false;
                let ResultQ =  await this.LoadSessionInit();
                this.showsignup = false;
                              
                if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
                {
                    this.showSignIn = false;
                    this.IsSign = true;
                    this.showApply = false;
                }
  
                if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
                {
                   this.IsSign = true;
                   this.showSignIn = false;
                   this.showsignup = false;
                } 
            }
            //|| event.url.includes('/signin?IsLoanApp=false') || event.url.includes('/signup;IsLoanApp=false')
            else  if(event.url.includes("/appstatus") ||  event.url.includes("/forgetpwrd") || event.url.includes("/apppasswordreststatus") || event.url.includes("/forgetpwrd2") )
            {
                this.showUp();
                this.showsignup = false;
                this.showSignIn = true;
                this.IsSign = false;
                this.showApply = true;
            
                if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
                {
                    this.showSignIn = true;
                    this.IsSign = false;
                    this.showApply = false;
                }

                if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
                {
                    this.IsSign = true;
                    this.showSignIn = false;
                    this.showsignup = false;
                }
             
            }
            else  if(event.url.includes("/signin") )
            {
                this.showUp();
                let Sesslog = await this.CheckSession();
                if(Sesslog == 1 && this.SessionResult != undefined){
                
                  // this.onNaviagateBack('/signup');
                }

                this.showsignup = true;
                this.showSignIn = false;
                this.IsSign = false;
                this.showApply = true;
            
              if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
              {
                  this.showSignIn = false;
                  this.IsSign = false;
                  this.showApply = false;
               }

          
              if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
              {
                 this.IsSign = true;
                 this.showSignIn = false;
                 this.showsignup = false;
              }

              /// this.reloadPage();
            }
            else  if( event.url.includes("/apppinauthentication"))
            {
              this.showUp();
              let Sesslog = await this.CheckSession();
              if(Sesslog == 1 && this.SessionResult != undefined)
              {
                // this.onNaviagateBack('/signup');
              }

              this.showsignup = false;
              this.showSignIn = true;
              this.IsSign = false;
              this.showApply = true;
          
              if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
              {
                  this.showSignIn = false;
                  this.IsSign = false;
                  this.showApply = false;
               }

              if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
              {
                 this.IsSign = true;
                 this.showSignIn = false;
                 this.showsignup = false;
              }
            }
            else if(event.url.includes('/signup'))
            {
                this.showUp();
                let Sesslog = await this.CheckSession();
                if(Sesslog == 1 && this.SessionResult != undefined)
                {
                    // this.onNaviagateBack('/signup');
                }

                this.IsSign = false;
                this.showsignup = false;
                this.showSignIn = true;
                this.showApply = true;
              
                if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
                {
                    this.showSignIn = false;
                    this.IsSign = false;
                    this.showApply = false;
                 }
  
           
                if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
                {
                   this.IsSign = true;
                   this.showSignIn = false;
                   this.showsignup = false;
                }
             }
             else  if(event.url.includes('/twofactorauth'))
             {
                // let Sesslog = await this.CheckSession();
                // if(Sesslog === 1){
                //   this.onSignOut("/signin");
                // }
                this.showUp();
                 this.IsSign = false;
                 this.showsignup = true;
                 this.showSignIn = false;
                 this.showApply = true;
             
                if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
                {
                    this.showSignIn = false;
                    this.IsSign = false;
                    this.showApply = false;
                }

            
                if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
                {
                  this.IsSign = false;
                  this.showSignIn = false;
                  this.showsignup = true;
                }
                
              }
             else if(event.url.includes('/Home'))
             {
                this.showUp();
                let Sesslog = await this.CheckSession();
                if(Sesslog == 1){
                  this.onNaviagateBack('/Home');
                }

                 this.IsSign = false;
                 this.showsignup = true;
                 this.showSignIn = false;
                 this.showApply = true;
             
                  if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
                  {
                      this.showSignIn = false;
                      this.showsignup = true;
                      this.IsSign = false;
                      this.showApply = true;
                  }

                
                  if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
                  {
                    this.IsSign = true;
                    this.showSignIn = false;
                    this.showsignup = false;
                  }
                  else
                  {
                    this.showSignIn = false;
                  }
              }   
              else
              {
                  this.showUp();
                  // let Sesslog = await this.CheckSession();
                  //  this.showApply = true;
             
                  if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
                  {
                      this.showSignIn = false;
                      this.IsSign = false;
                      this.showApply = false;
                  }

                  if(this.SessionResult  != "" && this.SessionResult  != undefined && this.SessionResult  != null && this.SessionResult  != StaticData.LoginKeySession)
                  {
                    this.IsSign = true;
                    this.showSignIn = false;
                    this.showsignup = false;
                  }
            } 
          }
        });

        this.showUp();
       }
       catch(ex:any)
       {
            StaticData.SignOutClient1(this.router, "/signin");
            return;
       }
  }

  public onDashboard(event:any):void
  { 
         LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
         LocalStorageService.setLoginSessionIdentity(StaticData.LoanAcctBankSession, StaticData.LoanAcctBankSession);
         LocalStorageService.setLoginSessionIdentity(StaticData.LoanReviewSession, StaticData.LoanReviewSession);
         LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);
        LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);
        this.onNaviagateBack('/dashboard');
        return;
  }

  public clickSignOut(event:any): void  
  {

    LocalStorageService.setLoginSessionIdentity(StaticData.LoanAcctBankSession, StaticData.LoanAcctBankSession);
    LocalStorageService.setLoginSessionIdentity(StaticData.LoanReviewSession, StaticData.LoanReviewSession);
    LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);

    LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, StaticData.AccountEmailSession);
    LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
    LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);  
    LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);
    
    try
    {
              this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
              if(this.SessionResult  == "" || this.SessionResult  == undefined || this.SessionResult  == null || this.SessionResult  == StaticData.LoginKeySession)
              {
                StaticData.SignOutClient1(this.router, "/signin");
                  return;
              }

              return;
    }
    catch(e)
    {
      StaticData.SignOutClient1(this.router, "/signin");
        return;
    }
  }

  private onNaviagateBack(page:string):void
  {
      this.router.navigate([page]);
      return;
  }

  public async SignInApplication(): Promise<boolean>
  {
      try
      {
              this.SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
              // console.log("Session Result " + this.SessionResult);

              if(this.SessionResult == "" || this.SessionResult == undefined || this.SessionResult  == null || this.SessionResult  == StaticData.LoginKeySession)
              {
                  return false;
              }
              else
              {

              }
              
              return await this.FetchUserDetails(this.SessionResult);    
      }
      catch(error:any)
      {
          return false;
      }
  }

  private async FetchUserDetails(AccountId:string):Promise<boolean>
  {
       try
       {
         // this.loadingService.setLoading(true);
          await this.LapoLoanService.FetchAccountDetailsConnector(AccountId).subscribe({
          next:(res)=>
          {
            this.loadingService.setLoading(false);
            // console.log(res);
            this.ResponseData = res;
            // console.log( this.ResponseData);
           
            if(this.ResponseData != null && this.ResponseData.isActive)
            {
              if(this.ResponseData.dataLoad==undefined || this.ResponseData.dataLoad == null){
                return;
              }
              
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

              this.ProfileName = this.acctDetails.FirstName;
               // console.log("loan app SECOND " , this.acctDetails.Email + this.SessionResult); 
              // this.DisplayFrontView();
              return true;
            }
            else
            {
                this.loadingService.setLoading(false);
                Swal.fire({ title: 'Error!', text:  this.ResponseData.tryCatchMessage,  icon: 'error', confirmButtonText: 'Ok' });
                return false;
            }

            return false;
          },
          error:(err:any)=>
          {
              this.loadingService.setLoading(false);
              Swal.fire({ title: 'Error!', text:  "An error occurred " + err.message, icon: 'error',  confirmButtonText: 'Ok'});
              return false;
          }
        })

          return false;
       }
       catch(error1:any)
       {
          this.loadingService.setLoading(false);
           Swal.fire({ title: 'Error!', text:  "An error occurred " + error1, icon: 'error',  confirmButtonText: 'Ok'});
          return false;
       }
  }

  public async LoadSessionInit():Promise<boolean>
  {
        try
        {  
                let SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);                 
              
                if(SessionResult  == undefined || SessionResult  == "" || SessionResult  == null || SessionResult  == StaticData.LoginKeySession)
                {
                    StaticData.properties =  StaticData.properties;
                    return false;
                }
  
                StaticData.properties =  StaticData.properties;
                return await this.FetchUserDetails(SessionResult);
        }
        catch(e:any)
        {
            StaticData.properties =  StaticData.properties;
            return false;
        }
  }

  public async CheckSession() : Promise<number> 
  {
          
          let SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
        
          try
          {
                    if(SessionResult != ""  && SessionResult != undefined && SessionResult != null && SessionResult != StaticData.LoginKeySession)
                    {
                         StaticData.propertie1 = LocalStorageService.getLoginSessionIdentity(StaticData.AppOnLoan);
                        if(StaticData.propertie1 != StaticData.AppOnLoanAnswer)
                        {
                            var detailsResult = await this.SignInApplication();
                            if(detailsResult)
                            {
                                this.router.navigate(['/dashboard'], { queryParams: { AccountId : SessionResult }});
                                return 2;
                            } 
                            else
                            {
                              return 1;
                            }
                        }
                        else if(StaticData.propertie1 == StaticData.AppOnLoanAnswer)
                        {
                            var detailsResult = await this.SignInApplication();
                            if(detailsResult)
                            {
                              this.router.navigate(['/loanbvnapp'], { queryParams: { AccountId : SessionResult }});
                              return 2;
                            } 
                            else
                            {
                              return 1;
                            }
                        }

                       return 1;
                    }

                    return 0;
          }
          catch(e:any)
          {
              return 0;
          }
  }

  public GotoLoan() :void
  {
      // [routerLink]="['/loanbvnapp', { IsLoanApp: true }]"
      LocalStorageService.setLoginSessionIdentity(StaticData.LoanKeySession, StaticData.LoanAppOnLoanAnswer);
      // this.router.navigate(['/loanbvnapp', { IsLoanApp: true }]); 
      this.router.navigate(['/loanbvnapp'],  { queryParams: { IsLoanApp : true }} );
      return;
  } 
}
