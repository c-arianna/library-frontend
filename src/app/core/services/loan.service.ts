import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { LoanDto } from "../../shared/models/loan.dto";
import { LoanListResponseDto } from "../../shared/models/loan-list-response.dto";

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private apiUrl = '/api/loans';

  constructor(private http: HttpClient) {}

  getLoans(): Observable<LoanDto[]> {    
    return this.http.get<LoanListResponseDto>(this.apiUrl).pipe(map(response => response.loans));
  }

}