import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CreateQuestionRequest } from '../../models/question.model';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  question: CreateQuestionRequest = {
    userId: '',
    title: '',
    caption: '',
    mediaUrl: '',
    mediaType: 'image'
  };
  
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploading = false;
  error = '';
  currentStep = 1;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.question.userId = currentUser.id;
    } else {
      // Redirect to login if not authenticated
      this.router.navigate(['/login']);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFileSelection(file);
    }
  }

  getAcceptedFileTypes(): string {
    switch (this.question.mediaType) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      default:
        return '*/*';
    }
  }

  onSubmit() {
    if (!this.selectedFile) {
      this.error = 'Please select a file to upload';
      return;
    }

    this.uploading = true;
    this.error = '';

    // Step 1: Upload the file
    this.apiService.uploadFile(this.selectedFile).subscribe({
      next: (uploadResponse: any) => {
        // Step 2: Create the question with the uploaded file URL
        this.question.mediaUrl = uploadResponse.url;
        
        this.apiService.createQuestion(this.question).subscribe({
          next: (createdQuestion: any) => {
            this.uploading = false;
            // Navigate back to feed
            this.router.navigate(['/']);
          },
          error: (err: any) => {
            this.uploading = false;
            this.error = 'Failed to create question. Please try again.';
            console.error('Error creating question:', err);
          }
        });
      },
      error: (err: any) => {
        this.uploading = false;
        this.error = 'Failed to upload file. Please try again.';
        console.error('Error uploading file:', err);
      }
    });
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  handleFileSelection(file: File) {
    this.selectedFile = file;
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeFile() {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  goBack() {
    this.router.navigate(['/']);
  }
}