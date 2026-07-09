import { Component, inject } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { BooksStore } from '../books.store';
import { HasRoleDirective } from '../../../core/directives/has.role';

@Component({
  selector: 'app-book-detail',
  imports: [HasRoleDirective],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
})
export class BookDetail {
  
  private route = inject(ActivatedRoute);

  constructor(public store: BooksStore) {

    const isbn = this.route.snapshot.paramMap.get('isbn');

    if (isbn) {
      this.store.loadBook(isbn);
    }

  }

}
