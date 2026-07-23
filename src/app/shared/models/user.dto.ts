import { UserRole } from "./user-roles.dto";
import { UserStatus } from "./user-status.dto";

export interface UserDto {
  userId: string;
  email: string;
  cardNumber: string | null;
  name: string;
  lastname: string;
  role: UserRole;
  status: UserStatus;
}