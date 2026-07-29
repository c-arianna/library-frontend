import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoanService } from '../../../core/services/loan.service';
import { LoanReturnDialogData } from './loan-return-dialog.model';
import { LoanReturnRequest } from '../../../shared/models/loan-return-request.dto';

@Component({
  selector: 'app-loan-create-dialog',
  standalone: true,
  templateUrl: './loan-return-dialog.html',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class LoanReturnDialogComponent {

  readonly form;

  constructor(private fb: FormBuilder, private loanService: LoanService, private snackBar: MatSnackBar, 
    private dialogRef: MatDialogRef<LoanReturnDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: LoanReturnDialogData) {

    this.form = this.fb.nonNullable.group({

        loanId: [
          data.loanId,
          Validators.required
        ],

        returnDate: [
          null as Date | null,
          Validators.required
        ],

      });

  }

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const request: LoanReturnRequest = {
      returnAt: this.toApiDate(value.returnDate!)
    };

    this.loanService.returnLoan(value.loanId, request)
      .subscribe({

        next: () => {

          this.snackBar.open(
            'Reso registrato con successo',
            'Chiudi',
            {
              duration: 3000
            }
          );

          this.dialogRef.close(true);

        },

        error: () => {

          this.snackBar.open(
            'Errore durante la regsitrazione del reso',
            'Chiudi',
            {
              duration: 3000
            }
          );

        }

      });

  }

  reset() {
    this.form.reset({
      loanId: this.data.loanId,
      returnDate: null
    });

  }

  close() {
    this.dialogRef.close(false);
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  private toApiDate(date: Date) {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }

}