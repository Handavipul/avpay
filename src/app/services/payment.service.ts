import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface PaymentRequest {
  amount: number;
  currency: string;
  recipient_account: string;
  recipient_bank: string;
  purpose: string;
}

export interface PaymentAuthRequest {
  images_data: string[];
  payment_data: PaymentRequest;
  timestamp: string;
}

export interface PaymentResponse {
  success: boolean;
  transaction_id?: string;
  status?: string;
  message?: string;
  receipt_url?: string;
  confidence_score?: number;
  angles_verified?: number;
}

export interface Transaction {
  transaction_id: string;
  status: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private apiService: ApiService) {}

  authorizePaymentWithFace(imagesData: string[], paymentData: PaymentRequest): Observable<PaymentResponse> {
    const request: PaymentAuthRequest = {
      images_data: imagesData,
      payment_data: paymentData,
      timestamp: new Date().toISOString()
    };

    return this.apiService.post<PaymentResponse>('/payment/authorize-multi-angle', request);
  }

  processPayment(paymentData: PaymentRequest): Observable<PaymentResponse> {
    return this.apiService.post<PaymentResponse>('/payment/process', paymentData);
  }

  getPaymentStatus(transactionId: string): Observable<Transaction> {
    return this.apiService.get<Transaction>(`/payment/status/${transactionId}`);
  }

  getTransactionHistory(): Observable<Transaction[]> {
    return this.apiService.get<Transaction[]>('/payment/history');
  }
}
