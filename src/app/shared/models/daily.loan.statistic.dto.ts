export interface DailyLoanStatisticDto {
  statisticDate: string;
  loansCreated: number;
  loansConfirmed: number;
  loansCanceled: number;
  loansReturned: number;
}