import { Component, OnInit } from '@angular/core';
import { PWAService } from './services/pwa.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <!-- Install PWA Banner -->
      <div 
        *ngIf="pwaService.promptEvent" 
        class="fixed top-0 left-0 right-0 bg-blue-600 text-white p-4 z-50 shadow-lg"
      >
        <div class="flex items-center justify-between max-w-sm mx-auto">
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
            <span class="text-sm font-medium">Install App</span>
          </div>
          <div class="flex space-x-2">
            <button 
              (click)="pwaService.installPWA()"
              class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Install
            </button>
            <button 
              (click)="pwaService.dismissPrompt()"
              class="text-blue-200 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Main App Content -->
      <div [class.pt-20]="pwaService.promptEvent" class="min-h-screen">
        <router-outlet></router-outlet>
      </div>

      <!-- Bottom Navigation -->
      <nav 
        *ngIf="authService.isAuthenticated()" 
        class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb"
      >
        <div class="flex justify-around py-2">
          <a 
            routerLink="/dashboard" 
            routerLinkActive="text-blue-600" 
            class="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
            </svg>
            <span class="text-xs">Dashboard</span>
          </a>
          
          <a 
            routerLink="/payment" 
            routerLinkActive="text-blue-600" 
            class="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
            <span class="text-xs">Pay</span>
          </a>
          
          <a 
            routerLink="/history" 
            routerLinkActive="text-blue-600" 
            class="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span class="text-xs">History</span>
          </a>
          
          <a 
            routerLink="/settings" 
            routerLinkActive="text-blue-600" 
            class="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-xs">Settings</span>
          </a>
        </div>
      </nav>
    </div>
  `,
  styles: [`
    .safe-area-pb {
      padding-bottom: env(safe-area-inset-bottom);
    }
  `]
})
export class AppComponent implements OnInit {
  
  constructor(
    public pwaService: PWAService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.pwaService.initPWA();
  }
}
