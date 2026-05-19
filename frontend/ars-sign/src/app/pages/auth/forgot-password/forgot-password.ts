import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [RouterLink, CommonModule, FormsModule, TranslatePipe],
    templateUrl: './forgot-password.html',
})
export class ForgotPassword {
    supabase = inject(SupabaseService);
    email = '';
    verificationCode = '';
    newPassword = '';
    message = '';
    error = '';
    step: 'EMAIL' | 'CODE' = 'EMAIL';

    async onSubmit() {
        this.message = '';
        this.error = '';

        try {
            const { error } = await this.supabase.client.auth.resetPasswordForEmail(this.email);

            if (error) throw error;

            this.step = 'CODE';
            this.message = 'Verification code sent to your email! (Check console for mock OTP)';
            localStorage.setItem('mock_reset_email', this.email);
        } catch (err: any) {
            this.error = err.message;
        }
    }

    async verifyAndReset() {
        this.message = '';
        this.error = '';

        try {
            // 1. Verify OTP
            const { error: otpError } = await this.supabase.client.auth.verifyOtp({
                email: this.email,
                token: this.verificationCode,
                type: 'recovery'
            });

            if (otpError) throw otpError;

            // 2. Update Password
            const { error: updateError } = await this.supabase.client.auth.updateUser({
                password: this.newPassword
            });

            if (updateError) throw updateError;

            this.message = 'Password updated successfully! You can now login.';
            this.step = 'EMAIL'; // Reset for next time or navigate away
            this.email = '';
            this.verificationCode = '';
            this.newPassword = '';
        } catch (err: any) {
            this.error = err.message;
        }
    }
}
