import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoanOverdueDto } from '../../shared/models/loan-overdue.dto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = '/api/loans';

  private readonly http = inject(HttpClient);

  getOverdueLoans() {
    return this.http.get<LoanOverdueDto[]>(`${this.apiUrl}/dashboard/overdue`);
  }
  
}