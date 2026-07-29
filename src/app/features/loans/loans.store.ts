import { computed, Injectable, signal } from "@angular/core";
import { LoanDto } from "../../shared/models/loan.dto";
import { LoanFiltersDto } from "../../shared/models/loan-filters.dto";
import { LoanService } from "../../core/services/loan.service";
import { BaseFeatureStore } from "../../core/store/base-feature.store";
import { LoanStatus } from "../../shared/models/loan-status.dto";
import { Router } from "@angular/router";
import { LoanDetailDto } from "../../shared/models/loan-detail.dto";
import { Subscription } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { LoanUpdatedPayloadEventDto } from "../../shared/models/events/loan-updated-payload-event.dto";
import { mapLoanNotificationToDetail, mapLoanNotificationToLoan } from "../../shared/models/events/mapper/loan-updated-event-mapper.dto";

@Injectable({
  providedIn: 'root'
})
export class LoansStore extends BaseFeatureStore {

  private wsSub?: Subscription;
  
  readonly loans = signal<LoanDto[]>([]);

  readonly selectedLoan = signal<LoanDetailDto | null>(null);

  readonly filters = signal<LoanFiltersDto>({
    isbn: '',
    status: undefined,
    userId: '',
    cardNumber: ''
  });

  readonly filteredLoans = computed(() => {

    const loans = this.loans();
    const filters = this.filters();

    return loans.filter(loan => {

      const matchIsbn = !filters.isbn || loan.isbn.includes(filters.isbn);
      const matchStatus = !filters.status || loan.status === filters.status;
      const matchUserId = !filters.userId || loan.userId.includes(filters.userId);
      const matchCardNumber = !filters.cardNumber || loan.cardNumber?.includes(filters.cardNumber);

      return matchIsbn && matchStatus && matchUserId && matchCardNumber;

    });

  });

  constructor(private loanService: LoanService, private router: Router, private notificationService: NotificationService) {
    super();
    this.startRealtimeUpdates();
  }

  loadLoans() {
    this.executeRequest(this.loanService.getLoans(), loans => this.loans.set(loans));
  }

  loadLoan(loanId: string) {
   this.executeRequest(this.loanService.getLoan(loanId), loan => this.selectedLoan.set(loan));
  }

  updateFilter<K extends keyof LoanFiltersDto>(field: K, value: LoanFiltersDto[K]){
    
    this.filters.update(filters => ({
      ...filters,
      [field]: value
    }));
    
  }
    
  clearFilters() {
    
    this.filters.set({
      isbn: '',
      status: undefined,
      userId: '',
      cardNumber: ""
    });

    this.router.navigate(['/loans']);
    
  }

  updateStatusFilter(value: string) {
    this.updateFilter('status', value === '' ? undefined : value as LoanStatus);
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
    this.updateLoanList(payload);
    this.updateLoanDetail(payload);
  }

  private updateLoanList(payload: LoanUpdatedPayloadEventDto) {

    this.loans.update(loans => {

      const exists = loans.some(loan => loan.id === payload.loanId);

      const updatedLoan = mapLoanNotificationToLoan(payload);

      if (!exists) {
        return [
          updatedLoan,
          ...loans
        ];

      }

      return loans.map(loan => loan.id === payload.loanId ? updatedLoan : loan);

    });

  }

  private updateLoanDetail(payload: LoanUpdatedPayloadEventDto) {
  
      const selectedLoan = this.selectedLoan();
  
      if (selectedLoan && selectedLoan.isbn === payload.isbn) {
        this.selectedLoan.set(mapLoanNotificationToDetail(payload));
      }
  
  }

  confirmLoan(loanId: string) {
    this.executeRequest(this.loanService.confirmLoan(loanId));
  }

  cancelLoan(loanId: string) {
    this.executeRequest(this.loanService.cancelLoan(loanId));
  }

}