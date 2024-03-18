import { Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import { DataSharedService } from '../ps.loan.Models/DataSharedService';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppLoanHashs } from '../ps.loan.Models/AppLoanHashs';
import { LocalStorageService } from './local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import { Observable } from 'rxjs';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { RefineryService } from './refinery.service';
import { LapoLoanApiService } from './lapo-loan-api.service';

@Injectable({
  providedIn: 'root'
})
export class AppStorageService {

  private message!:string;
  private  ResponseData!: RespondMessageDto;

   public  static  LoanPersonnalSession:string = "LoanPersonnalSession";
    public  static  LoanAcctBankSession:string = "LoanAcct&BankSession";
    public  static  LoanReviewSession:string = "LoanReviewSession";
 
  constructor(private refineryService:  RefineryService, private loadingService: LoaderService, private  shared: DataSharedService,private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanApiService) {

  }

  public VerifyIfDataExit(Type:any): boolean 
  {
      let DataSession = LocalStorageService.getLoginSessionIdentity(Type);

      if(DataSession != "" && DataSession != null && DataSession != undefined && DataSession != Type)
      {
        return true;
      }

      return false;
  }

  public SaveHashData(Data:any, DataType:any, URL:any, NavigationExtras:any, IsRedirect:boolean):void
  {
         try
         {
                 this.loadingService.setLoading(true);
                 let codeResult = new AppLoanHashs();
                 codeResult.TypeHash = DataType;
                 codeResult.Data = Data;
                 codeResult.Hash = "";
   
                  this.refineryService.EncriptConnector(codeResult).subscribe({
                  next:(res)=> {
            
                    this.loadingService.setLoading(false);
                    console.log(res);
                    this.ResponseData = res;

                    if(this.ResponseData != null && this.ResponseData.isActive)
                    { 
                       LocalStorageService.setLoginSessionIdentity(DataType, this.ResponseData.dataLoad); 
                       
                       if(IsRedirect)
                       {
                           this.route.navigate([URL]);
                       }
                       return;
                    }
                    else
                    {
                        LocalStorageService.setLoginSessionIdentity(DataType, DataType);
                        this.message = this.ResponseData.tryCatchMessage;
                        Swal.fire({ title: 'Warning!', text:  this.message, icon: 'warning',  confirmButtonText: 'Ok' });
                        return;
                    }

                    return;
                },
                error:(err:any)=>
                {
                   LocalStorageService.setLoginSessionIdentity(DataType, DataType);
                    this.loadingService.setLoading(false);
                    console.log('Error' + err);
                    this.message = err.message;
                    Swal.fire({   title: 'Error!',   text:  this.message, icon: 'error',  confirmButtonText: 'Ok' });
                    return;
                }
                
              });

              return;    
          }
          catch(ex:any)
          {
            LocalStorageService.setLoginSessionIdentity(DataType, DataType);
            this.message = ex.message;
            console.log('Catch', ex);
            this.loadingService.setLoading(false);
            Swal.fire({   title: 'Error!',   text:  this.message, icon: 'error',  confirmButtonText: 'Ok' });
            return;    
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
                  console.log('Response Data Data', this.ResponseData.dataLoad);
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
                Swal.fire({   title: 'Error!',   text:  this.message, icon: 'error',  confirmButtonText: 'Ok' });
                return 0;
            }
            
            
          });
     }

}
