import { LoanStatus } from "./loan-status.dto";

export interface LoanDetailDto {
  id: string;
  isbn: string;
  userId: string;
  status: LoanStatus;
  start: string;
  end: string;
}