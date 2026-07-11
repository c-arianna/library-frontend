import { computed, Injectable, signal } from "@angular/core";
import { BaseFeatureStore } from "../../core/store/base-feature.store";
import { UserService } from "../../core/services/user.service";
import { UserDto } from "../../shared/models/user.dto";

@Injectable({
  providedIn: 'root'
})
export class UsersStore extends BaseFeatureStore {

    readonly users = signal<UserDto[]>([]);

    readonly readers = computed(() => this.users().filter(user => user.role === 'READER'));
    
    constructor(private userService: UserService) {
        super();
    }

    loadUsers(){
      this.executeRequest(this.userService.getUsers(), users => { this.users.set(users);});
    }

}