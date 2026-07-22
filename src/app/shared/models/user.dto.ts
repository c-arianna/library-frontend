import { UserStatus } from "./user-status.dto";

export interface UserDto {
  userId: string;
  email: string;
  cardNumber: string,
  name: string;
  lastname: string;
  role: string;
  status: UserStatus;
}