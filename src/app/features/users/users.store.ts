import { computed, Injectable, signal } from "@angular/core";
import { BaseFeatureStore } from "../../core/store/base-feature.store";
import { UserService } from "../../core/services/user.service";
import { UserDto } from "../../shared/models/user.dto";
import { UserDetailDto } from "../../shared/models/user-detail-dto";
import { NotificationService } from "../../core/services/notification.service";
import { Subscription } from "rxjs";
import { UserUpdatedPayloadEventDto } from "../../shared/models/events/user-updated-payload-event.dto";
import { UserFiltersDto } from "../../shared/models/user-filters.dto";
import { UserStatus } from "../../shared/models/user-status.dto";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UsersStore extends BaseFeatureStore {

  private wsSub?: Subscription;

  readonly users = signal<UserDto[]>([]);

  readonly readers = computed(() => this.users().filter(user => user.role === 'READER'));
    
  readonly selectedUser = signal<UserDetailDto | null>(null);

  readonly filters = signal<UserFiltersDto>({
      email: '',
      cardNumber: "",
      name: "",
      lastname: "",
      status: undefined
  });
  
  readonly filteredUsers = computed(() => {
  
    const users = this.readers();
    const filters = this.filters();
  
    return users.filter(user => {
      
      const matchEmail = !filters.email || user.email.includes(filters.email);
      const matchCardNumber = !filters.cardNumber || user.cardNumber?.includes(filters.cardNumber);
      const matchName = !filters.name || user.name.includes(filters.name);
      const matchLastname = !filters.lastname || user.lastname.includes(filters.lastname);
      const matchStatus = !filters.status || user.status === filters.status;
      
      return matchEmail && matchCardNumber && matchName && matchLastname && matchStatus;
  
      });
  
    });

  constructor(private userService: UserService, private router: Router, private notificationService: NotificationService) {
    super();
    this.startRealtimeUpdates();
  }

  loadUsers(){
    this.executeRequest(this.userService.getUsers(), users => { this.users.set(users);});
  }

  loadUser(userId: string) {
    this.selectedUser.set(null);
    this.executeRequest(this.userService.getUser(userId), user => this.selectedUser.set(user));
  }

  loadProfile() {
    this.selectedUser.set(null);
    this.executeRequest(this.userService.getProfile(), user => this.selectedUser.set(user));
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
  
      const index = list.findIndex(user => user.userId === payload.userId);
  
      if (index === -1) {
        return [
            updatedUser,
            ...list
        ];
  
      }
  
      return list.map(user => user.userId === payload.userId ? updatedUser : user);
  
    });
  
  }
  
  private updateUserDetail(payload: UserUpdatedPayloadEventDto) {
  
    const selectedUser = this.selectedUser();
  
    if (selectedUser && selectedUser.userId === payload.userId) {
        this.selectedUser.set(this.mapUserNotificationToDetail(payload));
      }
  
  }

  private mapUserNotificationToDetail(event: UserUpdatedPayloadEventDto): UserDetailDto {
  
    return {
      userId: event.userId,
      email: event.email,
      name: event.name,
      lastname: event.lastname,
      cardNumber: event.cardNumber,
      status: event.status
    };
  
  }

  updateFilter<K extends keyof UserFiltersDto>(field: K, value: UserFiltersDto[K]){
      
      this.filters.update(filters => ({
        ...filters,
        [field]: value
      }));
      
    }
      
    clearFilters() {
      
      this.filters.set({
        email: '',
        cardNumber: "",
        name: "",
        lastname: "",
        status: undefined
      });
  
      this.router.navigate(['/users']);
      
    }
  
    updateStatusFilter(value: string) {
      this.updateFilter('status', value === '' ? undefined : value as UserStatus);
    }

}