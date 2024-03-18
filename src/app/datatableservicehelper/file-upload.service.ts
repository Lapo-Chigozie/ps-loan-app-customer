import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiHostComponent } from '../environment/Environment';
import { AppConfig } from '../../assets/images/defaultSettings';
import { RespondMessageDto } from '../ps.loan.Models/RespondMessageDto';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService 
{
  private TimeOutHttp:any = AppConfig.TimeOutHttp;
  private  urlhost = ApiHostComponent.GetHostUrl(0); //2  ,0 
  private urlPassport = this.urlhost + AppConfig.FileUploader + '/UploadPassport';
  private urlIDCard =  this.urlhost + AppConfig.FileUploader  +  '/UploadIDCard';
  private  urlPayslip = this.urlhost + AppConfig.FileUploader   +  '/UploadPayslip';

  progress: number | undefined;
  message: string | undefined;
  total: any = 0;
  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http:HttpClient) { }
  
  // Returns an observable
  Upload(file:any):Observable<any> {
  
      // Create form data
      const formData = new FormData(); 
      // let ReqJson: any = {};
      // ReqJson["patientId"] = "12";
      // ReqJson["requesterName"] = "test1";
      // ReqJson["requestDate"] = "1/1/2019";
      // ReqJson["location"] = "INDIA";
      // ReqJson["filename"] = file.name;
      // //formData.append('ComponentId', '1');
      // formData.append( 'Info', JSON.stringify( ReqJson ) )
      // Store form name as "file" with file data
      formData.append("file", file, file.name);
     
      // Make http post request over api
      // with formData as req
      return this.http.post<any>("", formData, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) })
  }

  public upload_2(files: Set<File>): { [key: string]: { progress: Observable<number> } } {

    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', "", formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
         // const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
       //   progress.next(percentDone);
        } else if (event instanceof HttpResponse) {

          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }
  
  public UploadPassport(files:any , PFNumber: any, AcctId:any): Observable<RespondMessageDto>
  {
      let fileToUpload = <File>files[0];
      const formData = new FormData();
  
      formData.append('AcctId', JSON.stringify(AcctId))
      formData.append('PFNumber', JSON.stringify(PFNumber))
      formData.append('file', fileToUpload, fileToUpload.name);
      // {reportProgress: true, observe: 'events'}
      return this.http.post<RespondMessageDto>(this.urlPassport, formData, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
  }

  public UploadIDCard(files:any , PFNumber: any, AcctId:any): Observable<RespondMessageDto>
  {
      let fileToUpload = <File>files[0];
      const formData = new FormData();
      formData.append( 'AcctId', JSON.stringify( AcctId ) )
      formData.append( 'PFNumber', JSON.stringify( PFNumber ))
      formData.append('file', fileToUpload, fileToUpload.name);
      // {reportProgress: true, observe: 'events'}
      return this.http.post<RespondMessageDto>(this.urlIDCard, formData, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
  }

  public UploadPayslip(files:any , PFNumber: any, AcctId:any): Observable<RespondMessageDto>
  {
      let fileToUpload = <File>files[0];
      const formData = new FormData();
      formData.append( 'AcctId', JSON.stringify( AcctId ) )
      formData.append( 'PFNumber', JSON.stringify( PFNumber ))
      formData.append('file', fileToUpload, fileToUpload.name);
      // {reportProgress: true, observe: 'events'}
      return this.http.post<RespondMessageDto>(this.urlPayslip, formData, { headers: new HttpHeaders({ timeout: `${this.TimeOutHttp}` }) });
  }
}
