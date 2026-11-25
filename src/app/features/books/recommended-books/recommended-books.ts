import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { RecommendedBooksStore } from './recommended-books.store';

@Component({
  selector: 'app-recommended-books',
  templateUrl: './recommended-books.html',
  styleUrl: './recommended-books.scss',
  imports: [RouterLink],
  providers: [RecommendedBooksStore]
})
export class RecommendedBooksComponent implements OnInit {

  readonly store = inject(RecommendedBooksStore);

  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.store.loadRecommendations();
  }
}