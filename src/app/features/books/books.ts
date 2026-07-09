import {Component, OnDestroy, OnInit} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AddBookDialog } from './addBookDialog/addBookDialog';
import { HasRoleDirective } from '../../core/directives/has.role';
import { BooksStore } from './books.store';
import { BookFiltersDto } from '../../shared/models/book-filters.dto';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [FormsModule, HasRoleDirective],
  templateUrl: './books.html',
  styleUrl: './books.scss'
})
export class BooksComponent implements OnInit, OnDestroy {
  
  constructor(public store: BooksStore, private dialog: MatDialog, private snackBar : MatSnackBar) {}

  ngOnInit() {

    this.store.loadBooks();
    this.store.startRealtimeUpdates();

  }

  clearFilters() {
    this.store.clearFilters();
  }
  
  openAddBookDialog() {

    const dialogRef = this.dialog.open(AddBookDialog, {
                                            width: '420px',
                                            panelClass: 'custom-dialog'
                                          });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        console.log('Libro creato → aggiornato da WebSocket');

        this.snackBar.open('Libro in inserimento...', 'Chiudi', {
            duration: 2000
        });

      }

    });
  }

  ngOnDestroy() {
    this.store.stopRealtimeUpdates();
  }

}