import { Component, ElementRef, ViewChild, OnDestroy, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { SupabaseService } from '../../../services/supabase.service';
import { SignToTextService } from '../../../services/sign-to-text.service';

@Component({
  selector: 'app-sign-to-text',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './sign-to-text.html',
  styleUrl: './sign-to-text.scss',
})
export class SignToText implements OnDestroy {
  supabase = inject(SupabaseService);
  signToTextService = inject(SignToTextService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  
  isStreaming = false;
  stream: MediaStream | null = null;
  translationText = '';
  wsStatus: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';
  
  private ws: WebSocket | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private intervalId: any;


  async toggleCamera() {
    if (this.isStreaming) {
      this.stopCamera();
    } else {
      await this.startCamera();
    }
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Update state and force detection
      this.zone.run(() => {
        this.isStreaming = true;
        this.cdr.detectChanges();
      });

      // Wait a tick for the video element to pick up the stream binding from the template
      setTimeout(() => {
        const video = document.getElementById('main-camera-feed') as HTMLVideoElement;
        if (video) {
          video.play().catch(e => console.error("Error playing video:", e));
        }

        // Start WebSocket for real-time translation
        this.initWebSocket();
        this.startSendingFrames();
      }, 100);
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please allow camera permissions.');
      this.zone.run(() => {
        this.isStreaming = false;
        this.cdr.detectChanges();
      });
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement && this.videoElement.nativeElement) {
      this.videoElement.nativeElement.srcObject = null;
    }
    this.isStreaming = false;
    this.closeWebSocket();
  }

  private initWebSocket() {
    this.wsStatus = 'connecting';
    this.ws = this.signToTextService.connectWS();
    
    this.ws.onopen = () => {
      console.log('✅ WebSocket Connected');
      this.zone.run(() => {
        this.wsStatus = 'connected';
        this.cdr.detectChanges();
      });
    };

    this.ws.onmessage = (event) => {
      // console.log('📩 Message from server:', event.data);
      const data = JSON.parse(event.data);
      
      if (data.error) {
        console.error('🛑 Backend Error:', data.error);
        this.zone.run(() => {
          this.wsStatus = 'error';
          this.cdr.detectChanges();
        });
        return;
      }

      if (data.letter) {
        this.zone.run(() => {
          this.translationText += data.letter;
          this.cdr.detectChanges();
        });
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket Error:', error);
      this.zone.run(() => {
        this.wsStatus = 'error';
        this.cdr.detectChanges();
      });
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket Connection Closed');
      this.zone.run(() => {
        if (this.wsStatus !== 'error') {
            this.wsStatus = 'disconnected';
        }
        this.cdr.detectChanges();
      });

      // Simple auto-reconnect logic
      if (this.isStreaming) {
        console.log('🔄 Attempting to reconnect in 2 seconds...');
        setTimeout(() => {
          if (this.isStreaming) {
            this.initWebSocket();
          }
        }, 2000);
      }
    };
  }

  private closeWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startSendingFrames() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
    }

    this.intervalId = setInterval(() => {
      if (this.isStreaming && this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.sendFrame();
      }
    }, 200); // Send every 200ms
  }

  private sendFrame() {
    if (!this.canvas) return;
    const video = document.getElementById('main-camera-feed') as HTMLVideoElement;
    if (!video) return;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match video
    if (this.canvas.width !== video.videoWidth || this.canvas.height !== video.videoHeight) {
        if(video.videoWidth === 0 || video.videoHeight === 0) return; // Wait for video to be ready
        this.canvas.width = video.videoWidth;
        this.canvas.height = video.videoHeight;
    }

    ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
    const base64Image = this.canvas.toDataURL('image/jpeg', 0.5); // 0.5 quality for better speed
    this.ws?.send(base64Image);
  }

  copyToClipboard() {
    if (!this.translationText) return;
    navigator.clipboard.writeText(this.translationText).then(() => {
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }

  clearText() {
    this.translationText = '';
  }

  async saveResult() {
    if (!this.translationText) return;
    try {
      const { data: { user } } = await this.supabase.user;
      if (user) {
        await this.supabase.saveTranslation(user.id, 'sign_to_text', 'Video Stream', this.translationText);
        alert('Translation saved to history!');
      } else {
        alert('Please login to save results.');
      }
    } catch (e) {
      console.error('Error saving translation', e);
    }
  }

  ngOnDestroy() {
    this.stopCamera();
    this.closeWebSocket();
  }
}
