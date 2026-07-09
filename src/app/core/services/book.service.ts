import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AddBookRequestDto } from '../../shared/models/book-registered-request.dto';
import { BookFiltersDto } from '../../shared/models/book-filters.dto';
import { BookDto } from '../../shared/models/book.dto';
import { BookListResponseDto } from '../../shared/models/book-list-response.dto';
import { AddBookResponseDto } from '../../shared/models/book-registered-response.dto';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = '/api/books';

  constructor(private http: HttpClient) {}

  getBooks(filters?: BookFiltersDto): Observable<BookDto[]> {

    let params = new HttpParams();

    if (filters?.title) {
      params = params.set('title', filters.title);
    }

    if (filters?.author) {
      params = params.set('author', filters.author);
    }

    if (filters?.isbn) {
      params = params.set('isbn', filters.isbn);
    }

    if (filters?.onlyAvailable !== undefined) {
      params = params.set('onlyAvailable', String(filters.onlyAvailable));
    }

    return this.http.get<BookListResponseDto>(this.apiUrl, { params }).pipe(map(response => response.books));
  }

  addBook(book: AddBookRequestDto) {
   return this.http.post<AddBookResponseDto>(this.apiUrl, book);
  }

}