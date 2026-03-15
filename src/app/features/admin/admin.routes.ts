import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminDashboardComponent
    },
    {
        path: 'movies',
        loadComponent: () => import('./pages/admin-movies/admin-movies.component').then(m => m.AdminMoviesComponent)
    },
    {
        path: 'users',
        loadComponent: () => import('./pages/admin-users/admin-users.component').then(m => m.AdminUsersComponent)
    }
];

