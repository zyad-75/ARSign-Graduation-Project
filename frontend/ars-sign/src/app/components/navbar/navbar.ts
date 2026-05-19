import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  supabase = inject(SupabaseService);
  router = inject(Router);
  translationService = inject(TranslationService);

  isMobileMenuOpen = false;
  isLoggedIn = false;
  user: any = null;
  showBackArrow = false;
  isProfileDropdownOpen = false;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkBackArrow(event.url);
    });
  }

  async ngOnInit() {
    try {
      // Check initial Auth State
      const { data, error } = await this.supabase.client.auth.getSession();
      if (error) {
        console.warn('Auth session check failed:', error.message);
        this.isLoggedIn = false;
        this.user = null;
      } else {
        this.isLoggedIn = !!data.session;
        this.user = data.session?.user || null;
      }

      // Listen for auth changes
      this.supabase.client.auth.onAuthStateChange((_event, session) => {
        this.isLoggedIn = !!session;
        this.user = session?.user || null;
      });
    } catch (err) {
      console.warn('Auth service unavailable:', err);
      this.isLoggedIn = false;
    }

    // Check initial URL
    this.checkBackArrow(this.router.url);
  }

  checkBackArrow(url: string) {
    // Show back button if URL contains 'features/' or is 'lessons', 'sign-to-text', 'text-to-sign'
    // Adjust logic as per actual routes
    const featureRoutes = ['/sign-to-text', '/text-to-sign', '/lessons', '/campaigns', '/feedback'];
    this.showBackArrow = featureRoutes.some(route => url === route);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  toggleLanguage() {
    this.translationService.toggleLang();
  }

  async logout() {
    await this.supabase.signOut();
    this.isLoggedIn = false;
    this.isProfileDropdownOpen = false;
    this.router.navigate(['/']);
  }
}
