import { BookUpdatedPayloadEventDto } from "./book-updated-payload-event.dto";
import { LoanUpdatedPayloadEventDto } from "./loan-updated-payload-event.dto";
import { UserUpdatedPayloadEventDto } from "./user-updated-payload-event.dto";

export interface BookUpdatedNotification {
  eventType: 'BOOK_UPDATED';
  payload: BookUpdatedPayloadEventDto;
}

export interface LoanUpdatedNotification {
  eventType: 'LOAN_UPDATED';
  payload: LoanUpdatedPayloadEventDto;
}

export interface UserUpdatedNotification {
  eventType: 'USER_UPDATED';
  payload: UserUpdatedPayloadEventDto;
}

export type NotificationEvent = BookUpdatedNotification | LoanUpdatedNotification | UserUpdatedNotification;