import { Component, inject, OnInit } from "@angular/core";
import { SimilarBooksStore } from "./similar-books.store";
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
  selector: 'app-similar-books',
  templateUrl: './similar-books.html',
  styleUrl: './similar-books.scss',
  imports: [RouterLink],
  providers: [SimilarBooksStore]
})
export class SimilarBooksComponent implements OnInit {

    readonly store = inject(SimilarBooksStore);

    private readonly route = inject(ActivatedRoute);

    ngOnInit() {

        const isbn = this.route.snapshot.paramMap.get('isbn');

        if (isbn) {
            this.store.loadBooks(isbn);
        }
    }

}
