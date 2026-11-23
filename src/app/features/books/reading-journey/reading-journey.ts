import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ReadingJourneyStore } from "./reading-journey.store";

@Component({
  selector: 'app-similar-books',
  templateUrl: './reading-journey.html',
  styleUrl: './reading-journey.scss',
  imports: [RouterLink],
  providers: [ReadingJourneyStore]
})
export class ReadingJourneyComponent implements OnInit {

    readonly store = inject(ReadingJourneyStore);

    private readonly route = inject(ActivatedRoute);

    ngOnInit() {

        const isbn = this.route.snapshot.paramMap.get('isbn');

        if (isbn) {
            this.store.loadReadingJourney(isbn);
        }
    }

}