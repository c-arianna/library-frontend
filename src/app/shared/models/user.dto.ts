import { UserStatus } from "./user-status.dto";

export interface UserDto {
  userId: string;
  email: string;
  userIdentityProviderId: string,
  role: string;
  status: UserStatus;
}