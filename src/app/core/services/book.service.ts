import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AddBookRequest } from '../../shared/models/book.model';

export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:8080/books';

  constructor(private http: HttpClient) {}

  getBooks(filters?: any): Observable<Book[]> {
    let params: any = {};

    if (filters?.title){
      params.title = filters.title;
    }

    if (filters?.author){
      params.author = filters.author;
    }
    
    if (filters?.isbn){
      params.isbn = filters.isbn;
    }

    if (filters?.onlyAvailable !== undefined) {
      params.onlyAvailable = filters.onlyAvailable;
    }

    return this.http.get<{ books: Book[] }>(this.apiUrl, { params }).pipe(map(response => response.books));
  }

  addBook(book: AddBookRequest) {
   return this.http.post(this.apiUrl, book);
  }

}