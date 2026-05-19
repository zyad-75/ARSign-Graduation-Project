import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, TranslatePipe],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  supabase = inject(SupabaseService);
  router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  async signup(event: Event) {
    event.preventDefault();

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { data, error } = await this.supabase.signUp(this.email, this.password, {
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone
      });
      if (error) throw error;

      this.successMessage = 'Account created successfully! Redirecting to login...';

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error: any) {
      console.error('Signup error:', error);
      this.errorMessage = error.message;
    } finally {
      this.loading = false;
    }
  }
}
