import { UserStatus } from "./user-status.dto";

export interface UserDetailDto {
  userId: string;
  email: string;
  name: string;
  lastname: string;
  userIdentityProviderId: string;
  status: UserStatus;
}