import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SimilarBookDto } from '../../shared/models/similar-book.dto';
import { SimilarBooksResult } from '../../shared/models/similar-books-response.dto';
import { ReadingJourneyResult } from '../../shared/models/reading-journey.response.dto';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  private apiUrl = '/api/assistant';

  constructor(private http: HttpClient) {}

  getSimilarBooks(isbn: string): Observable<SimilarBooksResult> {
    return this.http.get<SimilarBooksResult>(`${this.apiUrl}/books/${isbn}/similar`);
  }

  getReadingJouney(isbn: string): Observable<ReadingJourneyResult> {
    return this.http.get<ReadingJourneyResult>(`${this.apiUrl}/books/${isbn}/readingpath`);
  }

}