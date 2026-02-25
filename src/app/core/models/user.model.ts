// Removed unused RxJS Timestamp import

export interface UserProfile {
    uid: string;
    email: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    photoURL?: string;
    gender?: string;
    age?: number;
    mobile?: string;
    role: 'user' | 'admin';
    createdAt: Date | string | number;
}

export interface Event {
    eventId: string;
    title: string;
    category: 'movie' | 'sports' | 'event' | 'consultancy';
    city: string;
    price: number;
    date: Date | string | number;
    imageUrl: string;
    status: 'active' | 'cancelled' | 'draft';
    description?: string;
    createdAt: Date | string | number;
}
