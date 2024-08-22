import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailApiUrl } from '../../../Environment/ApiUrl';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotService {
  private apiUrl = EmailApiUrl.apiUrl;

  constructor(private http:HttpClient) { }

  ForgotEmail(toEmail:any):Observable<any>{  
    const headers = new HttpHeaders({
      "Content-Type" : "application/json",
    })
    const emailRequest = { ToEmail: toEmail };
    return this.http.post<any>(this.apiUrl, emailRequest, {headers}); 
  }
}
