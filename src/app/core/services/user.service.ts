import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../shared/models/register-request.dto';
import { UserDto } from '../../shared/models/user.dto';
import { map, Observable } from 'rxjs';
import { UserListResponseDto } from '../../shared/models/user-list-response.dto';
import { UserDetailDto } from '../../shared/models/user-detail-dto';
import { UserActionRequest } from '../../shared/models/user-action-request.dto';

@Injectable({ providedIn: 'root' })
export class UserService {

  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/subscribe`, data);
  }

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserListResponseDto>(`${this.apiUrl}`).pipe(map(response => response.users));
  }

  getUser(userId: string) {
     return this.http.get<UserDetailDto>(`${this.apiUrl}/${userId}`);
  }

  suspendUser(data: UserActionRequest) {
    return this.http.post(`${this.apiUrl}/suspend`, data);
  }

  unsuspendUser(data: UserActionRequest) {
    return this.http.post(`${this.apiUrl}/unsuspend`, data);
  }

}
