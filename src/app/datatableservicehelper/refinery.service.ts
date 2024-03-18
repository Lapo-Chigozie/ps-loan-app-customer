import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';
import { Observable } from 'rxjs';
import { ApiHostComponent } from '../environment/Environment';

@Injectable({
  providedIn: 'root'
})
export class RefineryService {

  constructor(private http: HttpClient) 
  { 
     //this.HostServerUrl = AppHost;
     //private AppHost: ApiHostComponent;
  }

  public  EncriptConnector(data : any):Observable<RespondMessageDto>
  {
    let urlhost = ApiHostComponent.GetHostUrl(0); //2  ,0 
    return  this.http.post<RespondMessageDto>(urlhost + '/api/Refinerys/EncriptRefinery', data);
  }

  public  DecriptConnector(data : any):Observable<RespondMessageDto>
  {
    let urlhost = ApiHostComponent.GetHostUrl(0); //2  ,0 
    return  this.http.post<RespondMessageDto>(urlhost + '/api/Refinerys/DecriptRefinery', data);
  }

}
