import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink} from '@angular/router';
import { BooksStore } from '../books.store';
import { HasRoleDirective } from '../../../core/directives/has.role';
import { MatDialog } from '@angular/material/dialog';
import { BookCopiesDialogComponent } from '../book-copies-dialog/book-copies-dialog';
import { BookCopiesDialogData } from '../book-copies-dialog/book-copies-dialog.model';

@Component({
  selector: 'app-book-detail',
  imports: [HasRoleDirective, RouterLink],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
})
export class BookDetail {
  
  private route = inject(ActivatedRoute);

  constructor(public store: BooksStore, private dialog: MatDialog) {

    const isbn = this.route.snapshot.paramMap.get('isbn');

    if (isbn) {
      this.store.loadBook(isbn);
    }

    this.store.startRealtimeUpdates();
  }

  openAddCopiesDialog() {

    const book = this.store.detail();

    if (!book) {
      return;
    }

    this.dialog.open(BookCopiesDialogComponent,
      {
        width: '500px',
        panelClass: 'custom-dialog',
        data: {
          isbn: book.isbn,
          availableCopies: book.availableCopies,
          operation: 'ADD'
        } satisfies BookCopiesDialogData
      }
    );

  }

  openRemoveCopiesDialog() {

    const book = this.store.detail();

    if (!book) {
      return;
    }

    this.dialog.open(BookCopiesDialogComponent,
      {
        width: '500px',
        panelClass: 'custom-dialog',
        data: {
          isbn: book.isbn,
          availableCopies: book.availableCopies,
          operation: 'REMOVE'
        } satisfies BookCopiesDialogData
      }
    );

  }



}
