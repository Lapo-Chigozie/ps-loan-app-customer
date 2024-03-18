import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';
import { StaticData } from '../ps.loan.Models/StaticData';

@Component({
  selector: 'app-app-acct-already-in-using',
  templateUrl: './app-acct-already-in-using.component.html',
  styleUrls: ['./app-acct-already-in-using.component.css']
})
export class AppAcctAlreadyInUsingComponent implements OnInit {

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
          // this.window.location.hostname + StaticData.SiginLink1
          this.LoginLink = StaticData.SiginLink1();
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
