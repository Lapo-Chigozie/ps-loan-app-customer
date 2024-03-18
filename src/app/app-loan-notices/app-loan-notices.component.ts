import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { StaticData } from '../ps.loan.Models/StaticData';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoanAppAccountModel } from '../ps.loan.Models/LoanAppAccountModel';
import { AccountDetailsDto } from '../ps.loan.Models/AccountInfoDto';
import { BvnRespondsDto } from '../ps.loan.Models/BvnRespondsDto';
import { BvnAuthDto } from '../ps.loan.Models/BvnAuthDto';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { DataSharedService } from '../ps.loan.Models/DataSharedService';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';

@Component({
  selector: 'app-app-loan-notices',
  templateUrl: './app-loan-notices.component.html',
  styleUrls: ['./app-loan-notices.component.css']
})
export class AppLoanNoticesComponent implements OnInit {

  private AcctId!:string;

  public AllCustomerHasBlocked:boolean = true;
  public IsSessionActive:boolean = true;
  public StatusMessge!:string;
  public ImageName:string  = "Messagewarning.png";

  
  public ResponseData!: RespondMessageDto;
  public accountLogin!: LoanAppAccountModel;
  public BvnResponds !:BvnRespondsDto;
  public acctDetails !:AccountDetailsDto;
  public bvnAuth!: BvnAuthDto 

  constructor(private loadingService: LoaderService, private  shared: DataSharedService,private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanApiService) {

  }

  ngOnInit() :void
  {
    this.GetLoanSettings();
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
              this.LapoLoanService.GetLoanSettings(parseInt(this.AcctId)).subscribe({
            next: (res: any) => {
              this.loadingService.setLoading(false);
              this.ResponseData = res;
              // console.log("Loan Settings: ", this.ResponseData);
              if (this.ResponseData != null && this.ResponseData.isActive) {
                this.StatusMessge = this.ResponseData.dataLoad.message;
                this.ImageName = "Messagewarning.png";
                this.AllCustomerHasBlocked = this.ResponseData.dataLoad.isBlockLoanPortal;

                return;
              }
              else {
                Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' });
                return;
              }
            },
            error: (err: any) => {
              this.loadingService.setLoading(false);
              Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
              return;
            }
          })
        }
        catch(error:any)
        {
            this.loadingService.setLoading(false);
            Swal.fire({ title: 'Uh-oh!', text: "Service can't be reached at this time. You should try again.", icon: 'error', confirmButtonText: 'Ok' })
            return;
        }
  }
}
