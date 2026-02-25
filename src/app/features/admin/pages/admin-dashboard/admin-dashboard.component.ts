import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-900 text-gray-100 flex font-sans">
      
      <!-- Sidebar -->
      <aside class="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 hidden md:flex flex-col">
        <div class="h-16 flex items-center px-6 border-b border-gray-700">
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-accent-400">
            Admin Panel
          </span>
        </div>
        
        <nav class="p-4 space-y-1 flex-1">
          <a routerLink="/admin" class="flex items-center gap-3 px-4 py-3 bg-brand-500/10 text-brand-400 rounded-lg border border-brand-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Dashboard
          </a>
          <a routerLink="/admin/movies" routerLinkActive="bg-brand-500/10 text-brand-400" class="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 rounded-lg transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
             Movies
          </a>
          <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Users
          </a>
          <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Settings
          </a>
        </nav>


        <div class="p-4 border-t border-gray-700 space-y-2">
           <a routerLink="/" class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
             Back to Website
           </a>
           <button (click)="adminService.logout()" class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
             Sign Out
           </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-h-0 overflow-hidden">
        
        <!-- Header -->
        <header class="h-16 bg-gray-800/50 border-b border-gray-700 flex items-center justify-between px-8 backdrop-blur-sm">
           <h1 class="text-xl font-semibold text-gray-100">Company Overview</h1>
           <div class="flex items-center gap-4">
              <span class="text-sm text-gray-400">admin&#64;gmail.com</span>
              <div class="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs ring-4 ring-gray-800">
                A
              </div>
           </div>
        </header>

        <!-- Content Scrollable -->
        <div class="flex-1 overflow-auto p-8">
           
           <!-- Stats Grid -->
           <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                <div class="flex items-center justify-between">
                   <h3 class="text-gray-400 text-sm font-medium">Total Users</h3>
                   <span class="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                   </span>
                </div>
                <p class="text-3xl font-bold text-gray-100 mt-2">12,345</p>
                <div class="flex items-center gap-1 mt-2 text-sm text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  <span>+12% from last month</span>
                </div>
             </div>

             <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                <div class="flex items-center justify-between">
                   <h3 class="text-gray-400 text-sm font-medium">Active Sessions</h3>
                   <span class="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                   </span>
                </div>
                <p class="text-3xl font-bold text-gray-100 mt-2">1,204</p>
                <div class="flex items-center gap-1 mt-2 text-sm text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  <span>+5% from last hour</span>
                </div>
             </div>

             <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                <div class="flex items-center justify-between">
                   <h3 class="text-gray-400 text-sm font-medium">System Health</h3>
                   <span class="p-2 bg-green-500/10 text-green-400 rounded-lg">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                   </span>
                </div>
                <p class="text-3xl font-bold text-gray-100 mt-2">99.9%</p>
                <div class="flex items-center gap-1 mt-2 text-sm text-gray-400">
                  <span>Operational</span>
                </div>
             </div>
           </div>

           <!-- Recent Activity / Table Stub -->
           <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-700">
                <h3 class="text-lg font-semibold text-gray-100">Recent System Events</h3>
              </div>
              <div class="p-6 text-center text-gray-500 py-12">
                Chart data and logs will appear here.
              </div>
           </div>

        </div>
      </main>
    </div>
  `
})
export class AdminDashboardComponent {
  adminService = inject(AdminService);
}
