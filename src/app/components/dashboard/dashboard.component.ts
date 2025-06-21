import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { PaymentService, Transaction } from '../../services/payment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-sm mx-auto px-4 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold text-gray-900">Dashboard</h1>
              <p class="text-sm text-gray-600">Welcome back, {{ currentUser?.email }}</p>
            </div>
            <button 
              (click)="logout()"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Balance Card -->
      <div class="max-w-sm mx-auto px-4 py-6">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Account Balance</h2>
            <svg class="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
          </div>
          <div class="text-3xl font-bold mb-2">$2,450.50</div>
          <div class="text-blue-200 text-sm">Available Balance</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="max-w-sm mx-auto px-4 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-4">
          <button 
            (click)="navigateToPayment()"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </div>
            <div class="text-center">
              <h4 class="font-semibold text-gray-900 mb-1">Send Money</h4>
              <p class="text-xs text-gray-600">Quick payment</p>
            </div>
          </button>

          <button 
            (click)="navigateToHistory()"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="text-center">
              <h4 class="font-semibold text-gray-900 mb-1">History</h4>
              <p class="text-xs text-gray-600">View transactions</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="max-w-sm mx-auto px-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button 
            (click)="navigateToHistory()"
            class="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
          >
            View All
          </button>
        </div>
        
        <div class="space-y-3">
          <div *ngIf="loadingTransactions" class="text-center py-8">
            <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-600 bg-blue-100">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          </div>

          <div *ngIf="!loadingTransactions && recentTransactions.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p class="text-gray-600">No transactions yet</p>
            <p class="text-sm text-gray-500 mt-1">Make your first payment to get started</p>
          </div>

          <div *ngFor="let transaction of recentTransactions" 
               class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center"
                     [class.bg-green-100]="transaction.status === 'completed'"
                     [class.bg-yellow-100]="transaction.status === 'pending'"
                     [class.bg-red-100]="transaction.status === 'failed'">
                  <svg class="w-5 h-5" 
                       [class.text-green-600]="transaction.status === 'completed'"
                       [class.text-yellow-600]="transaction.status === 'pending'"
                       [class.text-red-600]="transaction.status === 'failed'"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Payment</p>
                  <p class="text-sm text-gray-600">{{ transaction.created_at | date:'MMM d, HH:mm' }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">-{{ transaction.amount }}</p>
                <p class="text-xs capitalize"
                   [class.text-green-600]="transaction.status === 'completed'"
                   [class.text-yellow-600]="transaction.status === 'pending'"
                   [class.text-red-600]="transaction.status === 'failed'">
                  {{ transaction.status }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  recentTransactions: Transaction[] = [];
  loadingTransactions = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadRecentTransactions();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadUserData() {
    const userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.subscriptions.push(userSub);
  }

  private loadRecentTransactions() {
    this.loadingTransactions = true;
    
    const transactionSub = this.paymentService.getTransactionHistory().subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions.slice(0, 3); // Show only recent 3
        this.loadingTransactions = false;
      },
      error: (error) => {
        console.error('Failed to load transactions:', error);
        this.loadingTransactions = false;
      }
    });
    this.subscriptions.push(transactionSub);
  }

  navigateToPayment() {
    this.router.navigate(['/payment']);
  }

  navigateToHistory() {
    this.router.navigate(['/history']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}