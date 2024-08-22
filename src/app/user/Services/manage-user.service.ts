import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUser, DeleteUser, UpdateUser, GetAllUser, FilterUser, SortUser, ExportExcel, changePassword } from '../../../Environment/ApiUrl'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageUserService {

  constructor(private http:HttpClient) { }

   // Get All Users
   getAllUsers(pageNumber: number, pageSize: number): Observable<any[]> {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any[]>(GetAllUser.apiUrl, { params });
  }

  // Create User
  createUser(formData: FormData): Observable<any> {
    return this.http.post<any>(CreateUser.apiUrl, formData);
  }

  // Update User
  updateUser( user: any): Observable<any> {
    return this.http.put<any>(`${UpdateUser.apiUrl}`, user, { responseType: 'text' as "json"});
  }

  // Delete User
  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${DeleteUser.apiUrl}/${userId}`);
  }

  //Filter User Active/Inactive
  filterUser(filter:any):Observable<any>{
    return this.http.get<any>(`${FilterUser.apiUrl}?filter=${filter}`);
  }

  //Filter User Active/Inactive
  sortUsers(sortColumn:string):Observable<any>{
    return this.http.get<any>(`${SortUser.apiUrl}/${sortColumn}`);
  }

  //Export in Excel User
  exportExcel():Observable<Blob>{
    return this.http.get<any>(`${ExportExcel.apiUrl}`, { responseType: 'blob' as 'json' });
  }

  //Change Password
  ChangePassword(payload: any):Observable<any>{
    return this.http.put<any>(`${changePassword.apiUrl}`, payload);
  }
}
