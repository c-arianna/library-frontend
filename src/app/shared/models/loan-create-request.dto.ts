export interface LoanCreateRequest {
  isbn: string;
  startDate: string;
  endDate: string;
  userId?: string;
}