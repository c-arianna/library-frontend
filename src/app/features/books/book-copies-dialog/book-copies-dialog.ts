import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookService } from '../../../core/services/book.service';
import {BookCopiesDialogData } from './book-copies-dialog.model';
import { BookAddCopiesRequest } from '../../../shared/models/book-add-copies-request.dto';
import { BookRemoveCopiesRequest } from '../../../shared/models/book-remove-copies-request.dto';

@Component({
  selector: 'app-book-copies-dialog',
  standalone: true,
  templateUrl: './book-copies-dialog.html',
  styleUrl: './book-copies-dialog.scss',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class BookCopiesDialogComponent {

  readonly form;

  constructor(private fb: FormBuilder, private bookService: BookService, private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<BookCopiesDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: BookCopiesDialogData) {

    this.form =
      this.fb.nonNullable.group({
        quantity: [
          1,
          [
            Validators.required,
            Validators.min(1)
          ]
        ],
        reason: ['']
      });

    if (data.operation === 'REMOVE') {
      this.form.controls.quantity.addValidators(Validators.max(data.availableCopies));
      this.form.controls.quantity.updateValueAndValidity();
    }

  }

  get isRemove() {
    return this.data.operation === 'REMOVE';
  }

  get title() {
    return this.isRemove ? 'Rimuovi copie' : 'Aggiungi copie';
  }

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const addRequest : BookAddCopiesRequest = {quantity: value.quantity};
    const removeRequest : BookRemoveCopiesRequest = {quantity: value.quantity, reason: value.reason};

    const request$ = this.isRemove ? this.bookService.removeCopies(this.data.isbn, removeRequest) 
          : this.bookService.addCopies(this.data.isbn, addRequest);

    request$.subscribe({

        next: () => {

          this.snackBar.open(
            'Operazione avviata',
            'Chiudi',
            {
              duration: 3000
            }
          );

          this.dialogRef.close(true);

        },

        error: () => {

          this.snackBar.open(
            'Errore durante il salvataggio',
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
      quantity: 1,
      reason: ''
    });

  }

  close() {
    this.dialogRef.close(false);
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && ( control.dirty || control.touched));
  }

}