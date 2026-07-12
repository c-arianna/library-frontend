import { computed, Injectable, signal } from "@angular/core";
import { BaseFeatureStore } from "../../core/store/base-feature.store";
import { UserService } from "../../core/services/user.service";
import { UserDto } from "../../shared/models/user.dto";
import { UserDetailDto } from "../../shared/models/user-detail-dto";

@Injectable({
  providedIn: 'root'
})
export class UsersStore extends BaseFeatureStore {

    readonly users = signal<UserDto[]>([]);

    readonly readers = computed(() => this.users().filter(user => user.role === 'READER'));
    
    readonly selectedUser = signal<UserDetailDto | null>(null);

    constructor(private userService: UserService) {
        super();
    }

    loadUsers(){
      this.executeRequest(this.userService.getUsers(), users => { this.users.set(users);});
    }

    loadUser(userId: string) {
      this.selectedUser.set(null);
      this.executeRequest(this.userService.getUser(userId), user => this.selectedUser.set(user));
    }

}