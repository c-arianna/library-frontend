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

export interface RejectBookRequestDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-book-request-reject-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './book-request-reject-dialog.html',
  styleUrl: './book-request-reject-dialog.scss'
})
export class BookRequestRejectDialogComponent {

  readonly data = inject<RejectBookRequestDialogData>(MAT_DIALOG_DATA);

  readonly dialogRef = inject(MatDialogRef<BookRequestRejectDialogComponent>);

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    reason: ['', Validators.maxLength(500)]
  });

  confirm() {

    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close({
      confirmed: true,
      reason: this.form.getRawValue().reason
    });

  }

}