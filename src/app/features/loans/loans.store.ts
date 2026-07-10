import { computed, Injectable, signal } from "@angular/core";
import { LoanDto } from "../../shared/models/loan.dto";
import { LoanFiltersDto } from "../../shared/models/loan-filters.dto";
import { LoanService } from "../../core/services/loan.service";
import { BaseFeatureStore } from "../../core/store/base-feature.store";
import { LoanStatus } from "../../shared/models/loan-status.dto";
import { Router } from "@angular/router";
import { LoanDetailDto } from "../../shared/models/loan-detail.dto";

@Injectable({
  providedIn: 'root'
})
export class LoansStore extends BaseFeatureStore {

  readonly loans = signal<LoanDto[]>([]);

  readonly selectedLoan = signal<LoanDetailDto | null>(null);

  readonly filters = signal<LoanFiltersDto>({
    isbn: '',
    status: undefined,
    userId: ''
  });

  readonly filteredLoans = computed(() => {

    const loans = this.loans();
    const filters = this.filters();

    return loans.filter(loan => {

      const matchIsbn = !filters.isbn || loan.isbn.includes(filters.isbn);
      const matchStatus = !filters.status || loan.status === filters.status;
      const matchUserId = !filters.userId || loan.userId.includes(filters.userId);

      return matchIsbn && matchStatus && matchUserId;

    });

  });

  constructor(private loanService: LoanService, private router: Router) {
    super();
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
      userId: ''
    });

    this.router.navigate(['/loans']);
    
  }

  updateStatusFilter(value: string) {
    this.updateFilter('status', value === '' ? undefined : value as LoanStatus);
  }
    
}