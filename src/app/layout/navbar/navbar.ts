import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { HasRoleDirective } from '../../core/directives/has.role';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../core/services/user.service';
import { UserActionsDialogComponent } from '../../features/users/user-actions-dialog/user-actions-dialog';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatMenuModule,
    HasRoleDirective
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {

  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);

  menuOpen = false;

  get name() {
    return this.auth.getName();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.auth.logout();
  }

  unsubscribe() {

    this.dialog.open(UserActionsDialogComponent,
      {
        panelClass: 'custom-dialog',
        data: {
          action: 'unsubscribe'
        }

      }).afterClosed().subscribe(result => {

        if (!result?.confirmed) {
          return;
        }

        this.auth.logout();

   });

  }

}