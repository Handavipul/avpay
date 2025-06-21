import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface User {
  id: number;
  email: string;
  created_at: string;
  last_login?: string;
}

export interface AuthResponse {
  success: boolean;
  user_id?: number;
  token?: string;
  confidence?: number;
  consistency_score?: number;
  angles_captured?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('current_user');
    
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  authenticateWithFace(imagesData: string[]): Observable<AuthResponse> {
    const request = {
      images_data: imagesData,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent
    };

    return this.apiService.post<AuthResponse>('/auth/face-multi-angle', request)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            localStorage.setItem('auth_token', response.token);
            
            // Create user object
            const user: User = {
              id: response.user_id!,
              email: 'demo@example.com', // This would come from backend in real app
              created_at: new Date().toISOString()
            };
            
            localStorage.setItem('current_user', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  registerFace(imagesData: string[]): Observable<any> {
    const request = {
      images_data: imagesData,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent
    };

    return this.apiService.post('/auth/register-face', request);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }
}

