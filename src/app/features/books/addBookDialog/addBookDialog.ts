import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BookService } from '../../../core/services/book.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-book-dialog',
  standalone: true,
  templateUrl: './addBookDialog.html',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AddBookDialog {

  form;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddBookDialog>, private bookService: BookService,
    private snackBar: MatSnackBar) {

    this.form = this.fb.nonNullable.group({
      isbn: ['', Validators.required],
      author: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['']
    });
  }

  submit() {
    
    if (this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const request = {
      isbn: formValue.isbn,
      author: formValue.author,
      title: formValue.title,
      description: formValue.description
    };

    this.bookService.addBook(request).subscribe({
        next: () => {

          this.snackBar.open(
            'Libro aggiunto con successo',
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

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

}
