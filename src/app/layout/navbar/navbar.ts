import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { HasRoleDirective } from '../../core/directives/has.role';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, HasRoleDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {

  private readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);

  menuOpen = false;

  get username(): string {
    return this.auth.getUsername();
  }

  logout() {
    this.auth.logout();
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
  
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

}
