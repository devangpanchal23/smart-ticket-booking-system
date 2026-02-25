import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-8">
      <div>
        <h2 class="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p class="text-gray-400">Welcome back, Admin.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="glass-card p-6 relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl group-hover:bg-primary-500/30 transition-all"></div>
          <p class="text-gray-400 text-sm font-medium mb-1">Total Bookings</p>
          <h3 class="text-3xl font-bold text-white">1,248</h3>
          <span class="text-green-400 text-sm flex items-center mt-2">
            <span class="material-icons text-sm mr-1">trending_up</span> +12.5%
          </span>
        </div>

        <div class="glass-card p-6 relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-accent-500/20 rounded-full blur-2xl group-hover:bg-accent-500/30 transition-all"></div>
          <p class="text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
          <h3 class="text-3xl font-bold text-white">₹ 4.2L</h3>
          <span class="text-green-400 text-sm flex items-center mt-2">
            <span class="material-icons text-sm mr-1">trending_up</span> +8.2%
          </span>
        </div>

        <div class="glass-card p-6 relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all"></div>
          <p class="text-gray-400 text-sm font-medium mb-1">Active Events</p>
          <h3 class="text-3xl font-bold text-white">24</h3>
          <span class="text-gray-400 text-sm flex items-center mt-2">
            Across 5 categories
          </span>
        </div>

        <div class="glass-card p-6 relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl group-hover:bg-pink-500/30 transition-all"></div>
          <p class="text-gray-400 text-sm font-medium mb-1">Users</p>
          <h3 class="text-3xl font-bold text-white">8,540</h3>
          <span class="text-green-400 text-sm flex items-center mt-2">
            <span class="material-icons text-sm mr-1">trending_up</span> +24 this week
          </span>
        </div>
      </div>

      <!-- Recent Activity (Placeholder) -->
      <div class="glass-card p-6">
        <h3 class="text-xl font-bold text-white mb-6">Recent Bookings</h3>
        <div class="flex flex-col space-y-4">
           <!-- Mock Items -->
           <div class="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0">
             <div class="flex items-center space-x-4">
               <div class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                 <span class="material-icons text-sm">movie</span>
               </div>
               <div>
                 <p class="text-white font-medium">Avengers: Secret Wars</p>
                 <p class="text-gray-500 text-sm">By Rahul Sharma • 2 seats</p>
               </div>
             </div>
             <span class="text-white font-bold">₹ 800</span>
           </div>
           
           <div class="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0">
             <div class="flex items-center space-x-4">
               <div class="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400">
                 <span class="material-icons text-sm">music_note</span>
               </div>
               <div>
                 <p class="text-white font-medium">Sunburn Festival</p>
                 <p class="text-gray-500 text-sm">By Priya Patel • 1 seat</p>
               </div>
             </div>
             <span class="text-white font-bold">₹ 2,500</span>
           </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent { }
