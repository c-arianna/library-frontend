import {Injectable, computed, signal} from '@angular/core';

import { finalize, Observable, Subscription } from 'rxjs';

import { BookDto } from '../../shared/models/book.dto';
import { BookFiltersDto } from '../../shared/models/book-filters.dto';
import { BookRegisteredEventDto } from '../../shared/models/events/book-registered-event.dto';
import { BookService } from '../../core/services/book.service';
import { NotificationService } from '../../core/services/notification.service';
import { mapRegisteredEventToBook } from '../../shared/mapper/book.mapper';
import { BookDetailDto } from '../../shared/models/book-detail.dto';
import { mapError } from '../../shared/utils/error.mapper';

@Injectable({
  providedIn: 'root'
})
export class BooksStore {

  private wsSub?: Subscription;

  readonly books = signal<BookDto[]>([]);

  readonly filters = signal<BookFiltersDto>({
      title: '',
      author: '',
      isbn: '',
      onlyAvailable: false
    });

  readonly selectedBook = signal<BookDetailDto | null>(null);

  readonly loading = signal(false);

  readonly error = signal<string | null>(null);

  readonly filteredBooks = computed(() => {

      const books = this.books();
      const filters = this.filters();

      return books.filter(book => {

        const matchTitle =
          !filters.title ||
          book.title
            .toLowerCase()
            .includes(
              filters.title.toLowerCase()
            );

        const matchAuthor =
          !filters.author ||
          book.author
            .toLowerCase()
            .includes(
              filters.author.toLowerCase()
            );

        const matchIsbn =
          !filters.isbn ||
          book.isbn.includes(
            filters.isbn
          );

        const matchAvailable =
          !filters.onlyAvailable ||
          book.available;

        return (
          matchTitle &&
          matchAuthor &&
          matchIsbn &&
          matchAvailable
        );

      });

    });

  readonly detail = computed(() => {

      const book = this.selectedBook();

      if (!book) {
        return null;
      }

      const availableCopies = book.totalCopies - book.borrowedCopies - book.reservedCopies;

      return {
        ...book,
        availableCopies
      };

    });

  constructor(private bookService: BookService, private notificationService: NotificationService) {}
  
  private executeRequest<T>(request$: Observable<T>, onSuccess: (result: T) => void) {

    this.loading.set(true);
    this.error.set(null);

    request$.pipe(finalize(() => {
        this.loading.set(false);
      })
    ).subscribe({

      next: result => {
        onSuccess(result);
      },

      error: err => {
        this.error.set(mapError(err?.error?.code));
      }

    });

  }

  loadBooks() {
    this.executeRequest(this.bookService.getBooks(), books => this.books.set(books));
  }

  loadBook(isbn: string) {
    this.selectedBook.set(null);
    this.executeRequest(this.bookService.getBook(isbn), book => this.selectedBook.set(book));
  }

  startRealtimeUpdates(): void {

    if (this.wsSub) {
      return;
    }

    this.wsSub = this.notificationService.messages().subscribe(event => {

          if (event.eventType === 'BOOK_REGISTERED') {

            const payload = event.payload;

            const book = mapRegisteredEventToBook(payload);

            this.books.update(list => {

              const exists = list.some(b => b.isbn === book.isbn);

              return exists ? list : [book, ...list];

            });

          }

        });

  }

  stopRealtimeUpdates(): void {

    this.wsSub?.unsubscribe();

    this.wsSub = undefined;

  }

  updateFilter<K extends keyof BookFiltersDto>(field: K, value: BookFiltersDto[K]){

    this.filters.update(filters => ({
      ...filters,
      [field]: value
    }));

  }

  clearFilters(): void {

    this.filters.set({
      title: '',
      author: '',
      isbn: '',
      onlyAvailable: false
    });

  }

}