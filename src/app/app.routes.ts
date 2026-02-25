import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guards';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'movies',
        loadComponent: () => import('./features/movies/movies.component').then(m => m.MoviesComponent)
    },
    {
        path: 'events',
        loadComponent: () => import('./features/events/events.component').then(m => m.EventsComponent)
    },
    {
        path: 'sports',
        loadComponent: () => import('./features/sports/sports.component').then(m => m.SportsComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [adminGuard]
    },
    { path: '**', redirectTo: '' }
];
