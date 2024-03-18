import { Injectable } from '@angular/core';
import { PageNextSelection } from '../PagenationModel/PageNextSelection';
import { RetrieverModel } from '../PagenationModel/RetrieverModel';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { PagenationFilterModel } from '../PagenationModel/PagenationFilterModel';
import { LoaderService } from './loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StaticData } from '../ps.loan.Models/StaticData';
import { LocalStorageService } from './local-storage.service';
import { LoginUserPermissionModel } from '../PagenationModel/LoginUserPermissionModel';
import { FormBuilder } from '@angular/forms';
import { LapoLoanApiService } from './lapo-loan-api.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AppDashboarddtService {

  public MaxSearchLength:number = 100;
  public Search:string ="";
  public ToDate  :string   ="";
  public  FromDate :string  ="";

  public ToDateValue  :string  ="";
  public  FromDateValue:string  ="";

  public DataStatus!:string;
  

  private QueNumMin = 5;
  private MaxRetriever :number = 100;

  public  MaxRetrieverList:Array<RetrieverModel> = new Array<RetrieverModel>();

  private MaxDataRetriever: number = 5;
  public  MaxRetrival: number = 100;

  public MaxStatusRetriever :string = 'All';

  private MaxPagenationDataLink :number = 6;
  private MaxPagenationDataPulled :number = 0;

  private AcctId:any;
  public ResponseData!: RespondMessageDto;
  public LoanApps:any = [];

  public ShowPageStart :number = 0;
  public ShowPageEnd :number = 0;
  public ShowPageTotal :number = 0;
  public IsSearchBar:boolean = false;
  public SelectedNumber:number = 1;

  private SearchData = new PagenationFilterModel();

  constructor(private loadingService: LoaderService,private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService) { }

  public onLoad(AppId:any): void
  {
      // let today = new Date();
      // let date1 = new Date("1/1/" + today.getFullYear() + " 7:41:58 PM");
      // let date2 = new Date("12/30/" + today.getFullYear() + " 7:41:58 PM");

      let today = new Date();
      let PastYear:number = today.getFullYear();
      let EnterYear:number = PastYear - 5;
      this.FromDate = "1/01/" + EnterYear.toString() + " 12:00:00 AM";

      this.ToDate = "12/31/" + today.getFullYear() + " 11:59:00 PM";

       this.AcctId = AppId;
       this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
            
       this.SearchData = new PagenationFilterModel();
       if(this.SearchData.PermissionPage == undefined || this.SearchData.PermissionPage == null)
       {
            this.SearchData.PermissionPage = new LoginUserPermissionModel();
            this.SearchData.PermissionPage . IsASSISTANTHEADOFOPERATION = false;
            this.SearchData.PermissionPage.IsDISBURSEMENTOFFICER = false;
            this.SearchData.PermissionPage. IsGROUPHEAD = false;
            this.SearchData.PermissionPage. IsHEADOFOPERATIONS = false;
            this.SearchData.PermissionPage.  IsRELATIONSHIPOFFICER = false;
            this.SearchData.PermissionPage. IsTEAMLEADS = false;
            this.SearchData.PermissionPage. IsRECONCILIATIONANDACCOUNTOFFICER = false;
            this.SearchData.PermissionPage.  IsCustomerLoanPermission = false;
            this.SearchData.PermissionPage.  IsGeneralPermissionsAccessRight = false;
            this.SearchData.PermissionPage.  IsLoanSettingAccessRight = false;
            this.SearchData.PermissionPage. IsNetPaysAccessRight = false;
            this.SearchData.PermissionPage. IsTenureAccessRight = false;
            this.SearchData.PermissionPage. GroupName = "Default";
            this.SearchData.PermissionPage.GroupId  = 0;
            this.SearchData.PermissionPage.  TeamId = 0;
            this.SearchData.PermissionPage.  AccessRightToApprovedLoan = false;
            this.SearchData.PermissionPage.  AccessRightToCancelLoan = false;
            this.SearchData.PermissionPage.  AccessRightToAnonymousLoanApplication = false;
            this.SearchData.PermissionPage.  AccessRightToUploadBackDISBURSEMENTLoan = false;
            this.SearchData.PermissionPage. AccessRightToUploadBackRepaymentLoan = false;
            this.SearchData.PermissionPage. AccessRightToViewUploadBackRepaymentLoan = false,
            this.SearchData.PermissionPage.  IsDeveloperTeam = false;
            this.SearchData.PermissionPage.  AccessRightToViewDisbursementLoan = false,
            this.SearchData.PermissionPage.  AccessRightToExportDISBURSEMENTLoan = false;
            this.SearchData.PermissionPage.AccessRightToViewLoan = false;
            this.SearchData.PermissionPage. AccessRightToPrintLoan =false;
            this.SearchData.PermissionPage.  AccessRightToProceedLoan =false;
       }


       this.GenerateRetriever();
       this.LoadSearchData();
      // this.GetAllLoanApplys(this.AcctId ,  this.MaxRetrival)
  }

  public onMaxRetrival(event:any):void
  {
      this.MaxDataRetriever = parseInt(event.target.value);
      this.MaxRetrival = parseInt(event.target.value);
      
      this.SearchData.dateFrom =  this.FromDate ;
      this.SearchData.dateTo =  this.ToDate;
      this.SearchData.pageDataSize = this.MaxDataRetriever;
      this.SearchData.status = this.MaxStatusRetriever;
      this.SearchData.searchText = this.Search;
      this.SearchData.AccountId =  this.AcctId
      this.SearchData.SelectedNumber = this.SelectedNumber;
      this.SearchData.IsSelected = true;
      this.SearchData.IsSearchBar = this.IsSearchBar;

    
      this.SearchData.PageNext = new  PageNextSelection();

      this.SearchData.PageNext.LastSkipCount = 0;
      this.SearchData.PageNext.LastTakeCount =  0;
   
      this.SearchData.PageNext.SkipCount =  1; 
      this.SearchData.PageNext.TakeCount  = this.MaxDataRetriever;

      this.SearchData.PageNext.StopTakeCount = 0;
      this.SearchData.PageNext.HasBar = false;
   
      this.GetAllLoanApplys(this.AcctId,  this.SearchData);
  }

  public onStatusRetrival(event:any):void
  {
      this.MaxStatusRetriever = event.target.value;

      try
      {
          this.SearchData.dateFrom = this.FromDate.toString();
          this.SearchData.dateTo = this.ToDate.toString();
          this.SearchData.pageDataSize = this.MaxDataRetriever;
          this.SearchData.status = this.MaxStatusRetriever;
          this.SearchData.searchText = event.target.value ?? this.Search;
          this.SearchData.AccountId =  this.AcctId
          this.SearchData.SelectedNumber = this.SelectedNumber;
          this.SearchData.IsSelected = true;
          this.SearchData.IsSearchBar = this.IsSearchBar;


          this.SearchData.PageNext = new  PageNextSelection();

          this.SearchData.PageNext.LastSkipCount = 0;
          this.SearchData.PageNext.LastTakeCount =  0;
      
          this.SearchData.PageNext.SkipCount =  1; 
          this.SearchData.PageNext.TakeCount  = this.MaxDataRetriever;

          this.SearchData.PageNext.StopTakeCount = 0;
          this.SearchData.PageNext.HasBar = false;

          this.GetAllLoanApplys(this.AcctId,  this.SearchData);
      }
      catch(error:any)
      {
  
      }
  }

  public onSearchButton(event:any):void
  {
      // alert(this.ToDate.toString() + this.FromDate.toString());
      try
      {
             if(this.ToDate=="" || this.ToDate=="" ||this.ToDate==undefined || this.ToDate==undefined)
             {
                  Swal.fire({ title: 'Warning!', text: "Select Date from and Date to", icon: 'warning', confirmButtonText: 'Ok' });
                  return;
             }

          this.IsSearchBar = false;
          this.SearchData.dateFrom = this.FromDate.toString();
          this.SearchData.dateTo = this.ToDate.toString();
          this.SearchData.pageDataSize = this.MaxDataRetriever;
          this.SearchData.status = this.MaxStatusRetriever;
          this.SearchData.searchText = event.target.value ?? this.Search;
          this.SearchData.AccountId =  this.AcctId
          this.SearchData.SelectedNumber = this.SelectedNumber;
          this.SearchData.IsSelected = true;
          this.SearchData.IsSearchBar = this.IsSearchBar;

        this.SearchData.PageNext = new  PageNextSelection();

        this.SearchData.PageNext.LastSkipCount = 0;
        this.SearchData.PageNext.LastTakeCount =  0;
   
        this.SearchData.PageNext.SkipCount =  1; 
        this.SearchData.PageNext.TakeCount  = this.MaxDataRetriever;

        this.SearchData.PageNext.StopTakeCount = 0;
        this.SearchData.PageNext.HasBar = false;
        this.GetAllLoanApplys(this.AcctId,  this.SearchData);
      }
      catch(error:any)
      {
  
      }
  }

  public onSearchPress(event:any, key:any):void
  {
    try
    {
         this.IsSearchBar=true;
         this.SearchData.dateFrom = this.FromDate.toString();
         this.SearchData.dateTo = this.ToDate.toString();
         this.SearchData.pageDataSize = this.MaxDataRetriever;
         this.SearchData.status = this.MaxStatusRetriever;
         this.SearchData.searchText = event.target.value ?? this.Search;
         this.SearchData.AccountId =  this.AcctId
         this.SearchData.SelectedNumber = this.SelectedNumber;
         this.SearchData.IsSelected = true;
         this.SearchData.IsSearchBar = this.IsSearchBar;

         this.SearchData.PageNext = new  PageNextSelection();

         this.SearchData.PageNext.LastSkipCount = 0;
         this.SearchData.PageNext.LastTakeCount =  0;
      
         this.SearchData.PageNext.SkipCount =  1; 
         this.SearchData.PageNext.TakeCount  = this.MaxDataRetriever;
   
         this.SearchData.PageNext.StopTakeCount = 0;
         this.SearchData.PageNext.HasBar = false;
     
         this.GetAllLoanApplys(this.AcctId, this.SearchData);
    }
    catch(error:any)
    {

    }
  }

  public GenerateRetriever():void
  {
       this.MaxRetrieverList  = new Array<RetrieverModel>();
       for(let i = this.QueNumMin; i <= this.MaxRetriever; i++)
       {
          if( i == 5 )
          {
               let RetrList = new RetrieverModel();
               RetrList.No = i.toString();
               this.MaxRetrieverList.push(RetrList);
          }
          else if( i == 10 )
          {
            let RetrList = new RetrieverModel();
            RetrList.No = i.toString();
               this.MaxRetrieverList.push(RetrList);
          }
          else if( i == 15 )
          {
            let RetrList = new RetrieverModel();
            RetrList.No = i.toString();
               this.MaxRetrieverList.push(RetrList);
          }
          else if( i == 20 )
          {
            let RetrList = new RetrieverModel();
            RetrList.No = i.toString();
               this.MaxRetrieverList.push(RetrList);
          }
          else if( i == 30 )
          {
            let RetrList = new RetrieverModel();
            RetrList.No = i.toString();
               this.MaxRetrieverList.push(RetrList);
          }
          else if( i == 50 )
          {
            let RetrList = new RetrieverModel();
            RetrList.No = i.toString();
               this.MaxRetrieverList.push(RetrList);
          }
          else if( (i + 25) == 75 )
          {
            let RetrList = new RetrieverModel();
            RetrList.No = i.toString();
               this.MaxRetrieverList.push(RetrList);
          }
          else if( (i + 25) == 100 )
          {
            let RetrList = new RetrieverModel();
            RetrList.No = i.toString();
               this.MaxRetrieverList.push(RetrList);
          }
          else if( (i + 25) == 125 )
          {
            let RetrList = new RetrieverModel();
            RetrList.No = i.toString();
               this.MaxRetrieverList.push(RetrList);
          }
          else if( (i + 25) == 150)
          {
            let RetrList = new RetrieverModel();
            RetrList.No = i.toString();
               this.MaxRetrieverList.push(RetrList);
          }
          else if( (i + 25) == 175)
          {
            let RetrList = new RetrieverModel();
            RetrList.No = i.toString();
            this.MaxRetrieverList.push(RetrList);
          }
          else if( (i + 25) == 200)
          {
             let RetrList = new RetrieverModel();
             RetrList.No = i.toString();
             this.MaxRetrieverList.push(RetrList);
          }
         
       }
  }

  public LoadSearchData(): void
  {
        try
        {
             this.IsSearchBar=false;
             this.SearchData.dateFrom = this.FromDate;
             this.SearchData.dateTo =  this.ToDate;
             this.SearchData.pageDataSize = this.MaxDataRetriever;
             this.SearchData.status = this.MaxStatusRetriever;
             this.SearchData.searchText = this.Search;
             this.SearchData.AccountId =  this.AcctId
             this.SearchData.SelectedNumber = 1;
             this.SearchData.IsSelected = true;
             this.SearchData.IsSearchBar = false;

             this.SearchData.PageNext = new  PageNextSelection();

             this.SearchData.PageNext.LastSkipCount = 0;
             this.SearchData.PageNext.LastTakeCount =  0;
          
             this.SearchData.PageNext.SkipCount =  1; 
             this.SearchData.PageNext.TakeCount  = this.MaxDataRetriever;
       
             this.SearchData.PageNext.StopTakeCount = 0;
             this.SearchData.PageNext.HasBar = false;
          
             this.GetAllLoanApplys(this.AcctId,  this.SearchData);
        }
        catch(ex:any)
        {

        }
  }

  public async GetAllLoanApplys(ClientId:any , PagenationFilter:any): Promise<void> 
  {
       try
       {
                // let items: Item[] = [];
               //  <li *ngFor='let in of [0,1,2,3,4];let i = index'>{{i}}</li>
               //  <li *ngxRange="let value from 0 to 20 by 5">

                this.AcctId = ClientId;
                this.AcctId = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
            
                if(this.AcctId  == "" || this.AcctId  == undefined || this.AcctId  == null || this.AcctId  == StaticData.LoginKeySession)
                {
                    this.onSignOut("/signin");
                    return;
                }

                this.loadingService.setLoading(true);
                await this.LapoLoanService.GetAllLoanApp(PagenationFilter).subscribe({
                next:(res) =>
                {
                  this.loadingService.setLoading(false);
                  this.ResponseData = res;
                  if(this.ResponseData != null && this.ResponseData.isActive)
                  {
                      this.LoanApps = this.ResponseData.dataLoad.data;
                      this.ShowPageStart = this.ResponseData.dataLoad.minSelectedNumber;
                      this.ShowPageEnd = this.ResponseData.dataLoad.maxSelectedNumber;
                      this.ShowPageTotal = this.ResponseData.dataLoad.totalData;
                      this.MaxRetrival = this.ResponseData.dataLoad.pageSize;
                      // console.log("Poof Loan Apps! " , this.ResponseData.dataLoad);
                      return;
                  }
                  else
                  {
                      // console.log(this.ResponseData);
                      // Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' })
                      return;
                  }
              
                },
                error:(err):any=>
                {
                    // console.log("no continue " + err);
                    this.loadingService.setLoading(false);
                  //  Swal.fire({ title: 'Error!', text: "An error occurred: " + err.message, icon: 'error', confirmButtonText: 'Ok' })
                    return;
                }
              })
       }
       catch(ex:any)
       {
           this.loadingService.setLoading(false);
       }
  }

  private onSignOut(event:any):void
  {
      this.onNaviagateBack(event);
  }

  private onNaviagateBack(page:string):void
  {
    // this.router.navigate([page]);
    LocalStorageService.setLoginSessionIdentity(StaticData.LoginKeySession, StaticData.LoginKeySession);
    LocalStorageService.setLoginSessionIdentity(StaticData.TwoLoginKeySession, StaticData.TwoLoginKeySession);
    LocalStorageService.setLoginSessionIdentity(StaticData.AppOnLoan, StaticData.AppOnLoan);
    LocalStorageService.setLoginSessionIdentity(StaticData.AccountEmailSession, StaticData.AccountEmailSession);
    this.router.navigate([page],  { queryParams: { IsLoanApp: false }} );
    return;
  }

  public onDateFromChange(event:any)
  {
     // alert(this.FromDateValue);
      this.FromDate = event + " 12:00:00 AM";
      //alert(this.FromDate);
  }

  public onDateToChange(event:any)
  {
     // alert(this.ToDateValue);
       this.ToDate = event + " 11:59:00 PM";
    //  alert(this.ToDate);
      // console.log("Date event ",  this.ToDate);
  }

  public ParseDate(event: any): Date 
  {
      let dateString = event.value
      if (dateString) 
      {
          return new Date(dateString);
      }

      return new Date();
   }
   
   public async onPagenationClick(No: any, Data:any): Promise<void>
   {
         try
         {
              console.log('on Pagenation Click:', Data);

              // endPage
              // isSelected
              // selectedNumber
              // skipLastData
              // startPage
              // takeData
              // totalData

              this.SearchData.dateFrom = this.FromDate;
              this.SearchData.dateTo =  this.ToDate;
              this.SearchData.pageDataSize = this.MaxDataRetriever;
              this.SearchData.status = this.MaxStatusRetriever;
              this.SearchData.searchText = this.Search;
              this.SearchData.AccountId =  this.AcctId
              this.SearchData.SelectedNumber = Data.selectedNumber;
              this.SearchData.IsSelected = true;
              this.SearchData.IsSearchBar =  this.IsSearchBar;
 

              this.SearchData.PageNext = new  PageNextSelection();
              this.SearchData.PageNext.LastSkipCount = Data.skipLastData;
              this.SearchData.PageNext.LastTakeCount =  Data.takeData;
           
              this.SearchData.PageNext.SkipCount =  Data.skipLastData; 
              this.SearchData.PageNext.TakeCount  = Data.takeData;

              this.SearchData.PageNext.StopTakeCount = 0;
              this.SearchData.PageNext.HasBar = true;
           
              this.GetAllLoanApplys(this.AcctId,  this.SearchData);
         }
         catch(ex:any)
         {
 
         }
   }

   public async onPreviousPagenationClick(No: any, Data:any): Promise<void>
   {
         try
         {
              console.log('on Previous PagenationClick:', (Data));

              // PagenationRespond.SkipLastData = (StartPage - 1);
              // PagenationRespond.TakeData = pagenationFilter.pageDataSize;
              // endPage
              // isSelected
              // selectedNumber
              // skipLastData
              // startPage
              // takeData
              // totalData


               this.SearchData.dateFrom = this.FromDate;
               this.SearchData.dateTo =  this.ToDate;
               this.SearchData.pageDataSize = this.MaxDataRetriever;
               this.SearchData.status = this.MaxStatusRetriever;
               this.SearchData.searchText = this.Search;
               this.SearchData.AccountId =  this.AcctId
               this.SearchData.SelectedNumber = Data.lastSelectedNumber;
               this.SearchData.IsSelected  = true;
               this.SearchData.IsSearchBar =  this.IsSearchBar;
 
               this.SearchData.PageNext = new  PageNextSelection();

               this.SearchData.PageNext.LastSkipCount = Data.skipLastData;
               this.SearchData.PageNext.LastTakeCount =  Data.takeData;
           
               this.SearchData.PageNext.SkipCount =  Data.skipLastData; 
               this.SearchData.PageNext.TakeCount = Data.takeData;

               this.SearchData.PageNext.StopTakeCount = 0;
               this.SearchData.PageNext.HasBar = false;
           
               this.GetAllLoanApplys(this.AcctId,  this.SearchData);
         }
         catch(ex:any)
         {
 
         }
   }

   public async onNextPagenationClick(No: any, Data:any): Promise<void>
   {
         try
         {
              console.log('on Previous PagenationClick:', (Data));

              // PagenationRespond.SkipLastData = (StartPage - 1);
              // PagenationRespond.TakeData = pagenationFilter.pageDataSize;
              // endPage
              // isSelected
              // selectedNumber
              // skipLastData
              // startPage
              // takeData
              // totalData

               this.SearchData.dateFrom = this.FromDate;
               this.SearchData.dateTo =  this.ToDate;
               this.SearchData.pageDataSize = this.MaxDataRetriever;
               this.SearchData.status = this.MaxStatusRetriever;
               this.SearchData.searchText = this.Search;
               this.SearchData.AccountId =  this.AcctId
               this.SearchData.SelectedNumber = Data.nextSelectedNumber;
               this.SearchData.IsSelected  = true;
               this.SearchData.IsSearchBar =  this.IsSearchBar;
 
               this.SearchData.PageNext = new  PageNextSelection();

               this.SearchData.PageNext.LastSkipCount = Data.skipLastData;
               this.SearchData.PageNext.LastTakeCount =  Data.takeData;
           
               this.SearchData.PageNext.SkipCount =  Data.skipLastData; 
               this.SearchData.PageNext.TakeCount = Data.takeData;

               this.SearchData.PageNext.StopTakeCount = 0;
               this.SearchData.PageNext.HasBar = false;
           
               this.GetAllLoanApplys(this.AcctId,  this.SearchData);
         }
         catch(ex:any)
         {
 
         }
   }
}
