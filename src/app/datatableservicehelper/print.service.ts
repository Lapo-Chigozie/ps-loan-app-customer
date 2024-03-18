
import { Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FileUploadService } from './file-upload.service';
import Swal from 'sweetalert2';
import { LapoLoanApiService } from './lapo-loan-api.service';

@Injectable({
  providedIn: 'root'
})
export class PrintService 
{
  public isPrinting = false;
  private ResponseData: any;
 
  constructor(private loadingService: LoaderService,private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,private LapoLoanService: LapoLoanApiService, private fileUploadService: FileUploadService) 
  {
      //headerId: item.headerId , IppisNumber: item.ippisNumber 
  }
 
  public ngOnInit() 
  {
  
  }
 
 public PrintLocal(data:any): void 
 {
   let heightScreen = window.innerHeight + 200;
   let widthScreen = window.innerWidth;
   let popupWindow = window.open('','_blank','width='+widthScreen+',height='+heightScreen+',scrollbars=yes,menubar=no,toolbar=no,location=center,status=no,titlebar=no');
   popupWindow?.document.open();
   popupWindow?.document.write(data);
   popupWindow?.document.close();  
 
   return;
 }
 
 public OnProcessingApi(isprocessing:boolean): void {
 
 }
 
 public OnDismissingApi(isprocessing:boolean): void {
  
 }
 
 public async GetPrintServiceConnector(data:any)
 {
    this.loadingService.setLoading(true);
  
    await this.LapoLoanService.GetPrintServiceConnector(data).subscribe({
     next: (res: any) => 
     {
       this.loadingService.setLoading(false);
       this.ResponseData = res;
       if (this.ResponseData != null && this.ResponseData != undefined && this.ResponseData.isActive) 
       {
           let html = this.ResponseData.dataLoad;
           const InvoiceIds = ['101', '102'];
           // console.log('Html Data - ', html);
 
           // Promise.all(data).then(() => this.OnDataReady());
           // this.PrintDocument('Invoice', InvoiceIds);
           this.PrintLocal(html);
           return;
       }
 
       else {
         Swal.fire({ title: 'Warning!', text: this.ResponseData.tryCatchMessage, icon: 'warning', confirmButtonText: 'Ok' });
         return;
       }
 
     },
     error: (err: any) => {
       // console.log("no continue " + err);
       this.loadingService.setLoading(false);
       Swal.fire({ title: 'Error!', text: "An error occurred: " + err.message, icon: 'error', confirmButtonText: 'Ok' });
       return;
     }
   })
 }
 
 public PrintDocument(documentName: string, documentData: string[]) 
 {
     this.isPrinting = true;
     this.router.navigate(['/',{ outlets: { 'print': ['print', documentName, documentData.join()] }}]);
     return;
 }
  
 public OnDataReady() :void
 {
        setTimeout(() => {
          window.print();
          this.isPrinting = false;
          this.router.navigate([{ outlets: { print: null }}]);
        });
        return;
 }
}
