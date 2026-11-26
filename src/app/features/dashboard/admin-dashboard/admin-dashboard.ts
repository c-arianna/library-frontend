import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AssistantService } from '../../../core/services/assistant.service';
import { DashboardType } from '../../../shared/models/analytics.query.response.dto';
import { AnalyticsQueryRequest } from '../../../shared/models/analytics.query.request.dto';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent {

  readonly query = signal('');
  
  readonly assistantService = inject(AssistantService);

  private readonly router = inject(Router);

  readonly assistantMessage = signal<string | null>(null);

  readonly loading = signal(false);

  readonly errorMessage = signal<string | null>(null);

  analyze(): void {

    const question = this.query().trim();

    if (!question) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.assistantMessage.set(null);

    const request: AnalyticsQueryRequest = {
      question
    };

    this.assistantService.loadAnalyticsData(request).pipe(finalize(() => this.loading.set(false))).subscribe({

          next: response => {

            switch (response.dashboard) {

              case DashboardType.DAILY_LOANS:

                this.router.navigate(
                  ['/admin/dashboard/daily-loan-statistics'],
                  {
                    queryParams: {
                      lastDays: response.lastDays
                    }
                  }
                );

                break;

              case DashboardType.POPULAR_BOOKS:

                this.router.navigate(
                  ['/admin/dashboard/popular-books'],
                  {
                    queryParams: {
                      limit: response.limit
                    }
                  }
                );

                break;

              case DashboardType.OVERDUE_LOANS:

                this.router.navigate([
                  '/admin/dashboard/overdue-loans'
                ]);

                break;

              case DashboardType.USER_LOAN_STATISTICS:

                this.router.navigate([
                  '/admin/dashboard/user-loan-statistics'
                ]);

                break;

              case DashboardType.UNSUPPORTED:

                this.assistantMessage.set(
                  response.explanation
                );

                break;

            }

          },

          error: () => {
            this.errorMessage.set('Si è verificato un errore durante l\'analisi della richiesta.');
          }

        });

  }

  onQueryChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.assistantMessage.set(null);
 }


}