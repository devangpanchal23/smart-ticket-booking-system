import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { MovieService } from '../../core/services/movie.service';
import { InboxService } from '../../core/services/inbox.service';
import { Movie } from '../../core/models/movie.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  template: `
    @if (playerSize() !== 'full') {
      <app-navbar></app-navbar>
    }
    <div class="min-h-screen bg-gray-50/50 pt-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="glass border border-white/20 rounded-2xl p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 mb-2">
              Now Showing
            </h1>
            <p class="text-gray-600 text-lg">
              Explore the latest blockbusters and indie films.
            </p>
          </div>
          
          <!-- Category Tabs -->
          <div class="flex p-1 bg-gray-200 rounded-xl">
             <button (click)="activeTab.set('online')" [class.bg-white]="activeTab() === 'online'" [class.shadow-sm]="activeTab() === 'online'" class="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200" [class.text-gray-900]="activeTab() === 'online'" [class.text-gray-500]="activeTab() !== 'online'">
                Online Movies
             </button>
             <button (click)="activeTab.set('cinema')" [class.bg-white]="activeTab() === 'cinema'" [class.shadow-sm]="activeTab() === 'cinema'" class="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200" [class.text-gray-900]="activeTab() === 'cinema'" [class.text-gray-500]="activeTab() !== 'cinema'">
                In Theaters
             </button>
          </div>
        </div>
        
        @if (movies().length === 0) {
           <div class="text-center py-12 text-gray-500">
             <p>No movies available at the moment. Check back soon!</p>
           </div>
        }

        <!-- Online Movies Tab -->
        @if(activeTab() === 'online') {
            <div class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                <!-- Free Section -->
                <section>
                    <div class="flex items-center gap-3 mb-6">
                        <span class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">Free to Watch</span>
                        <div class="h-px flex-1 bg-gray-200"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        @for (movie of onlineFreeMovies(); track movie.id) {
                            <ng-container *ngTemplateOutlet="movieCard; context: {$implicit: movie}"></ng-container>
                        } @empty {
                            <p class="text-gray-400 text-sm italic col-span-full">No free movies available.</p>
                        }
                    </div>
                </section>

                <!-- Paid Section -->
                <section>
                    <div class="flex items-center gap-3 mb-6">
                        <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider">Premium (Paid)</span>
                        <div class="h-px flex-1 bg-gray-200"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        @for (movie of onlinePaidMovies(); track movie.id) {
                            <ng-container *ngTemplateOutlet="movieCard; context: {$implicit: movie, isPaid: true}"></ng-container>
                        } @empty {
                            <p class="text-gray-400 text-sm italic col-span-full">No premium movies available.</p>
                        }
                    </div>
                </section>
            </div>
        }

        <!-- Cinema Tab -->
        @if(activeTab() === 'cinema') {
            <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    @for (movie of cinemaMovies(); track movie.id) {
                        <ng-container *ngTemplateOutlet="movieCard; context: {$implicit: movie}"></ng-container>
                    } @empty {
                        <div class="col-span-full text-center py-12 text-gray-400">
                            <p>No movies currently in theaters.</p>
                        </div>
                    }
                </div>
            </div>
        }

        <!-- Resuable Movie Card Template -->
        <ng-template #movieCard let-movie let-isPaid="isPaid">
             <div (click)="onMovieClick(movie)" class="group cursor-pointer bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-700 relative">
               
               @if(isPaid) {
                  <div class="absolute top-2 right-2 z-10 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-amber-400">PREMIUM</div>
               }

               <!-- Image Section -->
               <div class="aspect-video relative overflow-hidden bg-gray-800">
                 <img [src]="getMovieImage(movie)" alt="{{movie.name}}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                 <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                 
                 <!-- Play Icon (Visible on Hover) -->
                 <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/20">
                      @if(isPaid) {
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      } @else {
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      }
                    </div>
                 </div>
               </div>
               
               <!-- Content Section -->
               <div class="p-4">
                  <h3 class="text-white font-bold text-lg truncate mb-1">{{movie.name}}</h3>
                  <div class="flex items-center gap-3 text-gray-400 text-sm">
                    <span class="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs">{{movie.ageRestriction}}</span>
                    <span>{{movie.characters.length}} Cast Members</span>
                    <span class="flex items-center gap-1 text-yellow-400 ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        {{movie.imdbRating}}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-2 line-clamp-1">{{movie.description}}</p>
               </div>
             </div>
        </ng-template>

        <!-- Access Code Modal -->
        @if (showCodeModal()) {
           <div class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
              <div class="bg-gray-800 w-full max-w-md rounded-2xl p-8 border border-gray-700 shadow-2xl text-center">
                 <div class="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                 </div>
                 <h2 class="text-2xl font-bold text-white mb-2">Premium Access</h2>
                 
                 @if(!otpSent()) {
                     <p class="text-gray-400 mb-6">
                        This is a premium movie. Click below to generate an access code. We'll send it to your Inbox.
                     </p>
                     
                     <div class="flex gap-3">
                        <button (click)="closeCodeModal()" class="flex-1 px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-300 font-medium transition-colors">Cancel</button>
                        <button (click)="generateCode()" class="flex-1 px-4 py-3 bg-brand-500 hover:bg-brand-600 rounded-lg text-white font-bold transition-colors shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                           Get Access Code
                        </button>
                     </div>
                 } @else {
                     <p class="text-gray-400 mb-6">
                        We've sent a 4-digit code to your <strong class="text-white">Inbox</strong>.
                     </p>
                     
                     <div class="mb-6">
                        <input type="text" [(ngModel)]="enteredCode" maxlength="4" placeholder="0000" class="w-32 text-center text-3xl tracking-[1em] font-mono bg-gray-900 border border-gray-600 rounded-lg py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all uppercase">
                     </div>
                     
                     @if(codeError()) {
                        <p class="text-red-400 text-sm mb-4 animate-in slide-in-from-top-1">Invalid code. Please check your inbox.</p>
                     }

                     <div class="flex gap-3">
                        <button (click)="closeCodeModal()" class="flex-1 px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-300 font-medium transition-colors">Cancel</button>
                        <button (click)="verifyCode()" class="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 rounded-lg text-white font-bold transition-colors shadow-lg shadow-brand-500/20">Watch Now</button>
                     </div>
                 }
              </div>
           </div>
        }

        <!-- Movie Details Modal -->
        @if (selectedMovie) {
          <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200" [class.p-4]="playerSize() !== 'full'">
            <div 
                class="bg-gray-900 text-white w-full overflow-hidden shadow-2xl flex flex-col relative transition-all duration-500 ease-in-out"
                [class.rounded-2xl]="playerSize() !== 'full'"
                [class.max-w-5xl]="playerSize() === 'default'"
                [class.max-w-7xl]="playerSize() === 'cinema'"
                [class.fixed]="playerSize() === 'full'"
                [class.inset-0]="playerSize() === 'full'"
                [class.z-[200]]="playerSize() === 'full'"
                [class.w-screen]="playerSize() === 'full'"
                [class.h-screen]="playerSize() === 'full'"
                [class.max-h-[90vh]]="playerSize() !== 'full'"
                [class.md:flex-row]="playerSize() !== 'full'">
                
              <button (click)="closeMovie()" 
                class="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
                [class.fixed]="playerSize() === 'full'">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              
              <!-- Trailer / Image Section -->
              <div 
                class="bg-black relative transition-all duration-500 ease-in-out group"
                [class.md:w-2/3]="playerSize() === 'default'"
                [class.md:w-[75%]]="playerSize() === 'cinema'"
                [class.aspect-video]="playerSize() !== 'full'"
                [class.md:aspect-auto]="playerSize() !== 'full'"
                [class.w-full]="playerSize() === 'full'"
                [class.h-full]="playerSize() === 'full'">
                
                 <!-- Size Controls -->
                 <div class="absolute top-4 left-4 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button (click)="setPlayerSize('default')" 
                        [class.bg-brand-500]="playerSize() === 'default'" 
                        [class.text-white]="playerSize() === 'default'"
                        class="p-2 rounded bg-black/50 text-gray-300 hover:text-white backdrop-blur-md border border-white/10" 
                        title="Default View">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
                    </button>
                    <button (click)="setPlayerSize('cinema')" 
                        [class.bg-brand-500]="playerSize() === 'cinema'"
                        [class.text-white]="playerSize() === 'cinema'"
                        class="p-2 rounded bg-black/50 text-gray-300 hover:text-white backdrop-blur-md border border-white/10" 
                        title="Cinema Mode">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"/><path d="M12 22v-5"/><path d="M12 7V2"/><line x1="7" y1="2" x2="7" y2="7"/><line x1="17" y1="2" x2="17" y2="7"/></svg>
                    </button>
                    <button (click)="setPlayerSize('full')" 
                        [class.bg-brand-500]="playerSize() === 'full'"
                        [class.text-white]="playerSize() === 'full'"
                        class="p-2 rounded bg-black/50 text-gray-300 hover:text-white backdrop-blur-md border border-white/10" 
                        title="Full Screen">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                    </button>
                 </div>

                 @if (getSafeUrl(selectedMovie.trailer)) {
                    <iframe [src]="getSafeUrl(selectedMovie.trailer)" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                 } @else {
                    <img [src]="selectedMovie.thumbnail" class="w-full h-full object-cover opacity-50">
                    <div class="absolute inset-0 flex items-center justify-center">
                       <p class="text-gray-400">Trailer unavailable</p>
                    </div>
                 }
              </div>

              <!-- Info Section -->
              @if (playerSize() !== 'full') {
                  <div 
                    class="overflow-y-auto bg-gray-800 transition-all duration-500 ease-in-out border-l border-gray-700"
                    [class.md:w-1/3]="playerSize() === 'default'"
                    [class.md:w-[25%]]="playerSize() === 'cinema'"
                    [class.w-full]="playerSize() !== 'full'"
                    [class.p-8]="playerSize() !== 'cinema'"
                    [class.p-6]="playerSize() === 'cinema'">
                    
                     <h2 class="font-bold mb-2" [class.text-3xl]="playerSize() !== 'cinema'" [class.text-xl]="playerSize() === 'cinema'">{{selectedMovie.name}}</h2>
                     
                     <div class="flex items-center gap-3 mb-6">
                       <span class="px-2 py-1 bg-gray-700 rounded text-sm font-medium">{{selectedMovie.ageRestriction}}</span>
                       <span class="flex items-center gap-1 text-yellow-400 font-bold">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          {{selectedMovie.imdbRating}}
                       </span>
                     </div>
                     
                     <div class="space-y-6">
                       <div>
                         <h3 class="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Synopsis</h3>
                         <p class="text-gray-300 leading-relaxed text-sm lg:text-base">{{selectedMovie.description}}</p>
                       </div>
                       
                       <div>
                         <h3 class="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Cast</h3>
                         <div class="space-y-3">
                           @for (char of selectedMovie.characters; track char.name) {
                             <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                                   @if(char.imageUrl) { <img [src]="char.imageUrl" class="w-full h-full object-cover"> }
                                   @else { <span class="text-xs">{{char.name.charAt(0)}}</span> }
                                </div>
                                <div class="min-w-0">
                                   <p class="font-medium text-white truncate">{{char.name}}</p>
                                   <p class="text-sm text-gray-400 truncate">{{char.role}}</p>
                                </div>
                             </div>
                           }
                         </div>
                       </div>
                     </div>

                     <button class="w-full mt-8 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-brand-600/20">
                        Book Tickets
                     </button>
                  </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class MoviesComponent {
  movieService = inject(MovieService);
  inboxService = inject(InboxService);
  sanitizer = inject(DomSanitizer);

  movies = toSignal(this.movieService.getMovies(), { initialValue: [] });
  activeTab = signal<'online' | 'cinema'>('online');
  playerSize = signal<'default' | 'cinema' | 'full'>('default');

  setPlayerSize(size: 'default' | 'cinema' | 'full') {
    this.playerSize.set(size);
  }

  // Computed (filtered) lists
  onlineFreeMovies = computed(() => this.movies().filter(m => (m.type === 'online' || !m.type) && (m.access === 'free' || !m.access)));
  onlinePaidMovies = computed(() => this.movies().filter(m => (m.type === 'online' || !m.type) && m.access === 'paid'));
  cinemaMovies = computed(() => this.movies().filter(m => m.type === 'cinema'));

  selectedMovie: Movie | null = null;

  // Access Code Logic
  showCodeModal = signal(false);
  otpSent = signal(false);
  pendingMovie: Movie | null = null;
  enteredCode = '';
  generatedCode = '';
  codeGeneratedAt: number | null = null;
  codeError = signal(false);

  onMovieClick(movie: Movie) {
    if (movie.access === 'paid') {
      this.startPaidFlow(movie);
    } else {
      this.openMovie(movie);
    }
  }

  startPaidFlow(movie: Movie) {
    this.pendingMovie = movie;
    this.otpSent.set(false);
    this.enteredCode = '';
    this.codeError.set(false);
    this.codeGeneratedAt = null;
    this.showCodeModal.set(true);
  }

  generateCode() {
    if (!this.pendingMovie) return;

    // Use centralized logic in InboxService
    this.generatedCode = this.inboxService.generateAndSendOtp(this.pendingMovie.name);
    this.codeGeneratedAt = Date.now();

    this.otpSent.set(true);
  }

  verifyCode() {
    // Check for expiration (2 minutes)
    if (this.codeGeneratedAt && (Date.now() - this.codeGeneratedAt > 2 * 60 * 1000)) {
      this.codeError.set(true);
      // Optional: Reset code to force regeneration if expired, 
      // or just show error and let user decide. 
      // Showing error is safer, user can click cancel and "Get Access Code" again if we reset properly.
      return;
    }

    if (this.enteredCode === this.generatedCode) {
      this.showCodeModal.set(false);
      this.openMovie(this.pendingMovie!);
      this.pendingMovie = null;
    } else {
      this.codeError.set(true);
    }
  }

  closeCodeModal() {
    this.showCodeModal.set(false);
    this.pendingMovie = null;
  }

  openMovie(movie: Movie) {
    this.selectedMovie = movie;
  }

  closeMovie() {
    this.selectedMovie = null;
  }

  getSafeUrl(url: string): SafeResourceUrl | null {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
