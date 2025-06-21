import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-sm mx-auto px-4 py-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">SecurePay</h1>
            <p class="text-gray-600">Face Recognition Payment App</p>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col justify-center px-4 py-8">
        <div class="max-w-sm mx-auto w-full space-y-8">
          
          <!-- Features -->
          <div class="space-y-4">
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">Secure Authentication</h3>
                  <p class="text-sm text-gray-600">Advanced face recognition technology</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">Fast Payments</h3>
                  <p class="text-sm text-gray-600">Send money with just your face</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">Transaction History</h3>
                  <p class="text-sm text-gray-600">Track all your payments</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <button 
              *ngIf="!authService.isAuthenticated()"
              (click)="navigateToAuth()"
              class="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 transition-colors active:bg-blue-800"
            >
              Get Started
            </button>

            <button 
              *ngIf="authService.isAuthenticated()"
              (click)="navigateToDashboard()"
              class="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:bg-green-700 transition-colors active:bg-green-800"
            >
              Go to Dashboard
            </button>

            <div class="text-center">
              <p class="text-xs text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 py-4">
        <div class="max-w-sm mx-auto px-4 text-center">
          <p class="text-xs text-gray-500">© 2025 SecurePay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `
})
export class HomeComponent {
  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  navigateToAuth() {
    this.router.navigate(['/auth']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}