import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  supabase = inject(SupabaseService);
  router = inject(Router);
  isEditing = false;
  loading = false;

  user: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    canHear: true,
    canSpeak: true,
    languagePreference: 'Arabic',
    location: '',
    joinedAt: null,
    stats: {
      completedLessons: 0,
      totalLessons: 0,
      quizScore: 0,
      streak: 0
    }
  };

  translationHistory: any[] = [];
  userLicenses: any[] = [];

  async ngOnInit() {
    this.loading = true;
    console.log('[Profile] Starting ngOnInit...');
    try {
      const { data: sessionData } = await this.supabase.client.auth.getSession();
      const sessionUser = sessionData?.session?.user;

      if (sessionUser) {
        // Robust data binding
        const u = sessionUser as any;
        const meta = u.user_metadata || {};

        this.user = { 
          ...this.user,
          email: u.email || this.user.email,
          firstName: meta.firstName || u.firstName || this.user.firstName,
          lastName: meta.lastName || u.lastName || this.user.lastName,
          phone: meta.phone || u.phone || this.user.phone,
          location: meta.location || u.location || this.user.location,
          canHear: meta.canHear !== undefined ? meta.canHear : this.user.canHear,
          canSpeak: meta.canSpeak !== undefined ? meta.canSpeak : this.user.canSpeak,
          languagePreference: meta.languagePreference || u.languagePreference || 'Arabic'
        };

        if (u.joinedAt) this.user.joinedAt = new Date(u.joinedAt);

        // Fetch from profile table
        const { data: profiles } = await this.supabase.client.from('profiles').select().eq('id', u.id);
        const p = profiles && profiles.length > 0 ? profiles[0] : null;
        
        if (p) {
          console.log('[Profile] Found profile in table:', p);
          this.user = {
            ...this.user,
            firstName: p.firstName || this.user.firstName,
            lastName: p.lastName || this.user.lastName,
            phone: p.phone || this.user.phone,
            location: p.location || this.user.location,
            canHear: p.canHear !== undefined ? p.canHear : this.user.canHear,
            canSpeak: p.canSpeak !== undefined ? p.canSpeak : this.user.canSpeak,
            languagePreference: p.languagePreference || this.user.languagePreference
          };
        }
        
        console.log('[Profile] Final User Object before display:', this.user);

        // Stats & History
        const { data: progress } = await this.supabase.getUserProgress(u.id);
        if (progress) this.user.stats.completedLessons = progress.length;

        const { data: allLessons } = await this.supabase.getLessons();
        if (allLessons) this.user.stats.totalLessons = allLessons.length;

        const { data: history } = await this.supabase.getTranslationHistory(u.id);
        if (history) this.translationHistory = history;

        const { data: licenses } = await this.supabase.getUserLicenses(u.id);
        if (licenses) this.userLicenses = licenses;

      } else {
        console.warn('[Profile] No active session.');
        this.router.navigate(['/login']);
      }

      this.supabase.client.auth.onAuthStateChange((event: string, session: any) => {
        if (event === 'USER_UPDATED' && session?.user) {
          this.user = { ...this.user, ...session.user };
        }
      });

    } catch (e) {
      console.error('Profile fetch error', e);
    } finally {
      this.loading = false;
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  async saveProfile() {
    this.loading = true;
    try {
      const { data: { user } } = await this.supabase.user;
      if (user) {
        const profileData = {
          id: user.id,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          phone: this.user.phone,
          canHear: this.user.canHear,
          canSpeak: this.user.canSpeak,
          languagePreference: this.user.languagePreference,
          location: this.user.location
        };

        await this.supabase.client.from('profiles').upsert(profileData, { onConflict: 'id' });

        this.isEditing = false;
        alert('Profile saved!');
      }
    } catch (e) {
      console.error('Save error', e);
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/']);
  }

  resetData() {
    if (confirm('This will clear ALL your saved data and log you out. Proceed?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  }
}
