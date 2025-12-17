import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        
        // Verify token is still valid
        this.apiService.getCurrentUser().subscribe({
          next: (user) => {
            this.currentUserSubject.next(user);
            this.updateLocalStorage(user);
          },
          error: () => {
            this.logout();
          }
        });
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.login(credentials).pipe(
      tap(response => {
        this.setAuthData(response);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.register(userData).pipe(
      tap(response => {
        this.setAuthData(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('auth_token', authResponse.token);
    this.updateLocalStorage(authResponse.user);
    this.currentUserSubject.next(authResponse.user);
    this.isAuthenticatedSubject.next(true);
  }

  private updateLocalStorage(user: User): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  isStudent(): boolean {
    return this.hasRole('student');
  }

  isTeacher(): boolean {
    return this.hasRole('teacher');
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  canAnswer(): boolean {
    return this.hasAnyRole(['teacher', 'admin']);
  }

  canModerate(): boolean {
    return this.isAdmin();
  }
}