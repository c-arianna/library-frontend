import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {

  menuOpen = false;

  constructor(private auth: AuthService, public theme: ThemeService) {}

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
