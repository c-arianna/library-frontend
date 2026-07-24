import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { mapError } from '../../../../shared/utils/error.mapper';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../../core/auth/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';

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

  readonly error = signal<string | null>(null);
  readonly loading = signal(false);
  
  form;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private auth: AuthService,
    public theme: ThemeService
  ) {
   this.form = this.fb.nonNullable.group({
       email: ['', [Validators.required, Validators.email]],
       firstName: ['', [Validators.required]],
       lastName: ['', [Validators.required]],
     password: ['', [Validators.required]]
   });

  }

  ngOnInit() {

    this.form.valueChanges.subscribe(() => {
      this.error.set(null);
    });

  }
  
  submit() {
    if (this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

   this.loading.set(true);
   this.error.set(null);

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
        this.error.set(mapError(err?.error?.code));
        this.loading.set(false);
      }
    });

  }

  login() {
     this.auth.login();
  }

  reset() {
    this.form.reset();
  }

}
