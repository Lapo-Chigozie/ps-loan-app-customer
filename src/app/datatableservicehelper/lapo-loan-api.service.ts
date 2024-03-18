


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHostComponent } from '../environment/Environment';
import { AppConfig } from '../../assets/images/defaultSettings';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { SignInPostDto } from '../ps.loan.Models/SignInPostDto';
import { TwoFactorAuthÇodeDto } from '../ps.loan.Models/TwoFactorAuthÇodeDto';
import { RegisterUserDto } from '../ps.loan.Models/RegisterUserDto';

 @Injectable({
  providedIn: 'root'
 })

export class LapoLoanApiService 
{
    private HostServerUrl:any = ApiHostComponent.IsLive;
    private TimeOutHttp:any = AppConfig.TimeOutHttp;
    private controllerName = AppConfig.AcctSecurity;

    constructor(private http: HttpClient) 
    { 
        this.HostServerUrl = ApiHostComponent.IsLive
        this.controllerName = AppConfig.AcctSecurity;
        //  private AppHost: ApiHostComponent
    }

    public InnerChangePasswordConnector(data : any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/InnerChangePassword', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public  GetPrintServiceConnector(data:any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.PrintService + '/SetLoanPrinterArrangement', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    GetUserPermissionDetails(accountId: number):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/GetUserPermissionDetails?AccounttId=' + accountId, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }
    
    public  UserTwoFactorActivatorConnector(data : string):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity  + '/UserTwoFactorActivator?AccounttId=' + data , { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public GetAllHubTeamMembers(PagenationFilter: any, urlhost:string):Observable<RespondMessageDto>
    {
        return this.http.post<RespondMessageDto>(urlhost , PagenationFilter, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
        // return this.http.get<RespondMessageDto>(urlhost + '/api/AcctSecurity/AllLoanApp?AccountId=' + accountId);
    }

    public ChangeProfileDetailsConnector(data : any):Observable<RespondMessageDto>
    {
        let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
        return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/ChangeProfileDetails1', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public async FileValidationImage(data : any):Promise<Observable<RespondMessageDto>>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  , 0 
      return await this.http.post<RespondMessageDto>(urlhost + AppConfig.FileValidation + '/ValidateFileUploadImage', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public async ValidateSlipFileImage1(data : any):Promise<Observable<RespondMessageDto>>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return await this.http.post<RespondMessageDto>(urlhost + AppConfig.FileValidation + '/ValidateSlipFileImage1', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public  GetUserProfileDetails(accountId: number):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/GetUserProfileDetails?AccounttId=' + accountId, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public GetAdminLoanMethodList(accountId: number):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/AdminLoanMethodListApp?AcctId=' + accountId , { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }
    
    public GetLoanAppDetails(AppHeaderId: string, AcctId: string):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/LoanAppDetails?AppHeaderId=' + AppHeaderId + "&AcctId=" + AcctId , { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public  CalculateScheduledLoanAmount(data:any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.LoanScheduled + '/CalculateScheduledLoanAmount', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public GetBankAcctName(data:any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/GetBankAcctName', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public RetrivetedBankAcctName(data:any):Observable<RespondMessageDto>
    {
       let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
       return this.http.post<RespondMessageDto>(urlhost + AppConfig.HubTeam + '/RetrivetedBankAcctName', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public  ValidateRelationShipOfficer(firstName:string, otherName:string):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.HubTeam + '/CheckIfOfficerMember?OffFirstName=' + firstName + '&OffOther=' + otherName , { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public CheckIfBankAccountIsOk(data:any):Observable<RespondMessageDto>
    {
          let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
          return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/CheckIfBankAccountIsOk?AcctId=' + data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public GetAllLoanSettings(data:any):Observable<RespondMessageDto>
    {
          let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
          return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/GetLoanSetting?Id=' + data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public CancelLoanAppConnector(data:any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/CancelLoanAppRequest', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public GetAdminLoanDetailsConnector(data:any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/CustomerdashboardLoanApp', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }
    
    public GetAllLoanApp(PagenationFilter: any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/AllLoanApp', PagenationFilter, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
      // return this.http.get<RespondMessageDto>(urlhost + '/api/AcctSecurity/AllLoanApp?AccountId=' + accountId);
    }

    public GetListOfNarrationList(accountId: any):Observable<RespondMessageDto>
    {
         let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
         return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/ListOfNarrationList?AcctId=' + accountId, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public GetListOfBusinessSegments(accountId: any):Observable<RespondMessageDto>
    {
         let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2, 0 
         return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/GetBusinessSegments', { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public GetListOfBusinessType(accountId: any):Observable<RespondMessageDto>
    {
         let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2, 0 
         return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/GetBusinessTypes', { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }
  
  
    public GetListOfStates(accountId: any):Observable<RespondMessageDto>
    {
         let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2, 0 
         return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/GetStates', { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public GetListOfCities(accountId: any):Observable<RespondMessageDto>
    {
         let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2, 0 
         return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/GetCitiesByStates?Id=' + accountId, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    //#################################################
    //gets all option of quickbooks settings

    public SignInConnector(save:SignInPostDto):Observable<RespondMessageDto>
    {
          let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
          return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/SignInAuth', save, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public RegisterCustomerConnector(save:RegisterUserDto):Observable<RespondMessageDto>
    {
      let urlhost =ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/Register', save, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public ConfirmTwoFactorAuthCodeConnector(code:TwoFactorAuthÇodeDto):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/ConfirmTwoFactorAuth', code, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public RebroundBankList(code:any):Observable<RespondMessageDto>
    {
       let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
       return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/RebroundBankList', code, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public GetBankAcctDetailsByAccountNo(code:any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/BankAcctDetailsByAccountNo', code, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public CreateNewLoanApplication(app:any):Observable<RespondMessageDto>
    {
       let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2
       return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/newLoanApplication', app, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }
  
    public AutoCreateAccountConnector(data : string):Observable<RespondMessageDto>
    {
      let urlhost =ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/AutoAdminCreateAcct?data=' + data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public  ConvertLoanAmount(data : any):Observable<RespondMessageDto>
    {
        let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
        return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/ConvertedLoanAmount?Amount=' + data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }
    
    public GetLoadSpinnerLoadingConnector(data : any):Observable<RespondMessageDto>
    {
        let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
        return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/LoadSpinnerRound?Lenght=' + data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public GetAllBanksNameLists(data : string):Observable<RespondMessageDto>
    {
        let urlhost =ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
        return this.http.get<RespondMessageDto>(urlhost + AppConfig.HubTeam + '/GetAllBanksNameLists?Number=' + data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public LoadBankLists(data : string):Observable<RespondMessageDto>
    {
      let urlhost =ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/GetAllBanks', { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public  ValidatePFNumberByNumberConnector(data : string):Observable<RespondMessageDto>
    {
      let urlhost =ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/ValidatePFNumberByProvider?Number=' + data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }
    
    public  FetchAccountDetailsConnector(data : string):Observable<RespondMessageDto>
    {
      let urlhost =ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/FetchAccountDetails?AcctId=' + data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public  VerifyNewAccountEmailConnector(data : string):Observable<RespondMessageDto>
    {
      let urlhost =ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/emailacctverify?AcctId=' + data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public  CheckIfAcctIsActiveConnector(data : string):Observable<RespondMessageDto>
    {
      let urlhost =ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/CheckIfAcctIsActive?AcctId=' + data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public UpdateProfileConnector(data : any):Observable<RespondMessageDto>
    {
         let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); // 2 , 0 
         return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/Updateemailacctverify?data=' + data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public  ResendTwofactorsmsConnector(message : string, accountId: number):Observable<RespondMessageDto>
    {
      let urlhost =ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 ReSendTwoFactorCode
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/ReSendTwoFactorCode?AcctId=' + accountId + "&message=" + message, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public  RequestBvnConnector(data : any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/RequestBvn', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public  BvnSettledmentConnector(data : any) : Observable<RespondMessageDto>
    {
          let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
          return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/BvnSettledment', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public  SendBvnAuthConnector(data : any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/SendBvnAuthentication', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }
    
    public   CheckIfEmailExitConnector(data : any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/CheckIfEmailExit', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }
    
    public   ChangePasswordConnector(data : any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/ChangePassword', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }
        
    public  VerifyBvnOtpCodeConnector(data : any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.post<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/VerifyBvnOtpCode', data, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public GetLoanSettings(accountId: any):Observable<RespondMessageDto>
    {
      let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); //2  ,0 
      return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/GetLoanSettings?AcctId=' + accountId, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }

    public GetE360UsersByTeamMember(AcctId: any, inputUser:any):Observable<RespondMessageDto>
    {
          let urlhost = ApiHostComponent.GetHostUrl(this.HostServerUrl); 
          //2  ,0 ProcessGetAllStaffAccessRight
          return this.http.get<RespondMessageDto>(urlhost + AppConfig.AcctSecurity + '/GetE360UsersByCustomer?AcctId=' + AcctId + "&inputUser=" + inputUser, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
    }
}
