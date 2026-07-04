import { Component } from '@angular/core';
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

  constructor(private auth: AuthService) {}

  get username(): string {
    return this.auth.getUsername();
  }
}