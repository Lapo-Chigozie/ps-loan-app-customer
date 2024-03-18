import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT, Location } from '@angular/common';
import { Inject } from '@angular/core';
import {  NavigationEnd, RoutesRecognized, RouterEvent } from '@angular/router';
import {  filter, pairwise, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppRouterService {

  public PreviousUrl: string = "/dashboard";
  public CurrentUrl: string = "/dashboard";
  public  previousUrl: string = "/dashboard";
  public previousRoutePath = new BehaviorSubject<string>('');
  private history = [];
  constructor(private router : Router , private location: Location, @Inject(DOCUMENT) private _document: any)  
  { 
      this.previousRoutePath.next(this.location.path());

      this.CurrentUrl = this.router.url;

        try
        {
            this.router.events.subscribe(event => 
            {    
               if (event instanceof NavigationEnd) 
               { 
                  this.PreviousUrl = this.CurrentUrl;
                 this.CurrentUrl = event.url; 
                }; 
         
            });
        }
        catch(ex:any){

        }

     
        try
        {
            this.router.events
            .pipe(filter((evt:any) => evt instanceof RoutesRecognized), pairwise())
            .subscribe((events:RoutesRecognized[])=>{
              this.PreviousUrl = events[0].urlAfterRedirects;
              this.CurrentUrl = events[1].urlAfterRedirects;
            });
        }
        catch(ex:any){

        }
    //   this.router.events
    //  .pipe(filter((event:any) => event instanceof NavigationEnd), pairwise())
    //   .subscribe((event: NavigationEnd) => {
    //     this.PreviousUrl = event.url;
    //     this.CurrentUrl = event.urlAfterRedirects;
    //   });

         try
         {
              this.router.events.pipe(filter(e => e instanceof RoutesRecognized), pairwise())
              .subscribe((event:any[]) =>
              {
                this.PreviousUrl = event[0].urlAfterRedirects;
                this.CurrentUrl = event[1].urlAfterRedirects;
                this.previousRoutePath.next(this.PreviousUrl);
              });
         }
         catch(ex:any){

         }

         try
         {
              this.router.events.pipe(filter(e => e instanceof NavigationEnd), pairwise())
              .subscribe((event:any[]) =>
              {
                this.PreviousUrl = event[0].urlAfterRedirects;
                this.CurrentUrl = event[1].urlAfterRedirects;
                this.previousRoutePath.next(this.PreviousUrl);
              });
         }
         catch(ex:any)
         {

         }

         try
         {
              this.router.events
              .pipe(filter((e: any) => e instanceof RoutesRecognized), pairwise()).subscribe((e: any) => {
                  console.log(e[0].urlAfterRedirects); 
                  this.PreviousUrl = e[0].urlAfterRedirects;
                  // previous url
              });
         }
         catch(ex:any){

         }
    }

    public GetCurrentUrl(): string 
    { 
          return this.CurrentUrl;
    } 
      
    public GetPreviousUrl(): string 
    { 
        return this.PreviousUrl;
    } 

    public GetHistory(): string[]
    {
      return this.history;
    }
  
    public GetPreviousUrl1(): string
    {
       return this.history[this.history.length - 2] || this._document.referrer;
    }

    public GoBack() : void
    {
         try
         {
                this.router.events
                .pipe(take(1), filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
                .subscribe((events: RoutesRecognized[]) => {

                  console.log('previous url', events[0].urlAfterRedirects);
                  console.log('current url', events[1].urlAfterRedirects);

                  this.PreviousUrl = events[0].urlAfterRedirects;
                  this.CurrentUrl = events[1].urlAfterRedirects

                  this.previousUrl = events[0].urlAfterRedirects;

                    if (!this.previousUrl) {
                      this.router.navigate(['/']);
                    } else {
                      this.router.navigateByUrl(this.previousUrl);
                    }
                });
         }
         catch(ex:any)
         {

         }
    }

}
