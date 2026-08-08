import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookRequestDto } from '../../shared/models/book.request.dto';
import { BookRequestsStore } from './book.requests.store';
import { HasRoleDirective } from '../../core/directives/has.role';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookRequestAddDialog } from './book-request-add-dialog/book-request-add-dialog';

@Component({
  selector: 'app-book-requests',
  standalone: true,
  imports: [RouterLink, HasRoleDirective],
  templateUrl: './book.requests.html',
  styleUrl: './book.requests.scss'
})
export class BookRequestsComponent implements OnInit {

  readonly store = inject(BookRequestsStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  
  readonly statusLabels = {
    PENDING: 'In attesa',
    APPROVED: 'Approvata',
    REJECTED: 'Rigettata'
  };

  ngOnInit() {
    this.store.loadBookRequests();
  }

  openAddBookRequestDialog() {
  
    const dialogRef = this.dialog.open(BookRequestAddDialog, {
                                              width: '420px',
                                              panelClass: 'custom-dialog'
                                            });
  
    dialogRef.afterClosed().subscribe(result => {
  
      if (result) {
  
        this.snackBar.open('Richiesta in inserimento...', 'Chiudi', {
              duration: 2000
        });
  
      }
  
    });
  }

}