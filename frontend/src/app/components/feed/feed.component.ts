import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  questions: Question[] = [];
  loading = false;
  error = '';
  showAnswerFormFor: string | null = null;
  showMenuFor: string | null = null;
  showEditFormFor: string | null = null;
  Date = Date; // Make Date available in template
  currentUser: User | null = null;
  newAnswer = {
    userId: '',
    textResponse: ''
  };
  editForm = {
    title: '',
    caption: '',
    mediaUrl: '',
    mediaType: 'image'
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadFeed();
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  loadFeed() {
    this.loading = true;
    this.error = '';
    
    this.apiService.getFeed().subscribe({
      next: (questions) => {
        console.log('Loaded questions:', questions);
        // Log media URLs for debugging
        questions.forEach((q, index) => {
          console.log(`Question ${index + 1}: ${q.title}`);
          console.log(`Media URL: ${q.mediaUrl}`);
        });
        this.questions = questions;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load questions. Please try again.';
        this.loading = false;
        console.error('Error loading feed:', err);
      }
    });
  }

  showAnswerForm(questionId: string) {
    this.showAnswerFormFor = questionId;
    this.newAnswer = { userId: '', textResponse: '' };
  }

  cancelAnswer() {
    this.showAnswerFormFor = null;
    this.newAnswer = { userId: '', textResponse: '' };
  }

  submitAnswer(questionId: string) {
    if (!this.newAnswer.userId || !this.newAnswer.textResponse) {
      alert('Please fill in all required fields');
      return;
    }

    this.apiService.addAnswer(questionId, this.newAnswer).subscribe({
      next: () => {
        this.cancelAnswer();
        this.loadFeed(); // Reload to show the new answer
      },
      error: (err) => {
        alert('Failed to submit answer. Please try again.');
        console.error('Error submitting answer:', err);
      }
    });
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  trackByQuestionId(index: number, question: Question): string {
    return question.id;
  }

  onMediaLoad(event: any): void {
    console.log('Media loaded successfully:', event.target?.src);
  }

  onMediaError(event: any): void {
    console.error('Media failed to load:', event);
    console.error('Failed URL:', event.target?.src);
    console.error('Error details:', event.target?.error);
    // You could show a placeholder or error message here
  }

  canEditQuestion(question: Question): boolean {
    return !!(this.currentUser && (
      this.currentUser.id === question.userId || 
      this.currentUser.role === 'admin'
    ));
  }

  toggleMenu(questionId: string): void {
    this.showMenuFor = this.showMenuFor === questionId ? null : questionId;
  }

  showEditForm(question: Question): void {
    this.editForm = {
      title: question.title,
      caption: question.caption,
      mediaUrl: question.mediaUrl || '',
      mediaType: question.mediaType
    };
    this.showEditFormFor = question.id;
    this.showMenuFor = null;
  }

  cancelEdit(): void {
    this.showEditFormFor = null;
    this.editForm = {
      title: '',
      caption: '',
      mediaUrl: '',
      mediaType: 'image'
    };
  }

  updateQuestion(questionId: string): void {
    if (!this.editForm.title || !this.editForm.caption) {
      alert('Please fill in all required fields');
      return;
    }

    this.apiService.updateQuestion(questionId, this.editForm).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadFeed(); // Reload to show updated question
      },
      error: (err) => {
        alert('Failed to update question. Please try again.');
        console.error('Error updating question:', err);
      }
    });
  }

  deleteQuestion(questionId: string): void {
    if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      this.apiService.deleteQuestion(questionId).subscribe({
        next: () => {
          this.loadFeed(); // Reload to remove deleted question
        },
        error: (err) => {
          alert('Failed to delete question. Please try again.');
          console.error('Error deleting question:', err);
        }
      });
    }
    this.showMenuFor = null;
  }

  onDebugImageLoad(type: string, event: any): void {
    console.log(`Debug ${type} image loaded successfully`);
    if (event.target) {
      (event.target as HTMLImageElement).style.border = '3px solid green';
    }
  }

  onDebugImageError(type: string, event: any): void {
    console.error(`Debug ${type} image failed to load`);
    if (event.target) {
      (event.target as HTMLImageElement).style.border = '3px solid red';
    }
  }
}