import { Component, inject, OnInit, signal } from "@angular/core";
import { DashboardService } from "../../../core/services/dashboard.service";
import { PopularBookDto } from "../../../shared/models/popular.books.dto";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-popular-books',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './popular-books.html',
  styleUrl: './popular-books.scss'
})
export class PopularBooksComponent implements OnInit {

    readonly popularBooks = signal<PopularBookDto[]>([]);

    readonly state = signal({
        loading: false,
        error: null as string | null
    });

    readonly dashboardService = inject(DashboardService)

    ngOnInit(): void {
        this.load();
    }

    load() {

        this.state.set({
            loading: true,
            error: null
        });

        this.dashboardService.findMostPopularBooks()
          .subscribe({

            next: books => {

              this.popularBooks.set(books);

              this.state.set({
                loading: false,
                error: null
              });

            },

            error: err => {

              this.state.set({
                loading: false,
                error: err?.message
              });

            }

          });

  }

  hasLoans(){
    return this.popularBooks().length > 0;
  }

}