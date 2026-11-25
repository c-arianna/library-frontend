import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SimilarBookDto } from '../../shared/models/similar-book.dto';
import { SimilarBooksResult } from '../../shared/models/similar-books-response.dto';
import { ReadingJourneyResult } from '../../shared/models/reading-journey.response.dto';
import { RecommendedBook } from '../../shared/models/recommended.book.dto';
import { RecommendationExplanation } from '../../shared/models/recommendation.explanation.dto';

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

  getRecommendedBooks() : Observable<RecommendedBook[]>{
    return this.http.get<RecommendedBook[]>(`${this.apiUrl}/recommendation`);
  }

  explainRecommendation(isbn: string){
    return this.http.get<RecommendationExplanation>(`${this.apiUrl}/recommendations/explain/${isbn}`);
  }

}