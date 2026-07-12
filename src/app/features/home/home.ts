import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink } from '@angular/router';
import { HasRoleDirective } from '../../core/directives/has.role';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, HasRoleDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

  private readonly auth = inject(AuthService);
  
  get name(): string {
    return this.auth.getName();
  }
}