import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BookService } from '../../../core/services/book.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookSubscriptionDialogData } from './book-subscription-dialog.model';

@Component({
  selector: 'app-book-subscription-dialog',
  standalone: true,
  templateUrl: './book-subscription-dialog.html',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class BookSubscriptionDialog {

  form;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<BookSubscriptionDialog>, private bookService: BookService,
    private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: BookSubscriptionDialogData) {

    this.form = this.fb.nonNullable.group({
      phoneNumber: ['', Validators.required],
      isbn: [data.isbn, Validators.required]
    });
  }

  submit() {
    
    if (this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const request = {
      phoneNumber: formValue.phoneNumber
    };

    this.bookService.subscribeBookAvailability(formValue.isbn, request).subscribe({
        next: () => {

          this.snackBar.open(
            'Notifica registrata con successo!',
            'Chiudi',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: 'success-snackbar'
            }
          );

        this.dialogRef.close(this.form.value);
      },
      error: () => {
        this.snackBar.open(
          'Errore durante il salvataggio',
          'Chiudi',
          { duration: 3000 }
        );
      }
    });
  }

  reset() {
    this.form.reset();
  }

  close() {
    this.dialogRef.close();
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }

}
