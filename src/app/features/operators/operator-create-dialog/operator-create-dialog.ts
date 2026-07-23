import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OperatorsStore } from '../operators.store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OperatorAddDto, OperatorRole } from '../../../shared/models/operator.add.dto';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-operator-create-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatOption,
    MatSelectModule
  ],
  templateUrl: './operator-create-dialog.html',
  styleUrl: './operator-create-dialog.scss'
})
export class OperatorCreateDialogComponent {

  readonly form;

  constructor(private fb: FormBuilder, private store: OperatorsStore, 
    private dialogRef: MatDialogRef<OperatorCreateDialogComponent>){

    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      name: [ '', Validators.required],
      lastname: ['', Validators.required],
      password: ['', [Validators.required]],
      role: this.fb.nonNullable.control<OperatorRole>('LIBRARIAN', Validators.required)
    });
  
  }
 
  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const request: OperatorAddDto = {
          email: value.email,
          lastname: value.lastname,
          name: value.name,
          password: value.password,
          role: value.role
        };

    this.store.createOperator(request, () => this.dialogRef.close(true));
  
  }

  close(): void {
    this.dialogRef.close(false);
  }

  reset() {
    this.form.reset();
  }
}

