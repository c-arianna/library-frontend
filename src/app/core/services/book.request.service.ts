import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {  Observable } from "rxjs";
import { BookRequestDto } from "../../shared/models/book.request.dto";
import { BookRequestDetailDto } from "../../shared/models/book.request-detail.dto";
import { CreateBookRequestDto } from "../../shared/models/book.request.add.dto";
import { CreateBookRequestResponseDto } from "../../shared/models/book.request.add.response.dto";

@Injectable({
  providedIn: 'root'
})
export class BookRequestService {

  private apiUrl = '/api/books/requests';

  private readonly http = inject(HttpClient);

  getBookRequests() {
    return this.http.get<BookRequestDto[]>(this.apiUrl);
  }

  getBookRequestDetail(requestId: string){
    return this.http.get<BookRequestDetailDto>(`${this.apiUrl}/${requestId}`);
  }

  addBookRequest(bookRequest: CreateBookRequestDto) {
     return this.http.post<CreateBookRequestResponseDto>(this.apiUrl, bookRequest);
  }

  approveRequest(requestId: string) {
    return this.http.post<void>(`${this.apiUrl}/${requestId}/approve`, {});
  }

  voteRequest(requestId: string) {
    return this.http.post<void>(`${this.apiUrl}/${requestId}/vote`, {});
  }

  rejectRequest(requestId: string, reason: string) {
    return this.http.post<void>(`${this.apiUrl}/${requestId}/reject`, {reason});
  }

}