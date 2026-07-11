import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { LoanDto } from "../../shared/models/loan.dto";
import { LoanListResponseDto } from "../../shared/models/loan-list-response.dto";
import { LoanDetailDto } from "../../shared/models/loan-detail.dto";
import { LoanCreateRequest } from "../../shared/models/loan-create-request.dto";
import { LoanCreateResponse } from "../../shared/models/loan-create.response.dto";

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private apiUrl = '/api/loans';

  constructor(private http: HttpClient) {}

  getLoans() {    
    return this.http.get<LoanListResponseDto>(this.apiUrl).pipe(map(response => response.loans));
  }

  getLoan(loanId: string) {
    return this.http.get<LoanDetailDto>(`${this.apiUrl}/${loanId}`);
  }

  createLoan(request: LoanCreateRequest) {
    return this.http.post<LoanCreateResponse>(this.apiUrl, request);
  }

}