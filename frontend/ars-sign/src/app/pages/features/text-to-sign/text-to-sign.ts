import { Component, ElementRef, ViewChild, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { SupabaseService } from '../../../services/supabase.service';
import { TextToSignService } from '../../../services/text-to-sign.service';
import { AvatarLoaderService } from '../../../services/avatar-loader.service';
import { AnimationControllerService } from '../../../services/animation-controller.service';

@Component({
    selector: 'app-text-to-sign',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    templateUrl: './text-to-sign.html',
    styleUrl: './text-to-sign.scss'
})
export class TextToSign implements AfterViewInit {
    supabase = inject(SupabaseService);
    textToSignService = inject(TextToSignService);
    avatarLoader = inject(AvatarLoaderService);
    animationController = inject(AnimationControllerService);
    private cdr = inject(ChangeDetectorRef);

    @ViewChild('avatarCanvas') avatarCanvas!: ElementRef<HTMLCanvasElement>;

    inputText = '';
    isProcessing = false;
    avatarLoaded = false;
    avatarError = false;

    public get currentWord(): string {
        return this.animationController.currentLabel;
    }

    ngAfterViewInit() {
        // Force UI update whenever animation state changes
        this.animationController.onStateChange = () => {
            this.cdr.detectChanges();
        };
        this.initAvatar();
    }

    private async initAvatar() {
        try {
            this.avatarLoader.initScene(this.avatarCanvas.nativeElement);
            await this.avatarLoader.loadModel('assets/avatar.glb');
            this.animationController.initialize();
            this.avatarLoaded = true;
        } catch (error) {
            console.error("Failed to initialize Avatar:", error);
            this.avatarError = true;
        }
    }

    convertText() {
        if (!this.inputText.trim()) {
            console.warn('[TextToSign] Empty input text');
            return;
        }
        
        if (!this.avatarLoaded) {
            console.warn('[TextToSign] Avatar not loaded yet');
            alert('Wait for avatar to load');
            return;
        }

        console.log(`[TextToSign] Processing text: "${this.inputText}"`);
        this.isProcessing = true;
        this.avatarError = false;

        // Use the new modular animation controller to play the sequence
        this.animationController.playSignSequence(this.inputText)
            .then(() => {
                console.log('[TextToSign] Sequence finished playing');
                this.saveToHistory();
            })
            .catch(err => {
                console.error('[TextToSign] Error playing sequence:', err);
                alert('Sign sequence interrupted or failed to play.');
            })
            .finally(() => {
                this.isProcessing = false;
            });
    }

    async saveToHistory() {
        try {
            const { data: { user } } = await this.supabase.user;
            if (user) {
                await this.supabase.saveTranslation(user.id, 'text_to_sign', this.inputText, '3D Avatar');
            }
        } catch (e) {
            console.error('Error saving translation history', e);
        }
    }
}
