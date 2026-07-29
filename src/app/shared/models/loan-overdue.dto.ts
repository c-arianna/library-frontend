export interface LoanOverdueDto {
  loanId: string;
  isbn: string;
  userId: string;
  cardNumber: string;
  dueDate: string;
  daysOverdue: number;
}