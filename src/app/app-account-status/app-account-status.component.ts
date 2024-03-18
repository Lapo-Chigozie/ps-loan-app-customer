import { Component, OnInit } from '@angular/core';
import { StaticData } from '../ps.loan.Models/StaticData';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';

@Component({
  selector: 'app-app-account-status',
  templateUrl: './app-account-status.component.html',
  styleUrls: ['./app-account-status.component.css']
})
export class AppAccountStatusComponent implements OnInit {

  public statusTitle:string = "";
  public statusMessge:string = "";
  public imageName:string = "";
  public IsEmailExit:boolean = false;
  public LoginLink = "";

  constructor( private loadingService: LoaderService, private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanApiService) 
  {
   
  }

  public ngOnInit(): void  
  {
      try
      {
          this.statusTitle = this.router.snapshot.queryParams["messageTitle"];
          this.statusMessge = this.router.snapshot.queryParams["statusMessge"];
          this.imageName = this.router.snapshot.queryParams["imageName"];

          try
          {
               this.IsEmailExit = this.router.snapshot.queryParams["IsEmailExit"];
          }
          catch(exx:any)
          {

          }

          // this.window.location.hostname + StaticData.SiginLink1
          this.LoginLink = StaticData.SiginLink1();

          if(this.statusTitle == undefined || this.statusMessge == undefined || this.imageName == undefined || this.statusTitle == null || this.statusMessge == null || this.imageName == null || this.statusTitle == "" || this.statusMessge == "" || this.imageName == "")
          {
                this.onNaviagateBack('/signin');
                return;
          }

          this.IsEmailExit = false;
          return;
      }
      catch(e:any)
      {
            this.onNaviagateBack('/signin');
            return;
      }
  }

  private onNaviagateBack(page:string):void
  {
      this.route.navigate([page]);
      return;
  }
}
