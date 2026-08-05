import { LoanBookDto } from "./loan-book.dto";
import { LoanStatus } from "./loan-status.dto";
import { LoanUserDto } from "./loan-user.dto";

export interface LoanDetailDto {
  id: string;
  book: LoanBookDto;
  status: LoanStatus;
  start: string;
  end: string;
  user: LoanUserDto;
  overdue: boolean;
  daysOverdue: number;
}