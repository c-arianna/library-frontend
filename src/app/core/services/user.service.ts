import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../shared/models/register-request.dto';

@Injectable({ providedIn: 'root' })
export class UserService {

  private api = '/api/users';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest) {
    return this.http.post(`${this.api}/subscribe`, data);
  }
}
