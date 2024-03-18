import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { RefineryService } from '../datatableservicehelper/refinery.service';
import { AppStorageService } from '../datatableservicehelper/app-storage.service';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { DataSharedService } from '../ps.loan.Models/DataSharedService';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { PersonalDetailsDto } from '../ps.loan.Models/PersonalDetailsDto';
import { BvnAuthDto } from '../ps.loan.Models/BvnAuthDto';
import { AccountDetailsDto } from '../ps.loan.Models/AccountInfoDto';
import { BvnRespondsDto } from '../ps.loan.Models/BvnRespondsDto';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { StaticData } from '../ps.loan.Models/StaticData';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { AppLoanHashs } from '../ps.loan.Models/AppLoanHashs';
import { DatePipe } from '@angular/common';
import {  NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-loan-personal-details',
  templateUrl: './loan-personal-details.component.html',
  styleUrls: ['./loan-personal-details.component.css'],
  providers: [DatePipe]
})
export class LoanPersonalDetailsComponent implements OnInit {

  datePipe: DatePipe = new DatePipe('en-US');
  
  message:string = "";
  TokenMessage:string="";

  bvnAuth!: BvnAuthDto 
  acctDetails !:AccountDetailsDto;
  BvnResponds !:BvnRespondsDto;
  ResponseData!: RespondMessageDto;

  Reasonforthisloan:string | undefined;
  ReasonforthisloanList:any | undefined;

  

  fullname:string | undefined ;
  PFNumber:any = "";
  DateOfBirth:any ;
  PhoneNumber:any;
  AltPhoneNumber:any  ;
  ResidentialAddress:string | undefined ;
 
  MaritalStatus:string | undefined ;
  nokname:string | undefined ;
  nokphone:any ;
  nokaddress:string | undefined ;
  transformDate: any ="";

  RelationShip:string | undefined ;

  EnableButton:boolean = true;
  IsProcessing:boolean = false;

  AcctId:string | undefined ;
  myDate = new Date();

  PersonalDetail!:PersonalDetailsDto;

  public CusState :string | undefined ;
  public CusCity:string | undefined ;

  public CusStateName :string | undefined ;
  public CusCityName:string | undefined ;

  public CusBusinessTypeText :string | undefined ;
  public CusBusinessTypeValue:string | undefined ;

  public CusBusinessSegmentText :string | undefined ;
  public CusBusinessSegmentValue:string | undefined ;

  public StateLists:any | undefined;
  public CityLists:any | undefined;

  public BusinessTypeLists:any | undefined;
  public BusinessSegmentLists:any | undefined;

  constructor(private refineryService: RefineryService, private AppStorage: AppStorageService, private PickerDate: DatePipe, private loadingService: LoaderService,private  shared: DataSharedService,private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanApiService) {

   // this.myDate = this.PickerDate.transform(this.myDate, 'yyyy-MM-dd');
  }
  
  public onAutoSignOut() : void
  { 
    window.setInterval(() => 
    {
      this.CheckSession();
     
    }, 100);
    return;
  } 

  async ngOnInit()
  {
       try
       {
            this.onAutoSignOut();
            this.CheckSession();

            let BvnDetail =   this.shared.getBvnData();
            let AcctDetail = this.shared.getDetailData();

            let RefineryExit = this.AppStorage.VerifyIfDataExit(StaticData.LoanPersonnalSession);
            // (BvnDetail==null || BvnDetail ==undefined || AcctDetail==null || AcctDetail ==undefined)
            if(RefineryExit)
            {
                  let codeResult = new AppLoanHashs();
                  codeResult.TypeHash = StaticData.LoanPersonnalSession;
                  codeResult.Data = "";
                  codeResult.Hash =  LocalStorageService.getLoginSessionIdentity(StaticData.LoanPersonnalSession); 

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
                        
                          BvnDetail = Data2.BvnResponds as BvnRespondsDto
                          AcctDetail = Data2.AcctDetails as AccountDetailsDto
                          this.PersonalDetail = Data2.PersonalDetails as PersonalDetailsDto

                          this.AltPhoneNumber =  this.PersonalDetail.AltPhoneNumber;
                          this.DateOfBirth =  this.PersonalDetail.DateOfBirth;
                          this.PFNumber = this.PersonalDetail.PFNumber;
                          this.nokname =   this.PersonalDetail.nokname ;
                          this.nokaddress = this.PersonalDetail.nokaddress;
                          this.bvnAuth =  this.PersonalDetail.bvnAuth ;
                          this.fullname = this.PersonalDetail.fullname ;
                          this.nokphone = this.PersonalDetail.nokphone;
                          this.RelationShip = this.PersonalDetail.RelationShip;
                          this.ResidentialAddress = this.PersonalDetail.ResidentialAddress;
                          this.MaritalStatus =  this.PersonalDetail.MaritalStatus ;
                          this.PhoneNumber = this.PersonalDetail.PhoneNumber;

                          this.Reasonforthisloan = this.PersonalDetail.Reasonforthisloan;

                          this.EnableButton = true;
                          if(this.PFNumber != undefined && this.PFNumber != null)
                          {   
                            this.IsProcessing = true;
                            // console.log('Response Data Data', this.PFNumber);
                            this.PFNumberValidation(this.PFNumber);
                          }
                        
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

              // let RefineryData = this.GetHashData(StaticData.LoanPersonnalSession);
              // console.log("Refinery Data", RefineryData);
              // if(RefineryData != undefined && RefineryData != null && RefineryData != 0)
              // {
              //    console.log("Refinery Data", RefineryData);
              //    // BvnDetail as BvnRespondsDto
              //    // AcctDetail as AccountDetailsDto
              // }
           }

           if(BvnDetail != null && AcctDetail != null && BvnDetail != undefined && AcctDetail != undefined) 
           {
                  let BvnDetail1 = BvnDetail as BvnRespondsDto;
                  let AcctDetail1 = AcctDetail as AccountDetailsDto;

                  if(BvnDetail1.PhoneNumber1==undefined || BvnDetail1.ResponseCode ==undefined || BvnDetail1.BVN==undefined || BvnDetail1.PhoneNumber1=="" || BvnDetail1.ResponseCode =="" || BvnDetail1.BVN=="")
                  {
                        StaticData.properties = true;
                        this.onNaviagateBack('/signin');
                        return;
                  }

                  if( AcctDetail1.AccountId==undefined || AcctDetail1.Email ==undefined || AcctDetail1.AccountType==undefined || AcctDetail1.Phone== undefined || AcctDetail1.AccountId=="" || AcctDetail1.Email =="" || AcctDetail1.AccountType=="" || AcctDetail1.Phone=="")
                  {
                    StaticData.properties = true;
                    this.onNaviagateBack('/signin');
                    return;
                  }

                  this.GetUserProfileDetails();
                  StaticData.properties = true;
                  this.acctDetails = AcctDetail;
                  this.BvnResponds = BvnDetail;
                  this.DisplayDetails();
           }
           else
           {
                   StaticData.properties = true;
                   this.onNaviagateBack('/signin');
                   return;
           }
       }
       catch(er:any)
       {
            StaticData.properties = true;
            this.onNaviagateBack('/signin');
            return;
       }
  }

  public async onStateChange(event:any) : Promise<void>
  {
      try
      {
           this.CusStateName = event.target.options[event.target.options.selectedIndex].text;
           this.CusState = event.target.value;

          //  alert(this.CusStateName );
          //  alert(this.CusState );

           this.CityLists = null;
           this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
           this.loadingService.setLoading(true);
   
           await this.LapoLoanService.GetListOfCities(this.CusState).subscribe({
           next:(res)=>
           {
           
             this.loadingService.setLoading(false);
             this.ResponseData = res;
             if(this.ResponseData != null && this.ResponseData.isActive)
             {
                 this.CityLists = this.ResponseData.dataLoad;
                 return;
             }
             else
             {
                 Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                 return;
             }
           },
           error:(err:any) : any=>
           {
               this.loadingService.setLoading(false);
               Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
               return;
           }
         });

      }
      catch(ex:any)
      {
          this.loadingService.setLoading(false);
          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
          return;
      }
  }

  public onCityChange(event:any) : void
  {
      try
      {
            this.CusCityName =  event.target.options[event.target.options.selectedIndex].text;
            this.CusCity = event.target.value;
      }
      catch(ex:any)
      {

      }
  }

  public async onBusinessSegmentChange(event:any) : Promise<void>
  {
      try
      {
           this.CusBusinessSegmentText =  event.target.options[event.target.options.selectedIndex].text;
           this.CusBusinessSegmentValue = event.target.value;
      }
      catch(ex:any)
      {
          this.loadingService.setLoading(false);
          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
          return;
      }
  }

  public async onBusinessTypeChange(event:any) : Promise<void>
  {
      try
      {
           this.CusBusinessTypeText =  event.target.options[event.target.options.selectedIndex].text;
           this.CusBusinessTypeValue = event.target.value;
      }
      catch(ex:any)
      {
          this.loadingService.setLoading(false);
          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
          return;
      }
  }

  private async GetAllStates(): Promise<void> 
  {
        try
        {
                      this.StateLists = null;
                      this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
                      this.loadingService.setLoading(true);
              
                      await this.LapoLoanService.GetListOfStates(this.AcctId).subscribe({
                      next:(res)=>
                      {
                        this.GetAllBusinessSegment();
                        this.loadingService.setLoading(false);
                        this.ResponseData = res;
                        if(this.ResponseData != null && this.ResponseData.isActive)
                        {
                            this.StateLists = this.ResponseData.dataLoad;
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
                         this.GetAllBusinessSegment();
                          // console.log("no continue " + err);
                          this.loadingService.setLoading(false);
                          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                          return;
                      }
                    });
        }
        catch(err:any)
        { 
          this.GetAllBusinessSegment();
            this.loadingService.setLoading(false);
            Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
            return;
        }
  }

  private async GetAllBusinessSegment(): Promise<void> 
  {
        try
        {
                      this.BusinessSegmentLists = null;
                      this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
                      this.loadingService.setLoading(true);
              
                      await this.LapoLoanService.GetListOfBusinessSegments(this.AcctId).subscribe({
                      next:(res)=>
                      {
                            this.GetAllBusinessType();
                            this.loadingService.setLoading(false);
                            this.ResponseData = res;
                            if(this.ResponseData != null && this.ResponseData.isActive)
                            {
                                this.BusinessSegmentLists = this.ResponseData.dataLoad;
                                if(this.BusinessSegmentLists!=null)
                                {
                                    this.CusBusinessSegmentText =this.BusinessSegmentLists[0].name;
                                    this.CusBusinessSegmentValue =this.BusinessSegmentLists[0].id;
                                }
                               
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
                          this.GetAllBusinessType();
                          this.loadingService.setLoading(false);
                          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                          return;
                      }
                    });
        }
        catch(err:any)
        { 
            this.GetAllBusinessType();
            this.loadingService.setLoading(false);
            Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
          return;
        }
  }

  private async GetAllBusinessType(): Promise<void> 
  {
        try
        {
                      this.BusinessTypeLists = null;
                      this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
                      this.loadingService.setLoading(true);
              
                      await this.LapoLoanService.GetListOfBusinessType(this.AcctId).subscribe({
                      next:(res)=>
                      {
                            this.loadingService.setLoading(false);
                            this.ResponseData = res;
                            if(this.ResponseData != null && this.ResponseData.isActive)
                            {
                                this.BusinessTypeLists = this.ResponseData.dataLoad;
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
                          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                          return;
                      }
                    });
        }
        catch(err:any)
        { 
            this.loadingService.setLoading(false);
            Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
            return;
        }
  }

  private async GetAllNarrations(): Promise<void> 
  {
          try
          {
                          this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
                          this.loadingService.setLoading(true);
                  
                          await this.LapoLoanService.GetListOfNarrationList(this.AcctId).subscribe({
                          next:(res)=>
                          {
                                  this.loadingService.setLoading(false);
                                  this.ResponseData = res;
                                  this.GetAllStates();
                                  if(this.ResponseData != null && this.ResponseData.isActive)
                                  {
                                      this.ReasonforthisloanList = this.ResponseData.dataLoad;
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
                              this.GetAllStates();
                              this.loadingService.setLoading(false);
                              Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                              return;
                          }
                        });
          }
          catch(err:any)
          {
              this.GetAllStates();
          }
  }

  public GetHashData(DataType: any): any 
  {
            let codeResult = new AppLoanHashs();
            codeResult.TypeHash = DataType;
            codeResult.Data = "";
          
            codeResult.Hash =  LocalStorageService.getLoginSessionIdentity(DataType); 

            this.loadingService.setLoading(true);
            
            this.refineryService.DecriptConnector(codeResult).subscribe({
              next:(res)=> {

                this.loadingService.setLoading(false);
              
                this.ResponseData = res;

                if(this.ResponseData != null && this.ResponseData.isActive)
                { 
                  // LocalStorageService.setLoginSessionIdentity(DataType, this.ResponseData.dataLoad); 
                  ///console.log('Response Data Data', this.ResponseData.dataLoad);
                  return this.ResponseData.dataLoad;
                }
                else
                {
                    LocalStorageService.setLoginSessionIdentity(DataType, DataType);
                    this.message = this.ResponseData.tryCatchMessage;
                    Swal.fire({ title: 'Warning!', text:  this.message, icon: 'warning',  confirmButtonText: 'Ok' });
                    return 0;
                }

                return 0;
            },
            error:(err:any)=>
            {
              LocalStorageService.setLoginSessionIdentity(DataType, DataType);
                this.loadingService.setLoading(false);
                console.log('Error' + err);
                this.message = err.message;
                Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
              
                return 0;
            }
            
            
          });
  }

  public onSignOut(event:any)
  {
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
      else
      {
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

  private DisplayDetails() : void  
  {

      this.GetAllNarrations();

      if(this.BvnResponds!=null)
      {
          this.fullname = this.BvnResponds.FirstName + ' ' + this.BvnResponds.LastName + " " + this.BvnResponds.MiddleName;
          this.DateOfBirth = this.BvnResponds.DateOfBirth;
          this.PhoneNumber = this.BvnResponds.PhoneNumber1;
      }
    
      if(this.acctDetails!=null)
      {
          this.AltPhoneNumber = this.acctDetails.AltPhone;
          this.ResidentialAddress = this.acctDetails.CurrentAddress;
      }
    
      if(this.PersonalDetail != null)
      {
          this.Reasonforthisloan = this.PersonalDetail.Reasonforthisloan;
          this.CusState = this.PersonalDetail.CusState;
          this.CusCity = this.PersonalDetail.CusCity;
          this.CusBusinessTypeValue = this.PersonalDetail.CusBusinessTypeValue;
          this.CusBusinessSegmentValue = this.PersonalDetail.CusBusinessSegmentValue;
      }
   
      // this.MaritalStatus = '';
      // this.nokname = '';
      // this.nokphone = '';
      // this.nokaddress = '';
  }

  private onNaviagateBack(page:string){
    this.route.navigate([page]);
  }

  private IsOnDateOfBirtCheck: boolean = false;

  public TypeValidation1(event:any)
  {
    try
    {
      if(this.IsOnDateOfBirtCheck == false && event.target.length >= 8)
      {
        this.IsOnDateOfBirtCheck=true;
        this.DateOfBirth = event.target.value;
        if(this.DateOfBirth == "" ||  this.DateOfBirth == undefined)
        {
            this.message = "Date-Of-Birth is required";
            Swal.fire({ title: 'Warning!', text:  this.message,
              icon: 'warning', confirmButtonText: 'Ok'}).then((result) => {
                if (result.isConfirmed) {this.IsOnDateOfBirtCheck=false; return;  } });
              return;
        }
  
        let year = new Date(this.DateOfBirth).getFullYear();
  
        let date = new Date();
        this.transformDate = this.datePipe.transform(date, 'yyyy-MM-dd')?.toString();
        let CurrentYear = new Date(this.transformDate).getFullYear();
        let AvgAcceptYear =  CurrentYear - year;
  
        if(AvgAcceptYear < 18 || AvgAcceptYear > StaticData.MaxClientAgeRetirement)
        {
          this.message = "Date-Birth, Age between 18 - 65 years is valid to apply for this loan.";
          Swal.fire({ title: 'Warning!', text:  this.message, icon: 'warning', confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.IsOnDateOfBirtCheck=false;
              return;
            }
          });
          return;
        }
        else
        {
          this.IsOnDateOfBirtCheck=false;
          return;
        }
      }
    }
    catch(error:any)
    {
      this.message = error.message;
      // Swal.fire({title: 'Warning!',  text:  this.message, icon: 'warning', confirmButtonText: 'Ok'}).then((result) => {
      //   if (result.isConfirmed) {
      //     this.IsOnDateOfBirtCheck=false;  return;  } });
      // return;

      Swal.fire({ title: 'Uh-oh!',  text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok'}).then((result) => {
        if (result.isConfirmed) {   this.IsOnDateOfBirtCheck = false;  return; } });
      return;
    }
  }

  public async onContinue(event:any)
  {
    try
    {

      this.loadingService.setLoading(true);
      let altLenth = this.AltPhoneNumber?.length;
      let nokphoneLenth = this.nokphone?.length;
      let PFNumberLenth = this.PFNumber?.length;

     try
     {
            if(this.DateOfBirth == null || this.DateOfBirth == "" ||  this.DateOfBirth == undefined)
            {
                this.loadingService.setLoading(false);
                // this.alertify.error('Error saving Connection...')
                this.message = "Date-Of-Birth is required";
                Swal.fire({ title: 'Warning!', text:  this.message,  icon: 'warning',  confirmButtonText: 'Ok' });       
                return;
            }

            let year = new Date(this.DateOfBirth).getFullYear();

            let date = new Date();
            this.transformDate = this.datePipe.transform(date, 'yyyy-MM-dd')?.toString();
            let CurrentYear = new Date(this.transformDate).getFullYear();
            let AvgAcceptYear =  CurrentYear - year;

            if(AvgAcceptYear < StaticData.MinClientAgeRetirement || AvgAcceptYear > StaticData.MaxClientAgeRetirement)
            {
                  this.loadingService.setLoading(false);
                  this.message = "Date-Birth, Age between 18 - 65 years is valid to apply for this loan.";
                  Swal.fire({ title: 'Warning!', text:  this.message, icon: 'warning', confirmButtonText: 'Ok'});
                  return;
            }
     }
     catch(error:any)
     {
        this.message = "Date-Of-Birth is invalid";
        Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
        return;
     }
     
      if(this.fullname == ""  ||this.fullname == null || this.fullname == undefined)
      {
         this.loadingService.setLoading(false);
          // this.alertify.error('Error saving Connection...')
          this.message = "Full name is required";
          Swal.fire({
            title: 'Warning!',
            text:  this.message,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
      }
      else if(this.nokaddress == ""  ||this.nokaddress == null || this.nokaddress == undefined)
      {
        this.loadingService.setLoading(false);
          // this.alertify.error('Error saving Connection...')
          this.message = "Nok address is required";
          Swal.fire({
            title: 'Warning!',
            text:  this.message,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
      }
      else if(this.nokphone == "" ||this.nokphone == null || this.nokphone == undefined)
      {
        this.loadingService.setLoading(false);
          // this.alertify.error('Error saving Connection...')
          this.message = "Nok phone is required";
          Swal.fire({
            title: 'Warning!',
            text:  this.message,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
      }
      else if(this.nokname == "" ||this.nokname == null || this.nokname == undefined)
      {
        this.loadingService.setLoading(false);
          // this.alertify.error('Error saving Connection...')
          this.message = "Nok name is required";
          Swal.fire({
            title: 'Warning!',
            text:  this.message,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
      }
      else if(this.MaritalStatus == "" ||this.MaritalStatus == null || this.MaritalStatus == undefined)
      {
        this.loadingService.setLoading(false);
          // this.alertify.error('Error saving Connection...')
          this.message = "Marital Status is required";
          Swal.fire({
            title: 'Warning!',
            text:  this.message,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
      }
      else if(this.ResidentialAddress == ""  ||this.ResidentialAddress == null || this.ResidentialAddress == undefined)
      {
        this.loadingService.setLoading(false);
          // this.alertify.error('Error saving Connection...')
          this.message = "Residential Address is required";
          Swal.fire({
            title: 'Warning!',
            text:  this.message,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
      }
      else if(this.PhoneNumber == "" ||this.PhoneNumber == null || this.PhoneNumber == undefined)
      {
        this.loadingService.setLoading(false);
          // this.alertify.error('Error saving Connection...')
          this.message = "Phone Number is required";
          Swal.fire({
            title: 'Warning!',
            text:  this.message,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
      }
      else if(this.PFNumber == "" ||this.PFNumber == null || this.PFNumber == undefined)
      {
        this.loadingService.setLoading(false);
          // this.alertify.error('Error saving Connection...')
          this.message = "Employee Number is required";
          Swal.fire({
            title: 'Warning!',
            text:  this.message,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
      }
     
      else if(altLenth > 1 && altLenth > 11)
      {
          this.loadingService.setLoading(false);
          // this.alertify.error('Error saving Connection...')
          this.message = "Alternative phone number must be 11 digit";
          Swal.fire({
            title: 'Warning!',
            text:  this.message,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
      }
      else if(nokphoneLenth > 11)
      {
          this.loadingService.setLoading(false);
          // this.alertify.error('Error saving Connection...')
          this.message = "Next-of-kin phone number must be 11 digit";
          Swal.fire({
            title: 'Warning!',
            text:  this.message,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
          return;
      }
      else
      {

          let personalDetails = new PersonalDetailsDto();
          personalDetails.Reasonforthisloan = this.Reasonforthisloan;
          personalDetails.AltPhoneNumber = this.AltPhoneNumber;
          personalDetails.DateOfBirth = this.DateOfBirth;
          personalDetails.PFNumber = this.PFNumber;
          personalDetails.acctDetails = this.acctDetails;
          personalDetails.nokname = this.nokname;
          personalDetails.nokaddress = this.nokaddress;
          personalDetails.bvnAuth = this.bvnAuth  ;
          personalDetails.BvnResponds = this.BvnResponds;
          personalDetails.fullname = this.fullname;
          personalDetails.retDate = this.DateOfBirth;
          personalDetails.nokphone = this.nokphone;
          personalDetails.ResidentialAddress = this.ResidentialAddress;
          personalDetails.MaritalStatus = this.MaritalStatus;
          personalDetails.PhoneNumber = this.PhoneNumber;


          personalDetails.CusState = this.CusState;
          personalDetails.CusCity= this.CusCity; 
          personalDetails.CusStateName= this.CusStateName;
          personalDetails.CusCityName= this.CusCityName;
          personalDetails.CusBusinessTypeText= this.CusBusinessTypeText;
          personalDetails.CusBusinessTypeValue= this.CusBusinessTypeValue;
          personalDetails.CusBusinessSegmentText= this.CusBusinessSegmentText;
          personalDetails.CusBusinessSegmentValue= this.CusBusinessSegmentValue;

          StaticData.PersonalDetails = personalDetails;
          personalDetails.RelationShip = this.RelationShip;

        let navigationExtras: NavigationExtras = {
          state: {
            personalDetails: personalDetails,
          },
        };

        this.shared.setBvnData(this.BvnResponds);
        this.shared.setDetailData(this.acctDetails);
        this.shared.setPersonalDetails(personalDetails);

        // LoanPersonnalSession:string = "LoanPersonnalSession";
        // LoanAcctBankSession:string = "LoanAcct&BankSession";
        // LoanReviewSession:string = "LoanReviewSession";

          let DataForm1 = { PersonalDetails: personalDetails, BvnResponds:this.BvnResponds, AcctDetails: this.acctDetails};
          this.AppStorage.SaveHashData(DataForm1, StaticData.LoanPersonnalSession, '/loanappdetails', navigationExtras, true);   
      }
    }
    catch(exp:any)
    {
          this.loadingService.setLoading(false);
          Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' });
          return;
    }
  }

  onIPFNblur(event:any)
  {
    // if(event.target.value.length == 9)
    //   {   if(this.IsProcessing == false){
    //     this.IsProcessing = true;
    //     this.PFNumberValidation(event.target.value);
    //   }
    // }
  }

  onIPFNkeypress(event:any)
  {
    if(event.target.value.length >= 9)
    {   if(this.IsProcessing == false){
      this.IsProcessing = true;
      this.PFNumberValidation(event.target.value);
    }
    }
  }

  onIPFNpaste(event:any)
  {
    if(event.target.value.length >= 9)
    {   
      if(this.IsProcessing == false){
        this.IsProcessing = true;
        this.PFNumberValidation(event.target.value);
      }
    }
  
  }

  public onKeydown(event:any)
  {
    if(event.target.value.length >= 9)
    { 
      if(this.IsProcessing == false){
        this.IsProcessing = true;
        this.PFNumberValidation(event.target.value);
      }
    }
    else{
      Swal.fire({
        title: 'Warning!',
        text:  'IPPIS number  must enter 9 digits',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
   
    }
  }

  private PFNumberValidation(iban:string):boolean 
  {
      // this.loadingService.setLoading(true);

      this.EnableButton = true;
      StaticData.properties = true;
    
      //  this.LapoLoanService.ValidatePFNumberByNumberConnector(iban).subscribe({
      //   next:(res)=>
      //   {
      //     this.loadingService.setLoading(false);
      //      // console.log(res);
      //        // console.log( this.ResponseData);
      //      this.ResponseData = res;
      //      this.IsProcessing = false;
          
      //      if(this.ResponseData!=null && this.ResponseData.isActive)
      //      {
      //         this.IsProcessing = false;
      //         StaticData.properties = true;
      //         this.EnableButton=true;
      //         return true;

      //      }
      //      else
      //      {

      //       this.PFNumber = "";
      //       StaticData.properties = true;
      //       this.IsProcessing = false;
      //       this.EnableButton=false;
      //       this.loadingService.setLoading(false);
      //         Swal.fire({
      //           title: 'Error!',
      //           text:  this.ResponseData.tryCatchMessage,
      //           icon: 'error',
      //           confirmButtonText: 'Ok'
      //         });
      //       return false;

      //      }
      //   },
      //   error:(err:any)=>
      //   {
      //     this.PFNumber = "";
      //     StaticData.properties = true;
      //     this.IsProcessing = false;
      //     this.EnableButton = false;
      //     // this.alertify.error('Error saving Connection...')
      //     this.loadingService.setLoading(false);
      //       Swal.fire({
      //         title: 'Error!',
      //         text:  "An error occurred " + err.message,
      //         icon: 'error',
      //         confirmButtonText: 'Ok'
      //       });
      //     return false;
      //   }
      // })

      return false;
  }

  public ContainerSummary() :void
  {
    setTimeout(()=>{
      
           let RefineryExit = this.AppStorage.VerifyIfDataExit(StaticData.LoanAcctBankSession)
           if(RefineryExit)
           {
              this.route.navigate(['/apploanreview']);
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

  public ProfileDetails:any;
  public async GetUserProfileDetails(): Promise<void> 
  {
            this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);

            if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
            {
                this.onSignOut("/signin");
                return;
            }

            await this.LapoLoanService.GetUserProfileDetails(parseInt(this.AcctId)).subscribe({
            next:(res) =>
            {
                this.loadingService.setLoading(false);
                this.ResponseData = res;
                if(this.ResponseData != null && this.ResponseData.isActive)
                {
                    this.ProfileDetails = this.ResponseData.dataLoad;
                    this.MaritalStatus = this.ProfileDetails.userProfileDetails.marrintalStatus;
                    return;
                }
                else
                {
                    Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                    return;
                }
            },
            error:(err)=>
            {
                  this.loadingService.setLoading(false);
                  Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
                      return;
            }
        });
  }
}
