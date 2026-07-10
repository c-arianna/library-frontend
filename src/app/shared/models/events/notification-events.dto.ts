import { BookUpdatedPayloadEventDto } from "./book-registered-payload-event.dto";

export interface BookUpdatedNotification {
  eventType: 'BOOK_UPDATED';
  payload: BookUpdatedPayloadEventDto;
}

export type NotificationEvent = BookUpdatedNotification;