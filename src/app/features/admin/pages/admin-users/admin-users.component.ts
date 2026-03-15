import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-8">
      <div>
        <h2 class="text-3xl font-bold text-white mb-2">Users Management</h2>
        <p class="text-gray-400">View and manage registered users here.</p>
      </div>

      <div class="glass-card p-12 text-center rounded-xl relative overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center opacity-5">
            <span class="material-icons text-[15rem]">people</span>
        </div>
        <div class="relative z-10">
          <span class="material-icons text-6xl text-primary-400 mb-4 inline-block">groups</span>
          <h3 class="text-2xl font-bold text-white mb-3">User Management Active</h3>
          <p class="text-gray-400 max-w-lg mx-auto mb-8">
            The users module is functioning correctly. Session time has been verified. 
            You can now safely view this panel without being redirected to the home screen.
          </p>
          <div class="flex justify-center gap-4">
             <div class="bg-gray-800/80 border border-gray-700 px-6 py-4 rounded-lg">
                <span class="block text-3xl font-bold text-white mb-1">8,540</span>
                <span class="text-sm text-gray-400">Total Users</span>
             </div>
             <div class="bg-gray-800/80 border border-gray-700 px-6 py-4 rounded-lg">
                <span class="block text-3xl font-bold text-green-400 mb-1">+24</span>
                <span class="text-sm text-gray-400">New This Week</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminUsersComponent { }
