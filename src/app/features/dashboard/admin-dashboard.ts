import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoanOverdueDto } from '../../shared/models/loan-overdue.dto';
import { DashboardService } from '../../core/services/dashboard.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { Subscription } from 'rxjs';
import { LoanUpdatedPayloadEventDto } from '../../shared/models/events/loan-updated-payload-event.dto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ RouterLink, DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {

  private wsSub?: Subscription;

  readonly overdueLoans = signal<LoanOverdueDto[]>([]);

  readonly loading = signal(false);

  readonly error = signal<string | undefined>(undefined);

  constructor(private dashboardService: DashboardService, private notificationService: NotificationService) {
    this.startRealtimeUpdates();
  }

  ngOnInit(): void {
    this.loadOverdueLoans();
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

    this.loading.set(true);
    this.error.set(undefined);

    this.dashboardService.getOverdueLoans()
      .subscribe({
        next: loans => {
          this.overdueLoans.set(loans);
          this.loading.set(false);
        },
        error: err => {
          this.error.set(
            err?.message ?? 'Errore durante il caricamento dei prestiti scaduti'
          );

          this.loading.set(false);
        }
      });
  }

  hasOverdueLoans(): boolean {
    return this.overdueLoans().length > 0;
  }

}
