import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';

@Component({
    selector: 'app-campaigns',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    template: `
    <div class="dictionary-page min-h-screen pt-24 pb-12 relative overflow-hidden">
        <div class="animated-bg"><div class="blob-3"></div></div>
        <div class="max-w-screen-xl mx-auto px-4 relative z-10">
            <h1 class="text-4xl md:text-6xl font-black text-white text-center mb-16 animate-fade-in">
                <ng-container *ngIf="isArabic; else enHeader">
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-400">
                        {{ 'Campaigns' | translate }}
                    </span>
                    <span class="text-white ml-2">
                        {{ 'Community' | translate }}
                    </span>
                </ng-container>
                <ng-template #enHeader>
                    <span class="text-white">{{ 'Community' | translate }}</span>
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-yellow-400 ml-2">
                        {{ 'Campaigns' | translate }}
                    </span>
                </ng-template>
            </h1>
 
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
                <!-- Campaign 1 -->
                <div class="glass-card p-6 rounded-3xl border border-white/10 group hover:scale-105 transition-all duration-500">
                    <div class="h-56 rounded-2xl bg-gray-800 mb-6 overflow-hidden relative">
                        <img src="/images/s5.avif" 
                             alt="Workshop" class="w-full h-full object-cover">
                        <div class="absolute top-4 right-4 bg-primary text-secondary text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                            {{ 'Active' | translate }}
                        </div>
                    </div>
                    <h3 class="text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors">
                        {{ 'Sign Language Basics Workshop' | translate }}
                    </h3>
                    <p class="text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                        {{ 'WorkshopDescription' | translate }}
                    </p>
                    <a href="https://wfdeaf.org/" target="_blank" class="block text-center w-full py-4 rounded-2xl bg-white/5 text-white font-black group-hover:bg-primary group-hover:text-secondary transition-all border border-white/10">
                        {{ 'Learn More' | translate }}
                    </a>
                </div>
 
                <!-- Campaign 2 -->
                <div class="glass-card p-6 rounded-3xl border border-white/10 group hover:scale-105 transition-all duration-500">
                    <div class="h-56 rounded-2xl bg-gray-800 mb-6 overflow-hidden relative">
                        <img src="/images/s6.avif" 
                             alt="Deaf Awareness" class="w-full h-full object-cover">
                        <div class="absolute top-4 right-4 bg-primary text-secondary text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                            {{ 'Upcoming' | translate }}
                        </div>
                    </div>
                    <h3 class="text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors">
                        {{ 'Deaf Awareness Week' | translate }}
                    </h3>
                    <p class="text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                        {{ 'AwarenessDescription' | translate }}
                    </p>
                    <a href="https://www.un.org/en/observances/sign-languages-day" target="_blank" class="block text-center w-full py-4 rounded-2xl bg-white/5 text-white font-black group-hover:bg-primary group-hover:text-secondary transition-all border border-white/10">
                        {{ 'Join Event' | translate }}
                    </a>
                </div>

                <!-- Campaign 3 (New) -->
                <div class="glass-card p-6 rounded-3xl border border-white/10 group hover:scale-105 transition-all duration-500">
                    <div class="h-56 rounded-2xl bg-gray-800 mb-6 overflow-hidden relative">
                        <img src="/images/s7.png" 
                             alt="Inclusion" class="w-full h-full object-cover">
                        <div class="absolute top-4 right-4 bg-primary text-secondary text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                            {{ 'Active' | translate }}
                        </div>
                    </div>
                    <h3 class="text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors">
                        {{ 'Inclusive Workplace Seminar' | translate }}
                    </h3>
                    <p class="text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                        {{ 'SeminarDescription' | translate }}
                    </p>
                    <a href="https://www.nad.org/resources/sign-language-interpreting/" target="_blank" class="block text-center w-full py-4 rounded-2xl bg-white/5 text-white font-black group-hover:bg-primary group-hover:text-secondary transition-all border border-white/10">
                        {{ 'Learn More' | translate }}
                    </a>
                </div>

                <!-- Campaign 4 (New) -->
                <div class="glass-card p-6 rounded-3xl border border-white/10 group hover:scale-105 transition-all duration-500">
                    <div class="h-56 rounded-2xl bg-gray-800 mb-6 overflow-hidden relative">
                        <img src="/images/s8.png" 
                             alt="Deaf Tech" class="w-full h-full object-cover">
                        <div class="absolute top-4 right-4 bg-primary text-secondary text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                            {{ 'Upcoming' | translate }}
                        </div>
                    </div>
                    <h3 class="text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors">
                        {{ 'Sign-Tech Hackathon' | translate }}
                    </h3>
                    <p class="text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                        {{ 'HackathonDescription' | translate }}
                    </p>
                    <a href="https://github.com/topics/sign-language-recognition" target="_blank" class="block text-center w-full py-4 rounded-2xl bg-white/5 text-white font-black group-hover:bg-primary group-hover:text-secondary transition-all border border-white/10">
                        {{ 'Register Hub' | translate }}
                    </a>
                </div>
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
export class CampaignsComponent {
    translationService = inject(TranslationService);

    get isArabic() {
        return this.translationService.currentLang() === 'ar';
    }
}
