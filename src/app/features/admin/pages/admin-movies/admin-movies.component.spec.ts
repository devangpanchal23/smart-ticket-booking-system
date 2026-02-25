import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminMoviesComponent } from './admin-movies.component';
import { MovieService } from '../../../../core/services/movie.service';
import { AdminService } from '../../../../core/services/admin.service';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Movie } from '../../../../core/models/movie.model';
import { vi } from 'vitest';

describe('AdminMoviesComponent', () => {
    let component: AdminMoviesComponent;
    let fixture: ComponentFixture<AdminMoviesComponent>;
    let mockMovieService: any;
    let mockAdminService: any;

    // Helper to create a valid movie object
    const createMockMovie = (): Movie => ({
        id: 'test-id',
        name: 'Inception',
        thumbnail: 'https://example.com/img.jpg',
        trailer: 'https://youtube.com/v/123',
        description: 'A dream within a dream',
        ageRestriction: 'PG-13',
        imdbRating: 5.0,
        characters: [{ name: 'Leo', role: 'Cobb', imageUrl: '' }],
        createdAt: new Date()
    });

    beforeEach(async () => {
        // Setup Service Mocks
        mockMovieService = {
            getMovies: () => of([]),
            addMovie: () => of('new-id'),
            updateMovie: () => of(void 0),
            deleteMovie: () => of(void 0)
        };

        mockAdminService = {
            logout: () => { }
        };

        await TestBed.configureTestingModule({
            imports: [AdminMoviesComponent, NoopAnimationsModule],
            providers: [
                provideRouter([]),
                { provide: MovieService, useValue: mockMovieService },
                { provide: AdminService, useValue: mockAdminService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminMoviesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    describe('Form Handling', () => {
        it('should initialize form with default values', () => {
            expect(component.movieForm).toBeDefined();
            expect(component.characters.length).toBe(0);
            expect(component.showForm).toBe(false);
        });

        it('should validate required fields', () => {
            component.openAddForm();
            component.onSubmit();
            expect(component.movieForm.invalid).toBe(true);
            expect(component.movieForm.get('name')?.errors?.['required']).toBe(true);
        });

        it('should add character to form array', () => {
            component.openAddForm();
            component.addCharacter('John', 'Hero');

            expect(component.characters.length).toBe(1);
            const charGroup = component.characters.at(0);
            expect(charGroup.get('name')?.value).toBe('John');
            expect(charGroup.get('role')?.value).toBe('Hero');
        });

        it('should remove character from form array', () => {
            component.openAddForm();
            component.addCharacter();
            component.removeCharacter(0);
            expect(component.characters.length).toBe(0);
        });

        it('should populate form when opening edit mode', () => {
            const movie = createMockMovie();
            component.openEditForm(movie);

            expect(component.isEditing).toBe(true);
            expect(component.currentMovieId).toBe(movie.id);
            expect(component.movieForm.get('name')?.value).toBe(movie.name);
            expect(component.characters.length).toBe(1);
            expect(component.showForm).toBe(true);
        });

        it('should reset form properly', () => {
            component.openAddForm();
            component.movieForm.get('name')?.setValue('Dirty Data');
            component.addCharacter();

            component.closeForm();
            component.openAddForm(); // Should trigger reset

            expect(component.movieForm.get('name')?.value).toBe(null);
            expect(component.characters.length).toBe(0);
        });
    });

    describe('Data Operations', () => {
        it('should call verify logic is called on add movie', () => {
            // Mock addMovie spy
            const spy = vi.spyOn(mockMovieService, 'addMovie');

            component.openAddForm();
            component.movieForm.patchValue({
                name: 'New Movie',
                thumbnail: 'url',
                trailer: 'url',
                description: 'desc',
                ageRestriction: 'PG',
                imdbRating: 5
            });

            component.onSubmit();

            expect(spy).toHaveBeenCalled();
            expect(component.showForm).toBe(false);
        });

        it('should handle errors during save', () => {
            const errorMsg = 'Network Error';
            mockMovieService.addMovie = () => throwError(() => new Error(errorMsg));

            component.openAddForm();
            component.movieForm.patchValue(createMockMovie());

            component.onSubmit();

            expect(component.errorMessage()).toContain(errorMsg);
            expect(component.isSubmitting()).toBe(false);
            // Form should remain open on error
            expect(component.showForm).toBe(true);
        });

        it('should call updateMovie when editing', () => {
            const spy = vi.spyOn(mockMovieService, 'updateMovie');
            const movie = createMockMovie();

            component.openEditForm(movie);
            component.onSubmit(); // Save without changes

            expect(spy).toHaveBeenCalled();
            const payload = spy.mock.calls[0][0] as any;
            expect(payload.id).toBe(movie.id);
        });
    });
});
