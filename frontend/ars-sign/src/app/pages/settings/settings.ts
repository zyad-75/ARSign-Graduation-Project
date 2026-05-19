import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, RouterLink],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings implements OnInit {
  supabase = inject(SupabaseService);
  router = inject(Router);

  settings = {
    notifications: true,
    emailUpdates: true,
    darkMode: true,
    autoSave: true
  };

  loading = false;

  ngOnInit() {
    // Load settings from local storage if any
    const saved = localStorage.getItem('app_settings');
    if (saved) {
      this.settings = JSON.parse(saved);
    }
  }

  saveSettings() {
    this.loading = true;
    localStorage.setItem('app_settings', JSON.stringify(this.settings));
    setTimeout(() => {
      this.loading = false;
      alert('Settings saved successfully!');
    }, 1000);
  }

  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/']);
  }
}
