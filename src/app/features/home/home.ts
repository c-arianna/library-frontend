import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

  private readonly auth = inject(AuthService);
  
  readonly isReader = this.auth.hasRole('ROLE_READER');

  readonly isLibrarian = this.auth.hasRole('ROLE_LIBRARIAN');

  readonly isAdmin = this.auth.hasRole('ROLE_ADMIN');

  get name(): string {
    return this.auth.getName();
  }
}