import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoanOverdueDto } from '../../shared/models/loan-overdue.dto';
import { DashboardService } from '../../core/services/dashboard.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { Subscription } from 'rxjs';
import { LoanUpdatedPayloadEventDto } from '../../shared/models/events/loan-updated-payload-event.dto';
import { UserLoanStatisticsDto } from '../../shared/models/user-loan-statistics.dto';
import { RiskLevel } from '../../shared/models/risk-level.dto';
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import { DailyLoanStatisticDto } from '../../shared/models/daily.loan.statistic.dto';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ RouterLink, DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('loanChart')
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  private wsSub?: Subscription;

  readonly overdueLoans = signal<LoanOverdueDto[]>([]);

  readonly userLoanStatistics = signal<UserLoanStatisticsDto[]>([]);

  readonly dailyLoanStatistics = signal<DailyLoanStatisticDto[]>([]);

  readonly selectedDays = signal(30);

  readonly overdueLoansState = signal({
    loading: false,
    error: null as string | null
  });

  readonly statisticsState = signal({
    loading: false,
    error: null as string | null
  });

  constructor(private dashboardService: DashboardService, private notificationService: NotificationService) {
    this.startRealtimeUpdates();
  }

  ngOnInit(): void {
    this.loadOverdueLoans();
    this.loadStatistics();
  }

  ngAfterViewInit() {
    this.loadDailyLoanStatistics();
  }

  startRealtimeUpdates() {

    if (this.wsSub) {
      return;
    }

    this.wsSub = this.notificationService.messages().subscribe(event => {

      if (event.eventType !== 'LOAN_UPDATED') {
        return;
      }

      this.handleLoanUpdated(event.payload);
     
    });

  }

  private handleLoanUpdated(payload: LoanUpdatedPayloadEventDto){
      this.updateLoansOverdue(payload);
  }

 private updateLoansOverdue(payload: LoanUpdatedPayloadEventDto) {

  this.overdueLoans.update(loans => {

    if (payload.status === 'RETURNED') {
      return loans.filter(loan => loan.loanId !== payload.loanId
      );
    }

    if (!payload.overdue) {
      return loans.filter(loan => loan.loanId !== payload.loanId
      );
    }

    const updatedLoan = this.mapNotificationToLoan(payload);

    const exists = loans.some(loan => loan.loanId === payload.loanId);

    if (!exists) {
      return [
        updatedLoan,
        ...loans
      ];
    }

    return loans.map(loan => loan.loanId === payload.loanId ? updatedLoan : loan);
    
  });
}

  private mapNotificationToLoan(payload: LoanUpdatedPayloadEventDto) : LoanOverdueDto {

    return {
      loanId: payload.loanId,
      isbn: payload.isbn,
      userId: payload.userId,
      cardNumber: payload.cardNumber,
      dueDate: payload.endDate,
      daysOverdue: payload.daysOverdue
    }
  }

  loadOverdueLoans() {

    this.overdueLoansState.set({loading: true, error: null});
    
    this.dashboardService.getOverdueLoans()
      .subscribe({
        next: loans => {
          this.overdueLoans.set(loans);
          this.overdueLoansState.set({loading: false, error: null});
        },
        error: err => {
          this.overdueLoansState.set({loading: false, error: err?.message ?? 'Errore durante il caricamento dei prestiti scaduti'});
        }
      });
  }

  loadStatistics() {

    this.statisticsState.set({loading: true, error: null});
   
    this.dashboardService.getUserLoanStatistics()
      .subscribe({
        next: statistic => {
          this.userLoanStatistics.set(statistic);
          this.statisticsState.set({loading: false, error: null});
        },
        error: err => {
          this.statisticsState.set({loading: false, error: err?.message ?? 'Errore durante il caricamento delle statistiche'});
        }
      });
  }

  hasOverdueLoans(): boolean {
    return this.overdueLoans().length > 0;
  }

  hasStatistics(): boolean {
    return this.userLoanStatistics().length > 0;
  }

  mapRiskToDescription(riskLevel : RiskLevel){

    switch(riskLevel){
      case 'HIGH': return "Alto"
      case 'MEDIUM': return "Medio"
      case 'LOW': return "Basso"
    }
  }

  loadDailyLoanStatistics(days: number = 30) {

    this.selectedDays.set(days);

    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);

    this.dashboardService.getDailyLoanStatistics(this.toIsoDate(from), this.toIsoDate(to))
      .subscribe({
          next: statistics => {
            this.dailyLoanStatistics.set(statistics);
            this.createChart(statistics);
          },
          error: error => {
            console.error(error);
          }

    });

  }

  private createChart(statistics: DailyLoanStatisticDto[]) {

    if (this.chart) {
      this.chart.destroy();
    }
    
    this.chart = new Chart(this.chartCanvas.nativeElement, {

      type: 'line',

      data: {

        labels: statistics.map(d => d.statisticDate),

          datasets: [

            {
              label: 'Creati',
              data: statistics.map(d => d.loansCreated),
              borderColor: '#b8860b',
              tension: 0.3
            },

            {
              label: 'Confermati',
              data: statistics.map(d => d.loansConfirmed),
              borderColor: '#2e7d32',
              tension: 0.3
            },

            {
              label: 'Annullati',
              data: statistics.map(d => d.loansCanceled),
              borderColor: '#d32f2f',
              tension: 0.3
            },

            {
              label: 'Restituiti',
              data: statistics.map(d => d.loansReturned),
              borderColor: '#1976d2',
              tension: 0.3
            }

          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }

    });

  }

  private toIsoDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

}
