export interface BookUpdatedPayloadEventDto {
  isbn: string;
  title: string;
  author: string;
  description: string;
  available: boolean;
  totalCopies: number;
  borrowedCopies: number;
  reservedCopies: number;
}