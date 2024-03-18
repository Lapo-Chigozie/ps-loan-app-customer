import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../datatableservicehelper/local-storage.service';
import { StaticData } from '../ps.loan.Models/StaticData';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  private PageTitle = 'Home Page';

  public doctors: any[] = [];

  constructor(private loadingService: LoaderService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService) 
  { 
    
  } 

  ngOnInit(): void 
  {
    //this.service.getDoctor().subscribe(res => {
    // this.doctors = res;
  }
   
  redirectApply()
  {
     // window.location.href = "#/signup.html";
  }

  redirectSignIn()
  {
    //window.location.href = "#/signin.html";
  }

  navigator() 
  { 
      // this.router.navigate(['/someRoute']); 
  } 

  goBack(): void 
  {
    //(click)="goBack()"
    // window.location..back();
  }

  public GotoLoan() :void
  {
      // alert("");
      LocalStorageService.setLoginSessionIdentity(StaticData.LoanKeySession, StaticData.LoanAppOnLoanAnswer);
      // this.router.navigate(['/loanbvnapp', { queryParams:{ IsLoanApp: true } }]); 
      this.router.navigate(['/loanbvnapp'],  { queryParams: { IsLoanApp : true }} );
      return;
  } 
}
