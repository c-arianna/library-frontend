import { LoanBookDto } from "../../loan-book.dto";
import { LoanDetailDto } from "../../loan-detail.dto";
import { LoanUserDto } from "../../loan-user.dto";
import { LoanDto } from "../../loan.dto";
import { LoanUpdatedPayloadEventDto } from "../loan-updated-payload-event.dto";

export function mapLoanNotificationToLoan(payload: LoanUpdatedPayloadEventDto) : LoanDto {

  return {
    id: payload.loanId,
    isbn: payload.isbn,
    author: payload.author,
    title: payload.title,
    userId: payload.userId,
    cardNumber: payload.cardNumber,
    status: payload.status,
    overdue: payload.overdue
  };

}

export function mapLoanNotificationToDetail(event: LoanUpdatedPayloadEventDto): LoanDetailDto {

  const book : LoanBookDto  = {
      isbn: event.isbn,
      author: event.author,
      title: event.title
  };

  const user : LoanUserDto  = {
      id: event.userId,
      cardNumber: event.cardNumber
  };
  
  return {
    id: event.loanId,
    book,
    user,
    status: event.status,
    start: event.startDate,
    end: event.endDate,
    overdue: event.overdue,
    daysOverdue: event.daysOverdue
  };

}