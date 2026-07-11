import { Component, inject } from "@angular/core";
import { ConfirmDialogData } from "./confirm-dialog-model";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  imports: [
    MatDialogModule,
    MatButtonModule
  ]
})
export class ConfirmDialogComponent {

  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

}