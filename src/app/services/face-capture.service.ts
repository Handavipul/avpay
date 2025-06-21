import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

export interface CaptureSession {
  id: string;
  requiredAngles: string[];
  capturedImages: { [angle: string]: string };
  currentAngle: string;
  isComplete: boolean;
  quality: number;
}

@Injectable({
  providedIn: 'root'
})
export class FaceCaptureService {
  private captureSessionSubject = new BehaviorSubject<CaptureSession | null>(null);
  public captureSession$ = this.captureSessionSubject.asObservable();

  private readonly requiredAngles = ['front', 'left', 'right'];
  private stream: MediaStream | null = null;

  constructor() {}

  async startCaptureSession(): Promise<string> {
    const sessionId = this.generateSessionId();
    const session: CaptureSession = {
      id: sessionId,
      requiredAngles: [...this.requiredAngles],
      capturedImages: {},
      currentAngle: this.requiredAngles[0],
      isComplete: false,
      quality: 0
    };

    this.captureSessionSubject.next(session);
    return sessionId;
  }

  async initializeCamera(): Promise<MediaStream> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      return this.stream;
    } catch (error) {
      throw new Error('Unable to access camera');
    }
  }

  captureImage(videoElement: HTMLVideoElement, angle: string): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    ctx.drawImage(videoElement, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Update session
    const currentSession = this.captureSessionSubject.value;
    if (currentSession) {
      currentSession.capturedImages[angle] = imageData;
      
      // Move to next angle
      const currentIndex = currentSession.requiredAngles.indexOf(angle);
      if (currentIndex < currentSession.requiredAngles.length - 1) {
        currentSession.currentAngle = currentSession.requiredAngles[currentIndex + 1];
      } else {
        currentSession.isComplete = true;
      }
      
      this.captureSessionSubject.next({ ...currentSession });
    }
    
    return imageData;
  }

  getCapturedImages(): string[] {
    const session = this.captureSessionSubject.value;
    if (!session) return [];
    
    return this.requiredAngles.map(angle => session.capturedImages[angle]).filter(Boolean);
  }

  resetSession(): void {
    this.captureSessionSubject.next(null);
    this.stopCamera();
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Quality assessment methods
  assessImageQuality(imageData: string): Promise<number> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const quality = this.calculateSharpness(imageData) * 0.6 + this.calculateBrightness(imageData) * 0.4;
        resolve(Math.min(quality, 1.0));
      };
      img.src = imageData;
    });
  }

  private calculateSharpness(imageData: ImageData): number {
    const data = imageData.data;
    let sum = 0;
    let count = 0;
    
    for (let i = 4; i < data.length - 4; i += 4) {
      const current = data[i]; // Red channel
      const next = data[i + 4];
      sum += Math.abs(current - next);
      count++;
    }
    
    return Math.min(sum / count / 255, 1.0);
  }

  private calculateBrightness(imageData: ImageData): number {
    const data = imageData.data;
    let sum = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      sum += brightness;
    }
    
    const avgBrightness = sum / (data.length / 4) / 255;
    return 1.0 - Math.abs(avgBrightness - 0.5) * 2; // Prefer moderate brightness
  }
}