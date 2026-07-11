import { LoanDetailDto } from "../../loan-detail.dto";
import { LoanDto } from "../../loan.dto";
import { LoanUpdatedPayloadEventDto } from "../loan-updated-payload-event.dto";

export function mapLoanNotificationToLoan(payload: LoanUpdatedPayloadEventDto) : LoanDto {

  return {
    id: payload.loanId,
    isbn: payload.isbn,
    userId: payload.userId,
    status: payload.status
  };

}

export function mapLoanNotificationToDetail(event: LoanUpdatedPayloadEventDto): LoanDetailDto {

  return {
    id: event.loanId,
    isbn: event.isbn,
    userId: event.userId,
    status: event.status,
    start: event.startDate,
    end: event.endDate
  };

}