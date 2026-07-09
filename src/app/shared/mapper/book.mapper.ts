import { BookDto } from '../models/book.dto';
import { BookRegisteredEventDto } from '../models/events/book-registered-event.dto';

export function mapRegisteredEventToBook(event: BookRegisteredEventDto): BookDto {

  return {
    isbn: event.isbn,
    title: event.title,
    author: event.author,
    available: false
  };

}