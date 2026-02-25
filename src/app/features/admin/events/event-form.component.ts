import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { Router } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="glass-card p-8 max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold text-white mb-6">Create New Event</h2>
      
      <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div>
          <label class="block text-gray-400 text-sm font-medium mb-2">Event Title</label>
          <input formControlName="title" type="text" class="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="e.g. IPL Final 2026">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-400 text-sm font-medium mb-2">Category</label>
            <select formControlName="category" class="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors">
              <option value="movie">Movie</option>
              <option value="sports">Sports</option>
              <option value="event">Live Event</option>
              <option value="consultancy">Consultancy</option>
            </select>
          </div>
          
          <div>
            <label class="block text-gray-400 text-sm font-medium mb-2">City</label>
            <input formControlName="city" type="text" class="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="e.g. Mumbai">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-400 text-sm font-medium mb-2">Price (₹)</label>
            <input formControlName="price" type="number" class="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors">
          </div>
          
          <div>
            <label class="block text-gray-400 text-sm font-medium mb-2">Date</label>
            <input formControlName="date" type="datetime-local" class="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors">
          </div>
        </div>

        <div>
           <label class="block text-gray-400 text-sm font-medium mb-2">Image URL</label>
           <input formControlName="imageUrl" type="text" class="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="https://...">
        </div>

        <div class="flex justify-end pt-4">
          <button type="submit" [disabled]="eventForm.invalid" class="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-primary-500/25">
            Create Event
          </button>
        </div>
      </form>
    </div>
  `
})
export class EventFormComponent {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);

  eventForm = this.fb.group({
    title: ['', Validators.required],
    category: ['movie', Validators.required],
    city: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    date: ['', Validators.required],
    imageUrl: ['', Validators.required],
    status: ['active']
  });

  async onSubmit() {
    if (this.eventForm.valid) {
      const formVal = this.eventForm.value;
      const eventData: any = {
        ...formVal,
        date: Timestamp.fromDate(new Date(formVal.date as string)),
        eventId: '' // filled by service
      };

      try {
        await this.eventService.createEvent(eventData);
        alert('Event Created Successfully!');
        this.router.navigate(['/admin/events']);
      } catch (e) {
        console.error(e);
        alert('Error creating event');
      }
    }
  }
}
