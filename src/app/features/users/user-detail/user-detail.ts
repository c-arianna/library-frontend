import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UsersStore } from '../users.store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserActionsDialogComponent } from '../user-actions-dialog/user-actions-dialog';
import { UserDetailDto } from '../../../shared/models/user-detail-dto';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-user-detail',
  imports: [ RouterLink],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetailComponent implements OnInit {

    readonly store = inject(UsersStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly authService = inject(AuthService);
    readonly isProfile = signal(false);

    readonly isOperatorView = computed(() => this.router.url.startsWith('/operators'));

    readonly statusLabels = {
      ACTIVE: 'Attivo',
      SUSPENDED: 'Sospeso',
      DISABLED: 'Disabilitato'
    };

    readonly roleLabels = {
      ADMIN: 'Amministratore',
      LIBRARIAN: 'Bibliotecario',
      READER: 'Utente Biblioteca'
    };

    ngOnInit() {
      const userId = this.route.snapshot.paramMap.get('userId');
      this.isProfile.set(!userId);

      if (userId) {
        this.store.loadUser(userId);
        return;
      }
      
      this.store.loadProfile();
    }

    openLoans() {
      const user = this.store.selectedUser();

      if (!user) {
          return;
        }

      this.router.navigate(
        ['/loans'],
        {
          queryParams: {
            cardNumber: user.cardNumber
          }
        }
      );
    }

    suspendUser() {

      const user = this.store.selectedUser();

      if (!user) {
        return;
      }

      this.dialog.open(UserActionsDialogComponent,
        {
          panelClass: 'custom-dialog',
          data: {
            userId: user.userId,
            action: 'suspend'
          }
        }
      );

    }

    reactivateUser() {

      const user = this.store.selectedUser();

      if (!user) {
        return;
      }

      this.dialog.open(UserActionsDialogComponent,
      {
        panelClass: 'custom-dialog',
        data: {
          userId: user.userId,
          action: 'unsuspend'
        }
      }
    );

  }

  isCurrentUser(user: UserDetailDto) {
    return user.userIdentityProviderId === this.authService.getUserIdentityProviderId();
  }

}
