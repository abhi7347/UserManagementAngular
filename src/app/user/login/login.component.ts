import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from  '@angular/router'; 
import { LoginService } from '../Services/login.service';
import { AuthService } from '../Services/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor(private fb: FormBuilder, private router:Router, private loginService: LoginService, private authService: AuthService, private toastr: ToastrService){}

  loginForm!: FormGroup;
  passwordFieldType: string = 'password';
  showPassword: boolean = false;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)
      ]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.loginService.loginUser(this.loginForm.value).subscribe({
        next: (response:any) => {
          console.log('Login successful:', response);
          
          this.toastr.success("Login Successfully!");
          this.router.navigate(['/user/dashboard']);
          const token = response.token;
          this.authService.storeToken(token);
  
     
        },
        error: (err:any) => {
          console.error('Login error:', err);
          this.toastr.error("Login Error!");
        }
      });
    }
  }
    

  forgotPass(){
    this.router.navigate(['/user/forgot']);
  }

  toggleVisibility(passwordField: HTMLInputElement, icon: HTMLElement): void {
    // Toggle the password field type and icon class
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    } else {
      passwordField.type = 'password';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  }
}


