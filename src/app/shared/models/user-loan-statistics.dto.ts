import { RiskLevel } from "./risk-level.dto";

export interface UserLoanStatisticsDto {
  userId: string;
  cardNumber: string;
  overdueLoansCount: number;
  activeOverdueLoansCount: number;
  lastOverdueDate: string;
  totalDaysOverdue: number;
  riskLevel : RiskLevel;
}