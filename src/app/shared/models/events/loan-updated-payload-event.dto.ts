import { LoanStatus } from "../loan-status.dto";

export interface LoanUpdatedPayloadEventDto {
  loanId: string;
  isbn: string;
  userId: string;
  identityProviderId: string;
  status: LoanStatus;
  startDate: string;
  endDate: string;
}