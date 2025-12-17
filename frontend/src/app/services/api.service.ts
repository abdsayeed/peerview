import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';
import { Question, CreateQuestionRequest, CreateAnswerRequest, Answer } from '../models/question.model';
import { User, LoginRequest, RegisterRequest, AuthResponse, AdminStats, ModerationRequest } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl || '';
  private legacyApiUrl = `${this.baseUrl}/api`;
  private v1ApiUrl = `${this.baseUrl}/v1`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.error || `Server returned code ${error.status}`;
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // AUTHENTICATION METHODS
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.v1ApiUrl}/auth/login`, credentials)
      .pipe(
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.v1ApiUrl}/auth/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.v1ApiUrl}/users/me`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // MEDIA METHODS
  generateUploadUrl(fileName: string, fileType: string): Observable<any> {
    return this.http.post(`${this.v1ApiUrl}/media/upload-url`, 
      { fileName, fileType }, 
      { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // ENHANCED QUESTION METHODS
  getQuestionsV1(page: number = 1, limit: number = 20): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.v1ApiUrl}/questions?page=${page}&limit=${limit}`, 
      { headers: this.getAuthHeaders() })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createQuestionV1(question: Omit<CreateQuestionRequest, 'userId'>): Observable<Question> {
    return this.http.post<Question>(`${this.v1ApiUrl}/questions`, question, 
      { headers: this.getAuthHeaders() })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getQuestionV1(questionId: string): Observable<Question> {
    return this.http.get<Question>(`${this.v1ApiUrl}/questions/${questionId}`, 
      { headers: this.getAuthHeaders() })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateQuestion(questionId: string, questionData: any): Observable<Question> {
    return this.http.put<Question>(`${this.v1ApiUrl}/questions/${questionId}`, questionData,
      { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteQuestion(questionId: string): Observable<any> {
    return this.http.delete(`${this.v1ApiUrl}/questions/${questionId}`, 
      { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // ENHANCED ANSWER METHODS
  addAnswerV1(questionId: string, answer: Omit<CreateAnswerRequest, 'userId'>): Observable<Answer> {
    return this.http.post<Answer>(`${this.v1ApiUrl}/questions/${questionId}/answers`, answer,
      { headers: this.getAuthHeaders() })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateAnswer(answerId: string, textResponse: string, mediaUrl?: string): Observable<Answer> {
    return this.http.put<Answer>(`${this.v1ApiUrl}/answers/${answerId}`, 
      { textResponse, mediaUrl }, 
      { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteAnswer(answerId: string): Observable<any> {
    return this.http.delete(`${this.v1ApiUrl}/answers/${answerId}`, 
      { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // ADMIN METHODS
  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.v1ApiUrl}/admin/stats`, 
      { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  moderateContent(moderation: ModerationRequest): Observable<any> {
    return this.http.post(`${this.v1ApiUrl}/admin/moderation`, moderation,
      { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getFlaggedContent(): Observable<any> {
    return this.http.get(`${this.v1ApiUrl}/admin/flagged-content`, 
      { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllUsers(page: number = 1, limit: number = 20): Observable<User[]> {
    return this.http.get<User[]>(`${this.v1ApiUrl}/admin/users?page=${page}&limit=${limit}`, 
      { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserActivity(userId: string): Observable<any> {
    return this.http.get(`${this.v1ApiUrl}/admin/users/${userId}/activity`, 
      { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadFile(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.baseUrl}/api/upload`, formData)
      .pipe(
        retry(1),
        catchError(this.handleError),
        // URLs are already correct for proxy, no conversion needed
        map(response => response)
      );
  }

  getFeed(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/api/feed`)
      .pipe(
        retry(1),
        catchError(this.handleError),
        // URLs are already correct for proxy, no conversion needed
        map(questions => questions)
      );
  }

  createQuestion(question: CreateQuestionRequest): Observable<Question> {
    return this.http.post<Question>(`${this.baseUrl}/api/questions`, question)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addAnswer(questionId: string, answer: CreateAnswerRequest): Observable<Answer> {
    return this.http.post<Answer>(`${this.baseUrl}/api/questions/${questionId}/answers`, answer)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getQuestion(questionId: string): Observable<Question> {
    return this.http.get<Question>(`${this.baseUrl}/api/questions/${questionId}`)
      .pipe(
        retry(1),
        catchError(this.handleError),
        // URLs are already correct for proxy, no conversion needed
        map(question => question)
      );
  }
}