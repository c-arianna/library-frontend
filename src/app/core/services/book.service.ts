import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AddBookRequestDto } from '../../shared/models/book-registered-request.dto';
import { BookDto } from '../../shared/models/book.dto';
import { BookListResponseDto } from '../../shared/models/book-list-response.dto';
import { AddBookResponseDto } from '../../shared/models/book-registered-response.dto';
import { BookDetailDto } from '../../shared/models/book-detail.dto';
import { BookRemoveCopiesRequest } from '../../shared/models/book-remove-copies-request.dto';
import { BookAddCopiesRequest } from '../../shared/models/book-add-copies-request.dto';
import { BookSubscribeRequest } from '../../shared/models/book-subscribe-request.dto';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = '/api/books';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<BookDto[]> {
    return this.http.get<BookListResponseDto>(this.apiUrl).pipe(map(response => response.books));
  }

  addBook(book: AddBookRequestDto) {
   return this.http.post<AddBookResponseDto>(this.apiUrl, book);
  }

  getBook(isbn: string) {
    return this.http.get<BookDetailDto>(`${this.apiUrl}/${isbn}`);
  }

  addCopies(isbn: string, request: BookAddCopiesRequest) {
    return this.http.post(`${this.apiUrl}/${isbn}/copies/add`, request);
  }

  removeCopies(isbn: string, request : BookRemoveCopiesRequest) {
    return this.http.post(`${this.apiUrl}/${isbn}/copies/remove`, request);
  }

  subscribeBookAvailability(isbn: string, request: BookSubscribeRequest){
    return this.http.post(`${this.apiUrl}/${isbn}/subscription`, request);
  }
}