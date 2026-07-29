import { LoanStatus } from "./loan-status.dto";

export interface LoanDto {
  id: string;
  isbn: string;
  userId: string;
  cardNumber: string;
  status: LoanStatus;
  overdue: boolean;
}