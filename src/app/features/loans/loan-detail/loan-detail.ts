import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LoansStore } from '../loans.store';
import { HasRoleDirective } from '../../../core/directives/has.role';
import { DatePipe } from '@angular/common';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { LoanReturnDialogComponent } from '../loan-return-dialog/loan-return-dialog';
import { LoanReturnDialogData } from '../loan-return-dialog/loan-return-dialog.model';

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

  private readonly dialog = inject(MatDialog);

  ngOnInit() {

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
      loan.book.isbn
    ]);

  }

  confirmLoan() {
    this.openConfirmDialog('Conferma prestito', 'Vuoi confermare il prestito?', 'Conferma', 
              () => {
                  const loan = this.store.selectedLoan();
                  if(!loan){
                    return;
                  }
                  this.store.confirmLoan(loan.id);
                }
        );
  
  }

  cancelLoan() {
     this.openConfirmDialog('Annulla prestito', 'Vuoi annullare il prestito?', 'Annulla Prestito', 
              () => {
                  const loan = this.store.selectedLoan();
                  if(!loan){
                    return;
                  }
                  this.store.cancelLoan(loan.id);
                }
        );
  }

  returnLoan() {

    const loan = this.store.selectedLoan();
    
    if (!loan) {
      return;
    }
    
    this.dialog.open(LoanReturnDialogComponent,
      {
        width: '420px',
        panelClass: 'custom-dialog',
        data: {
            loanId: loan.id
        } satisfies LoanReturnDialogData
      }
    );

  }

  private openConfirmDialog(title: string, message: string, confirmLabel: string, action: () => void) {

    this.dialog.open(ConfirmDialogComponent,
        {
          panelClass: 'custom-dialog',
          data: {
            title,
            message,
            confirmLabel
          }
        }
      )
      .afterClosed()
      .subscribe(result => {

        if (result) {
          action();
        }

      });
  }

  get overdueMessage() {
    const loan = this.store.selectedLoan();
    const days = loan ? loan.daysOverdue : 0;
    return days === 1 ? 'Prestito scaduto da 1 giorno.' : `Prestito scaduto da ${days} giorni.`;
  }

}