import { LoanStatus } from "./loan-status.dto";

export interface LoanFiltersDto {
  isbn?: string;
  status?: LoanStatus;
  userId?: string;
  cardNumber?: string;
}