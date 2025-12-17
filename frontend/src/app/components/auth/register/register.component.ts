import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userData: RegisterRequest = {
    email: '',
    password: '',
    fullName: '',
    role: 'student'
  };
  
  confirmPassword = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  passwordsMatch(): boolean {
    return this.userData.password === this.confirmPassword;
  }

  onSubmit(): void {
    if (!this.userData.email || !this.userData.password || !this.userData.fullName) {
      return;
    }

    if (!this.passwordsMatch()) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.userData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.message || 'Registration failed. Please try again.';
      }
    });
  }
}