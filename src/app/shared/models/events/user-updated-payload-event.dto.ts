import { UserStatus } from "../user-status.dto";

export interface UserUpdatedPayloadEventDto {
  userId: string;
  email: string;
  name: string;
  lastname: string;
  cardNumber: string;
  userIdentityProviderId: string;
  status: UserStatus;
  role: string;
}