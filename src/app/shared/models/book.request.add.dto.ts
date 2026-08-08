export interface CreateBookRequestDto {
  title: string;
  author: string;
  isbn?: string;
  notes?: string;
}