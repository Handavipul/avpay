import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { PaymentComponent } from './components/payment/payment.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FaceCaptureComponent } from './components/face-capture/face-capture.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { SettingsComponent } from './components/settings/settings.component';

import { AuthService } from './services/auth.service';
import { PaymentService } from './services/payment.service';
import { FaceCaptureService } from './services/face-capture.service';
import { ApiService } from './services/api.service';
import { PWAService } from './services/pwa.service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    PaymentComponent,
    DashboardComponent,
    FaceCaptureComponent,
    TransactionHistoryComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    AuthService,
    PaymentService,
    FaceCaptureService,
    ApiService,
    PWAService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

