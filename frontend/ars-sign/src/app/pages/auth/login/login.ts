import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  supabase = inject(SupabaseService);
  router = inject(Router);

  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  async login(event: Event) {
    event.preventDefault();
    this.loading = true;
    this.errorMessage = '';

    try {
      const { data, error } = await this.supabase.signIn(this.email, this.password);
      if (error) throw error;

      this.router.navigate(['/profile']);
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.loading = false;
    }
  }
}
