import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { BookService, Book } from '../../core/services/book.service';
import { AuthService } from '../../core/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { AddBookDialog } from './addBookDialog/addBookDialog';
import { MatDialog } from '@angular/material/dialog';
import { HasRoleDirective } from '../../core/directives/has.role';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [FormsModule, HasRoleDirective],
  templateUrl: './books.html',
  styleUrl: './books.scss'
})
export class BooksComponent implements OnInit, OnDestroy {

  books = signal<any[]>([]);

   filters = signal({
    title: '',
    author: '',
    isbn: '',
    onlyAvailable: false
  });

   filteredBooks = computed(() => {

    const f = this.filters();
    const list = this.books();

    return list.filter(book => {

      const matchTitle = !f.title || book.title.toLowerCase().includes(f.title.toLowerCase());

      const matchAuthor = !f.author || book.author.toLowerCase().includes(f.author.toLowerCase());

      const matchIsbn = !f.isbn || book.isbn.includes(f.isbn);

      const matchAvailable = !f.onlyAvailable || book.available;

      return matchTitle && matchAuthor && matchIsbn && matchAvailable;

    });

  });
  
  wsSub!: Subscription;

  constructor(private bookService: BookService, private auth: AuthService, private dialog: MatDialog, 
      private notificationService: NotificationService, private snackBar : MatSnackBar) {}

  ngOnInit() {

     this.bookService.getBooks({}).subscribe(data => {
      this.books.set(data);
    });
    
    this.wsSub = this.notificationService.messages().subscribe(event => {

      console.log('WS event:', event.eventType);

      if (event.eventType === 'BOOK_REGISTERED') {

        const book = event.payload;

        this.books.update(books => {
              const exists = books.some(b => b.isbn === book.isbn);
              return exists ? books : [book, ...books];
            });
      }

    });

  }

  updateFilters(field: string, value: any) {
    this.filters.update(f => ({
      ...f,
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
    if (this.wsSub) {
      this.wsSub.unsubscribe();
    }
  }

}