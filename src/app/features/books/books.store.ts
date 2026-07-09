import {Injectable, computed, signal} from '@angular/core';

import { Subscription } from 'rxjs';

import { BookDto } from '../../shared/models/book.dto';
import { BookFiltersDto } from '../../shared/models/book-filters.dto';
import { BookRegisteredEventDto } from '../../shared/models/events/book-registered-event.dto';
import { BookService } from '../../core/services/book.service';
import { NotificationService } from '../../core/services/notification.service';
import { mapRegisteredEventToBook } from '../../shared/mapper/book.mapper';

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

  readonly filteredBooks =
    computed(() => {

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

  constructor(private bookService: BookService, private notificationService: NotificationService) {}

  loadBooks() {
    this.bookService.getBooks().subscribe(books => { this.books.set(books); });

  }

  startRealtimeUpdates() {

    if (this.wsSub) {
      return;
    }

    this.wsSub = this.notificationService.messages().subscribe(event => {

          if (event.eventType === 'BOOK_REGISTERED') {

            const payload = event.payload as BookRegisteredEventDto;

            const book = mapRegisteredEventToBook(payload)

            this.books.update(list => {

              const exists = list.some(b => b.isbn === book.isbn);

              return exists ? list : [book, ...list];

            });

          }

        });

  }

  stopRealtimeUpdates() {
    this.wsSub?.unsubscribe();
    this.wsSub = undefined;
  }

  updateFilter<K extends keyof BookFiltersDto>(field: K, value: BookFiltersDto[K]) {

    this.filters.update(filters => ({
        ...filters,
        [field]: value
      })
    );

  }

  clearFilters() {

    this.filters.set({
      title: '',
      author: '',
      isbn: '',
      onlyAvailable: false
    });

  }

}