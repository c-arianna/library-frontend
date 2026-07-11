import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink} from '@angular/router';
import { BooksStore } from '../books.store';
import { HasRoleDirective } from '../../../core/directives/has.role';
import { MatDialog } from '@angular/material/dialog';
import { BookCopiesDialogComponent } from '../book-copies-dialog/book-copies-dialog';
import { BookCopiesDialogData } from '../book-copies-dialog/book-copies-dialog.model';
import { LoanCreateDialogComponent } from '../../loans/loan-create-dialog/loan-create-dialog';
import { LoanCreateDialogData } from '../../loans/loan-create-dialog/loan-create-dialog.model';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-book-detail',
  imports: [HasRoleDirective, RouterLink],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
})
export class BookDetail implements OnInit {
   
  readonly store = inject(BooksStore);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit() {
    const isbn = this.route.snapshot.paramMap.get('isbn');
    if (isbn) {
      this.store.loadBook(isbn);
    }
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

  openLoans() {
    const book = this.store.detail();

    if (!book) {
      return;
    }

    this.router.navigate(
      ['/loans'],
      {
        queryParams: {
          isbn: book.isbn
        }
      }
    );
  }

  openLoanCreateDialog() {

    const book = this.store.detail();

    if (!book) {
      return;
    }

    this.dialog.open(LoanCreateDialogComponent,
      {
        width: '500px',
        panelClass: 'custom-dialog',
        data: {
          isbn: book.isbn
        } satisfies LoanCreateDialogData
      }
    );

  }

}
