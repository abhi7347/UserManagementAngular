import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgotService } from '../Services/forgot.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent {

  constructor(private fb: FormBuilder, private forgotService:ForgotService, private toastr:ToastrService) { }

  forgotPasswordForm = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]]
  });


  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const Value = this.forgotPasswordForm.get("email")?.value;
      this.forgotService.ForgotEmail(Value).subscribe({
        next: (response:any) => {
          console.log('Email Sent:', response);
          this.toastr.success('Email Sent!');
        },
        error: (err:any) => {
          console.error('Email error:', err);
          this.toastr.error('Email not Registered');
        }
      });
    }
  }
}