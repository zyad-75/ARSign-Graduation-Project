import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
    name: 'translate',
    standalone: true,
    pure: false // Impure to detect signal changes automatically if needed, or we can use signals in template
})
export class TranslatePipe implements PipeTransform {
    private translationService = inject(TranslationService);

    transform(value: string): string {
        return this.translationService.translate(value);
    }
}
