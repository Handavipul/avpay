import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FaceCaptureService } from '../../services/face-capture.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: false,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-sm mx-auto px-4 py-4 flex items-center">
          <button (click)="goBack()" class="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="text-xl font-semibold text-gray-900">Face Authentication</h1>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col justify-center px-4 py-8">
        <div class="max-w-sm mx-auto w-full">

          <!-- Mode Selection -->
          <div *ngIf="!showCapture" class="space-y-6">
            <div class="text-center mb-8">
              <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome</h2>
              <p class="text-gray-600">Choose your authentication method</p>
            </div>

            <div class="space-y-4">
              <button 
                (click)="startAuthentication()"
                class="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 transition-colors active:bg-blue-800 flex items-center justify-center space-x-3"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                </svg>
                <span>Sign In</span>
              </button>

              <button 
                (click)="startRegistration()"
                class="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:bg-green-700 transition-colors active:bg-green-800 flex items-center justify-center space-x-3"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                <span>Register New Face</span>
              </button>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <h4 class="font-medium text-blue-900 mb-1">How it works</h4>
                  <p class="text-sm text-blue-700">We'll capture your face from multiple angles for secure authentication. Your biometric data is encrypted and stored securely.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Face Capture Interface -->
          <div *ngIf="showCapture" class="space-y-6">
            <app-face-capture 
              [mode]="authMode"
              (onSuccess)="handleCaptureSuccess($event)"
              (onError)="handleCaptureError($event)"
              (onCancel)="cancelCapture()"
            ></app-face-capture>
          </div>

          <!-- Loading State -->
          <div *ngIf="isProcessing" class="text-center py-8">
            <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-600 bg-blue-100">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-red-700 font-medium">{{ errorMessage }}</p>
            </div>
          </div>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-green-700 font-medium">{{ successMessage }}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class AuthComponent implements OnInit, OnDestroy {
  showCapture = false;
  authMode: 'login' | 'register' = 'login';
  isProcessing = false;
  errorMessage = '';
  successMessage = '';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private faceCaptureService: FaceCaptureService
  ) {}

  ngOnInit() {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.faceCaptureService.resetSession();
  }

  goBack() {
    if (this.showCapture) {
      this.cancelCapture();
    } else {
      this.router.navigate(['/']);
    }
  }

  startAuthentication() {
    this.authMode = 'login';
    this.showCapture = true;
    this.clearMessages();
  }

  startRegistration() {
    this.authMode = 'register';
    this.showCapture = true;
    this.clearMessages();
  }

  handleCaptureSuccess(imagesData: string[]) {
    this.isProcessing = true;
    this.clearMessages();

    if (this.authMode === 'login') {
      const authSub = this.authService.authenticateWithFace(imagesData).subscribe({
        next: (response) => {
          this.isProcessing = false;
          if (response.success) {
            this.successMessage = 'Authentication successful!';
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1500);
          } else {
            this.errorMessage = response.message || 'Authentication failed';
          }
        },
        error: (error) => {
          this.isProcessing = false;
          this.errorMessage = error || 'Authentication failed';
        }
      });
      this.subscriptions.push(authSub);
    } else {
      const regSub = this.authService.registerFace(imagesData).subscribe({
        next: (response) => {
          this.isProcessing = false;
          this.successMessage = 'Face registered successfully! You can now sign in.';
          setTimeout(() => {
            this.showCapture = false;
            this.authMode = 'login';
          }, 2000);
        },
        error: (error) => {
          this.isProcessing = false;
          this.errorMessage = error || 'Registration failed';
        }
      });
      this.subscriptions.push(regSub);
    }
  }

  handleCaptureError(error: string) {
    this.errorMessage = error;
  }

  cancelCapture() {
    this.showCapture = false;
    this.faceCaptureService.resetSession();
    this.clearMessages();
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}