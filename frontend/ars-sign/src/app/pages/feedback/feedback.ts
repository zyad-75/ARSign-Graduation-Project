import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="animated-bg"><div class="blob-3"></div></div>
    <div class="min-h-screen pt-24 pb-12 relative z-10 px-4 flex items-center justify-center">
        <div class="max-w-md w-full glass-card p-8 rounded-2xl border border-white/10 shadow-2xl">
            <h2 class="text-3xl font-extrabold text-white text-center mb-6">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-yellow-400">
                    {{ 'Feedback' | translate }}
                </span>
            </h2>
            <p class="text-gray-400 text-center mb-8">
                {{ 'We value your feedback' | translate }}
            </p>

            <form (ngSubmit)="submitFeedback()">
                <div class="mb-5">
                    <label for="email" class="block mb-2 text-sm font-medium text-white">{{ 'Email Address' | translate }}</label>
                    <input type="email" id="email" [(ngModel)]="email" name="email" class="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 placeholder-gray-500" placeholder="name@example.com" required>
                </div>
                <div class="mb-5">
                    <label for="message" class="block mb-2 text-sm font-medium text-white">{{ 'Message' | translate }}</label>
                    <textarea id="message" rows="4" [(ngModel)]="message" name="message" class="block p-2.5 w-full text-sm text-white bg-gray-800 rounded-lg border border-gray-600 focus:ring-primary focus:border-primary placeholder-gray-500" placeholder="{{ 'Your feedback...' | translate }}" required></textarea>
                </div>
                <button type="submit" [disabled]="loading" class="w-full text-secondary bg-primary hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-transform hover:scale-[1.02] disabled:opacity-50">
                    {{ loading ? 'Sending...' : ('Submit Feedback' | translate) }}
                </button>
            </form>

            <div *ngIf="submitted" class="mt-4 p-4 text-sm text-green-400 rounded-lg bg-gray-800 border border-green-800 text-center animate-fade-in-up">
                {{ 'Thank you for your feedback!' | translate }}
            </div>
            <div *ngIf="error" class="mt-4 p-4 text-sm text-red-400 rounded-lg bg-gray-800 border border-red-800 text-center animate-fade-in-up">
                {{ error }}
            </div>
        </div>
    </div>
  `,
  styles: [`
    .glass-card {
        background: rgba(17, 24, 39, 0.7);
        backdrop-filter: blur(12px);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }
  `]
})
export class FeedbackComponent {
  translationService = inject(TranslationService);
  email = '';
  message = '';
  submitted = false;
  loading = false;
  error = '';

  async submitFeedback() {
    if (!this.email || !this.message) return;

    this.loading = true;
    this.submitted = false;
    this.error = '';

    // Mock delay for UI feedback
    setTimeout(() => {
      this.loading = false;
      this.submitted = true;
      this.email = '';
      this.message = '';

      setTimeout(() => {
        this.submitted = false;
      }, 3000);
    }, 1000);
  }
}
