import { Component, OnInit } from '@angular/core';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { LoaderService } from '../datatableservicehelper/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LapoLoanApiService } from '../datatableservicehelper/lapo-loan-api.service';

@Component({
  selector: 'app-app-password-rest-status',
  templateUrl: './app-password-rest-status.component.html',
  styleUrls: ['./app-password-rest-status.component.css']
})
export class AppPasswordRestStatusComponent implements OnInit {

  identification:string="";

  statusTitle:string ="";
  statusMessge:string ="";
  imageName:string = "";
  LoginLink:string = "";
  success:boolean = false;
  ResponseData: RespondMessageDto | undefined;
  showLink:boolean = false;

  constructor(private loadingService: LoaderService, private route: Router, private router: ActivatedRoute,  private LapoLoanService: LapoLoanApiService) {

  }

  ngOnInit(): void  
  {
       try{
        this.statusTitle = this.router.snapshot.queryParams["messageTitle"];
        this.statusMessge = this.router.snapshot.queryParams["statusMessge"];
        this.imageName = this.router.snapshot.queryParams["imageName"];
        this.LoginLink = this.router.snapshot.queryParams["SiginLink"];
        if(this.statusTitle === "" || this.statusMessge === "" || this.imageName === "")
        {
            this.onNaviagateBack('/forgetpwrd');
            return;
        }
        
        this.success = true;

        if(this.LoginLink == "" || this.LoginLink == null){
          this.showLink = false;
        }
        else{
          this.showLink = true;
        }
        
        this.success = true;
    }
    catch(e){
     //console.log('Display: ' + e);
         this.onNaviagateBack('/forgetpwrd');
         return;
    }
  }

  private onNaviagateBack(page:string):void{
    this.route.navigate([page]);
  }

}
