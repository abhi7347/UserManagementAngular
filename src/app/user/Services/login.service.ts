import { Injectable } from '@angular/core';
import { LoginApiUrl } from '../../../Environment/ApiUrl';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = LoginApiUrl.apiUrl;

  constructor(private http: HttpClient ) { }

  loginUser(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }
}
