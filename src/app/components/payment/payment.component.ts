import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService, PaymentRequest } from '../../services/payment.service';
import { FaceCaptureService } from '../../services/face-capture.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment',
  standalone: false,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-sm mx-auto px-4 py-4 flex items-center">
          <button (click)="goBack()" class="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="text-xl font-semibold text-gray-900">Send Payment</h1>
        </div>
      </header>

      <div class="max-w-sm mx-auto px-4 py-6">
        
        <!-- Payment Form -->
        <div *ngIf="currentStep === 'form'" class="space-y-6">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <form [formGroup]="paymentForm" class="space-y-4">
              
              <!-- Amount -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 text-lg">$</span>
                  </div>
                  <input 
                    type="number" 
                    formControlName="amount"
                    class="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                  >
                </div>
                <div *ngIf="paymentForm.get('amount')?.invalid && paymentForm.get('amount')?.touched" 
                     class="mt-1 text-sm text-red-600">
                  Please enter a valid amount
                </div>
              </div>

              <!-- Recipient Account -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Recipient Account</label>
                <input 
                  type="text" 
                  formControlName="recipient_account"
                  class="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter account number"
                >
                <div *ngIf="paymentForm.get('recipient_account')?.invalid && paymentForm.get('recipient_account')?.touched" 
                     class="mt-1 text-sm text-red-600">
                  Please enter recipient account
                </div>
              </div>

              <!-- Recipient Bank -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Recipient Bank</label>
                <select 
                  formControlName="recipient_bank"
                  class="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Bank</option>
                  <option value="chase">Chase Bank</option>
                  <option value="bofa">Bank of America</option>
                  <option value="wells_fargo">Wells Fargo</option>
                  <option value="citi">Citibank</option>
                  <option value="other">Other</option>
                </select>
                <div *ngIf="paymentForm.get('recipient_bank')?.invalid && paymentForm.get('recipient_bank')?.touched" 
                     class="mt-1 text-sm text-red-600">
                  Please select recipient bank
                </div>
              </div>

              <!-- Purpose -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Purpose (Optional)</label>
                <input 
                  type="text" 
                  formControlName="purpose"
                  class="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Rent payment, Gift, etc."
                >
              </div>
            </form>
          </div>

          <!-- Payment Summary -->
          <div *ngIf="paymentForm.get('amount')?.value" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 class="font-semibold text-blue-900 mb-2">Payment Summary</h3>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-blue-700">Amount:</span>
                <span class="font-medium text-blue-900">{{ paymentForm.get('amount')?.value | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">Fee:</span>
                <span class="font-medium text-blue-900">$0.00</span>
              </div>
              <div class="border-t border-blue-200 pt-1 mt-2">
                <div class="flex justify-between">
                  <span class="font-semibold text-blue-900">Total:</span>
                  <span class="font-bold text-blue-900">{{ '$' + (paymentForm.get('amount')?.value | number:'1.2-2') }}</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            (click)="proceedToVerification()"
            [disabled]="!paymentForm.valid"
            class="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Verification
          </button>
        </div>

        <!-- Face Verification -->
        <div *ngIf="currentStep === 'verification'" class="space-y-6">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900 mb-2">Verify Payment</h2>
              <p class="text-gray-600">Please verify your identity to authorize this payment</p>
            </div>

            <!-- Payment Details Review -->
            <div class="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 class="font-semibold text-gray-900 mb-3">Payment Details</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Amount:</span>
                  <span class="font-medium text-gray-900">{{ paymentData.amount | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">To Account:</span>
                  <span class="font-medium text-gray-900">{{ paymentData.recipient_account }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Bank:</span>
                  <span class="font-medium text-gray-900 capitalize">{{ paymentData.recipient_bank.replace('_', ' ') }}</span>
                </div>
                <div *ngIf="paymentData.purpose" class="flex justify-between">
                  <span class="text-gray-600">Purpose:</span>
                  <span class="font-medium text-gray-900">{{ paymentData.purpose }}</span>
                </div>
              </div>
            </div>

            <app-face-capture 
              mode="login"
              (onSuccess)="handleVerificationSuccess($event)"
              (onError)="handleVerificationError($event)"
              (onCancel)="cancelVerification()"
            ></app-face-capture>
          </div>
        </div>

        <!-- Processing -->
        <div *ngIf="currentStep === 'processing'" class="text-center py-12">
          <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="animate-spin w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Processing Payment</h2>
          <p class="text-gray-600">Please wait while we process your transaction...</p>
        </div>

        <!-- Success -->
        <div *ngIf="currentStep === 'success'" class="text-center py-12">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p class="text-gray-600 mb-6">Your payment has been processed successfully</p>
          
          <div *ngIf="transactionId" class="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 class="font-semibold text-gray-900 mb-2">Transaction Details</h3>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Transaction ID:</span>
                <span class="font-mono text-gray-900">{{ transactionId }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Amount:</span>
                <span class="font-medium text-gray-900">{{ paymentData.amount | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span class="font-medium text-green-600">Completed</span>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <button 
              (click)="goToDashboard()"
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button 
              (click)="makeAnotherPayment()"
              class="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Make Another Payment
            </button>
          </div>
        </div>

        <!-- Error Messages -->
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-red-700 font-medium">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PaymentComponent implements OnInit, OnDestroy {
  paymentForm!: FormGroup;
  currentStep: 'form' | 'verification' | 'processing' | 'success' = 'form';
  paymentData: PaymentRequest = {} as PaymentRequest;
  transactionId: string = '';
  errorMessage: string = '';
  
  
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private paymentService: PaymentService,
    private faceCaptureService: FaceCaptureService
  ) {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      recipient_account: ['', [Validators.required, Validators.minLength(5)]],
      recipient_bank: ['', Validators.required],
      purpose: ['']
    });
  }

  ngOnInit() {
    this.clearErrorMessage();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.faceCaptureService.resetSession();
  }

  goBack() {
    if (this.currentStep === 'verification') {
      this.currentStep = 'form';
      this.clearErrorMessage();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  proceedToVerification() {
    if (this.paymentForm.valid) {
      this.paymentData = {
        amount: this.paymentForm.value.amount,
        currency: 'USD',
        recipient_account: this.paymentForm.value.recipient_account,
        recipient_bank: this.paymentForm.value.recipient_bank,
        purpose: this.paymentForm.value.purpose || ''
      };
      this.currentStep = 'verification';
      this.clearErrorMessage();
    } else {
      this.markFormGroupTouched();
    }
  }

  handleVerificationSuccess(verificationData: any) {
    this.clearErrorMessage();
    this.currentStep = 'processing';
    this.processPayment(verificationData);
  }

  handleVerificationError(error: any) {
    this.errorMessage = error.message || 'Face verification failed. Please try again.';
  }

  cancelVerification() {
    this.currentStep = 'form';
    this.clearErrorMessage();
  }

  private processPayment(verificationData: any) {
    const paymentRequest = {
      ...this.paymentData,
      verification_data: verificationData
    };

    const subscription = this.paymentService.processPayment(paymentRequest)
      .subscribe({
        next: (response) => {
          this.transactionId = response.transaction_id ?? '';
          this.currentStep = 'success';
          this.clearErrorMessage();
        },
        error: (error) => {
          this.currentStep = 'verification';
          this.errorMessage = error.error?.message || 'Payment processing failed. Please try again.';
        }
      });

    this.subscriptions.push(subscription);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  makeAnotherPayment() {
    this.resetComponent();
  }

  private resetComponent() {
    this.paymentForm.reset();
    this.currentStep = 'form';
    this.paymentData = {} as PaymentRequest;
    this.transactionId = '';
    this.clearErrorMessage();
    this.faceCaptureService.resetSession();
  }

  private markFormGroupTouched() {
    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.markAsTouched();
    });
  }

  private clearErrorMessage() {
    this.errorMessage = '';
  }
}