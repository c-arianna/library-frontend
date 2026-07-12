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
import { UserUnsubscribeRequest } from '../../../shared/models/user-unsubscribed-request.dto';

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
    
    get title() {

        switch (this.data.action) {

            case 'suspend':
            return 'Sospendi utente';

            case 'unsuspend':
            return 'Riattiva utente';

            case 'unsubscribe':
            return 'Disiscrizione';

        }

    }

    get confirmLabel(): string {

        switch (this.data.action) {

            case 'suspend':
                return 'Sospendi';

            case 'unsuspend':
                return 'Riattiva';

            case 'unsubscribe':
                return 'Disiscriviti';

        } 

    }

    submit() {

        const reason = this.form.controls.reason.value;

        let operation;

        switch (this.data.action) {

            case 'suspend':
                operation = this.userService.suspendUser({userId: this.data.userId!, reason});
                break;

            case 'unsuspend':
                operation = this.userService.unsuspendUser({userId: this.data.userId!, reason});
                break;

            case 'unsubscribe':
                operation = this.userService.unsubscribe({reason});
                break;
        }

        operation.subscribe({

            next: () => {
                this.dialogRef.close({confirmed: true, action: this.data.action});
            },

            error: () => {

                this.snackBar.open("Errore durante l'operazione", 'Chiudi',
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