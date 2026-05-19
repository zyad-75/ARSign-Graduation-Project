import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    // TODO: Replace with environment variables
    private SUPABASE_URL = 'https://lapiisonndxockzpwvia.supabase.co';
    private SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcGlpc29ubmR4b2NrenB3dmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0ODgyMzcsImV4cCI6MjA4ODA2NDIzN30.LkC3kLaWJ9VPJssy2lSW1nHtA0Pu8qgiqoAfceoRvMU';

    constructor() {
        console.warn('[SupabaseService] Initializing Robust Mock Client (LocalStorage Mode)');
        this.supabase = new MockSupabaseClient() as any;

        // AUTO-REPAIR: If session exists but name is missing, try to restore from users list
        try {
            const sessionStr = localStorage.getItem('mock_session');
            if (sessionStr) {
                const session = JSON.parse(sessionStr);
                if (session?.user) {
                    const profiles = JSON.parse(localStorage.getItem('mock_db_profiles') || '[]');
                    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
                    
                    const profileFound = profiles.find((p: any) => p.email === session.user.email || p.id === session.user.id);
                    const userFound = users.find((u: any) => u.email === session.user.email);
                    
                    if (profileFound || userFound) {
                        session.user = { 
                            ...session.user, 
                            ...userFound,
                            ...profileFound,
                            firstName: profileFound?.firstName || userFound?.firstName || session.user.firstName,
                            lastName: profileFound?.lastName || userFound?.lastName || session.user.lastName,
                            phone: profileFound?.phone || userFound?.phone || session.user.phone
                        };
                        localStorage.setItem('mock_session', JSON.stringify(session));
                        console.log('[MockDB] Repaired session data from profiles/users successfully.');
                    }
                }
            }
        } catch (e) {
            console.warn('[MockDB] Auto-repair failed (harmless):', e);
        }
    }

    get client() {
        return this.supabase;
    }

    // Auth wrappers
    async signUp(email: string, password: string, metadata: any = {}) {
        return this.supabase.auth.signUp({ email, password, options: { data: metadata } } as any);
    }

    async signIn(email: string, password: string) {
        return this.supabase.auth.signInWithPassword({ email, password });
    }

    async signOut() {
        return this.supabase.auth.signOut();
    }

    get user() {
        return this.supabase.auth.getUser();
    }

    // Lessons & Quizzes
    async getLessons() {
        return this.supabase.from('lessons').select('*').order('order_index');
    }

    async getQuizzes(lessonId: number) {
        return this.supabase.from('quizzes').select('*').eq('lesson_id', lessonId);
    }

    async getUserProgress(userId: string) {
        return this.supabase.from('user_progress').select('*').eq('user_id', userId);
    }

    async completeLesson(userId: string, lessonId: number) {
        return this.supabase.from('user_progress').upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' });
    }

    // Storage
    async uploadFile(bucket: string, path: string, file: any) {
        return this.supabase.storage.from(bucket).upload(path, file);
    }

    async getFileUrl(bucket: string, path: string) {
        return this.supabase.storage.from(bucket).getPublicUrl(path);
    }

    // Translation History
    async saveTranslation(userId: string, type: 'sign_to_text' | 'text_to_sign', input: string, output: string) {
        return this.supabase.from('translations').insert({
            user_id: userId,
            input_type: type,
            input_data: input,
            output_data: output,
            created_at: new Date().toISOString()
        });
    }

    async getTranslationHistory(userId: string) {
        return this.supabase.from('translations').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    }

    // Licenses
    async getLicenses() {
        return this.supabase.from('licenses').select('*');
    }

    async getUserLicenses(userId: string) {
        return this.supabase.from('user_licenses').select('*, licenses(*)').eq('user_id', userId);
    }
}

// Mock Implementation
class MockSupabaseClient {
    auth = {
        signUp: async ({ email, password, options }: any) => {
            const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
            if (users.find((u: any) => u.email === email)) {
                return { data: null, error: { message: 'User already exists' } };
            }
            const metadata = options?.data || {};
            const newUser = {
                id: Date.now().toString(),
                email,
                joinedAt: new Date().toISOString(),
                firstName: metadata.firstName || '',
                lastName: metadata.lastName || '',
                phone: metadata.phone || '',
                user_metadata: { ...metadata }
            };

            // Password is NOT in metadata but in the user object for mock auth
            const authUser = { ...newUser, password };
            users.push(authUser);
            localStorage.setItem('mock_users', JSON.stringify(users));

            // Also initialize profile in 'profiles' table for persistence
            const profiles = JSON.parse(localStorage.getItem('mock_db_profiles') || '[]');
            profiles.push(newUser);
            localStorage.setItem('mock_db_profiles', JSON.stringify(profiles));

            return { data: { user: newUser, session: null }, error: null };
        },
        signInWithPassword: async ({ email, password }: any) => {
            const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
            const user = users.find((u: any) => u.email === email && u.password === password);
            if (!user) {
                return { data: { session: null }, error: { message: 'Invalid credentials' } };
            }

            // Re-fetch profile data to ensure session has latest details
            const profiles = JSON.parse(localStorage.getItem('mock_db_profiles') || '[]');
            const profile = profiles.find((p: any) => p.email === email || p.id === user.id) || {};

            // Merge auth user with profile data - ensuring profile overrides old auth metadata
            const fullUser = {
                ...user,
                ...profile,
                firstName: profile.firstName || user.firstName || user.user_metadata?.firstName,
                lastName: profile.lastName || user.lastName || user.user_metadata?.lastName,
                phone: profile.phone || user.phone || user.user_metadata?.phone,
                location: profile.location || user.location,
                canHear: profile.canHear !== undefined ? profile.canHear : (user.canHear !== undefined ? user.canHear : true),
                canSpeak: profile.canSpeak !== undefined ? profile.canSpeak : (user.canSpeak !== undefined ? user.canSpeak : true),
                languagePreference: profile.languagePreference || user.languagePreference || 'Arabic',
                user_metadata: {
                    ...user.user_metadata,
                    ...profile,
                    firstName: profile.firstName || user.user_metadata?.firstName || user.firstName,
                    lastName: profile.lastName || user.user_metadata?.lastName || user.lastName,
                    phone: profile.phone || user.user_metadata?.phone || user.phone,
                    canHear: profile.canHear !== undefined ? profile.canHear : (user.user_metadata?.canHear !== undefined ? user.user_metadata.canHear : true),
                    canSpeak: profile.canSpeak !== undefined ? profile.canSpeak : (user.user_metadata?.canSpeak !== undefined ? user.user_metadata.canSpeak : true),
                }
            };

            const session = { access_token: 'mock-token-' + Date.now().toString(), user: fullUser };
            localStorage.setItem('mock_session', JSON.stringify(session));
            this.notifyAuthChange('SIGNED_IN', session);
            return { data: { session, user: fullUser }, error: null };
        },
        signOut: async () => {
            localStorage.removeItem('mock_session');
            this.notifyAuthChange('SIGNED_OUT', null);
            return { error: null };
        },
        getUser: async () => {
            const session = JSON.parse(localStorage.getItem('mock_session') || 'null');
            const user = session?.user || null;
            if (user && !user.firstName && user.user_metadata?.firstName) {
                user.firstName = user.user_metadata.firstName;
                user.lastName = user.user_metadata.lastName;
                user.phone = user.user_metadata.phone;
            }
            return { data: { user }, error: null };
        },
        getSession: async () => {
            const session = JSON.parse(localStorage.getItem('mock_session') || 'null');
            if (session?.user && !session.user.firstName && session.user.user_metadata?.firstName) {
                session.user.firstName = session.user.user_metadata.firstName;
                session.user.lastName = session.user.user_metadata.lastName;
                session.user.phone = session.user.user_metadata.phone;
            }
            return { data: { session }, error: null };
        },
        onAuthStateChange: (callback: any) => {
            this.authCallback = callback;
            const session = JSON.parse(localStorage.getItem('mock_session') || 'null');
            // Trigger immediately
            callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
            return { data: { subscription: { unsubscribe: () => { } } } };
        },
        resetPasswordForEmail: async (email: string) => {
            const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
            const user = users.find((u: any) => u.email === email);
            if (!user) {
                return { error: { message: 'User not found' } };
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            localStorage.setItem(`mock_otp_${email}`, otp);
            console.log(`[MOCK] Password reset OTP for ${email}: ${otp}`);
            return { data: {}, error: null };
        },
        verifyOtp: async ({ email, token, type }: any) => {
            const savedOtp = localStorage.getItem(`mock_otp_${email}`);
            if (token === savedOtp) {
                return { data: { session: { access_token: 'reset-token-' + Date.now() } }, error: null };
            }
            return { error: { message: 'Invalid or expired OTP' } };
        },
        updateUser: async ({ password }: any) => {
            const session = JSON.parse(localStorage.getItem('mock_session') || 'null');
            // For mock reset flow, we might need a way to know WHICH user is being updated if no active session
            // In real Supabase, resetOtp creates a temporary session.
            // Let's assume for mock that we store the email in a temporary 'mock_reset_email'
            const resetEmail = localStorage.getItem('mock_reset_email');
            let users = JSON.parse(localStorage.getItem('mock_users') || '[]');

            const emailToUpdate = session?.user?.email || resetEmail;
            if (!emailToUpdate) return { error: { message: 'No active session or reset context' } };

            users = users.map((u: any) => u.email === emailToUpdate ? { ...u, password } : u);
            localStorage.setItem('mock_users', JSON.stringify(users));
            localStorage.removeItem('mock_reset_email');
            localStorage.removeItem(`mock_otp_${emailToUpdate}`);

            return { data: { user: users.find((u: any) => u.email === emailToUpdate) }, error: null };
        }
    };

    storage = {
        from: (bucket: string) => ({
            upload: async (path: string, file: any) => {
                console.log(`Mock Upload to ${bucket}/${path}`, file);
                return { data: { path }, error: null };
            },
            getPublicUrl: (path: string) => ({
                data: { publicUrl: `https://mock-supabase.storage/${bucket}/${path}` }
            })
        })
    };

    private authCallback: any = null;
    private notifyAuthChange(event: string, session: any) {
        if (this.authCallback) {
            this.authCallback(event, session);
        }
    }

    from(table: string) {
        return {
            select: (query?: string) => {
                const execute = async (col?: string, val?: any) => {
                    let data = JSON.parse(localStorage.getItem(`mock_db_${table}`) || '[]');

                    // Initialize mock data if empty
                    if (data.length === 0) {
                        if (table === 'lessons') {
                            data = [
                                { id: 1, title: 'Introduction to ASL', video_id: '0FcwzMq4iWg', order_index: 0 },
                                { id: 2, title: 'Basic Finger spelling', video_id: '2hQ-hFAw_W0', order_index: 1 },
                                { id: 3, title: 'Common Phrases', video_id: 'Raa0vBXA8OQ', order_index: 2 }
                            ];
                            localStorage.setItem('mock_db_lessons', JSON.stringify(data));
                        } else if (table === 'quizzes') {
                            data = [
                                { id: 1, lesson_id: 1, question: 'What is the sign for "Hello"?', options: ['Wave hand', 'Touch nose', 'Clap hands'], correct_answer: 'Wave hand' },
                                { id: 2, lesson_id: 1, question: 'How many letters in ASL alphabet?', options: ['20', '26', '30'], correct_answer: '26' },
                                { id: 3, lesson_id: 1, question: 'Which hand do you use for signing?', options: ['Dominant Hand', 'Left Hand only', 'Right Hand only'], correct_answer: 'Dominant Hand' }
                            ];
                            localStorage.setItem('mock_db_quizzes', JSON.stringify(data));
                        } else if (table === 'licenses') {
                            data = [
                                { id: 1, name: 'Premium Sign Language Course', description: 'Full access to all advanced ASL lessons.', price: 49.99 },
                                { id: 2, name: 'Live Mentorship', description: 'One-on-one sessions with ASL experts.', price: 99.99 }
                            ];
                            localStorage.setItem('mock_db_licenses', JSON.stringify(data));
                        }
                    }

                    if (col && val !== undefined) {
                        if (query === '*, licenses(*)' && table === 'user_licenses') {
                            // Basic mock join
                            const licenses = JSON.parse(localStorage.getItem('mock_db_licenses') || '[]');
                            data = data.filter((item: any) => item[col] === val).map((item: any) => ({
                                ...item,
                                licenses: licenses.find((l: any) => l.id === item.license_id)
                            }));
                        } else {
                            data = data.filter((item: any) => item[col] === val);
                        }
                    }
                    return { data, error: null };
                };
                return {
                    eq: (column: string, value: any) => {
                        return {
                            then: (resolve: any) => execute(column, value).then(resolve)
                        };
                    },
                    order: (column: string, { ascending }: any = { ascending: true }) => {
                        return {
                            then: (resolve: any) => execute().then(res => {
                                const d = res.data.sort((a: any, b: any) => ascending ? a[column] - b[column] : b[column] - a[column]);
                                resolve({ data: d, error: null });
                            })
                        };
                    },
                    then: (resolve: any) => execute().then(resolve)
                };
            },
            insert: async (row: any) => {
                const data = JSON.parse(localStorage.getItem(`mock_db_${table}`) || '[]');
                const newRow = { id: row.id || Date.now(), ...row };
                data.push(newRow);
                localStorage.setItem(`mock_db_${table}`, JSON.stringify(data));
                return { data: [newRow], error: null };
            },
            update: (updates: any) => {
                return {
                    eq: async (column: string, value: any) => {
                        let data = JSON.parse(localStorage.getItem(`mock_db_${table}`) || '[]');
                        data = data.map((item: any) => item[column] === value ? { ...item, ...updates } : item);
                        localStorage.setItem(`mock_db_${table}`, JSON.stringify(data));

                        // CRITICAL: If updating profiles, also update the active session user
                        if (table === 'profiles') {
                            const session = JSON.parse(localStorage.getItem('mock_session') || 'null');
                            if (session && session.user && session.user[column] === value) {
                                session.user = { ...session.user, ...updates };
                                localStorage.setItem('mock_session', JSON.stringify(session));
                                this.notifyAuthChange('USER_UPDATED', session);
                            }
                        }

                        return { data, error: null };
                    }
                };
            },
            upsert: async (row: any, options: any) => {
                const onConflict = options?.onConflict || 'id';
                let data = JSON.parse(localStorage.getItem(`mock_db_${table}`) || '[]');
                const idx = data.findIndex((item: any) => item[onConflict] === row[onConflict]);
                if (idx !== -1) {
                    data[idx] = { ...data[idx], ...row };
                } else {
                    data.push({ id: row.id || Date.now(), ...row });
                }
                localStorage.setItem(`mock_db_${table}`, JSON.stringify(data));

                // Also update session user if applicable
                if (table === 'profiles') {
                    const session = JSON.parse(localStorage.getItem('mock_session') || 'null');
                    if (session && session.user && session.user[onConflict] === row[onConflict]) {
                        session.user = { ...session.user, ...row };
                        localStorage.setItem('mock_session', JSON.stringify(session));
                        this.notifyAuthChange('USER_UPDATED', session);
                    }
                }

                return { data, error: null };
            }
        };
    }
}
