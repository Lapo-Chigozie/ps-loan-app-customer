import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BvnAuthDto } from '../ps.loan.Models/BvnAuthDto';
import { PersonalDetailsDto } from '../ps.loan.Models/PersonalDetailsDto';
import { BvnRespondsDto } from '../ps.loan.Models/BvnRespondsDto';
import { AccountDetailsDto } from '../ps.loan.Models/AccountInfoDto';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { AppStorageService } from '../datatableservicehelper/app-storage.service';
import { RefineryService } from '../datatableservicehelper/refinery.service';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { DataSharedService } from '../ps.loan.Models/DataSharedService';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import { AppLoanHashs } from '../ps.loan.Models/AppLoanHashs';
import { LoanAppDto } from '../ps.loan.Models/LoanAppDto';
import Swal from 'sweetalert2';
import { BankAcctDetailsResponseDto, RequestAccountNoDto } from '../ps.loan.Models/RequestAccountNoDto';
import { BankListResponseDto } from '../ps.loan.Models/BankListResponseDto';

@Component({
  selector: 'app-loan-app-details',
  templateUrl: './loan-app-details.component.html',
  styleUrls: ['./loan-app-details.component.css']
})

export class LoanAppDetailsComponent implements OnInit ,  AfterViewInit  {

  message:string = "";
  TokenMessage:string="";

  bvnAuth!: BvnAuthDto 
  acctDetails !:AccountDetailsDto;
  BvnResponds !: BvnRespondsDto;
  ResponseData!: RespondMessageDto;
  PersonalDetail!:PersonalDetailsDto ;

  acctName:string | undefined ;
  acctNumber:string | undefined ;
  bankName:string | undefined ;

  bankName1:string | undefined ;
  loanTenure:string | undefined;
  loanAmount:any | undefined ;

  MinLoanAmount !:string;
  MaxLoanAmount!:string;

  MinLoanAmountNo !:number;
  MaxLoanAmountNo!:number;
  BankLists: BankListResponseDto[] = [];

  AllBankLists: any;

  BankAcctDetails: BankAcctDetailsResponseDto | undefined ;

  PaySliptfiles:any | undefined;
  PassportPhotograph :any | undefined;
  StaffIdCard :any | undefined;

  AcctId:any;
  LoanTenuresList:any;
  ViewScheduleding:boolean = true;
  SchedulingAmount:number = 0;
  SchedulingDate:string = "";

  LayoutRepaymentScheduled:boolean = false;

  //    PaySliptfiles1:any = undefined
  //  PassportPhotograph1 :any= undefined
  //    StaffIdCard1 :any= undefined

  IsShowButton :Boolean = false;
  LoanTenureData:any=null;
  LoanScheduleData:any=null;

  PassportName:string ="";
  SlipName:string ="";
  IdCardName:string ="";

  public PaySlipUrl:any;
  public PaySlipShow : Boolean = false;

  public  StaffIDCardShow: Boolean = false;
  public StaffIDCardUrl:any; 

  public PassportPhotographShow: Boolean = false;
  public PassportPhotographUrl:any;

  private AccountNumber:string | undefined;
  private AccountName!:string | undefined;
  private BankName!:string ;

  private AppSettings:any=undefined;

  public RelationshipOfficerFirstName :any = "";
  public RelationshipOfficerRef = "Default";
  public RelationshipOfficerOtherName :any  = "Default";

  public IsProgressBarShowing:boolean = false;
  public IsErrorHappen:boolean = false;

  //private appip: MyappService ,
  constructor(private AppStorage: AppStorageService, private refineryService: RefineryService,private loadingService: LoaderService,private  shared: DataSharedService,private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanApiService) {

  }

  public ngAfterViewInit(): void 
  {
    
  }

  public onSignOut(event:any):void
  {
      LocalStorageService.setLoginSessionIdentity(StaticData.DateLoginKeySession, StaticData.DateLoginKeySession);
      this.onSignOutSess();
      this.onNaviagateBack(event);
  }

  public onSignOutSess() : void
  {
      if(StaticData.propertie1 == StaticData.AppOnLoanAnswer){
      
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
           
           let BvnDetail =   this.shared.getBvnData();
           let AcctDetail = this.shared.getDetailData();
           let clientDetails = this.shared.getPersonalDetails();

           //(clientDetails==undefined || clientDetails==null || AcctDetail==null || AcctDetail==undefined ||  BvnDetail == null || BvnDetail==undefined)
           let RefineryExit = this.AppStorage.VerifyIfDataExit(StaticData.LoanAcctBankSession)
           if(RefineryExit)
           {
               let codeResult = new AppLoanHashs();
               codeResult.TypeHash = StaticData.LoanAcctBankSession;
               codeResult.Data = "";
               codeResult.Hash =  LocalStorageService.getLoginSessionIdentity(StaticData.LoanAcctBankSession); 
 
               this.loadingService.setLoading(true);
             
               this.refineryService.DecriptConnector(codeResult).subscribe({
               next:(res)=> 
               {
                  this.loadingService.setLoading(false);
                  this.ResponseData = res;
                  if(this.ResponseData != null && this.ResponseData.isActive)
                  { 
                        // LocalStorageService.setLoginSessionIdentity(DataType, this.ResponseData.dataLoad); 
                        let Data2 = JSON.parse(this.ResponseData.dataLoad);
                        
                        BvnDetail = Data2.BvnResponds as BvnRespondsDto;
                        AcctDetail = Data2.AcctDetails as AccountDetailsDto;
                        clientDetails = Data2.PersonalDetails as PersonalDetailsDto;

                        let newLoanApp = Data2.NewLoanApp as LoanAppDto;

                        this.BvnResponds = BvnDetail;
                        this.acctDetails = AcctDetail;
                        this.PersonalDetail = clientDetails;

                        this.loanAmount  = newLoanApp.LoanAmount?.toString();
                        this.loanTenure = newLoanApp.Ternor;
                        this.acctDetails.AccountId = newLoanApp.AccountId;

                        this.bankName = newLoanApp.BankName;
                        this.bankName1 = newLoanApp.BankName;

                        this.acctName = newLoanApp.AcctName;
                        this.acctNumber = newLoanApp.AcctNumber;
                        this.PersonalDetail.PFNumber = newLoanApp.PFNumber;
                        
                        this.RelationshipOfficerRef = newLoanApp.RelationshipOfficerRef?.toString();
                        this.RelationshipOfficerFirstName = newLoanApp.OfficerFirstName?.toString();
                        this.RelationshipOfficerOtherName = newLoanApp.OfficerOtherName?.toString();

                        // this.GetAllLoanApplys();
                        // console.log('AccountId ', AcctDetail.AccountId);
                        this.CalulateAllDataAmount1(AcctDetail.AccountId)

                        //  this.StaffIdCard = null; // newLoanApp.StaffIdCard;
                        //  this.PaySliptfiles = null; // newLoanApp.PaySliptfiles ;
                        //  this.PassportPhotograph = null; //  newLoanApp.PassportPhotograph;

                        // console.log('Response Data Data 1 ', this.bankName ,this.acctNumber, this.loanAmount, this.loanTenure );
                        // return this.ResponseData.dataLoad;
                  }
                  else
                  {
                      LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);
                      this.message = this.ResponseData.tryCatchMessage;
                      // Swal.fire({ title: 'Warning!', text:  this.message, icon: 'warning',  confirmButtonText: 'Ok' });
                      this.onNaviagateBack('/signin');
                      return;
                  }
               },
                error:(err:any)=>
                {
                    LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);
                    this.loadingService.setLoading(false);
                    // console.log('Error' + err);
                    this.message = err.message;
                    // Swal.fire({ title: 'Error!',   text:  this.message, icon: 'error',  confirmButtonText: 'Ok' });
                    this.onNaviagateBack('/signin');
                    return;
                }      
           });
 
           }

           if(BvnDetail == null || BvnDetail == undefined) 
           {
              this.onNaviagateBack('/signin');
              return;
           }

            if(AcctDetail == null || AcctDetail == undefined) 
            {
              this.onNaviagateBack('/signin');
              return;
            }

            if(clientDetails == null || clientDetails == undefined) 
            {
              this.onNaviagateBack('/signin');
              return;
            }

          //   if(this.acctDetails == null || this.acctDetails == undefined) {
          //     this.onNaviagateBack('/signin');
          //     return;
          // }

          //  if(this.acctDetails != null && this.acctDetails != undefined) {
          //      AcctDetail = this.acctDetails;
          //  }

          //  if(this.BvnResponds != null && this.BvnResponds != undefined) {
          //      BvnDetail = this.BvnResponds;
          //  }

          //  if(this.PersonalDetail != null && this.PersonalDetail != undefined) {
          //     clientDetails = this.PersonalDetail;
          //   }
           
           if(BvnDetail != undefined && AcctDetail != undefined && clientDetails != undefined && BvnDetail != null && AcctDetail != null && clientDetails != null) 
           {
                let BvnDetail1 = BvnDetail as BvnRespondsDto;
                let AcctDetail1 = AcctDetail as AccountDetailsDto ;
                let ClientDetail = clientDetails as PersonalDetailsDto ;

              if(BvnDetail1.PhoneNumber1 == "" || BvnDetail1.ResponseCode == "" || BvnDetail1.BVN == "")
              {
                  StaticData.properties = true;
                  this.onNaviagateBack('/signin');
                  return;
              }

              if(AcctDetail1.AccountId == undefined || AcctDetail1.Email == undefined || AcctDetail1.AccountType==undefined || AcctDetail1.Phone==undefined || AcctDetail1.AccountId == "" || AcctDetail1.Email == "" || AcctDetail1.AccountType=="" || AcctDetail1.Phone==""){
                StaticData.properties = true;
                this.onNaviagateBack('/signin');
                return;
              }

              if(ClientDetail.PFNumber ==undefined || ClientDetail.PhoneNumber ==undefined || ClientDetail.PFNumber =="" || ClientDetail.PhoneNumber =="")
              {
                  StaticData.properties = true;
                  this.onNaviagateBack('/signin');
                  return;
              }

              StaticData.properties = true;
              this.acctDetails = AcctDetail;
              this.BvnResponds = BvnDetail;
              this.PersonalDetail = ClientDetail;
              this.GetAllMethidLoan();
              this.CalulateAllDataAmount1(AcctDetail1.AccountId)
              this.GetLoanSettings();
              this.LoadAllBankLists();
           }
           else
           {
              StaticData.properties = true;
              this.onNaviagateBack('/signin');
              return;    
           }
       }
       catch(e:any)
       {
            //console.log('Display: ' + e);
            StaticData.properties = true;
            this.onNaviagateBack('/signin');
            return;
       }
  }

  public async LoadBankLists():Promise<void>
  {
        await this.LapoLoanService.LoadBankLists("").subscribe({
          next:(res)=>
          {
            this.ResponseData =  res;
          
            if(this.ResponseData!=null && this.ResponseData.isActive)
            {
                this.BankLists =  this.ResponseData.dataLoad;
                return;
            }
            else{
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
          error:(err)=>
          {
            this.message = "Error has occur " + err.message;
            Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
            return;

          }
        })
  }

  public onNaviagateBack(page:string):void
  {
      this.route.navigate([page]);
  }

  public onContinue(event:any): void
  {
       try
       {
              if(this.loanAmount == "" || this.loanAmount == undefined || this.loanAmount == null)
              {
                  this.message = "Loan Amount is required";
                  Swal.fire({ title: 'Warning!', text:  this.message, icon: 'warning',  confirmButtonText: 'Ok'  });
                  return;
              }
              // else if(this.RelationshipOfficerRef == "" || this.RelationshipOfficerRef == undefined || this.RelationshipOfficerRef == null)
              // {
              //     this.message = "Relationship Officer is required";
              //     Swal.fire({ title: 'Warning!', text:  this.message, icon: 'warning', confirmButtonText: 'Ok' });
              //     return;
              // }
              else if(this.loanTenure == "0" || this.loanTenure == "" || this.loanTenure == undefined || this.loanTenure == null)
              {
                  // this.alertify.error('Error saving Connection...')
                  this.message = "Loan Tenure is required";
                  Swal.fire({
                    title: 'Warning!',
                    text:  this.message,
                    icon: 'warning',
                    confirmButtonText: 'Ok' });
                  return;
              }
              else if(this.bankName == "" || this.bankName == undefined || this.bankName == null)
              {
                  // this.alertify.error('Error saving Connection...')
                  this.message = "Bank Name is required";
                  Swal.fire({
                    title: 'Warning!',
                    text:  this.message,
                    icon: 'warning',
                    confirmButtonText: 'Ok' });
                  return;
              }
              else if(this.acctNumber == "" || this.acctNumber == undefined || this.acctNumber == null)
              {
                  // this.alertify.error('Error saving Connection...')
                  this.message = "Bank Account Number is required";
                  Swal.fire({
                    title: 'Warning!',
                    text:  this.message,
                    icon: 'warning',
                    confirmButtonText: 'Ok'});
                  return;
              }
              else if(this.acctName == "" || this.acctName == undefined || this.acctName == null)
              {
                  // this.alertify.error('Error saving Connection...')
                  this.message = "Bank Account Name is required";
                  Swal.fire({
                    title: 'Warning!',
                    text:  this.message,
                    icon: 'warning',
                    confirmButtonText: 'Ok'});
                  return;
              }
              if(parseInt(this.loanAmount) < parseInt(this.AppSettings.minLoanAmount))
              {
                  this.IsShowButton = false;
                  Swal.fire({title: 'Warning!', text:  "Minimum loan amount is " + this.AppSettings.minLoanAmount,
                  icon: 'warning',  confirmButtonText: 'Ok' });
                  return;
              }
              else
              {
                      if(this.PersonalDetail == null || this.PersonalDetail == undefined)
                      {
                        this.message = "Your profile details is not longer available.";
                        Swal.fire({ title: 'Warning!',   text:  this.message,  icon: 'warning',  confirmButtonText: 'Ok'
                        }).then((result) => { if (result.isConfirmed) { this.onSignOut("/signin"); return; } });
                        return;
                      }

                      if(parseInt(this.loanAmount) > parseInt(this.MaxLoanAmountNo.toString())){
                          this.message = "You are not Eligible to take loan of " + this.loanAmount;
                          Swal.fire({ title: 'Warning!',   text:  this.message,  icon: 'warning',  confirmButtonText: 'Ok'
                          });
                          return;
                      }

                      if(this.StaffIdCard != undefined && this.StaffIdCard != null && this.StaffIdCard.length <= 0){
                            Swal.fire({ title: 'Warning!',  text: "StaffId Card is required", icon: 'warning', confirmButtonText: 'Ok'
                          }).then((result) => {
                            if (result.isConfirmed) {
                              //this.reloadPage();
                                      return;
                            }
                          });
                          return;
                      }

                      if(this.StaffIdCard == undefined || this.StaffIdCard == null){
                        Swal.fire({ title: 'Warning!',  text: "StaffId Card is required", icon: 'warning', confirmButtonText: 'Ok'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          //this.reloadPage();
                                  return;
                        }
                      });
                      return;
                      }
      
                      if(this.PaySliptfiles != undefined && this.PaySliptfiles != null && this.PaySliptfiles.length <= 0){
                Swal.fire({ title: 'Warning!',  text: "Resent pay slip is required", icon: 'warning', confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.isConfirmed) 
                {
                  //this.reloadPage();
                  return;
                }
              });
              return;
          }

          if(this.PaySliptfiles == undefined || this.PaySliptfiles == null)
          {
            Swal.fire({ title: 'Warning!',  text: "Resent pay slip is required", icon: 'warning', confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) 
            {
                //this.reloadPage();
                return;
            }
          });
          return;
          }

          if(this.PaySliptfiles != undefined && this.PaySliptfiles != null && this.PaySliptfiles.length <= 0)
          {
             Swal.fire({ title: 'Warning!',  text: "Resent pay slip is required", icon: 'warning', confirmButtonText: 'Ok'
             }).then((result) => {
                if (result.isConfirmed) 
                {
                    //this.reloadPage();
                    return;
                }
              });
              return;
           }

          if(this.PassportPhotograph != undefined && this.PassportPhotograph != null && this.PassportPhotograph.length <= 0)
          {
              Swal.fire({ title: 'Warning!',  text: "Passport Photograph is required", icon: 'warning', confirmButtonText: 'Ok'
              }).then((result) => {
              if (result.isConfirmed) 
              {
                //this.reloadPage();
                return;
              }
              });
              return;   
          }

          if(this.PassportPhotograph == undefined || this.PassportPhotograph == null)
          {
              Swal.fire({ title: 'Warning!',  text: "Passport Photograph is required", icon: 'warning', confirmButtonText: 'Ok'
              }).then((result) => {
              if (result.isConfirmed) 
              {
                //this.reloadPage();
                return;
              }
            });
            return;   
          }

          if(this.acctDetails == undefined || this.acctDetails.AccountId == undefined || this.acctDetails.AccountId == "")
          {
              Swal.fire({ title: 'Warning!',  text: "Login session has expired", icon: 'warning', confirmButtonText: 'Ok' }).then((result) => {
              if (result.isConfirmed) { this.route.navigate(["/signin"]); } });
              return;
          }

          if(this.PersonalDetail == undefined || this.PersonalDetail.PFNumber == undefined || this.PersonalDetail.PFNumber == "")
          {
              Swal.fire({ title: 'Warning!',  text: "IPPIS Number is required", icon: 'warning', confirmButtonText: 'Ok' }).then((result) => {
              if (result.isConfirmed) { this.route.navigate(["/signin"]); } });
              return;
          }

            try
            {
                    if(this.loanAmount != null && this.loanAmount != undefined && this.loanAmount.toString().length > 0)
                    {
                            let AmountLoan = parseInt(this.loanAmount);
                            
                            // if(AmountLoan >=  this.MinLoanAmountNo && AmountLoan <=  this.MaxLoanAmountNo)
                            // {
                            //   this.IsShowButton =true;
                            // }
                            // else{
                            //   this.IsShowButton =false;
                            //     Swal.fire({title: 'Warning!',   text:  "Loan amount is not eligible to apply on this account",
                            //   icon: 'warning', confirmButtonText: 'Ok' });
                            //   return;
                            // }
 
                            // console.log('Confirm Button Text', parseInt(this.AppSettings.minLoanAmount) , AmountLoan);

                            if(this.AppSettings.useSalaryAsMaxLoanAmount == true)
                            {
                                if(AmountLoan > this.MaxLoanAmountNo)
                                {
                                        this.IsShowButton = false;
                                        Swal.fire({title: 'Warning!', text:  "Loan amount is not eligible to apply on this account",
                                        icon: 'warning',  confirmButtonText: 'Ok' });
                                        return;
                                }
                            }
                            else if (this.AppSettings.useSalaryAsMaxLoanAmount == false)
                            {
                                if(AmountLoan > parseInt(this.AppSettings.maxLoanAmount))
                                {
                                    this.IsShowButton = false;
                                    Swal.fire({title: 'Warning!', text:  "Maximum loan amount is " + this.AppSettings.maxLoanAmount,
                                    icon: 'warning',  confirmButtonText: 'Ok' });
                                    return;
                                }
                            }
                            else
                            {
                                    this.IsShowButton = true;
                            }
                          
                            if(AmountLoan < parseInt(this.AppSettings.minLoanAmount))
                            {
                                          this.IsShowButton = false;
                                          Swal.fire({title: 'Warning!', text:  "Minimum loan amount is " + this.AppSettings.minLoanAmount,
                                          icon: 'warning',  confirmButtonText: 'Ok' });
                                          return;
                            }
                            else
                            {
                                    this.IsShowButton = true;
                            }

                            // if(AmountLoan <=  this.MaxLoanAmountNo)
                            // {
                            //      this.IsShowButton = true;
                            // }
                            // else
                            // {
                            //      this.IsShowButton = false;
                            //      Swal.fire({title: 'Warning!', text:  "Loan amount is not eligible to apply on this account",
                            //      icon: 'warning', confirmButtonText: 'Ok' });
                            //      return;
                            // }
                    }
                    else
                    {
                        this.IsShowButton = false;
                        Swal.fire({title: 'Warning!', text:  "Maximum loan amount is " + this.AppSettings.maxLoanAmount,
                        icon: 'warning',  confirmButtonText: 'Ok' });
                        return;
                    }
            }
            catch(err:any)
            {
                this.IsShowButton = false;
                Swal.fire({title: 'Warning!',  text:  "Loan amount must not contain letters.", icon: 'warning',
                confirmButtonText: 'Ok'});  
                return;
            }

            if(this.RelationshipOfficerFirstName==""|| this.RelationshipOfficerFirstName==undefined || this.RelationshipOfficerFirstName==null)
            {
                    this.RelationshipOfficerFirstName = "Default";
                    this.RelationshipOfficerOtherName = "Default";
            }

            if(this.RelationshipOfficerFirstName != "Default" && this.RelationshipOfficerFirstName != null && this.RelationshipOfficerFirstName != "")
            {
              if(this.RelationshipOfficerFirstName != undefined && (this.RelationshipOfficerOtherName == undefined || this.RelationshipOfficerOtherName == ""))
              {
                      Swal.fire({title: 'Warning!',  text:  "Relationship Officer Last Name is required.", icon: 'warning', confirmButtonText: 'Ok'});  
                      return;
              }
  
              if(this.RelationshipOfficerOtherName != undefined && (this.RelationshipOfficerFirstName == undefined || this.RelationshipOfficerFirstName == ""))
              {
                      Swal.fire({title: 'Warning!',  text:  "Relationship Officer First Name is required.", icon: 'warning', confirmButtonText: 'Ok'});  
                      return;
              }
            }
            else
            {
                    this.RelationshipOfficerFirstName = "Default";
                    this.RelationshipOfficerOtherName = "Default";
            }
            
            if(this.RelationshipOfficerRef != undefined && this.RelationshipOfficerRef != null &&  this.RelationshipOfficerRef != "" && this.RelationshipOfficerRef != "Default" && this.RelationshipOfficerFirstName != "Default" && this.RelationshipOfficerOtherName != "Default" &&  this.RelationshipOfficerFirstName != "" && this.RelationshipOfficerOtherName != "" && this.RelationshipOfficerFirstName != undefined && this.RelationshipOfficerOtherName != undefined)
            {
                this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
            
                this.loadingService.setLoading(true);
             
                this.LapoLoanService.ValidateRelationShipOfficer(this.RelationshipOfficerRef, this.RelationshipOfficerRef).subscribe({
                next:(res) => 
                {
                      this.loadingService.setLoading(false);
                      this.ResponseData = res;
                      if(this.ResponseData != null && this.ResponseData.isActive)
                      {
                          this.SaveLoanAppCookie();
                      }
                      else
                      {
                          Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                          return;
                      }
                },
                error:(err:any):any=>
                {
                        this.loadingService.setLoading(false);
                        Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
                        return;
                }
            
                });

            }
            else
            {
                     this.SaveLoanAppCookie();
            }
         }
       }
       catch(erra:any)
       {
           this.IsShowButton =false;
          
           Swal.fire({ title: 'Uh-oh!',  text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
            if (result.isConfirmed) {  this.route.navigate(["/signin"]);  return; } });
           return;
       }
  }

  public SaveLoanAppCookie(): void
  {
          let newLoanApp =  new LoanAppDto();
          newLoanApp.LoanAmount = parseInt(this.loanAmount);
          newLoanApp.Ternor = this.loanTenure;
          newLoanApp.AccountId =  this.acctDetails.AccountId;
          newLoanApp.BankName = this.bankName1;
          newLoanApp.AcctName = this.acctName;
          newLoanApp.AcctNumber = this.acctNumber;
          // console.log(newLoanApp.AcctNumber);
          newLoanApp.PFNumber = this.PersonalDetail.PFNumber;

          newLoanApp.StaffIdCard = this.StaffIdCard;
          newLoanApp.PaySliptfiles = this.PaySliptfiles
          newLoanApp.PassportPhotograph = this.PassportPhotograph;

          if((this.RelationshipOfficerRef == "" || this.RelationshipOfficerFirstName == "" || this.RelationshipOfficerOtherName == "") || (this.RelationshipOfficerRef == null || this.RelationshipOfficerFirstName == null || this.RelationshipOfficerOtherName == null || this.RelationshipOfficerFirstName == undefined || this.RelationshipOfficerOtherName == undefined))
          {
              this.RelationshipOfficerFirstName = "Default";
              this.RelationshipOfficerOtherName = "Default";
              this.RelationshipOfficerRef = "Default";
          }

          newLoanApp.OfficerFirstName = this.RelationshipOfficerFirstName;
          newLoanApp.OfficerOtherName = this.RelationshipOfficerOtherName;
          newLoanApp.RelationshipOfficerRef = this.RelationshipOfficerRef;

          //  console.log("Background 1" ,  this.PersonalDetail);
          //  console.log("Background 2" , this.BvnResponds);
          //  console.log("Background 3" , this.acctDetails);
          //  console.log("Background 4" , newLoanApp);

          this.shared.setPersonalDetails(this.PersonalDetail);
          this.shared.setBvnData(this.BvnResponds);
          this.shared.setDetailData(this.acctDetails); 
          this.shared.setLoanDetailsData(newLoanApp);

          // let navigationExtras: NavigationExtras = { //   state: { //     personalDetails: this.PersonalDetail,  //   }, // };

          // let apploan = { newLoanApp : newLoanApp,PersonalDetail:this.PersonalDetail, BvnResponds:this.BvnResponds,  acctDetails:this.acctDetails } 
          // LocalStorageService.setLoanAppObject(StaticData.LoanAppSessionKey,apploan);

          let DataForm1 = { NewLoanApp: newLoanApp, PersonalDetails: this.PersonalDetail, BvnResponds: this.BvnResponds, AcctDetails: this.acctDetails};
          this.AppStorage.SaveHashData(DataForm1, StaticData.LoanAcctBankSession, '/apploanreview', null, true);
  }

  public async PassportuploadFile(event:any):Promise<void> 
  {
        const files: FileList = event.target.files;

        // Clear the input
    
        if(files == undefined || files == null || files[0] == undefined ||  files[0] == null)
        {
          event.target.value = null;
          Swal.fire({ title: 'warning!',  text: "Upload a file and try again", icon: 'warning', confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              //this.reloadPage();
              this.PassportPhotograph = undefined;
            }
          });
          return;
        }
  
      // files: FileList = event.target.files;
      // console.log(files);

        let fileToUpload = <File>files[0];
        let name = fileToUpload.name;
        let type = fileToUpload.type;
        let size = fileToUpload.size;
        let modifiedDate = fileToUpload.lastModified;

        this.PassportName = name;

        if(this.PassportName != "" &&  this.PassportName != undefined && (this.PassportName == this.SlipName  || this.PassportName == this.IdCardName))
        {
            this.PassportName = "";
            event.target.value = null;
            this.PassportPhotograph = undefined;
            Swal.fire({ title: 'Warning!', text: "Passport must not be the same with Slip or ID Card Upload.", icon: 'warning', confirmButtonText: 'Ok' })
            return;
        }
      // console.log(this.PassportPhotograph);

      /// let resultValidation = await this.ValidateFileUploadImage(name, this.PassportPhotograph, files, event);
      

      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) 
      {
          let file = event.target.files[0];
          reader.readAsDataURL(file);
          reader.onload = () => 
          {
              this.PassportPhotographShow = true;
              this.PassportPhotographUrl = reader.result; 
          };
      }
      else
      {
          this.PassportPhotographShow = false;
      }
      
      this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
      this.loadingService.setLoading(true);
  
      let FileUrl = name;
      console.log(FileUrl);
  
      let FileNames = { FileName : FileUrl, AcctLogin: this.AcctId, size: '0' };
      
      await (await this.LapoLoanService.FileValidationImage(FileNames)).subscribe({
      next:(res)=>{
      
        this.loadingService.setLoading(false);
        this.ResponseData = res;
        if(this.ResponseData != null && this.ResponseData.isActive)
        {
            this.PassportPhotograph = files;
            // console.log(this.PassportPhotograph);
            return;
        }
        else
        {
            event.target.value = null;
            this.PassportPhotograph = undefined;
            console.log('File Error 1' ,this.PassportPhotograph);
            Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
            return ;
        }
      },
      error:(err:any):any=>
      {
          event.target.value = null;
          this.PassportPhotograph = undefined;
          console.log('File Error 1',this.PassportPhotograph);
          this.loadingService.setLoading(false);
          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
          return;
      }
    })
  
      // let totalSize: number = 0;
      // for (let file of files) {
      //     totalSize = totalSize + file.size;
      // }
      // console.log ("Total select file's size is " + totalSize)

      //  let fileToUpload = <File>files[0];
      //  var name = fileToUpload.name;
      //  var type = fileToUpload.type;
      //  var size = fileToUpload.size;
      //  var modifiedDate = fileToUpload.lastModified;

      // console.log ('Name: ' + name + "\n" +  'Type: ' + type + "\n" + 'Last-Modified-Date: ' + modifiedDate + "\n" +'Size: ' + Math.round(size / 1024) + " KB");
    
      // if (files[0]) {
      //   const file: File = files[0];
      //   var pattern = /image-*/;

      //   if (!file.type.match(pattern)) {
      //     Swal.fire({ title: 'Warning!',  text: "You must upload a valid image", icon: 'warning', confirmButtonText: 'Ok'
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       //this.reloadPage();
          
      //     } });
      //     return;
      //   }
      // }
    }

  public  async CarduploadFile(event:any):Promise<void> 
  {
    
    const files: FileList = event.target.files;

    // console.log('Passport Photograph 1 ', this.PassportPhotograph);
    // if(this.PassportPhotograph==undefined || this.PassportPhotograph[0]==undefined || this.PassportPhotograph==null || this.PassportPhotograph==undefined)
    // {
    //     event.target.value = null;
    //     Swal.fire({ title: 'Warning!',  text: "Upload a Passport Photograph and try again", icon: 'warning', confirmButtonText: 'Ok'
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       //this.reloadPage();     
    //     }
    //   });
    //   return;
    // }
    
     if (files == undefined || files == null || files[0] == undefined ||  files[0] == null)
     {
        event.target.value = null;
        Swal.fire({ title: 'Warning!',  text: "Upload a file and try again", icon: 'warning', confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            //this.reloadPage();
                   
          }
        });
        return;
      }
      
      console.log(files);

      let fileToUpload = <File>files[0];
      let name = fileToUpload.name;
      let type = fileToUpload.type;
      let size = fileToUpload.size;
      let modifiedDate = fileToUpload.lastModified;

      this.IdCardName = name;

      if(this.IdCardName != "" &&  this.IdCardName != undefined && (this.IdCardName == this.PassportName  || this.IdCardName == this.SlipName))
      {
          this.IdCardName ="";
          event.target.value = null;
          this.StaffIdCard = undefined;
        Swal.fire({ title: 'Warning!', text: "ID Card must not be the same with Slip or Passport upload.", icon: 'warning', confirmButtonText: 'Ok' })
        return;
      }

     // console.log(this.PassportPhotograph);
    /// let resultValidation = await this.ValidateFileUploadImage(name, this.StaffIdCard, files, event);
    
     this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
     this.loadingService.setLoading(true);

     let reader = new FileReader();
     if(event.target.files && event.target.files.length > 0) 
     {
         let file = event.target.files[0];
         reader.readAsDataURL(file);
         reader.onload = () => 
         {
             this.StaffIDCardShow = true;
             this.StaffIDCardUrl = reader.result; 
         };
     }
     else
     {
         this.StaffIDCardShow = false;
     }


     let FileUrl = name;
     console.log(FileUrl);
  
     let FileNames = { FileName : FileUrl, AcctLogin: this.AcctId, size: '0' };
     
     await (await this.LapoLoanService.FileValidationImage(FileNames)).subscribe({
     next:(res)=>{
     
       this.loadingService.setLoading(false);
       this.ResponseData = res;
       if(this.ResponseData != null && this.ResponseData.isActive)
       {
           this.StaffIdCard = files;
           console.log(this.StaffIdCard);
           return 1;
       }
       else
       {
           event.target.value = null;
           this.StaffIdCard = undefined;
           console.log('File Error 2', this.StaffIdCard);
           Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
           return 2;
       }
     },
     error:(err:any):any=>
     {
          event.target.value = null;
          this.StaffIdCard = undefined;
          // console.log('File Error 2', this.StaffIdCard);
         this.loadingService.setLoading(false);
       
          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
         return 2;
     }
   })
  
      // let totalSize: number = 0;
      // for (let file of files) {
      //     totalSize = totalSize + file.size;
      // }
      // console.log ("Total select file's size is " + totalSize)

      // let fileToUpload = <File>files[0];
      // var name = fileToUpload.name;
      // var type = fileToUpload.type;
      // var size = fileToUpload.size;
      // var modifiedDate = fileToUpload.lastModified;

      // console.log ('Name: ' + name + "\n" +  'Type: ' + type + "\n" + 'Last-Modified-Date: ' + modifiedDate + "\n" +'Size: ' + Math.round(size / 1024) + " KB");
    
      // if (files[0]) {
      //   const file: File = files[0];
      //   var pattern = /image-*/;

      //   if (!file.type.match(pattern)) {
      //     Swal.fire({ title: 'Warning!',  text: "You must upload a valid image", icon: 'warning', confirmButtonText: 'Ok'
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       //this.reloadPage();
                  
      //     }
      //   });
      //     return;
      //   }
      // }
    }

  public  async SlipuploadFile(event:any) :Promise<void>
  {

    const  files: FileList = event.target.files;

    if (files == undefined || files == null || files[0] == undefined ||  files[0] == null) {
      
      event.target.value = null;
      Swal.fire({ title: 'warning!',  text: "Upload a file and try again", icon: 'warning', confirmButtonText: 'Ok'
      }).then((result) => {
         if (result.isConfirmed) 
         {
          //this.reloadPage();
                
         }
      });
      return;
    }

    // const files1 = event.target.files;
    // if (files1.length === 0)
    //     return;

    // const mimeType = files1[0].type;
    // if (mimeType.match(/image\/*/) == null) {
    //     this.message = "Only images are supported.";
    //     return;
    // }

    // const reader = new FileReader();
    // const imagePath = files1;
    // reader.readAsDataURL(files[0]); 
    // reader.onload = (_event) => 
    // { 
    //     this.PaySlipUrl = reader.result; 
    // }

    
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) 
    {
        let file = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => 
        {
            this.PaySlipShow = true;
            this.PaySlipUrl = reader.result; 
        };
    }
    else
    {
        this.PaySlipShow = false;
    }

   // console.log(this.PaySliptfiles);
   // files: FileList = event.target.files;

   console.log(files);

    let fileToUpload = <File>files[0];
    let name = fileToUpload.name;
    let type = fileToUpload.type;
    let size = fileToUpload.size;
    let modifiedDate = fileToUpload.lastModified;

    this.SlipName = name;

    if(this.SlipName != "" &&  this.SlipName != undefined && (this.SlipName == this.PassportName  || this.SlipName == this.IdCardName))
    {
          this.SlipName = "";
          event.target.value = null;
          this.PaySliptfiles = undefined;
          Swal.fire({ title: 'Warning!', text: "Recent Pay Slip must not be the same with Id card or Passport upload.", icon: 'warning', confirmButtonText: 'Ok' })
          return;
    }

   // console.log(this.PassportPhotograph);
   // let resultValidation = await this.ValidateFileUploadImage(name, this.PaySliptfiles, files, event);
    
   this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
   this.loadingService.setLoading(true);

   let FileUrl = name;
   console.log(FileUrl);

   let FileNames = { FileName : FileUrl, AcctLogin: this.AcctId, size: '0' };
   
   await (await this.LapoLoanService.ValidateSlipFileImage1(FileNames)).subscribe({
   next:(res)=>{
   
     this.loadingService.setLoading(false);
     this.ResponseData = res;
     if(this.ResponseData != null && this.ResponseData.isActive)
     {
         this.PaySliptfiles = files;
         console.log(this.PaySliptfiles);
         return 1;
     }
     else
     {
         event.target.value = null;
         this.PaySliptfiles = undefined;
        //  console.log('File Error 3', this.PaySliptfiles);
         Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
         return 2;
     }
   },
   error:(err:any):any=>
   {
      event.target.value = null;
      this.PaySliptfiles = undefined;
      // console.log('File Error 3',this.PaySliptfiles);
       this.loadingService.setLoading(false);
     
  Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

       return 2;
   }
 })

    // let totalSize: number = 0;
    // for (let file of files) {
    //     totalSize = totalSize + file.size;
    // }
    // console.log ("Total select file's size is " + totalSize)

    //  let fileToUpload = <File>files[0];
    //  var name = fileToUpload.name;
    //  var type = fileToUpload.type;
    //  var size = fileToUpload.size;
    //  var modifiedDate = fileToUpload.lastModified;

    // console.log ('Name: ' + name + "\n" +  'Type: ' + type + "\n" + 'Last-Modified-Date: ' + modifiedDate + "\n" +'Size: ' + Math.round(size / 1024) + " KB");
   
    // if (files[0]) {
    //   const file: File = files[0];
    //   var pattern = /image-*/;

    //   if (!file.type.match(pattern)) {
    //     Swal.fire({ title: 'Warning!',  text: "You must upload a valid image", icon: 'warning', confirmButtonText: 'Ok'
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       //this.reloadPage();
                
    //     }
    //   });
    //     return;
    //   }
    //}
  }

  private async CalulateAllDataAmount1(AccountId:any)
  {
      let DataPerson =  { AccountId : AccountId , PFNumber: this.PersonalDetail.PFNumber};
    
      await this.LapoLoanService.RebroundBankList(DataPerson).subscribe({
        next:(res)=>{

           this.ResponseData =  res;
           
          if(this.ResponseData != null && this.ResponseData.isActive)
          {
              // this.BankAcctDetails =  this.ResponseData.dataLoad;
              // this.acctName = this.BankAcctDetails?.account_name;
              this.IsShowButton = true;

              this.MinLoanAmount = this.ResponseData.dataLoad.startAmount;  
              this.MaxLoanAmount = this.ResponseData.dataLoad.endAmount;
              this.MinLoanAmountNo = this.ResponseData.dataLoad.startAmounty;
              this.MaxLoanAmountNo = this.ResponseData.dataLoad.endAmounty;

              // this.AccountNumber = this.ResponseData.dataLoad.bankAccountNo;
              // this.AccountName = this.ResponseData.dataLoad.bankAccountName;
              // this.BankName = this.ResponseData.dataLoad.bankName;
              // accountId, bankAccountName, bankAccountNo, bankName, endAmount, pfNumber ,startAmount
              return;
          }
          else
          {
            this.IsShowButton = false;
            this.message = this.ResponseData.tryCatchMessage;
            Swal.fire({ title: 'Error!', text:  this.message, icon: 'error', confirmButtonText: 'Ok' });
            return;
          }
      
          // this.sweetalert.timedNofication('Connection Saved Successfully...')
        },
        error:(err:any)=>{

          // this.alertify.error('Error saving Connection...')
          this.IsShowButton = false;
          this.message = "Error has occur " + err.message;
          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

          return;

        }
      })
  }

  // numericOnly(event): boolean {    
  //   let patt = /^([0-9])$/;
  //   let result = patt.test(event.key);
  //   return result;
  // }

  public AcctNumberkeyPress(event: any):void {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  private BankSelectedName = "";
  public async onAccountNumberChanged(event:any):Promise<void> 
  {
        let acctNo =  event.target.value;

        if(acctNo!="" && acctNo != undefined && acctNo!=null)
        {
          await this.LapoLoanService.CheckIfBankAccountIsOk(acctNo).subscribe({
            next:(res) => 
            {
                this.loadingService.setLoading(false);
                this.ResponseData = res;
                if(this.ResponseData != null && this.ResponseData.isActive)
                {
    
                }
                else
                {
                    acctNo="";
                    this.acctNumber = "";
                    event.target.value ="";
                    Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                    return;
                }
            },
            error:(err:any):any=>
            {
              acctNo="";
              this.acctNumber = "";
              event.target.value ="";
                Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
                return;
            }
          })
        }


       if(this.BankSelectedName != undefined  && this.BankSelectedName != null  && this.BankSelectedName != "" && this.BankSelectedName != "---Select--Bank---"  && acctNo  != "" && acctNo  != undefined && acctNo  != null && acctNo.length == 10)
        {
           // Swal.fire({ title: 'Warning!', text: 'Account Number is required', icon: 'warning', confirmButtonText: 'Ok' })
           // return;
          try
          {
                  this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
              
                  if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
                  {
                      this.onSignOut("/signin");
                      return;
                  }

                  this.loadingService.setLoading(true);
                  let dataChange = { 'Selected': this.BankSelectedName, 'AcctNo': acctNo};

                  await this.LapoLoanService.RetrivetedBankAcctName(dataChange).subscribe({
                  next:(res) => 
                  {
                      this.loadingService.setLoading(false);
                      this.ResponseData = res;
                      if(this.ResponseData != null && this.ResponseData.isActive)
                      {
                          this.acctName = this.ResponseData.dataLoad.acctName;
                          this.AccountNumber = this.acctNumber;
                          this.AccountName =  this.acctName;
                          this.bankName1 = this.ResponseData.dataLoad.bankName;
                          return;
                      }
                      else
                      {
                          this.loadingService.setLoading(false);
                          Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                          return;
                      }
                  },
                  error:(err:any):any=>
                  {
                      this.loadingService.setLoading(false);
                      Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
                      return;
                  }
                })
          }
          catch(errx:any)
          {
              this.loadingService.setLoading(false);
              Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
              return;
          }
        }
  }

  public onBackAccountNumberChange(event:any):void
  {

        if(event.target.value.length < 11)
        {
          // Swal.fire({
          //   title: 'Warning!',
          //   text:  "Enter Bank Account Number",
          //   icon: 'warning',
          //   confirmButtonText: 'Ok'
          // })
          // return;
        }
        
        if(event.target.value.length >= 11)
        {
            this.LoadBankAcctDetails(event.target.value);
        }
  }

  public onLoanAmountChange(event:any):void
  {
       try
       {
          
                  this.loanAmount = event.target.value;
                  let AmountLoan = parseInt(event.target.value);

                  // if(AmountLoan >=  this.MinLoanAmountNo && AmountLoan <=  this.MaxLoanAmountNo)
                  // {
                  //     this.IsShowButton = true;
                  //     return;
                  // }
                  // else{
                  //   this.IsShowButton = false;
                  //         Swal.fire({title: 'Warning!',
                  //       text:  "Loan amount is not eligible to apply on this account",
                  //       icon: 'warning',
                  //       confirmButtonText: 'Ok'
                  //     })
                  //     return;
                  // }

                  this.IsShowButton = false;

                      // if(AmountLoan > this.MaxLoanAmountNo)
                      // {
                      //         this.IsShowButton = false;
                      //         Swal.fire({title: 'Warning!', text:  "Loan amount is not eligible to apply on this account",
                      //         icon: 'warning',  confirmButtonText: 'Ok' });
                      //         return;
                      // }

                    if(AmountLoan > parseInt(this.AppSettings.maxLoanAmount))
                    {
                        this.IsShowButton = false;
                        Swal.fire({title: 'Warning!', text:  "Maximum loan amount is " + this.AppSettings.maxLoanAmount,
                        icon: 'warning',  confirmButtonText: 'Ok' });
                        return;
                    }
                  
              this.IsShowButton = true;
       }
       catch(err:any)
       {
               this.IsShowButton = false;
               Swal.fire({title: 'Warning!', text:  "Maximum loan amount is " + this.AppSettings.maxLoanAmount,
                        icon: 'warning',  confirmButtonText: 'Ok' }); 
                        return;
       }
  }
  
  private async LoadBankAcctDetails(acctNo:any) : Promise<void>  
  {

      try
      {
        let newAcctNo = new RequestAccountNoDto()
        newAcctNo.AccountNo = acctNo.string;
    
        await this.LapoLoanService.GetBankAcctDetailsByAccountNo(newAcctNo).subscribe({
          next:(res)=>{
    
            this.ResponseData =  res;
          
            if(this.ResponseData != null && this.ResponseData.isActive)
            {
                this.BankAcctDetails =  this.ResponseData.dataLoad;
                this.acctName = this.BankAcctDetails?.account_name;
                return;
            }
            else{
    
              this.message = this.ResponseData.tryCatchMessage;
              Swal.fire({ title: 'Error!', text:  this.message, icon: 'error', confirmButtonText: 'Ok' });
              return;
            }
         
            // this.sweetalert.timedNofication('Connection Saved Successfully...')
    
          },
          error:(err)=>{
    
            // this.alertify.error('Error saving Connection...')
    
            this.message = "Error has occur " + err.message;
            Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

            return;
    
          }
        })
      }
      catch(exx:any){
        this.message = "Error has occur " + exx.message;
        Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

        return;
      }
  }

  private SizeValidation2(files:any):void
  {  
    const fi = files; 
    // Check if any file is selected. 
    if (fi.files.length > 0) { 
        for (let i = 0; i <= fi.files.length - 1; i++) { 
            const fsize = fi.files.item(i).size; 
            const file = Math.round((fsize / 1024)); 
            // The size of the file. 
            if (file >= 4096) { 
                alert("File too Big, please select a file less than 4mb"); 
            } 
        } 
    } 
  } 
  
  //onchange="TypeValidation1(); SizeValidation1();"

  private SizeValidation1(files:any):void
  {  
      const fi = files; 
      // Check if any file is selected. 
      if (fi.files.length > 0) { 
          for (let i = 0; i <= fi.files.length - 1; i++) 
          { 
              const fsize = fi.files.item(i).size; 
              const file = Math.round((fsize / 1024)); 
              // The size of the file. 
              if (file >= 4096) 
              { 
                  alert("File too Big, please select a file less than 4mb"); 
              } 
          } 
      } 
  } 

  private async ValidateFileUploadImageOld(FileUrl:string, Filedata:any, Data:any, Event:any): Promise<number> 
  {
        this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
      
        if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
        {
            this.onSignOut("/signin");
            return 2;
        }

        this.loadingService.setLoading(true);

        console.log(FileUrl);

        let FileNames = { FileName : FileUrl, AcctLogin: this.AcctId, size: '0' };
        
        await (await this.LapoLoanService.FileValidationImage(FileNames)).subscribe({
        next:(res)=>{
        
          this.loadingService.setLoading(false);
          this.ResponseData = res;
          if(this.ResponseData != null && this.ResponseData.isActive)
          {
              Filedata = Data;
              console.log(Filedata);
              return 1;
          }
          else
          {
              Event.target.value = null;
              Filedata = undefined;
              console.log(Filedata);
              Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
              return 2;
          }
        },
        error:(err:any):any=>
        {
            // console.log("no continue " + err);
            this.loadingService.setLoading(false);
            Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

            return 2;
        }
      })

      return 0;
  }

  private async GetAllMethidLoan(): Promise<void> 
  {
        
        this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
   
        if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
        {
            this.onSignOut("/signin");
            return;
        }
    
        this.loadingService.setLoading(true);
        await this.LapoLoanService.GetAdminLoanMethodList(parseInt(this.AcctId)).subscribe({
        next:(res)=>{
        
          this.loadingService.setLoading(false);
          this.ResponseData = res;
          if(this.ResponseData != null && this.ResponseData.isActive)
          {
              this.LoanTenuresList = this.ResponseData.dataLoad;
              return;
          }
          else
          {
              Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
              return;
          }
        },
        error:(err:any):any=>
        {
            this.loadingService.setLoading(false);
            Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
            return;
        }
      });
  }

  public ContainerSummary() :void
  {

    setTimeout(()=>{
      

           //  let Amt = this.loanAmount;
           let RefineryExit = this.AppStorage.VerifyIfDataExit(StaticData.LoanAcctBankSession)
           if(RefineryExit)
           {
                if(this.PassportPhotograph == undefined || this.PassportPhotograph == null)
                {
                  Swal.fire({ title: 'Warning!',  text: "Passport Photograph is required", icon: 'warning', confirmButtonText: 'Ok'
                  }).then((result) => {
                  if (result.isConfirmed) 
                  {
                    return;
                  }});
                  return;   
                }
        
              if(this.PaySliptfiles == undefined || this.PaySliptfiles == null)
              {
                  Swal.fire({ title: 'Warning!',  text: "Resent pay slip is required", icon: 'warning', confirmButtonText: 'Ok'
                }).then((result) => {
                  if (result.isConfirmed) 
                  {
                      return;
                  }
                });
                return;
              }
        
              if(this.StaffIdCard == undefined || this.StaffIdCard == null)
              {
                  Swal.fire({ title: 'Warning!',  text: "StaffId Card is required", icon: 'warning', confirmButtonText: 'Ok'
                }).then((result) => {
                  if (result.isConfirmed) {
                    
                            return;
                  }
                });
                return;
              }

              
            let newLoanApp =  new LoanAppDto();
            newLoanApp.LoanAmount = parseInt(this.loanAmount);
            newLoanApp.Ternor = this.loanTenure;
            newLoanApp.AccountId =  this.acctDetails .AccountId;
            newLoanApp.AcctName = this.acctName;
            newLoanApp.AcctNumber = this.acctNumber;
            newLoanApp.PFNumber = this.PersonalDetail.PFNumber;
            newLoanApp.BankName = this.bankName;
            newLoanApp.StaffIdCard = this.StaffIdCard;
            newLoanApp.PaySliptfiles = this.PaySliptfiles
            newLoanApp.PassportPhotograph = this.PassportPhotograph;
  
            //  console.log("Background 1" ,  this.PersonalDetail);
            //  console.log("Background 2" , this.BvnResponds);
            //  console.log("Background 3" , this.acctDetails);
            //  console.log("Background 4" , newLoanApp);
  
             this.shared.setPersonalDetails(this.PersonalDetail);
             this.shared.setBvnData(this.BvnResponds);
             this.shared.setDetailData(this.acctDetails); 
             this.shared.setLoanDetailsData(newLoanApp);


              let DataForm1 = { NewLoanApp: newLoanApp, PersonalDetails: this.PersonalDetail, BvnResponds:this.BvnResponds, AcctDetails: this.acctDetails};
              this.AppStorage.SaveHashData(DataForm1, StaticData.LoanAcctBankSession, '/apploanreview',null, true);
        
            // this.route.navigate(['/apploanreview']);
            return;
           }

      return;
    }, 100);
    return;
  }

  public ContainerAccountDetails() :void
  {
    setTimeout(()=>{
      
           let RefineryExit = this.AppStorage.VerifyIfDataExit(StaticData.LoanAcctBankSession)
           if(RefineryExit)
           {
              this.route.navigate(['/loanappdetails']);
              return;
           }

           return;
    }, 100);
    return;
  }

  public ContainerPersonalDetails() :void
  {
      setTimeout(()=> {
        
        let RefineryExit = this.AppStorage.VerifyIfDataExit(StaticData.LoanPersonnalSession)
        if(RefineryExit)
        {
          this.route.navigate(['/loanpersonaldetails']);
          return;
        }
        return;
      }, 100);
      return;
  }

  public onBackWard(event:any) : void
  { 
    setTimeout(()=> {  
      this.route.navigate(['/loanpersonaldetails']);
        return;
    }, 100);
    return;
  }

  public onAutoSignOut() : void
  { 
      window.setInterval(() => 
      {
          this.CheckSession();
      
      }, 100);
      return;
  } 

  public onViewScheduled(event:any) : void
  { 
        if(this.ViewScheduleding)
        {
            this.ViewScheduleding = false;
            return;
        }
        else
        {
            this.ViewScheduleding = true;
            return;
        }
        return;
  } 
  
  public async GetLoanSettings() : Promise<void>
  { 
     try
     {
              //   this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
          
             // this.loadingService.setLoading(true);
             
              await  this.LapoLoanService.GetAllLoanSettings('1.0.0.0.12').subscribe({
              next:(res) =>
               {
              
                this.loadingService.setLoading(false);
                this.ResponseData = res;
                if(this.ResponseData != null && this.ResponseData.isActive)
                {
                      this.AppSettings = this.ResponseData.dataLoad;
                      return;
                }
                else
                {
                      Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                      return;
                }
              },
              error:(err:any):any=>
              {
                      this.loadingService.setLoading(false);
                      Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
                      return;
              }
            })
     }
     catch(errx:any)
     {
        this.loadingService.setLoading(false);
        Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
        return;
     }
  } 

  public async onLoanTenureChanged(event:any) : Promise<void>
  { 
     var selectedTenured = event.target.value;
    
     try
     {
              this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
          
              if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
              {
                  this.onSignOut("/signin");
                  return;
              }

              if(this.loanAmount == undefined || this.loanAmount ==  "" || this.loanAmount <=  0)
              {
                  Swal.fire({ title: 'Warning!', text: 'Enter loan amount and try again.', icon: 'warning', confirmButtonText: 'Ok' })
                  return;
              }

              this.LayoutRepaymentScheduled = false;
            
              this.loadingService.setLoading(true);
              let DataChange = {'IPPISNumber': this.PersonalDetail.PFNumber, 'AccountId': this.AcctId, 'Amount': this.loanAmount , 'Tenure': selectedTenured };

              await  this.LapoLoanService.CalculateScheduledLoanAmount(DataChange).subscribe({
              next:(res) => {
              
                this.loadingService.setLoading(false);
                this.ResponseData = res;
                if(this.ResponseData != null && this.ResponseData.isActive)
                {
                    this.LoanScheduleData = this.ResponseData.dataLoad;
                    // console.log('Loan Schedule Data ', this.LoanScheduleData);
                    this.LayoutRepaymentScheduled = true;
                    return;
                }
                else
                {
                    this.LayoutRepaymentScheduled = false;
                    this.loadingService.setLoading(false);
                    Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                    return;
                }
              },
              error:(err:any):any=>
              {
                  // console.log("no continue " + err);
                  this.LayoutRepaymentScheduled = false;
                  this.loadingService.setLoading(false);
                  Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

                  return;
              }
            })
     }
     catch(errx:any)
     {
        this.LayoutRepaymentScheduled = false;
        this.loadingService.setLoading(false);
        Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });

        return;
     }
  } 

  public ContainerBVN() : void
  { 
    let LoanAcctBankExit = this.AppStorage.VerifyIfDataExit(StaticData.LoanAcctBankSession)
    let LoanPersonnalExit = this.AppStorage.VerifyIfDataExit(StaticData.LoanPersonnalSession)
    if(LoanPersonnalExit || LoanAcctBankExit)
    { 
        Swal.fire({
          title: 'Are you sure?',
          text: "Going back to BVN page will clear all the details you already filled!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#f97c00',
          cancelButtonColor: '#5b5b5b7f',
          confirmButtonText: 'Yes, I accept!'
        }).then((result) => 
        {
          if (result.isConfirmed) 
          {
            LocalStorageService.setLoginSessionIdentity(StaticData.LoanAcctBankSession, StaticData.LoanAcctBankSession);
            LocalStorageService.setLoginSessionIdentity(StaticData.LoanReviewSession, StaticData.LoanReviewSession);
            LocalStorageService.setLoginSessionIdentity(StaticData.LoanPersonnalSession, StaticData.LoanPersonnalSession);
            setTimeout(()=> {    this.route.navigate(['/loanbvnapp']); return; }, 100);
            return;
          }
        })
       
        return;
      }
      else{
        setTimeout(()=> {    this.route.navigate(['/loanbvnapp']); return; }, 100);
        return;
      }
      return;
  }

  public onAcctNumberChange(event:any):void
  {

      if(event.target.value.length >= 10)
      {
        if(event.target.value == undefined || event.target.value == "")
        {
              this.acctName  = "";
              this.bankName = "";
              Swal.fire({ title: 'Warning!', text: "Your Bank Account Number can not be empty space.", icon: 'warning', confirmButtonText: 'Ok' })
              return;
        }
        else if (event.target.value == this.AccountNumber)
        {
              this.acctNumber = this.AccountNumber;
              this.acctName  = this.AccountName;
              this.bankName =  this.BankName;
              return;
        }
        else
        {
              this.acctName  = "";
              this.bankName = "";
              Swal.fire({ title: 'Warning!', text: "Your Bank Account is invaild.", icon: 'warning', confirmButtonText: 'Ok' })
              return;
        }
      }
     
  }

  public onPasteAcctNumberChange(event:any):void
  {
      if(event.target.value.length >= 10)
      {
        if(event.target.value == undefined || event.target.value == "")
        {
              this.acctName  = "";
              this.bankName = "";
              Swal.fire({ title: 'Warning!', text: "Bank Account Number can not be empty space, Enter your Bank Account Number and try again", icon: 'warning', confirmButtonText: 'Ok' })
              return;
        }
        else if (event.target.value == this.AccountNumber)
        {
              this.acctNumber = this.AccountNumber;
              this.acctName  = this.AccountName ;
              this.bankName =  this.BankName;
              return;
        }
        else
        {    
              this.acctName  = "";
              this.bankName = "";
              Swal.fire({ title: 'Warning!', text: "Enter your Bank Account Number and try again", icon: 'warning', confirmButtonText: 'Ok' })
              return;
        }
      }
  }

  public async onBankNameChanged(event:any): Promise<void>
  {
      var Selected = event.target.value;
    
      try
      {
              this.BankSelectedName = Selected;
              this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
          
              if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
              {
                  this.onSignOut("/signin");
                  return;
              }

              if(this.acctNumber  == "" || this.acctNumber  == undefined || this.acctNumber  == null || this.acctNumber.length < 10)
              {
                  Swal.fire({ title: 'Warning!', text: 'Account Number is required', icon: 'warning', confirmButtonText: 'Ok' })
                  return;
              }

              this.loadingService.setLoading(true);
              let DataChange = {'Selected': Selected, 'AcctNumber': this.acctNumber };

              await  this.LapoLoanService.CalculateScheduledLoanAmount(DataChange).subscribe({
              next:(res) => 
              {
              
                this.loadingService.setLoading(false);
                this.ResponseData = res;
                if(this.ResponseData != null && this.ResponseData.isActive)
                {
                    this.LoanScheduleData = this.ResponseData.dataLoad;
                    return;
                }
                else
                {
                    this.loadingService.setLoading(false);
                    Swal.fire({ title: 'Warning!', text: 'Invalid bank account details. Please check and try again', icon: 'warning', confirmButtonText: 'Ok' })
                    return;
                }
              },
              error:(err:any):any=>
              {
                  this.loadingService.setLoading(false);
                  Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
                  return;
              }
            })
      }
      catch(errx:any)
      {
          this.loadingService.setLoading(false);
          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
          return;
      }
  }
  
  public async LoadAllBankLists(): Promise <void>
  {
        await this.LapoLoanService.GetAllBanksNameLists("").subscribe({
          next:(res)=>
          {
              this.ResponseData =  res;
            
              if(this.ResponseData!=null && this.ResponseData.isActive)
              {
                  this.AllBankLists =  this.ResponseData.dataLoad;
                  return;
              }
          },
          error:(err)=>
          {
              return;
          }
        })
  }

  public async onBankChanged(event:any): Promise<void>
  {
         var Selected = event.target.value;
    
          try
          {       

                  this.BankSelectedName = Selected;
                  this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
              
                  if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
                  {
                      this.onSignOut("/signin");
                      return;
                  }

                  if(this.acctNumber  == "" || this.acctNumber  == undefined || this.acctNumber  == null)
                  {
                      Swal.fire({ title: 'Warning!', text: "Bank Account Number is required", icon: 'warning', confirmButtonText: 'Ok' })
                      return;
                  }

                  this.loadingService.setLoading(true);
                  let dataChange = { 'Selected': Selected, 'AcctNo': this.acctNumber };

                  await this.LapoLoanService.RetrivetedBankAcctName(dataChange).subscribe({
                  next:(res) => 
                  {
                      this.loadingService.setLoading(false);
                      this.ResponseData = res;
                      if(this.ResponseData != null && this.ResponseData.isActive)
                      {
                          this.acctName = this.ResponseData.dataLoad.acctName;
                          this.AccountNumber = this.acctNumber;
                          this.AccountName =  this.acctName;
                          this.bankName1 = this.ResponseData.dataLoad.bankName;

                          // this.acctNumber = this.AccountNumber;
                          // this.bankName =  this.BankName;
                          return;
                      }
                      else
                      {
                          this.loadingService.setLoading(false);
                           Swal.fire({ title: 'Warning!', text: 'Invalid bank account details. Please check and try again', icon: 'warning', confirmButtonText: 'Ok' })
                          return;
                      }
                  },
                  error:(err:any):any=>
                  {
                      this.loadingService.setLoading(false);
                      Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
                      return;
                  }
                })
          }
          catch(errx:any)
          {
              this.loadingService.setLoading(false);
              Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
              return;
          }
  }

   private parentNode:any;
   public listDivisionTeamList:any = [];
   
   public async onTeamMemberChange(event:any, eventTarget:any):Promise<void>
   {
          try
          {
                    this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);

                    this.listDivisionTeamList = null;
                    
                   //   this.RelationshipOfficerFirstName = "Default";
                    this.RelationshipOfficerOtherName = "Default";
                    this.RelationshipOfficerRef = "Default";

                    var inputUser = event.target.value;
                    //  this.loadingService.setLoading(true);
                    this.IsErrorHappen = false;
                    this.IsProgressBarShowing = true;
                    
                    await this.LapoLoanService.GetE360UsersByTeamMember(this.AcctId, inputUser).subscribe({
                    next:(res)=>
                    {
                          this.loadingService.setLoading(false);
                          this.ResponseData = res;
                          this.IsErrorHappen = false;
                          this.IsProgressBarShowing = false;
                          if(this.ResponseData != null && this.ResponseData.isActive)
                          {
                              this.listDivisionTeamList = this.ResponseData.dataLoad;

                              if(this.parentNode != undefined && this.parentNode.style.display == null)
                              {
                                  this.parentNode.style.display = "block";
                              }
                              
                              // Swal.fire({ title: 'Success!', text: this.ResponseData.tryCatchMessage, icon: 'success', confirmButtonText: 'Ok' })
                              return;
                          }
                          else
                          {
                                this.IsErrorHappen = true;
                                this.IsProgressBarShowing = false;
                                // Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                                return;
                          }
                    },
                    error:(err):any=>
                    {
                        this.IsErrorHappen = true;
                        this.IsProgressBarShowing = false;
                        this.loadingService.setLoading(false);
                        // Swal.fire({ title: 'Error!', text: "An error occurred: " + err.message, icon: 'error', confirmButtonText: 'Ok' })
                        return;
                    }
                  });
          }
          catch(exx:any)
          {
                this.IsErrorHappen = true;
                this.IsProgressBarShowing = false;
                this.loadingService.setLoading(false);
                //  Swal.fire({ title: 'Error!', text: "An error occurred: " + exx.message, icon: 'error', confirmButtonText: 'Ok' })
                return;
          }
   }

   public onClickDivisionTeamEventHandler(event:any, item:any):void
   {
         try
         {
                  //  console.log("Child:", e.target);
                  //  console.log("Parent:", e.target.parentNode); 
                  //  console.log("Parents parent sibling:", e.target.parentNode.parentNode.nextSibling);
                  // e.target.parent()[0].style.display = "none";
                  //  this.EnterFirstName = item.firstName;
                  //  this.EnterTeamMemberID = item.itemCode;

                  this.RelationshipOfficerRef = item.itemCode;
                  this.RelationshipOfficerFirstName = item.firstName + "   " + item.lastName + "   " + item.otherName;
                  this.RelationshipOfficerOtherName = item.firstName + "," + item.otherName + "," + item.lastName;
             
                  this.IsProgressBarShowing = true;
                 // this.loadingService.setLoading(true);
             
                  this.LapoLoanService.ValidateRelationShipOfficer(this.RelationshipOfficerRef, this.RelationshipOfficerRef).subscribe({
                  next:(res) => 
                  {
                        this.loadingService.setLoading(false);
                        this.ResponseData = res;
                        this.IsProgressBarShowing = false;
                        if(this.ResponseData != null && this.ResponseData.isActive)
                        {
                            this.RelationshipOfficerRef = item.itemCode;
                            this.RelationshipOfficerFirstName = item.firstName + "   " + item.lastName + "   " + item.otherName;
                            this.RelationshipOfficerOtherName = item.firstName + "," + item.otherName + "," + item.lastName;
                        }
                        else
                        {
                            this.RelationshipOfficerRef = "";
                            this.RelationshipOfficerFirstName = "";
                            this.RelationshipOfficerOtherName = "";
                            Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                            return;
                        }
                  },
                  error:(err:any):any=>
                  {
                          this.IsProgressBarShowing = false;
                          this.RelationshipOfficerRef = "";
                          this.RelationshipOfficerFirstName = "";
                          this.RelationshipOfficerOtherName = "";
                          this.loadingService.setLoading(false);
                          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
                          return;
                  }
                 });

                 event.target.parentNode.style.display = "none";

                 // this.parentNode =  event.target.parentNode;

                 //  if (event.key === "Enter") 
                 //  {

                 //  }

                 // FirstName = splitNames[0] == null ? "" : splitNames[0],
                 // LastName = splitNames[1] == null ? "" : splitNames[1],
                 // OtnherName = splitNames[2] == null ? "" : splitNames[2],

                 // console.log("Console Log ", event.target.parentNode);
         }
         catch(ex:any)
         {
            this.IsProgressBarShowing = false;
            this.RelationshipOfficerRef = "";
            this.RelationshipOfficerFirstName = "";
            this.RelationshipOfficerOtherName = "";
            this.loadingService.setLoading(false);
         }
   }
}

