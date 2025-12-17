import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.message || 'Login failed. Please try again.';
      }
    });
  }
}