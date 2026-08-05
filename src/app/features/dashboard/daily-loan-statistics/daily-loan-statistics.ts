import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from "@angular/core";
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import { DailyLoanStatisticDto } from "../../../shared/models/daily.loan.statistic.dto";
import { DashboardService } from "../../../core/services/dashboard.service";
import { RouterLink } from "@angular/router";

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

  readonly dashboardService = inject(DashboardService)

  ngAfterViewInit() {
    this.loadDailyLoanStatistics();
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

          datasets: [

            {
              label: 'Creati',
              data: statistics.map(d => d.loansCreated),
              borderColor: '#b8860b',
              tension: 0.3
            },

            {
              label: 'Confermati',
              data: statistics.map(d => d.loansConfirmed),
              borderColor: '#2e7d32',
              tension: 0.3
            },

            {
              label: 'Annullati',
              data: statistics.map(d => d.loansCanceled),
              borderColor: '#d32f2f',
              tension: 0.3
            },

            {
              label: 'Restituiti',
              data: statistics.map(d => d.loansReturned),
              borderColor: '#1976d2',
              tension: 0.3
            }

          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }

    });

  }

  private toIsoDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
  
}