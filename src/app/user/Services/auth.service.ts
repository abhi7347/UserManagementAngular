import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  constructor(private router: Router) {}

  // Store the token in local storage
  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Retrieve the token from local storage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Check if the token is expired
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  // Remove the token and redirect to login
  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/user/login']);
  }
}