import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div class="absolute top-1/4 left-0 w-96 h-96 bg-brand-400/5 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-400/5 rounded-full blur-[100px]"></div>
      </div>

      <div class="max-w-2xl mx-auto">
        <div class="glass-card overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-brand-600/10 to-accent-600/10 px-8 py-6 border-b border-white/10">
            <h2 class="text-2xl font-bold text-gray-900">Profile Settings</h2>
            <p class="text-primary-600 mt-1">Manage your account information</p>
          </div>

          <!-- Form content -->
          <div class="p-8">
            <div *ngIf="loading()" class="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>

            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
              
              <!-- Avatar Section -->
              <div class="flex items-center gap-6 mb-8">
                <div class="relative">
                  <div class="h-24 w-24 rounded-full bg-gradient-to-br from-brand-100 to-accent-100 p-1 shadow-inner">
                    <img [src]="currentUser?.photoURL" alt="Profile" class="h-full w-full rounded-full object-cover bg-white">
                  </div>
                </div>
                <div>
                   <h3 class="text-lg font-semibold text-gray-900">{{ currentUser?.displayName }}</h3>
                   <p class="text-sm text-gray-500">{{ currentUser?.email }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                
                <!-- Helper for Messages -->
                <div *ngIf="message()" [class]="'sm:col-span-6 p-4 rounded-lg mb-4 text-sm font-medium ' + (isError() ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700')">
                    {{ message() }}
                </div>

                <!-- Username -->
                <div class="sm:col-span-4">
                  <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input type="text" formControlName="username" id="username" 
                      class="block w-full rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2.5 bg-white/50 backdrop-blur-sm transition-all">
                  </div>
                  <p class="mt-1 text-xs text-gray-500">This will change your login username.</p>
                </div>

                <!-- First Name -->
                <div class="sm:col-span-3">
                  <label for="firstName" class="block text-sm font-medium text-gray-700">First name</label>
                  <div class="mt-1">
                    <input type="text" formControlName="firstName" id="firstName"
                      class="block w-full rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2.5 bg-white/50 backdrop-blur-sm transition-all">
                  </div>
                </div>

                <!-- Last Name -->
                <div class="sm:col-span-3">
                  <label for="lastName" class="block text-sm font-medium text-gray-700">Last name</label>
                  <div class="mt-1">
                    <input type="text" formControlName="lastName" id="lastName"
                      class="block w-full rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2.5 bg-white/50 backdrop-blur-sm transition-all">
                  </div>
                </div>

                <!-- Email (Read Only) -->
                <div class="sm:col-span-4">
                  <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                  <div class="mt-1">
                    <input type="email" formControlName="email" id="email" 
                      class="block w-full rounded-lg border-gray-200 bg-gray-50 text-gray-500 sm:text-sm py-2.5 cursor-not-allowed" readonly>
                  </div>
                </div>

                 <!-- Mobile -->
                 <div class="sm:col-span-3">
                  <label for="mobile" class="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <div class="mt-1">
                    <input type="tel" formControlName="mobile" id="mobile"
                      class="block w-full rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2.5 bg-white/50 backdrop-blur-sm transition-all">
                  </div>
                </div>

                <!-- Gender -->
                <div class="sm:col-span-2">
                  <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
                  <div class="mt-1">
                    <select id="gender" formControlName="gender"
                      class="block w-full rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2.5 bg-white/50 backdrop-blur-sm transition-all">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <!-- Age -->
                <div class="sm:col-span-1">
                  <label for="age" class="block text-sm font-medium text-gray-700">Age</label>
                  <div class="mt-1">
                    <input type="number" formControlName="age" id="age" min="1" max="120"
                      class="block w-full rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2.5 bg-white/50 backdrop-blur-sm transition-all">
                  </div>
                </div>

              </div>

              <!-- Advanced Security Section -->
              <div class="pt-6 border-t border-white/10">
                 <button type="button" (click)="openSecurity()" class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl transition-all border border-gray-700 hover:border-gray-600 group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-brand-400 group-hover:text-brand-300"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><rect x="10" y="8" width="4" height="4" rx="1"/></svg>
                    Advanced Security Settings
                 </button>
                 <p class="mt-2 text-xs text-gray-500">Manage password, 2FA, and active sessions.</p>
              </div>

              <div class="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t border-white/10 mt-2">
                 <!-- Left Side: Go to Home -->
                 <button type="button" routerLink="/" class="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-brand-600 font-medium flex justify-center items-center gap-2 transition-colors group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-1 transition-transform"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    Go to Home Page
                 </button>

                 <!-- Right Side: Cancel & Save -->
                 <div class="flex items-center gap-3 w-full sm:w-auto">
                    <button type="button" routerLink="/" class="flex-1 sm:flex-none px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
                      Cancel
                    </button>
                    <button type="submit" [disabled]="profileForm.invalid || loading()"
                      class="flex-1 sm:flex-none inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      {{ loading() ? 'Saving...' : 'Save Changes' }}
                    </button>
                 </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  loading = signal(false);
  message = signal('');
  isError = signal(false);
  currentUser: any;

  profileForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [{ value: '', disabled: true }],
    mobile: ['', [Validators.pattern('^[0-9]{10}$')]],
    gender: [''],
    age: [null, [Validators.min(1), Validators.max(120)]]
  });

  ngOnInit() {
    this.auth.user$.pipe(
    ).subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.profileForm.patchValue({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          gender: user.gender,
          age: user.age
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.loading.set(true);
    this.message.set('');
    this.isError.set(false);

    const formData = this.profileForm.getRawValue();

    this.auth.updateProfile(formData)
      .then(() => {
        this.message.set('Profile updated successfully!');
        this.isError.set(false);
        setTimeout(() => this.message.set(''), 3000); // Clear after 3s
      })
      .catch(err => {
        console.error(err);
        this.message.set(err.errors?.[0]?.longMessage || 'Failed to update profile. Please try again.');
        this.isError.set(true);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  openSecurity() {
    this.auth.openUserProfile();
  }
}
