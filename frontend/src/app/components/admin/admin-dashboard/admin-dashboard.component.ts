import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { AdminStats, User, ModerationRequest } from '../../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminStats | null = null;
  users: User[] = [];
  flaggedContent: any = null;
  loading = false;
  error = '';
  showFlaggedContent = false;
  showUsers = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = '';
    
    this.apiService.getAdminStats().subscribe({
      next: (stats: AdminStats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load statistics';
        this.loading = false;
        console.error('Error loading stats:', err);
      }
    });
  }

  refreshStats(): void {
    this.loadStats();
  }

  loadFlaggedContent(): void {
    this.showFlaggedContent = true;
    this.showUsers = false;
    this.loading = true;
    
    this.apiService.getFlaggedContent().subscribe({
      next: (content: any) => {
        this.flaggedContent = content;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load flagged content';
        this.loading = false;
        console.error('Error loading flagged content:', err);
      }
    });
  }

  loadAllUsers(): void {
    this.showUsers = true;
    this.showFlaggedContent = false;
    this.loading = true;
    
    this.apiService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  moderateContent(targetType: 'question' | 'answer', targetId: string, action: 'remove' | 'flag'): void {
    const moderation: ModerationRequest = {
      targetType,
      targetId,
      action
    };
    
    this.apiService.moderateContent(moderation).subscribe({
      next: (result: any) => {
        // Refresh flagged content
        this.loadFlaggedContent();
      },
      error: (err: any) => {
        this.error = 'Failed to moderate content';
        console.error('Error moderating content:', err);
      }
    });
  }

  viewUserActivity(userId: string): void {
    this.apiService.getUserActivity(userId).subscribe({
      next: (activity: any) => {
        console.log('User activity:', activity);
        // You could open a modal or navigate to a detailed view
      },
      error: (err: any) => {
        this.error = 'Failed to load user activity';
        console.error('Error loading user activity:', err);
      }
    });
  }
}