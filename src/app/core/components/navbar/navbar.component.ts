import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InboxService } from '../../services/inbox.service';
import { AdminLoginComponent } from '../../../features/admin/components/admin-login/admin-login.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminLoginComponent, DatePipe],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-[200] transition-all duration-300 bg-gray-900/80 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <a routerLink="/" class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-500 hover:opacity-80 transition-opacity">
              SmartTicket
            </a>
          </div>
          
          <!-- Desktop Menu -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-8">
              <a routerLink="/" routerLinkActive="text-white bg-white/10" [routerLinkActiveOptions]="{exact: true}" class="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-all">Home</a>
              <a routerLink="/movies" routerLinkActive="text-white bg-white/10" class="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-all">Movies</a>
              <a routerLink="/events" routerLinkActive="text-white bg-white/10" class="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-all">Events</a>
              <a routerLink="/sports" routerLinkActive="text-white bg-white/10" class="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-all">Sports</a>
            </div>
          </div>
          
          <!-- Auth Buttons (Desktop) -->
          <div class="hidden md:block">
            <div class="flex items-center gap-4">
               
               <!-- Inbox Button -->
               <div class="relative">
                  <button (click)="inbox.toggleInbox()" class="p-2 text-gray-400 hover:text-white relative transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                     @if (inbox.messages().length > 0) {
                        <span class="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white border border-gray-900">
                          {{inbox.messages().length}}
                        </span>
                     }
                  </button>

                  <!-- Inbox Popup -->
                  @if (inbox.isOpen()) {
                    <div class="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900/50">
                           <h3 class="font-semibold text-white">Inbox</h3>
                           @if(inbox.messages().length > 0) {
                             <button (click)="inbox.clearAll()" class="text-xs text-gray-400 hover:text-red-400 transition-colors">Clear All</button>
                           }
                        </div>
                        <div class="max-h-96 overflow-y-auto">
                           @if (inbox.messages().length === 0) {
                              <div class="p-8 text-center text-gray-500">
                                 <svg class="w-12 h-12 mx-auto mb-2 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                 <p class="text-sm">No new messages</p>
                              </div>
                           }
                           @for (msg of inbox.messages(); track msg.id) {
                              <div class="p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors group relative">
                                 <div class="flex justify-between items-start mb-1">
                                    <h4 class="text-white font-medium text-sm">{{msg.title}}</h4>
                                    <span class="text-xs text-gray-500">{{msg.timestamp | date:'shortTime'}}</span>
                                 </div>
                                 <p class="text-gray-400 text-sm mb-2">{{msg.body}}</p>
                                 <button (click)="inbox.deleteMessage(msg.id)" class="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                 </button>
                              </div>
                           }
                        </div>
                    </div>
                  }
               </div>

               <!-- Admin Trigger -->
               <button (click)="openAdminLogin()" class="text-gray-400 hover:text-white text-sm font-medium px-3 py-2 transition-colors">
                 Admin
               </button>

               <ng-container *ngIf="auth.user$ | async as user; else loginButton">
                 <div class="flex items-center gap-4 pl-4 border-l border-gray-700">
                   <a routerLink="/profile" class="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer mr-4">
                     Hi, {{ user.displayName || user.username || user.email }}
                   </a>
                   <button (click)="auth.logout()" class="text-gray-300 hover:text-white text-sm font-medium transition-colors hover:underline">
                     Logout
                   </button>
                 </div>
               </ng-container>
               <ng-template #loginButton>
                 <a routerLink="/login" class="ml-4 bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-primary-500/25 ring-1 ring-white/10">
                   Login
                 </a>
               </ng-template>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="-mr-2 flex md:hidden">
            <button (click)="toggleMobileMenu()" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" aria-controls="mobile-menu" [attr.aria-expanded]="isMobileMenuOpen()">
              <span class="sr-only">Open main menu</span>
              <!-- Icon when menu is closed -->
              <svg *ngIf="!isMobileMenuOpen()" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <!-- Icon when menu is open -->
              <svg *ngIf="isMobileMenuOpen()" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="md:hidden transition-all duration-300 ease-in-out overflow-hidden" [class.max-h-0]="!isMobileMenuOpen()" [class.max-h-96]="isMobileMenuOpen()" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/90 backdrop-blur-xl border-t border-white/10">
          <a routerLink="/" (click)="closeMobileMenu()" routerLinkActive="text-white bg-white/10" [routerLinkActiveOptions]="{exact: true}" class="text-gray-300 hover:text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium">Home</a>
          <a routerLink="/movies" (click)="closeMobileMenu()" routerLinkActive="text-white bg-white/10" class="text-gray-300 hover:text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium">Movies</a>
          <a routerLink="/events" (click)="closeMobileMenu()" routerLinkActive="text-white bg-white/10" class="text-gray-300 hover:text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium">Events</a>
          <a routerLink="/sports" (click)="closeMobileMenu()" routerLinkActive="text-white bg-white/10" class="text-gray-300 hover:text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium">Sports</a>
          
          <button (click)="openAdminLogin(); closeMobileMenu()" class="text-gray-300 hover:text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
             Admin Access
          </button>

          <div class="pt-4 pb-3 border-t border-gray-700">
             <ng-container *ngIf="auth.user$ | async as user; else mobileLoginButton">
               <a routerLink="/profile" (click)="closeMobileMenu()" class="flex items-center px-5 py-2 hover:bg-white/5 transition-colors">
                 <div class="flex-shrink-0">
                   <!-- Placeholder Avatar -->
                    <div *ngIf="!user.photoURL" class="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                       {{ (user.displayName || user.username || user.email || 'U').charAt(0).toUpperCase() }}
                    </div>
                    <img *ngIf="user.photoURL" [src]="user.photoURL" class="h-10 w-10 rounded-full object-cover">
                 </div>
                 <div class="ml-3">
                   <div class="text-base font-medium leading-none text-white">{{ user.displayName || user.username || 'User' }}</div>
                   <div class="text-sm font-medium leading-none text-gray-400 mt-1">{{ user.email }}</div>
                 </div>
               </a>
               <div class="mt-3 px-2 space-y-1">
                 <button (click)="auth.logout(); closeMobileMenu()" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Logout</button>
               </div>
             </ng-container>
             <ng-template #mobileLoginButton>
                <a routerLink="/login" (click)="closeMobileMenu()" class="block w-full text-center bg-primary-600 hover:bg-primary-500 text-white px-4 py-3 rounded-md text-base font-medium shadow-md">
                  Login / Sign Up
                </a>
             </ng-template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Admin Login Modal -->
    <app-admin-login *ngIf="showAdminLogin()" (close)="closeAdminLogin()"></app-admin-login>
  `
})
export class NavbarComponent {
  public auth = inject(AuthService);
  public inbox = inject(InboxService);
  isMobileMenuOpen = signal(false);
  showAdminLogin = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  openAdminLogin() {
    this.showAdminLogin.set(true);
  }

  closeAdminLogin() {
    this.showAdminLogin.set(false);
  }
}
