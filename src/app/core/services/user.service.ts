import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private api = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest) {
    return this.http.post(`${this.api}/subscribe`, data);
  }
}
