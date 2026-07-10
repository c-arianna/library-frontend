import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LoansStore } from '../loans.store';
import { HasRoleDirective } from '../../../core/directives/has.role';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [RouterLink, HasRoleDirective, DatePipe],
  templateUrl: './loan-detail.html',
  styleUrl: './loan-detail.scss'
})
export class LoanDetailComponent implements OnInit {

  readonly store = inject(LoansStore);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  readonly statusLabels = {
    PENDING: 'In attesa',
    CONFIRMED: 'Confermato',
    RESERVED: 'Prenotato',
    RETURNED: 'Restituito',
    FAILED: 'Fallito',
    CANCELED: 'Annullato'
  };

  ngOnInit(): void {

    const loanId = this.route.snapshot.paramMap.get('loanId');

    if (loanId) {
      this.store.loadLoan(loanId);
    }

  }

  openBookDetail(): void {

    const loan = this.store.selectedLoan();

    if (!loan) {
      return;
    }

    this.router.navigate([
      '/books',
      loan.isbn
    ]);

  }

}