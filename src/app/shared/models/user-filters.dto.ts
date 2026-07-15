import { UserStatus } from "./user-status.dto";

export interface UserFiltersDto {
  userId?: string;
  email?: string;
  userIdentityProviderId?: string;
  status?: UserStatus
}