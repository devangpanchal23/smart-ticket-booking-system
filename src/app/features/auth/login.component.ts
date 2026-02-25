import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50/50 grid place-items-center relative overflow-hidden">
      <!-- Background Flair -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div class="w-full max-w-md p-8 glass-card relative z-10 border-white/40 text-center">
        <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent-600 mb-4">SmartTicket</h1>
        <p class="text-primary-600 mb-8">Click below to sign in or create an account.</p>
        
        <button (click)="signInWithClerk()" 
          class="w-full bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 flex justify-center items-center gap-2">
          <span>Sign In / Sign Up</span>
        </button>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // If already logged in, redirect home
    this.auth.user$.subscribe(user => {
      if (user) {
        this.router.navigate(['/']);
      }
    });
  }

  signInWithClerk() {
    this.auth.openLogin();
  }
}
