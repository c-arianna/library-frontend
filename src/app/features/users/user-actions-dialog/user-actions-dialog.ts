import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UserActionsDialogData } from './user-actions-dialog-model';
import { UserActionRequest } from '../../../shared/models/user-action-request.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-suspend-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './user-actions-dialog.html',
  styleUrl: './user-actions-dialog.scss'
})
export class UserActionsDialogComponent {

    readonly form;

    constructor(private fb: FormBuilder, private userService: UserService, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<UserActionsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserActionsDialogData){

        this.form = this.fb.nonNullable.group({reason: ['']});

    }
    
    get isSuspend(): boolean {
        return this.data.action === 'suspend';
    }

    submit() {

        const request: UserActionRequest = {
            userId: this.data.userId,
            reason: this.form.controls.reason.value
        };

        const operation = this.isSuspend ? this.userService.suspendUser(request) : this.userService.unsuspendUser(request);

        operation.subscribe({

            next: () => {
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
        this.form.reset();
    }

    close() {
        this.dialogRef.close(false);
    }

}