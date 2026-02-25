import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot, CollectionReference, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private firestore = inject(Firestore);
    private moviesCollection!: CollectionReference;

    constructor() {
        this.moviesCollection = collection(this.firestore, 'movies');
    }

    getMovies(): Observable<Movie[]> {
        // Create an Observable that wraps the real-time snapshot listener
        return new Observable<Movie[]>(observer => {
            const q = query(this.moviesCollection, orderBy('createdAt', 'desc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const movies = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Movie[];
                observer.next(movies);
            }, (error) => {
                observer.error(error);
            });

            // Cleanup listener when unsubscribed
            return () => unsubscribe();
        });
    }

    addMovie(movie: Movie): Observable<string> {
        return new Observable<string>(observer => {
            // Explicitly map fields to ensure no undefined values are passed
            const payload = {
                name: movie.name || '',
                thumbnail: movie.thumbnail || '',
                trailer: movie.trailer || '',
                description: movie.description || '',
                ageRestriction: movie.ageRestriction || '',
                imdbRating: Number(movie.imdbRating) || 0,
                characters: (movie.characters || []).map(c => ({
                    name: c.name || '',
                    role: c.role || '',
                    imageUrl: c.imageUrl || ''
                })),
                createdAt: serverTimestamp(),
                type: movie.type || 'online',
                access: movie.access || 'free'
            };

            addDoc(this.moviesCollection, payload)
                .then(ref => {
                    observer.next(ref.id);
                    observer.complete();
                })
                .catch(err => observer.error(err));
        });
    }

    updateMovie(movie: Movie): Observable<void> {
        return new Observable<void>(observer => {
            const movieDocRef = doc(this.firestore, `movies/${movie.id}`);

            // Explicitly map fields for update
            const payload = {
                name: movie.name || '',
                thumbnail: movie.thumbnail || '',
                trailer: movie.trailer || '',
                description: movie.description || '',
                ageRestriction: movie.ageRestriction || '',
                imdbRating: Number(movie.imdbRating) || 0,
                characters: (movie.characters || []).map(c => ({
                    name: c.name || '',
                    role: c.role || '',
                    imageUrl: c.imageUrl || ''
                })),
                // maintain original createdAt or don't update it
                type: movie.type || 'online',
                access: movie.access || 'free'
            };

            updateDoc(movieDocRef, payload)
                .then(() => {
                    observer.next();
                    observer.complete();
                })
                .catch(err => observer.error(err));
        });
    }

    deleteMovie(id: string): Observable<void> {
        return new Observable<void>(observer => {
            const movieDocRef = doc(this.firestore, `movies/${id}`);

            deleteDoc(movieDocRef)
                .then(() => {
                    observer.next();
                    observer.complete();
                })
                .catch(err => observer.error(err));
        });
    }
}
