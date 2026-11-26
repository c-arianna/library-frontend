import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from "@angular/core";
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import { DailyLoanStatisticDto } from "../../../shared/models/daily.loan.statistic.dto";
import { DashboardService } from "../../../core/services/dashboard.service";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

@Component({
  selector: 'app-daily-loan-statistics',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './daily-loan-statistics.html',
  styleUrl: './daily-loan-statistics.scss'
})
export class DailyLoanStatisticsComponent implements AfterViewInit {

  @ViewChild('loanChart')
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  
  readonly dailyLoanStatistics = signal<DailyLoanStatisticDto[]>([]);

  readonly selectedDays = signal(30);

  readonly dashboardService = inject(DashboardService);

  readonly route = inject(ActivatedRoute);

  readonly router = inject(Router);

  ngAfterViewInit() {
    const days = Number(this.route.snapshot.queryParamMap.get('lastDays')) || 30;
    this.loadDailyLoanStatistics(days);
  }

  loadDailyLoanStatistics(days: number = 30) {

    this.selectedDays.set(days);

    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);

    this.dashboardService.getDailyLoanStatistics(this.toIsoDate(from), this.toIsoDate(to))
      .subscribe({
          next: statistics => {
            this.dailyLoanStatistics.set(statistics);
            this.createChart(statistics);
          },
          error: error => {
            console.error(error);
          }

    });

  }

  private createChart(statistics: DailyLoanStatisticDto[]) {

    if (this.chart) {
      this.chart.destroy();
    }
    
    this.chart = new Chart(this.chartCanvas.nativeElement, {

      type: 'line',

      data: {

        labels: statistics.map(d => d.statisticDate),

          datasets:  [

              {
                label: 'Creati',
                data: statistics.map(d => d.loansCreated),
                borderColor: '#b8860b',
                backgroundColor: 'rgba(184, 134, 11, 0.15)',
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3,
                tension: 0.3
              },

              {
                label: 'Confermati',
                data: statistics.map(d => d.loansConfirmed),
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.15)',
                fill: true,
                borderDash: [6, 4],
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3,
                tension: 0.3
              },

              {
                label: 'Annullati',
                data: statistics.map(d => d.loansCanceled),
                borderColor: '#d32f2f',
                backgroundColor: 'rgba(211, 47, 47, 0.15)',
                fill: true,
                pointStyle: 'triangle',
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3,
                tension: 0.3
              },

              {
                label: 'Restituiti',
                data: statistics.map(d => d.loansReturned),
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.15)',
                fill: true,
                borderDash: [2, 2],
                pointStyle: 'rectRot',
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3,
                tension: 0.3
              }
          ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            interaction: {
              mode: 'index',
              intersect: false
            },

            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false
              }
            }
        }

    });

  }

  private toIsoDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
  
  applyPresetFilter(days: number) {

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {
          lastDays: days
        },
        queryParamsHandling: 'merge'
      }
    );

    this.loadDailyLoanStatistics(days);
  
  }

  isCustomFilter(){
    return this.selectedDays() !== 7 && this.selectedDays() !== 30 &&  this.selectedDays() !== 90 && this.selectedDays() !== 365
  }

}