import { UserStatus } from "../user-status.dto";

export interface UserUpdatedPayloadEventDto {
  userId: string;
  email: string;
  name: string;
  lastname: string;
  userIdentityProviderId: string;
  status: UserStatus;
  role: string;
}