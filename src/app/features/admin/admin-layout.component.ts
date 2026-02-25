import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-dark-900 flex">
      <!-- Sidebar -->
      <aside class="w-64 glass border-r border-white/5 flex flex-col fixed h-full z-20">
        <div class="h-16 flex items-center px-6 border-b border-white/5">
          <span class="text-xl font-bold text-gradient">SmartTicket Admin</span>
        </div>
        
        <nav class="flex-1 px-4 py-6 space-y-2">
          <a routerLink="/admin/dashboard" routerLinkActive="bg-primary-500/20 text-primary-400" class="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
            <span class="material-icons mr-3 text-xl group-hover:text-primary-400">dashboard</span>
            Dashboard
          </a>
          <a routerLink="/admin/events" routerLinkActive="bg-primary-500/20 text-primary-400" class="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
            <span class="material-icons mr-3 text-xl group-hover:text-primary-400">event</span>
            Events
          </a>
          <a routerLink="/admin/bookings" routerLinkActive="bg-primary-500/20 text-primary-400" class="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
            <span class="material-icons mr-3 text-xl group-hover:text-primary-400">confirmation_number</span>
            Bookings
          </a>
          <a routerLink="/admin/users" routerLinkActive="bg-primary-500/20 text-primary-400" class="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
            <span class="material-icons mr-3 text-xl group-hover:text-primary-400">people</span>
            Users
          </a>
        </nav>
        
        <div class="p-4 border-t border-white/5">
          <button (click)="auth.logout()" class="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <span class="material-icons mr-3">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 ml-64 p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
    constructor(public auth: AuthService) { }
}
