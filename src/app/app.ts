import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from './layout/navbar/navbar';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSnackBarModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  protected readonly title = signal('library-frontend');

  constructor(private auth: AuthService) {}

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
}
