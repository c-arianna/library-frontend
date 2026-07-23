import { UserRole } from "../user-roles.dto";
import { UserStatus } from "../user-status.dto";

export interface UserUpdatedPayloadEventDto {
  userId: string;
  email: string;
  name: string;
  lastname: string;
  cardNumber: string | null;
  userIdentityProviderId: string;
  status: UserStatus;
  role: UserRole;
}