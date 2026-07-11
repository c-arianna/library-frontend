import { UserStatus } from "./user-status.dto";

export interface UserDto {
  userId: string;
  email: string;
  role: string;
  status: UserStatus;
}