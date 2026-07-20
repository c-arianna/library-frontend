import { UserStatus } from "./user-status.dto";

export interface UserFiltersDto {
  email?: string;
  name?: string;
  lastname?:string;
  status?: UserStatus
}