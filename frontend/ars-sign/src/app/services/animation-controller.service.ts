import { Injectable, inject, NgZone } from '@angular/core';
import * as THREE from 'three';
import { AvatarLoaderService } from './avatar-loader.service';
import { DictionaryService, SignAction } from './dictionary.service';

@Injectable({
  providedIn: 'root'
})
export class AnimationControllerService {
  private avatarLoader = inject(AvatarLoaderService);
  private dictionaryService = inject(DictionaryService);
  private zone = inject(NgZone);

  private mixer!: THREE.AnimationMixer;
  private currentAction: THREE.AnimationAction | null = null;
  public currentLabel: string = ''; // Tracks the current word/letter being signed
  public isAnimating: boolean = false; // Tracks if the avatar is currently in a sign sequence
  private isProcessing = false;

  // Callback for the component to force UI updates
  public onStateChange?: () => void;

  private notifyUI(): void {
    setTimeout(() => this.onStateChange?.(), 0);
  }

  initialize(): void {
    this.mixer = this.avatarLoader.getMixer();
    // Start with idle animation
    this.playAnimation('idle', true);
  }

  /**
   * Main entry point: Processes text and plays the corresponding sign sequence.
   */
  async playSignSequence(text: string): Promise<void> {
    if (this.isProcessing) return;
    
    try {
      this.zone.run(() => {
        this.isProcessing = true;
        this.isAnimating = true;
        this.notifyUI();
      });

      const sequence = this.dictionaryService.getTextSequence(text);
      console.log(`[AnimationController] Starting sequence for: "${text}"`, sequence);

      for (let i = 0; i < sequence.length; i++) {
        const action = sequence[i];
        
        // Update the display label — keep previous word visible during pauses
        if (action.type !== 'pause') {
          this.zone.run(() => {
            this.currentLabel = action.label;
            this.notifyUI();
          });
        }
        
        console.log(`[AnimationController] Processing action ${i + 1}/${sequence.length}:`, action);
        await this.handleSequenceAction(action);
      }
      
      this.zone.run(() => {
        this.currentLabel = '';
        this.notifyUI();
      });
    } catch (err) {
      console.error(`[AnimationController] Error during sequence playback:`, err);
    } finally {
      this.zone.run(() => {
        this.isAnimating = false;
        this.isProcessing = false;
        this.notifyUI();
      });
      // Always return to idle at the end
      await this.playAnimation('idle', true);
    }
  }

  private async handleSequenceAction(action: SignAction): Promise<void> {
    console.log(`[AnimationController] Processing action: ${action.label}`, action);

    if (action.type === 'pause') {
      await new Promise(r => setTimeout(r, 300));
      return;
    }

    // Load dynamic animation if it's a file path
    let clip: THREE.AnimationClip | null = null;
    if (action.value.endsWith('.glb')) {
      console.log(`[AnimationController] Loading external GLB: ${action.value}`);
      clip = await this.avatarLoader.loadExternalAnimation(action.value);
    } else {
      const internalClips = this.avatarLoader.getAnimations();
      console.log(`[AnimationController] Searching internal clips for: ${action.value}. Total clips: ${internalClips.length}`);
      clip = internalClips.find(c => c.name.toLowerCase() === action.value.toLowerCase()) || null;
    }

    if (clip) {
      console.log(`[AnimationController] Playing clip: ${clip.name}`);
      await this.fadeToAnimation(clip);
    } else {
      console.warn(`[AnimationController] Animation not found for: ${action.label}, holding display for 1.5s`);
      // Hold the label on screen so the user can read it even without animation
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  /**
   * Smoothly transitions from the current animation to the next one.
   */
  private fadeToAnimation(clip: THREE.AnimationClip, duration: number = 0.3): Promise<void> {
    return new Promise((resolve) => {
      const nextAction = this.mixer.clipAction(clip);
      
      // Reset and prepare the next action
      nextAction.reset();
      nextAction.setLoop(THREE.LoopOnce, 1);
      nextAction.clampWhenFinished = true;
      nextAction.enabled = true;

      if (this.currentAction) {
        // If it's the same action/clip, we need to be more aggressive to trigger a new 'finished' event
        if (this.currentAction.getClip() === clip) {
          this.currentAction.stop(); // Stop before replaying
          nextAction.play();
        } else {
          nextAction.play();
          this.currentAction.crossFadeTo(nextAction, duration, true);
        }
      } else {
        nextAction.play();
      }

      this.currentAction = nextAction;

      let resolved = false;
      const safeResolve = () => {
        if (!resolved) {
          this.zone.run(() => {
            resolved = true;
            this.mixer.removeEventListener('finished', onFinished);
            resolve();
          });
        }
      };

      // Safety timeout based on clip duration + small buffer
      const timeout = setTimeout(() => {
        console.warn(`[AnimationController] Safety timeout reached for clip: ${clip.name}`);
        safeResolve();
      }, (clip.duration * 1000) + 500);

      // Wait for it to finish normally
      const onFinished = (e: any) => {
        if (e.action === nextAction) {
          clearTimeout(timeout);
          console.log(`[AnimationController] Finished: ${clip.name}`);
          safeResolve();
        }
      };

      this.mixer.addEventListener('finished', onFinished);
    });
  }

  /**
   * Simple play helper (used for idle/loops)
   */
  private playAnimation(name: string, loop: boolean = false): void {
    const internalClips = this.avatarLoader.getAnimations();
    let clip = internalClips.find(c => c.name.toLowerCase() === name.toLowerCase());
    
    if (!clip) {
      console.warn(`[AnimationController] Clip '${name}' not found. Stopping animation.`);
      if (this.currentAction) this.currentAction.stop();
      return;
    }

    if (clip) {
      const action = this.mixer.clipAction(clip);
      action.reset();
      if (loop) action.setLoop(THREE.LoopRepeat, Infinity);
      else action.setLoop(THREE.LoopOnce, 1);
      action.play();
      this.currentAction = action;
    }
  }
}
