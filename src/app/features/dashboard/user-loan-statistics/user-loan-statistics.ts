import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { UserLoanStatisticsDto } from "../../../shared/models/user-loan-statistics.dto";
import { DashboardService } from "../../../core/services/dashboard.service";
import { RiskLevel } from "../../../shared/models/risk-level.dto";

@Component({
  selector: 'app-overdue-loans',
  standalone: true,
  imports: [ RouterLink],
  templateUrl: './user-loan-statistics.html',
  styleUrl: './user-loan-statistics.scss'
})
export class UserLoanStatisticsComponent implements OnInit {

    readonly userLoanStatistics = signal<UserLoanStatisticsDto[]>([]);

    readonly statisticsState = signal({
        loading: false,
        error: null as string | null
    });

    readonly dashboardService = inject(DashboardService)

    ngOnInit(){
        this.loadStatistics();
    }

    loadStatistics() {

        this.statisticsState.set({loading: true, error: null});
    
        this.dashboardService.getUserLoanStatistics()
        .subscribe({
            next: statistic => {
            this.userLoanStatistics.set(statistic);
            this.statisticsState.set({loading: false, error: null});
            },
            error: err => {
            this.statisticsState.set({loading: false, error: err?.message ?? 'Errore durante il caricamento delle statistiche'});
            }
        });
    }

    hasStatistics() {
        return this.userLoanStatistics().length > 0;
    }

    mapRiskToDescription(riskLevel : RiskLevel){

        switch(riskLevel){
            case 'HIGH': return "Alto"
            case 'MEDIUM': return "Medio"
            case 'LOW': return "Basso"
        }
    }

}