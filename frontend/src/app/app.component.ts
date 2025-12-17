import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, CommonModule],
  template: `
    <div *ngIf="showLayout">
      <app-layout>
        <router-outlet></router-outlet>
      </app-layout>
    </div>
    
    <div *ngIf="!showLayout">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit {
  title = 'PeerView';
  showLayout = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Hide layout for auth pages
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigationEnd = event as NavigationEnd;
        const authRoutes = ['/login', '/register'];
        this.showLayout = !authRoutes.includes(navigationEnd.url);
      });
  }
}