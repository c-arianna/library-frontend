export interface BookDetailDto {
  isbn: string;
  title: string;
  author: string;
  description: string;
  available: boolean;
  totalCopies: number;
  reservedCopies: number;
  borrowedCopies: number;
}