import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface BookRequestPriceDialogData {
  estimatedPrice: number | null;
  title: string;
}

@Component({
  selector: 'app-book-request-price-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './book-request-price-dialog.html',
  styleUrl: './book-request-price-dialog.scss'
})
export class BookRequestPriceDialogComponent {

  readonly data = inject<BookRequestPriceDialogData>(MAT_DIALOG_DATA);

  readonly dialogRef = inject(MatDialogRef<BookRequestPriceDialogComponent>);

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    estimatedPrice: [
      this.data.estimatedPrice ?? 0,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ]
  });

  save() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      estimatedPrice: this.form.getRawValue().estimatedPrice
    });

  }

  close() {
    this.dialogRef.close();
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

}