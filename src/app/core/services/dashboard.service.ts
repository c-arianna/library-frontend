import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoanOverdueDto } from '../../shared/models/loan-overdue.dto';
import { UserLoanStatisticsDto } from '../../shared/models/user-loan-statistics.dto';
import { DailyLoanStatisticDto } from '../../shared/models/daily.loan.statistic.dto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = '/api/loans';

  private readonly http = inject(HttpClient);

  getOverdueLoans() {
    return this.http.get<LoanOverdueDto[]>(`${this.apiUrl}/dashboard/overdue`);
  }

  getUserLoanStatistics() {
    return this.http.get<UserLoanStatisticsDto[]>(`${this.apiUrl}/dashboard/overdue/statistics`);
  }

  getDailyLoanStatistics(from: string, to: string){
    return this.http.get<DailyLoanStatisticDto[]>(`${this.apiUrl}/dashboard/daily/statistics`, {params: {from, to}});
  }
  
}