import { BookRequestStatus } from "../book.request.status.dto";

export interface BookRequestUpdatedPayloadEventDto {
  requestId: string;
  author: string;
  title: string;
  isbn: string;
  votes: number;
  status: BookRequestStatus;
}