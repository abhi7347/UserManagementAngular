import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ManageUserService } from '../Services/manage-user.service';
import { HttpParams } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';


// Define the DecodedToken interface
interface DecodedToken {
  userId: string;
}

@Component({
  selector: 'app-changepass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.css'],
})
export class ChangepassComponent implements OnInit {
  ChangePassForm!: FormGroup;
  email: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private manageUserService: ManageUserService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {
    this.ChangePassForm = this.fb.group({
      oldPass: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/) // At least one number, one uppercase letter, and one special character
        ]
      ]
    });
  }
  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'];
    console.log(this.email);
  }

  onSubmit(): void {
    debugger
    if (this.ChangePassForm.valid) {
      const oldPassword = this.ChangePassForm.value.oldPass;
      const newPassword = this.ChangePassForm.value.newPassword;
  
      const payload = {
        email: this.email,
        OldPassword: oldPassword,
        NewPassword: newPassword
      };
      this.manageUserService.ChangePassword(payload).subscribe({
        next: (res: any) => {
          this.toastr.success('Password changed successfully');
        },
        error: (err: any) => {
          this.toastr.error('Password not changed');
        }
      });
    } else {
      // Log the form errors
      console.log('Form errors:', this.ChangePassForm.errors);
      console.log('Old password errors:', this.ChangePassForm.get('oldPass')?.errors);
      console.log('New password errors:', this.ChangePassForm.get('newPassword')?.errors);
  
      this.toastr.error('Please correct the errors in the form');
    }
  }

  forgotPass(): void {
    this.router.navigate(['/user/forgot']);
  }
}


