import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';

@Component({
    selector: 'app-events',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="min-h-screen bg-gray-50/50 pt-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="glass border border-white/20 rounded-2xl p-8 mb-8">
          <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 mb-4">
            Events
          </h1>
          <p class="text-gray-600 text-lg">
            Find concerts, workshops, and local gatherings.
          </p>
        </div>
        
        <!-- Placeholder Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div class="h-64 rounded-xl bg-white border border-gray-200 p-6 flex items-center justify-center text-gray-400">
             Event Content Placeholder
           </div>
           <div class="h-64 rounded-xl bg-white border border-gray-200 p-6 flex items-center justify-center text-gray-400">
             Event Content Placeholder
           </div>
           <div class="h-64 rounded-xl bg-white border border-gray-200 p-6 flex items-center justify-center text-gray-400">
             Event Content Placeholder
           </div>
        </div>
      </div>
    </div>
  `
})
export class EventsComponent { }
