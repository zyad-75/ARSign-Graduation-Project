import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './dictionary.html',
  styleUrl: './dictionary.scss'
})
export class Dictionary {
  categories = [
    { name: 'Basics', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Family', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Healthcare', icon: 'M19 14l-7 7m0 0l-7-7m7 7V3' },
    { name: 'Emotions', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Emergency', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
  ];

  selectedCategory = 'Basics';
  activeTerm: string | null = null;

  sanitizer = inject(DomSanitizer);

  signs = [
    { term: 'مرحباً', translation: 'Hello', category: 'Basics', videoUrl: 'https://www.youtube.com/embed/tPezNwpdDEY?start=51&end=53' },
    { term: 'شكراً', translation: 'Thank You', category: 'Basics', videoUrl: 'https://www.youtube.com/embed/tPezNwpdDEY?start=49&end=51' },
    { term: 'أنا أحبك', translation: 'I Love You', category: 'Basics', videoUrl: 'https://www.youtube.com/embed/tPezNwpdDEY?start=21&end=23' },
    { term: 'نعم', translation: 'Yes', category: 'Basics', videoUrl: 'https://www.youtube.com/embed/n-JGG0PKF0Q?start=0&end=3' },
    { term: 'لا', translation: 'No', category: 'Basics', videoUrl: 'https://www.youtube.com/embed/n-JGG0PKF0Q?start=4&end=6' },
    { term: 'سلام', translation: 'Peace', category: 'Basics', videoUrl: 'https://www.youtube.com/embed/pqdwP578Yto?start=45&end=47' },
    { term: 'كيف حالك؟', translation: 'How are you?', category: 'Basics', videoUrl: 'https://www.youtube.com/embed/pqdwP578Yto?start=80&end=84' },
    { term: 'العائلة', translation: 'Family', category: 'Family', videoUrl: 'https://www.youtube.com/embed/tPezNwpdDEY?start=88&end=90' },
    { term: 'أب', translation: 'Father', category: 'Family', videoUrl: 'https://www.youtube.com/embed/tPezNwpdDEY?start=80&end=82' },
    { term: 'أم', translation: 'Mother', category: 'Family', videoUrl: 'https://www.youtube.com/embed/tPezNwpdDEY?start=82&end=84' },
    { term: 'أخ', translation: 'Brother', category: 'Family', videoUrl: 'https://www.youtube.com/embed/tPezNwpdDEY?start=77&end=79' },
    { term: 'أخت', translation: 'Sister', category: 'Family', videoUrl: 'https://www.youtube.com/embed/tPezNwpdDEY?start=75&end=77' },
    { term: 'طبيب', translation: 'Doctor', category: 'Healthcare', videoUrl: 'https://www.youtube.com/embed/bFJxp3zvN0E?start=56&end=59' },
    { term: 'مستشفى', translation: 'Hospital', category: 'Healthcare', videoUrl: 'https://www.youtube.com/embed/fm5EGSKmUfQ?start=44&end=46' },
    { term: 'صيدلية', translation: 'Pharmacy', category: 'Healthcare', videoUrl: 'https://www.youtube.com/embed/Vv70n-JFo3A' },
    { term: 'سعيد', translation: 'Happy', category: 'Emotions', videoUrl: 'https://www.youtube.com/embed/pqdwP578Yto?start=167&end=172' },
    { term: 'حزين', translation: 'Sad', category: 'Emotions', videoUrl: 'https://www.youtube.com/embed/pngr7NcWyOw?start=99&end=102' },
    { term: 'غاضب', translation: 'Angry', category: 'Emotions', videoUrl: 'https://www.youtube.com/embed/tPezNwpdDEY?start=123&end=125' },
    { term: 'خائف', translation: 'Scared', category: 'Emotions', videoUrl: 'https://www.youtube.com/embed/pngr7NcWyOw?start=69&end=71' },
    { term: 'إسعاف', translation: 'Ambulance', category: 'Emergency', videoUrl: 'https://www.youtube.com/embed/fm5EGSKmUfQ?start=27&end=29' },
    { term: 'ألم', translation: 'Pain', category: 'Emergency', videoUrl: 'https://www.youtube.com/embed/pngr7NcWyOw?start=51&end=53' },
    { term: 'شرطة', translation: 'Police', category: 'Emergency', videoUrl: 'https://www.youtube.com/embed/fm5EGSKmUfQ?start=30&end=32' },
    { term: 'مساعدة', translation: 'Help', category: 'Emergency', videoUrl: 'https://www.youtube.com/embed/fm5EGSKmUfQ?start=21&end=23' },
    { term: 'خطر', translation: 'Danger', category: 'Emergency', videoUrl: 'https://www.youtube.com/embed/fm5EGSKmUfQ?start=24&end=26' }
  ];

  get filteredSigns() {
    return this.signs.filter(s => s.category === this.selectedCategory);
  }

  translationService = inject(TranslationService);

  get isArabic() {
    return this.translationService.currentLang() === 'ar';
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
  }


  getThumbnailUrl(url: string): string {
    if (url === '#') return '';
    const videoId = url.split('/embed/')[1]?.split('?')[0];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  playVideo(term: string) {
    this.activeTerm = term;
  }

  getSafeUrl(url: string, play: boolean = false): SafeResourceUrl | null {
    if (url === '#') return null;
    let finalUrl = url;
    if (play) {
      const separator = finalUrl.includes('?') ? '&' : '?';
      finalUrl += `${separator}autoplay=1&mute=1`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }
}
