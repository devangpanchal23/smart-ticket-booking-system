import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Clerk } from '@clerk/clerk-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserProfile } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private router = inject(Router);
    private clerk: any | undefined;
    private userSubject = new BehaviorSubject<any>(null);
    private initialized = false;

    // Observable that exposes the current user
    user$ = this.userSubject.asObservable();

    // Derived observable for UserProfile (for admin guards etc)
    userProfile$: Observable<UserProfile | null> = this.user$.pipe(
        map(user => {
            if (!user) return null;
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: (user.clerkUser?.publicMetadata?.role as 'user' | 'admin') || 'user',
                createdAt: user.clerkUser?.createdAt || new Date()
            };
        })
    );

    // Signal for easier template binding
    userSignal = signal<any>(null);

    constructor() {
        // Initialization deferred to APP_INITIALIZER to ensure proper injection context
    }

    async ensureInitialized(): Promise<void> {
        if (!this.initialized) {
            await this.initializeClerk();
            this.initialized = true;
        }
    }

    private async initializeClerk() {
        if (this.initialized) return;
        
        try {
            this.clerk = new (Clerk as any)(environment.clerk.publishableKey);
            await this.clerk.load();

            // Update state on load
            this.updateUserState();

            // Listen for changes
            this.clerk.addListener((payload: any) => {
                this.updateUserState();
            });

        } catch (error) {
            console.error('Failed to initialize Clerk', error);
        }
    }

    private updateUserState() {
        if (this.clerk && this.clerk.user) {
            const clerkUser = this.clerk.user;
            const metadata = clerkUser.unsafeMetadata || {};

            const user: UserProfile = {
                uid: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress || '',
                username: clerkUser.username,
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
                displayName: clerkUser.fullName || clerkUser.firstName,
                photoURL: clerkUser.imageUrl,
                gender: metadata['gender'] as string,
                age: metadata['age'] as number,
                mobile: metadata['mobile'] as string,
                role: (clerkUser.publicMetadata?.role as 'user' | 'admin') || 'user',
                createdAt: clerkUser.createdAt || new Date()
            };
            this.userSubject.next(user);
            this.userSignal.set(user);
        } else {
            this.userSubject.next(null);
            this.userSignal.set(null);
        }
    }

    async updateProfile(data: Partial<UserProfile>) {
        if (!this.clerk || !this.clerk.user) return;

        try {
            const current = this.clerk.user;

            // 1. Update Name (Core Fields - Low Sensitivity)
            const namePayload: any = {};
            if (data.firstName && data.firstName !== current.firstName) namePayload.firstName = data.firstName;
            if (data.lastName && data.lastName !== current.lastName) namePayload.lastName = data.lastName;

            if (Object.keys(namePayload).length > 0) {
                await this.clerk.user.update(namePayload);
            }

            // 2. Update Metadata (Custom Fields - Low Sensitivity)
            // Always update to ensure consistency
            await this.clerk.user.update({
                unsafeMetadata: {
                    gender: data.gender,
                    age: data.age,
                    mobile: data.mobile
                }
            });

            // 3. Update Username (High Sensitivity - Might Trigger Verification)
            if (data.username && data.username !== current.username) {
                try {
                    await this.clerk.user.update({ username: data.username });
                } catch (err: any) {
                    // Check if error implies verification is needed
                    if (err.errors?.[0]?.code === 'verification_required' ||
                        err.errors?.[0]?.longMessage?.includes('verification')) {
                        // Trigger Clerk's UI to handle the verification flow
                        this.clerk.openUserProfile();
                        throw new Error('Please complete the verification in the popup window.');
                    }
                    throw err;
                }
            }

            // Refresh local state
            this.updateUserState();
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    // Opens the Clerk modal
    openLogin() {
        if (this.clerk) {
            this.clerk.openSignIn();
        }
    }

    // Opens the Clerk modal for signup
    openSignUp() {
        if (this.clerk) {
            this.clerk.openSignUp();
        }
    }

    // Opens the Clerk user profile modal (Security, 2FA, etc)
    openUserProfile() {
        if (this.clerk) {
            this.clerk.openUserProfile();
        }
    }

    async logout() {
        if (this.clerk) {
            await this.clerk.signOut();
            this.router.navigate(['/']);
        }
    }

    // Helper to get raw clerk instance if needed
    get clerkInstance() {
        return this.clerk;
    }
}
