import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { MovieService } from '../../../../core/services/movie.service';
import { AdminService } from '../../../../core/services/admin.service';
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'app-admin-movies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
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
          <a routerLink="/admin" class="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Dashboard
          </a>
          <a routerLink="/admin/movies" class="flex items-center gap-3 px-4 py-3 bg-brand-500/10 text-brand-400 rounded-lg border border-brand-500/20">
            <span class="material-icons">movie</span>
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
           <h1 class="text-xl font-semibold text-gray-100">Movies Management</h1>
           <div class="flex items-center gap-4">
              <span class="text-sm text-gray-400">admin&#64;gmail.com</span>
              <div class="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs ring-4 ring-gray-800">A</div>
           </div>
        </header>

        <!-- Content Area -->
        <div class="flex-1 overflow-auto p-8 relative">
          
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Movies Library</h2>
            <button (click)="openAddForm()" class="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Movie
            </button>
          </div>

          @if(successMessage()) {
            <div class="mb-6 bg-green-500/10 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
               <span>{{ successMessage() }}</span>
            </div>
          }

          <!-- Movies Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (movie of movies(); track movie.id) {
              <div class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-brand-500/50 transition-all group">
                <div class="relative aspect-video">
                  <img [src]="getMovieImage(movie)" [alt]="movie.name" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'">
                  <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button (click)="openEditForm(movie)" class="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                    </button>
                    <button (click)="deleteMovie(movie.id!)" class="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                  <span class="absolute top-2 right-2 px-2 py-1 bg-black/80 text-yellow-400 text-xs font-bold rounded flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    {{movie.imdbRating}}
                  </span>
                </div>
                <div class="p-4">
                  <h3 class="font-bold text-lg mb-1 truncate">{{movie.name}}</h3>
                  <div class="flex items-center gap-2 text-sm text-gray-400 mb-2">
                     <span class="px-2 py-0.5 bg-gray-700 rounded text-xs">{{movie.ageRestriction}}</span>
                     <span>{{movie.characters.length}} Cast Members</span>
                  </div>
                  <p class="text-sm text-gray-500 line-clamp-2">{{movie.description}}</p>
                </div>
              </div>
            }
          </div>

          <!-- Form Modal -->
          @if (showForm) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div class="bg-gray-800 w-full max-w-2xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div class="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                  <h3 class="text-xl font-bold">{{ isEditing ? 'Edit Movie' : 'Add New Movie' }}</h3>
                  <button (click)="closeForm()" class="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                
                <div class="p-6 overflow-y-auto">
                  <form [formGroup]="movieForm" (ngSubmit)="onSubmit()" class="space-y-4">
                    
                    @if(errorMessage()) {
                      <div class="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <span>{{ errorMessage() }}</span>
                      </div>
                    }

                    <!-- Basic Info -->
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-400">Movie Name</label>
                        <input formControlName="name" type="text" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                      </div>
                      <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-400">IMDb Rating (0-5)</label>
                        <input formControlName="imdbRating" type="number" step="0.1" min="0" max="5" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                    </div>
                    </div>

                     <!-- Category & Access -->
                     <div class="grid grid-cols-2 gap-4 bg-gray-700/30 p-4 rounded-lg border border-gray-700">
                       <div class="space-y-2">
                         <label class="block text-sm font-medium text-gray-400">Movie Type</label>
                         <div class="flex gap-4">
                            <label class="flex items-center gap-2 cursor-pointer">
                              <input type="radio" formControlName="type" value="online" class="text-brand-500 focus:ring-brand-500">
                              <span class="text-sm">Online Movie</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                              <input type="radio" formControlName="type" value="cinema" class="text-brand-500 focus:ring-brand-500">
                              <span class="text-sm">In Cinema</span>
                            </label>
                         </div>
                       </div>
                       
                       @if (movieForm.get('type')?.value === 'online') {
                         <div class="space-y-2 animate-in fade-in slide-in-from-left-2">
                           <label class="block text-sm font-medium text-gray-400">Access Type</label>
                           <div class="flex gap-4">
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" formControlName="access" value="free" class="text-brand-500 focus:ring-brand-500">
                                <span class="text-sm">Free</span>
                              </label>
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" formControlName="access" value="paid" class="text-brand-500 focus:ring-brand-500">
                                <span class="text-sm">Paid (Premium)</span>
                              </label>
                           </div>
                         </div>
                       }
                     </div>

                    <!-- Media Links -->
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-400">Thumbnail URL</label>
                        <input formControlName="thumbnail" type="text" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                      </div>
                      <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-400">Trailer URL</label>
                        <input formControlName="trailer" type="text" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                      </div>
                    </div>

                    <!-- Trailer Preview -->
                    @if(safeTrailerUrl) {
                        <div class="aspect-video bg-black/50 rounded-lg overflow-hidden border border-gray-600">
                            <iframe [src]="safeTrailerUrl" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
                        </div>
                    }

                    <!-- Details -->
                    <div class="space-y-1">
                      <label class="block text-sm font-medium text-gray-400">Age Restriction</label>
                      <input formControlName="ageRestriction" type="text" placeholder="e.g. 13+, R, PG-13" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                    </div>

                    <div class="space-y-1">
                      <label class="block text-sm font-medium text-gray-400">Description</label>
                      <textarea formControlName="description" rows="3" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500"></textarea>
                    </div>

                    <!-- Characters Array -->
                    <div class="space-y-2">
                       <div class="flex justify-between items-center">
                         <label class="block text-sm font-medium text-gray-400">Cast / Characters</label>
                         <button type="button" (click)="addCharacter()" class="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-brand-400">+ Add</button>
                       </div>
                       
                       <div formArrayName="characters" class="space-y-2">
                          @for(control of characters.controls; track $index) {
                             <div [formGroupName]="$index" class="flex gap-2 items-center">
                                <input formControlName="name" placeholder="Actor Name" class="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm text-white">
                                <input formControlName="role" placeholder="Role" class="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm text-white">
                                <button type="button" (click)="removeCharacter($index)" class="text-red-400 hover:text-red-300 p-1">
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                             </div>
                          }
                       </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
                      <button type="button" (click)="closeForm()" class="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors" [disabled]="isSubmitting()">Cancel</button>
                      <button type="submit" class="px-4 py-2 bg-brand-500 hover:bg-brand-600 rounded-lg text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait" [disabled]="isSubmitting()">
                        @if(isSubmitting()) {
                           <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                             <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Processing...
                        } @else {
                           {{ isEditing ? 'Update Movie' : 'Save Movie' }}
                        }
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          }

        </div>
      </main>
    </div>
  `
})
export class AdminMoviesComponent {
  // Services
  movieService = inject(MovieService);
  adminService = inject(AdminService);
  fb = inject(FormBuilder);
  sanitizer = inject(DomSanitizer);

  // State
  movies = toSignal(this.movieService.getMovies(), { initialValue: [] });
  showForm = false;
  isEditing = false;
  currentMovieId: string | null = null;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Form
  movieForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    thumbnail: ['', Validators.required],
    trailer: ['', Validators.required],
    description: ['', Validators.required],
    ageRestriction: ['', Validators.required],
    imdbRating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    type: ['online', Validators.required],
    access: ['free', Validators.required],
    characters: this.fb.array([])
  });

  get characters() {
    return this.movieForm.get('characters') as FormArray;
  }

  // Computed
  get safeTrailerUrl(): SafeResourceUrl | null {
    const url = this.movieForm.get('trailer')?.value;
    if (!url) return null;

    // Auto-convert YouTube Links
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
      embedUrl = `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}`;
    } else if (url.includes('youtu.be/')) {
      embedUrl = `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  openAddForm() {
    this.isEditing = false;
    this.currentMovieId = null;
    this.resetForm();
    this.showForm = true;
  }

  openEditForm(movie: Movie) {
    this.isEditing = true;
    this.currentMovieId = movie.id || null;
    this.resetForm();

    // Repopulate form
    this.movieForm.patchValue({
      name: movie.name,
      thumbnail: movie.thumbnail,
      trailer: movie.trailer,
      description: movie.description,
      ageRestriction: movie.ageRestriction,
      imdbRating: movie.imdbRating,
      type: movie.type || 'online',
      access: movie.access || 'free'
    });

    // Populate characters
    if (movie.characters) {
      movie.characters.forEach(char => {
        this.addCharacter(char.name, char.role);
      });
    }

    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.errorMessage.set(null);
  }

  resetForm() {
    this.movieForm.reset();
    this.characters.clear();
    this.movieForm.patchValue({
      imdbRating: 0,
      type: 'online',
      access: 'free'
    });
    this.isSubmitting.set(false);
    this.errorMessage.set(null);
  }

  addCharacter(name: string = '', role: string = '') {
    const charGroup = this.fb.group({
      name: [name, Validators.required],
      role: [role, Validators.required],
      imageUrl: ['']
    });
    this.characters.push(charGroup);
  }

  removeCharacter(index: number) {
    this.characters.removeAt(index);
  }

  onSubmit() {
    if (this.movieForm.invalid) {
      this.movieForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formData = this.movieForm.value;

    const movieData: Movie = {
      ...formData,
      id: this.currentMovieId || undefined,
      imdbRating: Number(formData.imdbRating)
    };

    const action$: Observable<any> = this.isEditing && this.currentMovieId
      ? this.movieService.updateMovie(movieData)
      : this.movieService.addMovie(movieData);

    action$.subscribe({
      next: () => {
        this.closeForm();
        this.isSubmitting.set(false);
        this.showSuccess(this.isEditing ? 'Movie updated successfully!' : 'Movie added successfully!');
      },
      error: (err: any) => {
        console.error('Error saving movie:', err);
        this.errorMessage.set(`Failed to save: ${err.message}`);
        this.isSubmitting.set(false);
      }
    });
  }

  deleteMovie(id: string) {
    if (confirm('Are you sure you want to delete this movie?')) {
      this.movieService.deleteMovie(id).subscribe({
        next: () => this.showSuccess('Movie deleted successfully!'),
        error: (err) => console.error(err)
      });
    }
  }

  showSuccess(message: string) {
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  getMovieImage(movie: Movie): string {
    // 1. If thumbnail is a YouTube URL
    if (this.isYouTubeUrl(movie.thumbnail)) {
      return this.getYouTubeThumbnail(movie.thumbnail);
    }
    // 2. If thumbnail is present (and not a YT link), use it
    if (movie.thumbnail && movie.thumbnail.length > 5) {
      return movie.thumbnail;
    }
    // 3. Fallback: Check if trailer is a YouTube URL
    if (this.isYouTubeUrl(movie.trailer)) {
      return this.getYouTubeThumbnail(movie.trailer);
    }
    // 4. Fallback to whatever is in thumbnail (might be empty/invalid)
    return movie.thumbnail || '';
  }

  private isYouTubeUrl(url: string | undefined): boolean {
    if (!url) return false;
    return url.includes('youtube.com/watch?v=') || url.includes('youtu.be/');
  }

  private getYouTubeThumbnail(url: string | undefined): string {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
}
