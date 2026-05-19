import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/auth/login/login';
import { Signup } from './pages/auth/signup/signup';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';
import { FeaturesHub } from './pages/features-hub/features-hub';
import { SignToText } from './pages/features/sign-to-text/sign-to-text';
import { TextToSign } from './pages/features/text-to-sign/text-to-sign';
import { Lessons } from './pages/features/lessons/lessons';
import { Dictionary } from './pages/features/dictionary/dictionary';
import { Profile } from './pages/profile/profile';
import { AboutUs } from './pages/about-us/about-us';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'forgot-password', component: ForgotPassword },
    { path: 'campaigns', loadComponent: () => import('./pages/campaigns/campaigns').then(m => m.CampaignsComponent) },
    { path: 'feedback', loadComponent: () => import('./pages/feedback/feedback').then(m => m.FeedbackComponent) },
    { path: 'features', component: FeaturesHub },
    { path: 'sign-to-text', component: SignToText },
    { path: 'text-to-sign', component: TextToSign },
    { path: 'lessons', component: Lessons },
    { path: 'dictionary', component: Dictionary },
    { path: 'profile', component: Profile },
    { path: 'about-us', component: AboutUs },
    { path: '**', redirectTo: '' }
];
