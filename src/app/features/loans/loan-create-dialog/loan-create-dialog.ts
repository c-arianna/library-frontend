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
import { LoanCreateDialogData } from './loan-create-dialog.model';
import { LoanCreateRequest } from '../../../shared/models/loan-create-request.dto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-loan-create-dialog',
  standalone: true,
  templateUrl: './loan-create-dialog.html',
  styleUrl: './loan-create-dialog.scss',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe
  ]
})
export class LoanCreateDialogComponent {

  readonly form;

  readonly minDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  constructor(private fb: FormBuilder, private loanService: LoanService, private snackBar: MatSnackBar, 
    private dialogRef: MatDialogRef<LoanCreateDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: LoanCreateDialogData) {

    this.form = this.fb.nonNullable.group({

        isbn: [
          data.isbn,
          Validators.required
        ],

        startDate: [
          null as Date | null,
          Validators.required
        ],

        endDate: [
          {
            value: null as Date | null,
            disabled: true
          }
        ]

      });

    this.form.controls.startDate.valueChanges.subscribe(startDate => {

        if (!startDate) {
          this.form.controls.endDate.setValue(null);
          return;
        }

        const endDate = new Date(startDate);

        endDate.setDate(endDate.getDate() + 30);

        this.form.controls.endDate.setValue(endDate);

      });

  }

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const request: LoanCreateRequest = {
      isbn: value.isbn,
      startDate: this.toApiDate(value.startDate!),
      endDate: this.toApiDate(value.endDate!)
    };

    this.loanService.createLoan(request)
      .subscribe({

        next: () => {

          this.snackBar.open(
            'Prestito creato',
            'Chiudi',
            {
              duration: 3000
            }
          );

          this.dialogRef.close(true);

        },

        error: () => {

          this.snackBar.open(
            'Errore durante la creazione del prestito',
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
      isbn: this.data.isbn,
      startDate: null,
      endDate: null
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