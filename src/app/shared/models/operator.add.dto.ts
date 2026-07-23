import { UserRole } from "./user-roles.dto";

export type OperatorRole = Exclude<UserRole, 'READER'>;

export interface OperatorAddDto {
  email: string;
  name: string;
  lastname: string;
  password: string;
  role: OperatorRole;
}