import { Component, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LoanOverdueDto } from "../../../shared/models/loan-overdue.dto";
import { Subscription } from "rxjs";
import { DashboardService } from "../../../core/services/dashboard.service";
import { NotificationService } from "../../../core/services/notification.service";
import { LoanUpdatedPayloadEventDto } from "../../../shared/models/events/loan-updated-payload-event.dto";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-overdue-loans',
  standalone: true,
  imports: [ RouterLink, DatePipe],
  templateUrl: './overdue-loans.html',
  styleUrl: './overdue-loans.scss'
})
export class OverdueLoansComponent implements OnInit {

    readonly overdueLoans = signal<LoanOverdueDto[]>([]);

    readonly overdueLoansState = signal({
        loading: false,
        error: null as string | null
    });

    private wsSub?: Subscription;

    constructor(private dashboardService: DashboardService, private notificationService: NotificationService) {
        this.startRealtimeUpdates();
    }

    ngOnInit() {
        this.loadOverdueLoans();
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

    startRealtimeUpdates() {

        if (this.wsSub) {
        return;
        }

        this.wsSub = this.notificationService.messages().subscribe(event => {

            if (event.eventType !== 'LOAN_UPDATED') {
                return;
            }

            this.updateLoansOverdue(event.payload);
        
        });

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

    hasOverdueLoans(): boolean {
        return this.overdueLoans().length > 0;
    }

}