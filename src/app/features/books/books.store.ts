import {Injectable, computed, signal} from '@angular/core';

import { finalize, Observable, Subscription } from 'rxjs';

import { BookDto } from '../../shared/models/book.dto';
import { BookFiltersDto } from '../../shared/models/book-filters.dto';
import { BookUpdatedPayloadEventDto } from '../../shared/models/events/book-registered-payload-event.dto';
import { BookService } from '../../core/services/book.service';
import { NotificationService } from '../../core/services/notification.service';
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

  constructor(private bookService: BookService, private notificationService: NotificationService) {
    this.startRealtimeUpdates();
  }
  
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

  startRealtimeUpdates() {

    if (this.wsSub) {
      return;
    }

    this.wsSub = this.notificationService.messages().subscribe(event => {

      switch(event.eventType){

        case 'BOOK_UPDATED':
          this.handleBookUpdated(event.payload);
          break;
        }

    });

  }

  updateFilter<K extends keyof BookFiltersDto>(field: K, value: BookFiltersDto[K]){

    this.filters.update(filters => ({
      ...filters,
      [field]: value
    }));

  }

  clearFilters() {

    this.filters.set({
      title: '',
      author: '',
      isbn: '',
      onlyAvailable: false
    });

  }

  private handleBookUpdated(payload: BookUpdatedPayloadEventDto) {
    this.updateBookList(payload);
    this.updateSelectedBook(payload);
  }

  private updateBookList(payload: BookUpdatedPayloadEventDto) {

    const updatedBook: BookDto = {
      isbn: payload.isbn,
      title: payload.title,
      author: payload.author,
      available: payload.available
    };

    this.books.update(list => {

      const index = list.findIndex(book => book.isbn === payload.isbn);

      if (index === -1) {
        return [
          updatedBook,
          ...list
        ];

      }

      return list.map(book =>
        book.isbn === payload.isbn
          ? updatedBook
          : book
      );

    });

  }

  private updateSelectedBook(payload: BookUpdatedPayloadEventDto) {

    const selectedBook = this.selectedBook();

    if (selectedBook && selectedBook.isbn === payload.isbn) {
      this.selectedBook.set(payload);
    }

  }

}