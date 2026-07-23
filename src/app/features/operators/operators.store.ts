import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { BaseFeatureStore } from '../../core/store/base-feature.store';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';

import { UserDto } from '../../shared/models/user.dto';
import { UserDetailDto } from '../../shared/models/user-detail-dto';
import { UserUpdatedPayloadEventDto } from '../../shared/models/events/user-updated-payload-event.dto';
import { UserStatus } from '../../shared/models/user-status.dto';
import { OperatorAddDto } from '../../shared/models/operator.add.dto';

@Injectable({
  providedIn: 'root'
})
export class OperatorsStore extends BaseFeatureStore {

  private wsSub?: Subscription;

  readonly users = signal<UserDto[]>([]);

  readonly operators = computed(() =>
    this.users().filter(user =>
      user.role === 'ADMIN' ||
      user.role === 'LIBRARIAN'
    )
  );

  readonly selectedUser = signal<UserDetailDto | null>(null);

  constructor(private userService: UserService, private router: Router, private notificationService: NotificationService) {
    super();
    this.startRealtimeUpdates();
  }

  loadOperators() {
    this.executeRequest(this.userService.getUsers(), users => this.users.set(users));
  }

  startRealtimeUpdates() {

    if (this.wsSub) {
      return;
    }

    this.wsSub = this.notificationService.messages().subscribe(event => {

        if (event.eventType !== 'USER_UPDATED') {
          return;
        }

        this.handleUserUpdated(event.payload);
      });
  }

  private handleUserUpdated(payload: UserUpdatedPayloadEventDto) {
    this.updateUserList(payload);
    this.updateUserDetail(payload);
  }

  private updateUserList(payload: UserUpdatedPayloadEventDto) {

    const updatedUser: UserDto = {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      lastname: payload.lastname,
      cardNumber: payload.cardNumber,
      role: payload.role,
      status: payload.status
    };

    this.users.update(list => {

      const index = list.findIndex(
        user => user.userId === payload.userId
      );

      if (index === -1) {
        return [updatedUser, ...list];
      }

      return list.map(user => user.userId === payload.userId ? updatedUser : user);
    });
  }

  private updateUserDetail(payload: UserUpdatedPayloadEventDto) {

    const selectedUser = this.selectedUser();

    if (selectedUser && selectedUser.userId === payload.userId) {
      this.selectedUser.set({
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
        lastname: payload.lastname,
        cardNumber: payload.cardNumber,
        userIdentityProviderId: payload.userIdentityProviderId,
        status: payload.status,
        role: payload.role
      });
    }
  }

  createOperator(request: OperatorAddDto, onSuccess?: () => void) {
    this.executeRequest(this.userService.createOperator(request), () =>  onSuccess?.());
  }

}