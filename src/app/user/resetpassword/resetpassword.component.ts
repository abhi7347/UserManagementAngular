import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResetService } from '../Services/reset.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent {
  passwordForm: FormGroup;
  email!: string;

  constructor(private fb: FormBuilder, private resetService: ResetService, private route: ActivatedRoute, private toastr:ToastrService) {
    this.passwordForm = this.fb.group({
      newPassword: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}/)
        ]
      ],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'];
    console.log(this.email);
  }
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const resetPasswordData = {
        newPassword: this.passwordForm.get('newPassword')?.value,
        confirmPassword: this.passwordForm.get('confirmPassword')?.value,
        email: this.email
      };
      this.resetService.ResetPassword(resetPasswordData).subscribe({
        next: (response) => {
          console.log("Password Reset Successful", response);
          this.toastr.success('Password Reset Successful');
        },
        error: (err: any) => {
          console.error('Password Reset Error:', err);
          this.toastr.error('Password Reset Error');
        }
      });
    } else {
      console.log("Form is invalid");
      console.log(this.passwordForm.errors);  // Log form errors
    }
  }
  
  togglePasswordVisibility(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const newPasswordInput = document.querySelector<HTMLInputElement>('#newPassword');
    const confirmPasswordInput = document.querySelector<HTMLInputElement>('#confirmPassword');

    if (newPasswordInput && confirmPasswordInput) {
      const type = checkbox.checked ? 'text' : 'password';
      newPasswordInput.type = type;
      confirmPasswordInput.type = type;
    }
  }

}

