import { Router } from "@angular/router";
import { AccountDetailsDto } from "./AccountInfoDto";
import { BvnDetails } from "./BvnDetails";
import { BvnRespondsDto } from "./BvnRespondsDto";
import { PersonalDetailsDto } from "./PersonalDetailsDto";
import { myAppConfig } from "../../assets/ecosystem.config";
import { AppConfig } from "../../assets/images/defaultSettings";
import { LocalStorageService } from "../datatableservicehelper/local-storage.service";


export class StaticData 
{
    public static  properties : boolean = false;
    public static  propertie1 : string = "LoanHolding";
    public static  BvnDetail: BvnRespondsDto;
    public static  AcctDetail: AccountDetailsDto;
    public  static  PersonalDetails:PersonalDetailsDto;
    public static SignInPage :string = "/signin";
    public static MaxClientAgeRetirement = 65;
    public static MinClientAgeRetirement = 18;
    public  static  AppOnLoan:string = "AppOnLoan1Client";
    public  static  AppOnLoanAnswer:string = "Yes";

    public  static  LoanAppOnLoanAnswer:string = "Yesloanbvnapp-login-session";
    
    public  static  DateLoginKeySession:string = "DateLoginKeySession";
    public  static  TimeLoginKeySession:string = "TimeLoginKeySession";
    
    public  static  LoginKeySession:string = "LoginKeySession1Client";
    public  static  LoginAcctDetailsKeySession:string = "LoginAcctDetailsKeySession1Client";
    public  static  TwoLoginKeySession:string = "TwoLoginKeySession1Client";
    public  static  AccountEmailSession:string = "AccountEmailSession";

    public  static  LoanKeySession:string = "LoanKeySession14555Client";

    public  static  LoanPersonnalSession:string = "LoanPersonnalSession";
    public  static  LoanAcctBankSession:string = "LoanAcct&BankSession";
    public  static  LoanReviewSession:string = "LoanReviewSession";


    public  static  ClientAdminPagesList:Array<Square>;
    public static CheckIfClintAdminPage(Pageurl: string):boolean
    {
        this.ClientAdminPagesList =  new Array<Square>;
        var sqllist =  new Square();
        sqllist.PageName = "/dashboard";
        this.ClientAdminPagesList.push(sqllist);

        console.log(this.ClientAdminPagesList);
         let admin = this.ClientAdminPagesList.find(p => Pageurl.includes(p.PageName ?? ""));
         if(admin != null || admin != undefined) {
            return true;
         }

         return false;
    }

    public static SignOutClient(router:Router,page:any ): void
    {
        // this.router.navigate([page]);
        router.navigate([page], { queryParams: { IsLoanApp: false }});
        return;
    }

    public static SignOutClient1(router:Router,page:any ): void
    {
        // this.router.navigate([page]);
        router.navigate([page]);
        return;
    }

    public static SiginLink1() : string
    {
        // return "http://localhost:59870/signin";
        if(myAppConfig.IsProducOrDev ==0){
            return AppConfig.DevProjectUrl + "/signin";
        }

        return AppConfig.ProductionProjectUrl + "/signin";
    }

    public static DashboardLink() : string
    {
        // return "http://localhost:59870/signin";
        let SessionResult = LocalStorageService.getLoginSessionIdentity(StaticData.LoginKeySession);
        
        if(myAppConfig.IsProducOrDev ==0){
            return AppConfig.DevProjectUrl + "/dashboard?AccountId="+ SessionResult;
        }

        return AppConfig.ProductionProjectUrl + "/dashboard?AccountId="+ SessionResult;
    }
    
    public static ResetPasswordUrl1(Username:any):string
    {
        return "/forgetpwrd2?Username=" + Username;
    }

    public static SpriningListStype =  [ "ball-8bits",
    "ball-atom" ,
     "ball-beat" ,
     "ball-circus" ,
    "ball-climbing-dot",
     "ball-clip-rotate",
       "ball-clip-rotate-multiple" ,
      "ball-clip-rotate-pulse" ,
      "ball-elastic-dots" ,
      "ball-fall" ,
      "ball-fussion",
      "ball-grid-beat",
      "ball-grid-pulse",
      "ball-newton-cradle",
      "ball-pulse" ,
      "ball-pulse-rise" ,
      "ball-pulse-sync" ,
      "ball-rotate" ,
      "ball-running-dots" ,
      "ball-scale" ,
      "ball-scale-multiple",
      "ball-scale-pulse" ,
      "ball-scale-ripple" ,
      "ball-scale-ripple-multiple",
      "ball-spin" ,
      "ball-spin-clockwise",
      "ball-spin-clockwise-fade" ,
      "ball-spin-clockwise-fade-rotating" ,
      "ball-spin-fade" ,
      "ball-spin-fade-rotating",
      "ball-spin-rotate" ,
      "ball-square-clockwise-spin" ,
      "ball-square-spin" ,
      "ball-triangle-path" ,
      "ball-zig-zag" ,
      "ball-zig-zag-deflect" ,
      "cog" ,
     "cube-transition" ,
      "fire" ,
     "line-scale",
      "line-scale-party" ,
      "line-scale-pulse-out" ,
      "line-scale-pulse-out-rapid",
      "line-spin-clockwise-fade" ,
      "line-spin-clockwise-fade-rotating" ,
      "line-spin-fade",
      "line-spin-fade-rotating" ,
      "pacman" ,
    "square-jelly-box" ,
      "square-loader" ,
      "square-spin" ,
      "timer",
     "triangle-skew-spin" ];
}

export class Square
{
   public PageName :string | undefined;
}


