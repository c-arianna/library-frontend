export interface AnalyticsQueryResponse{
    dashboard: DashboardType;
    lastDays?: number;
    limit?: number;
    explanation: string;
}

export enum DashboardType {
  DAILY_LOANS = 'DAILY_LOANS', 
  OVERDUE_LOANS = 'OVERDUE_LOANS', 
  POPULAR_BOOKS = 'POPULAR_BOOKS',
  USER_LOAN_STATISTICS = 'USER_LOAN_STATISTICS',
  UNSUPPORTED = 'UNSUPPORTED'
}