import { LoanStatus } from "../loan-status.dto";

export interface LoanUpdatedPayloadEventDto {
  loanId: string;
  isbn: string;
  userId: string;
  identityProviderId: string;
  cardNumber: string;
  status: LoanStatus;
  startDate: string;
  endDate: string;
  overdue: boolean;
  daysOverdue: number;
}