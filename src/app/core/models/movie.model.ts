export type MovieType = 'cinema' | 'online';
export type MovieAccess = 'free' | 'paid';

export interface Movie {
    id?: string;
    name: string;
    thumbnail: string;
    trailer: string;
    description: string;
    ageRestriction: string;
    imdbRating: number;
    characters: MovieCharacter[];
    createdAt?: any;
    type?: MovieType;   // Default 'online'
    access?: MovieAccess; // Default 'free'
}

export interface MovieCharacter {
    name: string;
    role: string; // e.g., 'Hero', 'Heroine', 'Villain', 'Director', etc.
    imageUrl?: string;
}
