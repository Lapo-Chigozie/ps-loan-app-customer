import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import { BvnRespondsDto, NewLoanAppDto } from '../ps.loan.Models/BvnRespondsDto';
import { AppStorageService } from '../datatableservicehelper/app-storage.service';
import { RefineryService } from '../datatableservicehelper/refinery.service';
import { FileUploadService } from '../datatableservicehelper/file-upload.service';
import { DataSharedService } from '../ps.loan.Models/DataSharedService';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { FormBuilder } from '@angular/forms';
import { AppBasedComponent } from '../app-based/app-based.component';
import { PersonalDetailsDto } from '../ps.loan.Models/PersonalDetailsDto';
import { AccountDetailsDto } from '../ps.loan.Models/AccountInfoDto';
import { LoanAppDto } from '../ps.loan.Models/LoanAppDto';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import {  Inject, LOCALE_ID } from '@angular/core';
import { DecimalPipe, Location, formatNumber } from '@angular/common';
import { AppRouterService } from '../datatableservicehelper/app-router.service';
import { AppLoanHashs } from '../ps.loan.Models/AppLoanHashs';


@Component({
  selector: 'app-app-loan-review',
  templateUrl: './app-loan-review.component.html',
  styleUrls: ['./app-loan-review.component.css']
})
export class AppLoanReviewComponent extends AppBasedComponent implements OnInit , AfterViewInit  
{

  message:string = "";

  bvnAuth!: any 
  override ResponseData!: RespondMessageDto;

  BvnDetail:any =undefined;
  AcctDetail:any =undefined;
  ClientDetail :any=undefined;
  LoanDetailsData :any=undefined;

  Reasonforthisloan:any=undefined;

  AcceptedLoan:any = false;
  LsAcctName:any;
  LsBankName:any;
  LsTenor:any;
  LsAmount:any;nkAddress:any;
  nkPhoneNumer:any;
  nkFullName:any;
  LoFullName:any;
  LoPFNumber:any;
  LoDateOfBirth:any;
  LoResidentialAddress:any;
  LoMaritalStatus:any;
  LoAltPhoneNumber:any;
  LoPhoneNumber:any;
  BvnFirstName:any;
  BvnBVN:any;
  BvnMiddleName:any;
  BvnLastName:any;
  BvnLastName2:any;
  PernalPhone:any;
  ClientType:any;
  PersonalEmail:any;
  FullNume:any;
  AcctNumber:any;
  nkRelationShip:any;

  LoanScheduleData: any = undefined;

  FormarttedAmount:any;
  override AcctId:any;

  OfficerFirstName : any = undefined;
  OfficerOtherName : any = undefined;

  public override ProfileDetails:any;
  
public CusState :string | undefined;
public CusCity:string | undefined;

public CusStateName :string | undefined;
public CusCityName:string | undefined;

public CusBusinessTypeText :string | undefined;
public CusBusinessTypeValue:string | undefined;

public CusBusinessSegmentText :string | undefined;
public CusBusinessSegmentValue:string | undefined;

  newLoanApp = new NewLoanAppDto()

// constructor(private AppStorage: AppStorageService, private refineryService: RefineryService, private fileUpload: FileUploadService, private loadingService: LoaderService, private  shared: DataSharedService, private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanServiceService) 
// {
//     super(AppStorage, refineryService, fileUpload, loadingService, shared, route, router, LapoLoanService);
// }

constructor(@Inject(LOCALE_ID) override locale: string,  override location: Location,  override appRouter: AppRouterService,  override  loadingService: LoaderService, override  router: Router, override  route: ActivatedRoute, override  formBuilder: FormBuilder, override  LapoLoanService: LapoLoanApiService, private  shared: DataSharedService, private fileUpload: FileUploadService, private refineryService: RefineryService, private AppStorage: AppStorageService) 
{
  super(locale, location, appRouter, loadingService, router, route, formBuilder, LapoLoanService);
}

public override ngAfterViewInit(): void 
{

}

public onSignOut(event:any): void
{
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

                if(twofactor != StaticData.TwoLoginKeySession)
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

public onAutoSignOut() : void
{ 
window.setInterval(() => 
{
  this.CheckSession();

}, 100);
return;
} 

public override  ngOnInit(): void  
{
    this.ngOnLoanInit();
    this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
}

public override  OnLoadedProfileFinished(sender:any, object:any): void
{
    this.onAutoSignOut();
    this.CheckSession();
    this.OnLoading()
}

public OnLoading():void 
{
try
{
            // let apploan = {newLoanApp : newLoanApp,PersonalDetail:this.PersonalDetail, BvnResponds:this.BvnResponds, 
            //  acctDetails:this.acctDetails } 

            // let apploan1 = LocalStorageService.getLoanAppObject(StaticData.LoanAppSessionKey);
            //  console.log("All Datas " + apploan1);

            // this.BvnDetail =   apploan1.BvnResponds;
            // this.acctDetails = apploan1.acctDetails;
            // this.ClientDetails = apploan1.PersonalDetail;
            // this.LoanDetailsData = apploan1.newLoanApp;

            let BvnDetails =   this.shared.getBvnData();
            let AcctDetails = this.shared.getDetailData();
            let clientDetails = this.shared.getPersonalDetails();
            let loanDetails = this.shared.getLoanDetailsData();

            // console.log('Response Data Data 000 ', loanDetails );
            let RefineryExit = this.AppStorage.VerifyIfDataExit(StaticData.LoanAcctBankSession)
            if(RefineryExit && (BvnDetails==null || BvnDetails==undefined || AcctDetails==null || AcctDetails==undefined || clientDetails==null || clientDetails==undefined || loanDetails==null || loanDetails==undefined))
            {
                let codeResult = new AppLoanHashs();
                codeResult.TypeHash = StaticData.LoanAcctBankSession;
                codeResult.Data = "";
                codeResult.Hash =  LocalStorageService.getLoginSessionIdentity(StaticData.LoanAcctBankSession); 

                this.loadingService.setLoading(true);
              
                this.refineryService.DecriptConnector(codeResult).subscribe({
                next:(res)=> {

                  this.loadingService.setLoading(false);
                  this.ResponseData = res;
                  if(this.ResponseData != null && this.ResponseData.isActive)
                  { 
                        // console.log('Response Data Data 1000 ', codeResult );
                        // LocalStorageService.setLoginSessionIdentity(DataType, this.ResponseData.dataLoad); 
                        let Data2 = JSON.parse(this.ResponseData.dataLoad);
                        
                        BvnDetails = Data2.BvnResponds as BvnRespondsDto;
                        AcctDetails = Data2.AcctDetails as AccountDetailsDto;
                        clientDetails = Data2.PersonalDetails as PersonalDetailsDto;

                        if(loanDetails!= undefined && loanDetails!=null)
                        {
                            Data2.NewLoanApp.StaffIdCard = loanDetails.StaffIdCard;
                            Data2.NewLoanApp.PaySliptfiles = loanDetails.PaySliptfiles;
                            Data2.NewLoanApp.PassportPhotograph = loanDetails.PassportPhotograph;
                        }
                        
                        loanDetails = Data2.NewLoanApp as LoanAppDto;

                        this.BvnDetail = BvnDetails;
                        this.AcctDetail = AcctDetails;
                        this.ClientDetail = clientDetails;
                        this.LoanDetailsData = loanDetails;

                        //   this.LoanDetailsData
                        // LoanDetailsData
                        // console.log('Response Data Data 1 ', this.bankName ,this.acctNumber, this.loanAmount, this.loanTenure );
                        // return this.ResponseData.dataLoad;
                  }
                  else
                  {
                      LocalStorageService.setLoginSessionIdentity(StaticData.LoginAcctDetailsKeySession, StaticData.LoginAcctDetailsKeySession);
                      this.message = this.ResponseData.tryCatchMessage;
                      // Swal.fire({ title: 'Warning!', text:  this.message, icon: 'warning',  confirmButtonText: 'Ok' });
                      this.onNaviagateBack('/signin');
                      return;
                  }
              },
              error:(err:any)=>
              {
                  LocalStorageService.setLoginSessionIdentity(StaticData.LoginAcctDetailsKeySession, StaticData.LoginAcctDetailsKeySession);
                  this.loadingService.setLoading(false);
                  this.message = err.message;
                  // Swal.fire({ title: 'Error!',   text:  this.message, icon: 'error',  confirmButtonText: 'Ok' });
                  this.onNaviagateBack('/signin');
                  return;
              }      
            });

            }
            else
            {
                
            }

              if(BvnDetails == null || BvnDetails == undefined) 
              {
                this.onNaviagateBack('/signin');
                return;
              }

              if(AcctDetails == null || AcctDetails == undefined) {
              this.onNaviagateBack('/signin');
                return;
              }

              if(clientDetails == null || clientDetails == undefined) 
              {
                  this.onNaviagateBack('/signin');
                  return;
              }

              if(loanDetails == null || loanDetails == undefined) 
              {
                  this.onNaviagateBack('/signin');
                  return;
              }

              this.BvnDetail = BvnDetails as BvnRespondsDto;
              this.AcctDetail = AcctDetails as AccountDetailsDto;
              this.ClientDetail = clientDetails as PersonalDetailsDto;
              this.LoanDetailsData = loanDetails as LoanAppDto;

              //    console.log("Loan Bnak V N Details " , this.BvnDetail);
              //    console.log("Loan Acct Details " , this.AcctDetail);
              //    console.log("Loan Client Details " , this.ClientDetail);
              //    console.log("Loan Client Loan Details " , this.LoanDetailsData);

              if(this.BvnDetail == null || this.BvnDetail == undefined)
              {
                    Swal.fire({ title: 'Warning!',  text: 'An error has occur: BVN details is missing and try again.', icon: 'warning', confirmButtonText: 'Ok'}).then((result) => {
                    if (result.isConfirmed) 
                    {
                        this.onNaviagateBack('/signin');
                        return;
                    }});
                  return;
              }

              if(this.AcctDetail == null || this.AcctDetail == undefined) 
              {
                  Swal.fire({ title: 'Warning!',  text: 'An error has occur: Login details is missing and try again.', icon: 'warning', confirmButtonText: 'Ok'}).then((result) => {
                  if (result.isConfirmed) {
                      this.onNaviagateBack('/signin');
                      return;
                      }});
                  return;
            }

            if(this.ClientDetail == null || this.ClientDetail == undefined) {
              Swal.fire({ title: 'Warning!',  text: 'An error has occur: Cliemt or Customer details is missing and try again.', icon: 'warning', confirmButtonText: 'Ok'}).then((result) => {
                if (result.isConfirmed) {
                  this.onNaviagateBack('/signin');
                  return;
            }
            });
              return;
              }

            if(this.LoanDetailsData == null || this.LoanDetailsData ==undefined) {
            Swal.fire({ title: 'Warning!',  text: 'An error has occur: Loan Application and Salary Account details is missing and try again.', icon: 'warning', confirmButtonText: 'Ok'}).then((result) => {
              if (result.isConfirmed) {
                this.onNaviagateBack('/signin');
              
                  return;
                }
              });
              return;
          }

            if(this.BvnDetail != null && this.LoanDetailsData != null && this.ClientDetail != null && this.AcctDetail != null) 
            {

              if(this.BvnDetail.PhoneNumber1 == undefined || this.BvnDetail.PhoneNumber1 == undefined  || this.BvnDetail.BVN == undefined){
                StaticData.properties = true;
                this.onNaviagateBack('/signin');
                return;
              }

            if(this.AcctDetail.AccountId == undefined || this.AcctDetail.Email == undefined || this.AcctDetail.AccountType==undefined || this.AcctDetail.Phone==undefined){
              StaticData.properties = true;
              this.onNaviagateBack('/signin');
                return;
            }

              if(this.ClientDetail.PFNumber ==undefined || this.ClientDetail.PhoneNumber == undefined){
                StaticData.properties = true;
                this.onNaviagateBack('/signin');
              return;
            }

          this.AcctNumber   = this.LoanDetailsData. AcctNumber
          this.LsAcctName = this.LoanDetailsData. AcctName;
          this.LsBankName = this.LoanDetailsData.BankName;
          this.LsTenor = this.LoanDetailsData.Ternor;
          this.LsAmount = this.LoanDetailsData.LoanAmount;
          this.nkAddress = this.ClientDetail.nokaddress;
          this.nkPhoneNumer = this.ClientDetail.nokphone;
          this.nkFullName = this.ClientDetail.nokname;
          this.LoFullName = this.ClientDetail.fullname;
          this.LoPFNumber = this.LoanDetailsData.PFNumber;
          this.LoDateOfBirth = this.ClientDetail.DateOfBirth;
          this.LoResidentialAddress = this.ClientDetail.ResidentialAddress;
          this.LoMaritalStatus = this.ClientDetail.MaritalStatus;
          this.LoAltPhoneNumber = this.ClientDetail.AltPhoneNumber;
          
          this.CusStateName = this.ClientDetail.CusStateName;
          this.CusCityName  = this.ClientDetail.CusCityName;
          this.CusBusinessTypeText = this.ClientDetail.CusBusinessTypeText;
          // CusBusinessTypeValue; // CusBusinessSegmentValue;
          this.CusBusinessSegmentText = this.ClientDetail.CusBusinessSegmentText;
          

          this.LoPhoneNumber = this.BvnDetail.PhoneNumber1;
          this.BvnFirstName = this.BvnDetail.FirstName;
          this.BvnBVN = this.BvnDetail.BVN;
          this.BvnMiddleName = this.BvnDetail.MiddleName;
          this.BvnLastName = this.BvnDetail.LastName;
          this.BvnLastName2 = this.BvnDetail.LastName;
          this.PernalPhone = this.BvnDetail.PhoneNumber1;
          this.ClientType = this.AcctDetail.AccountType;
          this.PersonalEmail = this.AcctDetail.Email;
          this.FullNume = this.BvnDetail.FirstName;
          this.nkRelationShip = this.ClientDetail.RelationShip;

          this.OfficerOtherName = this.LoanDetailsData.OfficerOtherName;
          this.OfficerFirstName = this.LoanDetailsData.OfficerFirstName; 
          
          this.Reasonforthisloan = this.ClientDetail.Reasonforthisloan;

          this.onLoanTenureChanged();
          this.ConvertCurrency(this.LsAmount);
        
                // AccountI
                // console.log("Loan Bnak Verification Number Details " , this.BvnDetail);
                // console.log("Loan Acct Details " , this.AcctDetail);
                // console.log("Loan Client Details " , this.ClientDetail);
                // console.log("Loan Client Loan Details " , this.LoanDetailsData);

                return;
            }
            else
            {
                    StaticData.properties = true;
                    Swal.fire({ title: 'Warning!',  text: 'An error has occur: Loan Application details is missing and try again.', icon: 'warning', confirmButtonText: 'Ok'}).then((result) => {
                    if (result.isConfirmed) { this.onNaviagateBack('/signin');return;} });
                    return;
            }
            
            return;
        }
        catch(error:any)
        {
          //console.log('Display: ' + e);
          StaticData.properties = true;
          Swal.fire({ title: 'Uh-oh!',  text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
            if (result.isConfirmed) { this.onSignOut('/signin'); return; } });
          return;
        }
}

public async onLoanTenureChanged() : Promise<void>
{ 
 var selectedTenured = this.LsTenor;

 try
 {
          this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
      
          if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
          {
              this.onSignOut("/signin");
              return;
          }

          if(this.LsAmount == undefined || this.LsAmount ==  "" || this.LsAmount <=  0)
          {
            // Swal.fire({ title: 'Warning!', text: 'Enter loan amount and try again.', icon: 'warning', confirmButtonText: 'Ok' })
            return;
          }

          this.loadingService.setLoading(true);
          let DataChange = {'IPPISNumber': this.LoPFNumber, 'AccountId': this.AcctId, 'Amount': this.LsAmount , 'Tenure': selectedTenured };

          await  this.LapoLoanService.CalculateScheduledLoanAmount(DataChange).subscribe({
          next:(res) => {
          
            this.loadingService.setLoading(false);
            this.ResponseData = res;
            if(this.ResponseData != null && this.ResponseData.isActive)
            {
                this.LoanScheduleData = this.ResponseData.dataLoad;
                // console.log('Loan Schedule Data ', this.LoanScheduleData);
              
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
              Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
        return;
          }
        })
 }
 catch(errx:any)
 {
    this.loadingService.setLoading(false);
    Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
        return;
 }
} 

public override onNaviagateBack(page:string)
{
  this.router.navigate([page]);
}

public onAcceptedLoan(object:any):void
{
    try{
          if(object.target.checked){
            this.AcceptedLoan=true;
          }
          else{
            this.AcceptedLoan=false;
          }
          
    }
    catch(exp){
      this.AcceptedLoan=false;
    }
}

public async onContinue(event:any)
{    
     try
     {

       if(this.AcceptedLoan == false)
       {
              Swal.fire({ title: 'Warning!',  text: "You must read and accept the loan terms and conditions", icon: 'warning', confirmButtonText: 'Ok'}).then((result) => {
                if (result.isConfirmed) { } });
       }
       else
       {

        if(this.LoanDetailsData == null || this.LoanDetailsData == undefined || this.ClientDetail==null || this.ClientDetail==undefined || this.AcctDetail==null || this.AcctDetail==undefined || this.BvnDetail==null || this.BvnDetail==undefined)
        {
              Swal.fire({ title: 'Error!',  text: "Session has expired, sign out and try again", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
                if (result.isConfirmed) { this.onSignOut("/signin") } }); 
                return;
        }

        if(this.LoanDetailsData?.PassportPhotograph == undefined || this.LoanDetailsData?.PassportPhotograph == null)
        {
              Swal.fire({ title: 'Warning!',  text: "Passport Photograph is required", icon: 'warning', confirmButtonText: 'Ok'
              }).then((result) => {
              if (result.isConfirmed) 
              { return; }});

              return;   
        }

        if(this.LoanDetailsData?.PaySliptfiles == undefined || this.LoanDetailsData?.PaySliptfiles == null  )
        {
              Swal.fire({ title: 'Warning!',  text: "Resent pay slip is required", icon: 'warning', confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.isConfirmed) 
                {  return; }
              });
              return;
        }

      if(this.LoanDetailsData?.StaffIdCard == undefined || this?.LoanDetailsData.StaffIdCard == null)
      {
              Swal.fire({ title: 'Warning!',  text: "StaffId Card is required", icon: 'warning', confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.isConfirmed) 
                {  return;  }
              });
              return;
      }


     // this. newLoanApp.LoanDetailsData?.PassportPhotograph = null;
     // this. newLoanApp.LoanDetailsData?.PaySliptfiles = null;
    //  this. newLoanApp.LoanDetailsData?.PaySliptfiles = null;

    Swal.fire({
      title: 'Notices?',
      text: "If you click 'Yes, Apply' you won't be able to make changes to this application.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97c00',
      cancelButtonColor: '#5b5b5b7f',
      confirmButtonText: 'Yes, Apply!',
      cancelButtonText: "No, Don't Apply!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.CreateLoanApplication();
      }
    })

    // const swalWithBootstrapButtons = Swal.mixin({
    //   customClass: {
    //     confirmButton: 'btn btn-success',
    //     cancelButton: 'btn btn-danger'
    //   },
    //   buttonsStyling: true
    // });
    
    // swalWithBootstrapButtons.fire({
    //   title: 'Warning?',
    //   text: "Are you sure that you are ready to apply for this loan?!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes, Apply!',
    //   cancelButtonText: "No, Don't Apply!",
    //   reverseButtons: true
    // }).then((result) => {
    //   if (result.isConfirmed) {
        
    //   } else if (
    //     /* Read more about handling dismissals below */
    //      result.dismiss === Swal.DismissReason.cancel ) {  } });
         
          return;
       }
       return;
    }
    catch(exa:any){
      Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
        return;
    }
}

private async ConvertCurrency(amount:string):Promise<void>
{
try{

 // console.log('Loan Details',  this. newLoanApp.LoanDetailsData);

  await this.LapoLoanService.ConvertLoanAmount(amount).subscribe({
    next:(res)=>{
      this.FormarttedAmount =  amount;
      this.ResponseData =  res;
     
      if(this.ResponseData != null && this.ResponseData.isActive)
      {
         this.FormarttedAmount=this.ResponseData.dataLoad
      }
      else{
      
        this.FormarttedAmount =  amount;
        this.loadingService.setLoading(false);
        this.message = this.ResponseData.tryCatchMessage;
       // Swal.fire({ title: 'Error!', text:  this.message, icon: 'error', confirmButtonText: 'Ok' });
        return;
      }
    },
    error:(err)=>
    {
      this.FormarttedAmount =  amount;
      this.loadingService.setLoading(false);
      this.message = "Error has occur " + err.message;
      // Swal.fire({ title: 'Error!', text:  this.message, icon: 'error', confirmButtonText: 'Ok'});
      return;
    }
  })

  return;
}
catch(err:any)
{this.FormarttedAmount =  amount;
  this.loadingService.setLoading(false);
  this.message = "Error has occur " + err.message;
 // Swal.fire({ title: 'Error!', text:  this.message, icon: 'error', confirmButtonText: 'Ok'});
  return;
}
}

private async CreateLoanApplication():Promise<void>
{
try
{

    // Swal.fire({ title: 'Warning!', text:  'Work on progress, Loan Scheduled and Interest Rate is on progress', icon: 'warning', confirmButtonText: 'Ok' });
    // return;

    if(this.LoanDetailsData == null || this.LoanDetailsData == undefined || this.ClientDetail == null || this.ClientDetail == undefined || this.AcctDetail == null || this.AcctDetail == undefined || this.BvnDetail == null || this.BvnDetail==undefined)
    {
          Swal.fire({ title: 'Error!',  text: "Session has expired, sign out and try again", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
          if (result.isConfirmed) { this.onSignOut("/signin") } });
          return;
    }

    this.loadingService.setLoading(true);
    this.newLoanApp = new NewLoanAppDto();
    this.newLoanApp.BvnDetail = this.BvnDetail;
    this.newLoanApp.AcctDetail = this.AcctDetail;
    this.newLoanApp.ClientDetail = this.ClientDetail;
    this.newLoanApp.LoanDetailsData = this.LoanDetailsData;

    // console.log('BVN Details',   this. newLoanApp.BvnDetail);
    // console.log('Acct Details',   this.  newLoanApp.AcctDetail);
    // console.log('Client Details',   this.  newLoanApp.ClientDetail );
    // console.log('Loan Details',  this. newLoanApp.LoanDetailsData);

    try 
    {
        await this.LapoLoanService.CreateNewLoanApplication(this.newLoanApp).subscribe({
        next:(res)=>
        {
          this.ResponseData =  res;
          // console.log('Return Data', this.ResponseData)
          if(this.ResponseData != null && this.ResponseData.isActive)
          {
                // this.route.navigate(["/apploanapplicationStatus"]);
                this.UploadPassport(this.newLoanApp.LoanDetailsData?.PassportPhotograph ,  this.newLoanApp.LoanDetailsData?.AccountId,  this.newLoanApp.LoanDetailsData?.PFNumber);
                return;
          }
          else
          {
                this.loadingService.setLoading(false);
                this.message = this.ResponseData.tryCatchMessage;
                Swal.fire({ title: '', text:  this.message, icon: 'warning', confirmButtonText: 'Ok' });
                return;
          }
        },
        error:(err)=>
        {
                this.loadingService.setLoading(false);
                this.message = "Error has occur " + err.message;
                Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                return;
        }
      })
    }
    catch(err:any)
    {
      Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
      return;
    }

  return;
}
catch(err1:any)
{
                this.loadingService.setLoading(false);
                this.message = "Error has occur " + err1.message;
                Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                return;
}
}

public UploadPassport(files:any , PFNumber: any, AcctId:any):void
{
try{
  this.loadingService.setLoading(true);
  this.fileUpload.UploadPassport(files , PFNumber, AcctId).subscribe({
    next: (event) => {
      this.loadingService.setLoading(false);
      this.ResponseData = event;
      if(this.ResponseData!=null && this.ResponseData.isActive)
      {
        this.UploadStaffIdCard(this.newLoanApp.LoanDetailsData?.StaffIdCard , PFNumber, AcctId)
        //  Swal.fire({ title: 'Success!',  text: this.ResponseData.tryCatchMessage, icon: 'success', confirmButtonText: 'Ok'}).then((result) => {
        //   if (result.isConfirmed) {
        //     this.reloadPage();
        //     return;
        //   }
        // });
         return;
      }
      else{
           // this.alertify.error('Error saving Connection...')
          Swal.fire({title: 'Error!', text: this.ResponseData.tryCatchMessage, icon: 'error',   confirmButtonText: 'Ok'}).then((result) => {
            if (result.isConfirmed) {
             //  this.reloadPage();
              return;
            }
          });
          
      }
   
  },
  error: (err: HttpErrorResponse) => {
    this.loadingService.setLoading(false);
   
Swal.fire({ title: 'Uh-oh!',  text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
if (result.isConfirmed) { this.reloadPage();
return; } });
return;
  
  }
});
}
catch(err:any)
{

this.loadingService.setLoading(false);

Swal.fire({ title: 'Uh-oh!',  text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
if (result.isConfirmed) { this.reloadPage();
return; } });
return;
}

}

public UploadStaffIdCard(files:any , PFNumber: any, AcctId:any):void
{
      try
{
  this.loadingService.setLoading(true);
  this.fileUpload.UploadIDCard(files , PFNumber, AcctId).subscribe({
    next: (event) => {
      this.loadingService.setLoading(false);
      this.ResponseData = event;
      if(this.ResponseData!=null && this.ResponseData.isActive)
      {
        this.UploadPaySliptfiles(this.newLoanApp.LoanDetailsData?.PaySliptfiles , PFNumber, AcctId)
        //  Swal.fire({ title: 'Success!',  text: this.ResponseData.tryCatchMessage, icon: 'success', confirmButtonText: 'Ok'}).then((result) => {
        //   if (result.isConfirmed) {
        //     this.reloadPage();
        //     return;
        //   }
        // });
        // return;
      }
      else{
           // this.alertify.error('Error saving Connection...')
          Swal.fire({title: 'Error!', text: this.ResponseData.tryCatchMessage, icon: 'error',   confirmButtonText: 'Ok'}).then((result) => {
            if (result.isConfirmed) {
              // this.reloadPage();
             // return;
            }
          });
         // return;
      }
   // return;
  },
  error: (err: HttpErrorResponse) => {
    this.loadingService.setLoading(false);
    Swal.fire({ title: 'Error!',  text: 'An error has occur, Check internet connection and try again', icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
      if (result.isConfirmed) 
      {
            // this.reloadPage();
            return;
      }
    });
    return;
  }
});
}
catch(err:any)
{
  this.loadingService.setLoading(false);
  Swal.fire({ title: 'Uh-oh!',  text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
    if (result.isConfirmed) { this.reloadPage();
      return; } });
  return;
  };
}

public UploadPaySliptfiles(files:any , PFNumber: any, AcctId:any):void
{
          try
          {
            
            this.loadingService.setLoading(true);
            this.fileUpload.UploadPayslip(files , PFNumber, AcctId).subscribe({
              next: (event) => 
              {
                this.loadingService.setLoading(false);
                this.ResponseData = event;
                if(this.ResponseData != null && this.ResponseData.isActive)
                {
                      let message = "Your loan application has been submitted for review. We will notify you once it has been authorized.";
                      let title = "Your loan request is successful!";
                      let imageName = "messageSuccessImage.png";
                      this.router.navigate(['/apploanapplicationStatus'], { queryParams: { messageTitle : title, statusMessge : message, imageName : imageName, SiginLink:  StaticData.SiginLink1(), Issuccessfully : true }});
                      return;
                 
                      //  Swal.fire({ title: 'Success!',  text: this.ResponseData.tryCatchMessage, icon: 'success', confirmButtonText: 'Ok'}).then((result) => {
                      //   if (result.isConfirmed) {
                      //     this.reloadPage();
                      //     return;
                      //   }
                      // });
      
                }
                else
                {
                          // this.alertify.error('Error saving Connection...')
                          Swal.fire({title: 'Error!', text: this.ResponseData.tryCatchMessage, icon: 'error',   confirmButtonText: 'Ok'}).then((result) => {
                            if (result.isConfirmed) {
                            // this.reloadPage();
                              // return;
                            }
                          });
                        //  return;
                }
            //  return;
            },
            error: (err: HttpErrorResponse) => 
            {
                  this.loadingService.setLoading(false);
                  Swal.fire({ title: 'Error!',  text: 'An error has occur, Check internet connection and try again', icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
                    if (result.isConfirmed) {
                      this.reloadPage();
                      return;
                    }
                  });
                  return;
            }
        });
        
      }
      catch(err:any)
      {
            this.loadingService.setLoading(false);         
            Swal.fire({ title: 'Uh-oh!',  text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
              if (result.isConfirmed) { this.reloadPage();
                return; } });
            return;
      };
}

private reloadPage() :void
{
setTimeout(()=>{
  window.location.reload();return;
}, 100);
return;
}

public ContainerSummary() :void
{
      let RefineryExit = this.AppStorage.VerifyIfDataExit(StaticData.LoanAcctBankSession)
      if(RefineryExit)
      {
        this.router.navigate(['/apploanreview']);
        return;
      }
      return;
}

public ContainerAccountDetails() :void
{
       let RefineryExit = this.AppStorage.VerifyIfDataExit(StaticData.LoanAcctBankSession)
       if(RefineryExit)
       {
          this.router.navigate(['/loanappdetails']);
          return;
       }
       return;
}

public ContainerPersonalDetails() :void
{
        let RefineryExit = this.AppStorage.VerifyIfDataExit(StaticData.LoanPersonnalSession)
        if(RefineryExit)
        {
          this.router.navigate(['/loanpersonaldetails']);
          return;
        }
        return;
}

public onBackWard(event:any) : void
{ 
  setTimeout(()=> {  
    this.router.navigate(['/loanappdetails']);
      return;
  }, 100);
  return;
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
        setTimeout(()=> {    this.router.navigate(['/loanbvnapp']); return; }, 100);
        return;
      }
    })
   
    return;
  }
  else
  {
          setTimeout(()=> { this.router.navigate(['/loanbvnapp']); return; }, 100);
          return;
  }
  
  return;
}
}
