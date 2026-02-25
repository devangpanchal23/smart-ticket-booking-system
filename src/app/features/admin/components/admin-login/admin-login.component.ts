import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="close.emit()"></div>
      
      <!-- Modal -->
      <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div class="text-center mb-8">
           <div class="mx-auto h-12 w-12 rounded-full bg-gray-900 text-white flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
           </div>
           <h2 class="text-2xl font-bold text-gray-900">Admin Login</h2>
           <p class="text-sm text-gray-500 mt-2">Enter your company credentials to access the dashboard.</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <div *ngIf="error()" class="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center font-medium">
             {{ error() }}
          </div>

          <div>
             <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
             <input type="email" id="email" formControlName="email" 
               class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm py-2.5">
          </div>

          <div>
             <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
             <input type="password" id="password" formControlName="password" 
               class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm py-2.5">
          </div>

          <div class="pt-2">
             <button type="submit" [disabled]="loginForm.invalid"
               class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
               Access Dashboard
             </button>
             <button type="button" (click)="close.emit()" class="mt-3 w-full text-center text-sm text-gray-500 hover:text-gray-700">
               Cancel
             </button>
          </div>

        </form>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private router = inject(Router);

  error = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.getRawValue();

    // Explicit credential check
    if (this.adminService.login(email!, password!)) {
      this.close.emit();
      this.router.navigate(['/admin']);
    } else {
      this.error.set('Invalid admin credentials.');
    }
  }
}
