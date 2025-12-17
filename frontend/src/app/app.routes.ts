import { Routes } from '@angular/router';
import { FeedComponent } from './components/feed/feed.component';
import { UploadComponent } from './components/upload/upload.component';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard, AdminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: FeedComponent, canActivate: [AuthGuard] },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  { path: 'question/:id', component: QuestionDetailComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];