import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    isAdmin = signal<boolean>(false);

    constructor(private router: Router) {
        // Check if previously logged in (optional persistence for demo)
        const stored = localStorage.getItem('admin_auth');
        if (stored === 'true') {
            this.isAdmin.set(true);
        }
    }

    login(email: string, pass: string): boolean {
        if (email === 'admin@gmail.com' && pass === 'admin@123') {
            this.isAdmin.set(true);
            localStorage.setItem('admin_auth', 'true');
            return true;
        }
        return false;
    }

    logout() {
        this.isAdmin.set(false);
        localStorage.removeItem('admin_auth');
        this.router.navigate(['/']);
    }
}
