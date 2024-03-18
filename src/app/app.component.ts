import { Component } from '@angular/core';

import {  Inject, InjectionToken, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationStart, NavigationEnd, Router } from '@angular/router';

import { LoaderService } from './datatableservicehelper/loader.service';
import { LapoLoanApiService } from './datatableservicehelper/lapo-loan-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private AppId:any;
  private SessionResult:any;
  public  heightScren:any =  this.window.innerHeight;
  ShowClientAdminLayout: boolean = false;
  ShowClientLayout: boolean = false;
 
  constructor(@Inject('Window') private window: Window, private loadingService: LoaderService,private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService) { }

  ngAfterContentInit(): void {
    
  }

  ngAfterViewInit(): void {
  
  }

  private showUp(): void {
    // this.contentPage2?.nativeElement.scrollTo( -0, -0 );
      // this.contentPage?.nativeElement.scrollIntoView();
      window.scroll(0,0);
   }
  
  ngOnInit() 
  {

    this.heightScren = window.innerHeight + 200;

    // console.log(this.route.snapshot); 

    // this.route.url.subscribe(([url]) => {
    //   const { path, parameters } = url;
    //   console.log(path); // e.g. /products
    //   console.log(parameters); // e.g. { id: 'x8klP0' }
    // });

    this.showUp();
    this.router.events.forEach((event) => {

      let event1 = event as NavigationStart;

        if (event instanceof NavigationStart || event instanceof NavigationEnd) 
        {
            //  console.log(event.url); 
             //StaticData.CheckIfClintAdminPage(event.url)===false
              if(event.url.includes('/apppassworddashboard') || event.url.includes('/repayments') || event.url.includes('/apploandetails') || event.url.includes('/clientloanRequest') || event.url.includes('/dashboard') || event.url.includes('/appeditprofile') || event.url.includes('/appprofile'))
              {
                  this.showUp();
                  this.ShowClientAdminLayout  = true;
                  this.ShowClientLayout  = false;
                  
                  return;
              }
              else 
              {
                  this.showUp();
                  this.ShowClientAdminLayout  = false;
                  this.ShowClientLayout  = true;
                    return;
              }
        }
    });

      //  console.log(this.route.snapshot); // ActivatedRouteSnapshot
      // console.log(this.route.snapshot.url); // UrlSegment[]
      // console.log(this.route.snapshot.url[0]); // UrlSegment
      // console.log(this.route.snapshot.url[0].path); // e.g. /products
      // console.log(this.route.snapshot.url[0].parameters); // e.g. { id: 'x8klP0' }

      // this.router.events.subscribe((val) => {
      //   if(location.path() != ''){
      //     this.route = location.path();
      //   } else {
      //     this.route = 'Home'
      //   }
      // });

        //  this.href = this.router.url;
        // console.log(this.router.url);

        // if( this.href=="/twofactorauth" || this.href== "/signin"){
        //    this.ShowRouteLet = true;
        // }
        //  else{
        //    this.ShowRouteLet = false;
        //  }
  }
}
