import { LoanDetailDto } from "../../loan-detail.dto";
import { LoanUserDto } from "../../loan-user.dto";
import { LoanDto } from "../../loan.dto";
import { LoanUpdatedPayloadEventDto } from "../loan-updated-payload-event.dto";

export function mapLoanNotificationToLoan(payload: LoanUpdatedPayloadEventDto) : LoanDto {

  return {
    id: payload.loanId,
    isbn: payload.isbn,
    userId: payload.userId,
    cardNumber: payload.cardNumber,
    status: payload.status
  };

}

export function mapLoanNotificationToDetail(event: LoanUpdatedPayloadEventDto): LoanDetailDto {

  const user : LoanUserDto  = {
      id: event.userId,
      cardNumber: event.cardNumber
  };
  
  return {
    id: event.loanId,
    isbn: event.isbn,
    user,
    status: event.status,
    start: event.startDate,
    end: event.endDate
  };

}