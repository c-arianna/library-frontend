import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { mapError } from '../../../../shared/utils/error-mapper';
import { keycloak } from '../../../../core/auth/keycloak.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [
      ReactiveFormsModule,
      MatInputModule,
      MatButtonModule,
      MatFormFieldModule,
      MatCardModule
  ],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.scss']
})
export class RegisterPage {

  loading = false;
  error?: string;
  form;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
   this.form = this.fb.nonNullable.group({
       email: ['', [Validators.required, Validators.email]],
       firstName: ['', [Validators.required]],
       lastName: ['', [Validators.required]],
     password: ['', [Validators.required]]
   });

  }
  
  submit() {
    if (this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

   this.loading = true;
   this.error = undefined;

   const formValue = this.form.getRawValue();

   const request = {
    email: formValue.email,
    name: formValue.firstName,
    lastname: formValue.lastName,
    password: formValue.password
  };
  
  this.userService.register(request).subscribe({
      next: () => {
        keycloak.login();
      },
      error: (err) => {
        this.error = mapError(err?.error?.code);
        this.loading = false;
      }
    });

  }

  login() {
     keycloak.login({
       redirectUri: window.location.origin
     });
  }
}
