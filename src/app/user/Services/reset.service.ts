import { Injectable } from '@angular/core';
import { ResetPasswordApiUrl } from '../../../Environment/ApiUrl';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ResetService {

  private apiUrl = ResetPasswordApiUrl.apiUrl

  constructor(private http:HttpClient) { }

  ResetPassword(resetpassword:any):Observable<any>{
    return this.http.put<any>(this.apiUrl, resetpassword);
  }
}
