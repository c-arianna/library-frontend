export type BookCopiesOperation = 'ADD' | 'REMOVE';

export interface BookCopiesDialogData {
  isbn: string;
  availableCopies: number;
  operation: BookCopiesOperation;
}
