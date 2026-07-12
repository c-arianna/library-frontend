import { Component, inject, OnInit } from '@angular/core';
import { UsersStore } from '../users.store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasRoleDirective } from '../../../core/directives/has.role';
import { MatDialog } from '@angular/material/dialog';
import { UserActionsDialogComponent } from '../user-actions-dialog/user-actions-dialog';

@Component({
  selector: 'app-user-detail',
  imports: [HasRoleDirective, RouterLink],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetailComponent implements OnInit {

    readonly store = inject(UsersStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);

    readonly statusLabels = {
      ACTIVE: 'Attivo',
      SUSPENDED: 'Sospeso',
      DISABLED: 'Disabilitato'
    };

    ngOnInit() {
      const userId = this.route.snapshot.paramMap.get('userId');
      if (userId) {
        this.store.loadUser(userId);
      }
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
            userId: user.userId
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
          mode: 'unsuspend'
        }
      }
    );

  }

}
