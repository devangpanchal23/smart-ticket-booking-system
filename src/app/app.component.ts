import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-primary-50 text-primary-900 font-sans selection:bg-brand-500 selection:text-white">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  title = 'smart-ticket';
}
