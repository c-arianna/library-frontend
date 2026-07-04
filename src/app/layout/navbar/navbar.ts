import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {

  menuOpen = false;
  isDark = false;

  constructor(private auth: AuthService) {}

  get username(): string {
    return this.auth.getUsername();
  }

  logout() {
    this.auth.logout();
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  toggleTheme() {
    this.isDark = !this.isDark;

    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');

    this.applyTheme();
  }
  
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit() {

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      this.isDark = savedTheme === 'dark';
    } else {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.applyTheme();
  }

  applyTheme() {
    document.body.classList.toggle('dark-theme', this.isDark);
    document.body.classList.toggle('light-theme', !this.isDark);
  }

}
