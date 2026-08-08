import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BookRequestService } from '../../../core/services/book.request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateBookRequestDto } from '../../../shared/models/book.request.add.dto';
import { mapError } from '../../../shared/utils/error.mapper';

@Component({
  selector: 'app-book-request-add-dialog',
  imports: [ ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './book-request-add-dialog.html',
  styleUrl: './book-request-add-dialog.scss',
})
export class BookRequestAddDialog {

  form;

  readonly errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<BookRequestAddDialog>, 
    private bookRequestService: BookRequestService, private snackBar: MatSnackBar) {

    this.form = this.fb.nonNullable.group({
      author: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      isbn: [''],
      notes: ['']
    });

    this.form.valueChanges.subscribe(() => {
      this.errorMessage.set(null);
    });
  
  }

  submit() {
    
    if (this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);

    const formValue = this.form.getRawValue();

    const request :  CreateBookRequestDto = {
      isbn: formValue.isbn,
      author: formValue.author,
      title: formValue.title,
      notes: formValue.notes
    };

    this.bookRequestService.addBookRequest(request).subscribe({
        next: () => {

          this.snackBar.open(
            'Richiesta aggiunta con successo',
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
      error: err => {

        this.errorMessage.set(err instanceof Error ? err.message : mapError(err?.error?.code));

      }
    });
  }

  reset() {
    this.errorMessage.set(null);
    this.form.reset();
  }

  close() {
    this.dialogRef.close();
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

}
