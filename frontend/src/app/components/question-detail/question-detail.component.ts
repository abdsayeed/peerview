import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Question, CreateAnswerRequest } from '../../models/question.model';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit {
  question: Question | null = null;
  loading = false;
  error = '';
  showAnswerForm = false;
  submittingAnswer = false;
  
  newAnswer: CreateAnswerRequest = {
    userId: '',
    textResponse: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const questionId = this.route.snapshot.paramMap.get('id');
    if (questionId) {
      this.loadQuestion(questionId);
    }
  }

  loadQuestion(questionId: string) {
    this.loading = true;
    this.error = '';
    
    this.apiService.getQuestion(questionId).subscribe({
      next: (question: Question) => {
        this.question = question;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load question. Please try again.';
        this.loading = false;
        console.error('Error loading question:', err);
      }
    });
  }

  submitAnswer() {
    if (!this.question || !this.newAnswer.userId || !this.newAnswer.textResponse) {
      return;
    }

    this.submittingAnswer = true;
    
    this.apiService.addAnswer(this.question.id, this.newAnswer).subscribe({
      next: (answer: any) => {
        // Add the new answer to the question
        this.question!.answers.push(answer);
        this.question!.status = 'answered';
        
        // Reset form
        this.cancelAnswer();
        this.submittingAnswer = false;
      },
      error: (err: any) => {
        this.submittingAnswer = false;
        alert('Failed to submit answer. Please try again.');
        console.error('Error submitting answer:', err);
      }
    });
  }

  cancelAnswer() {
    this.showAnswerForm = false;
    this.newAnswer = { userId: '', textResponse: '' };
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleDateString() + ' ' + 
           new Date(timestamp).toLocaleTimeString();
  }

  goBack() {
    this.router.navigate(['/']);
  }
}