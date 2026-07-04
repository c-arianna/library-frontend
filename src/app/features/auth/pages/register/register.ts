import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { mapError } from '../../../../shared/utils/error.mapper';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
      ReactiveFormsModule,
      MatInputModule,
      MatButtonModule,
      MatFormFieldModule,
      MatCardModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterPage {

  loading = false;
  error?: string;
  form;
  isDark = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private auth: AuthService
  ) {
   this.form = this.fb.nonNullable.group({
       email: ['', [Validators.required, Validators.email]],
       firstName: ['', [Validators.required]],
       lastName: ['', [Validators.required]],
     password: ['', [Validators.required]]
   });

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      this.isDark = savedTheme === 'dark';
    } else {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.applyTheme();

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
        this.auth.login();
      },
      error: (err) => {
        this.error = mapError(err?.error?.code);
        this.loading = false;
      }
    });

  }

  login() {
     this.auth.login();
  }

  reset() {
    this.form.reset();
  }

  toggleTheme() {
    this.isDark = !this.isDark;

    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');

    this.applyTheme();
  }

  applyTheme() {
    document.body.classList.toggle('dark-theme', this.isDark);
    document.body.classList.toggle('light-theme', !this.isDark);
  }

}
