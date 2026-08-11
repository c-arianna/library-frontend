import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { BookRequestsStore } from '../book-requests/book.requests.store';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-purchase-suggestions',
  standalone: true,
  imports: [ ReactiveFormsModule, RouterLink, DecimalPipe],
  templateUrl: './purchase-suggestions.html',
  styleUrl: './purchase-suggestions.scss'
})
export class PurchaseSuggestionsComponent implements OnInit {

  private readonly fb = inject(FormBuilder);

 readonly store = inject(BookRequestsStore);

  readonly form = this.fb.nonNullable.group({
    budget: [
      100,
      [
        Validators.required,
        Validators.min(1)
      ]
    ]
  });

  ngOnInit() {
    this.store.clearSuggestion();
  }

  calculate() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const budget = this.form.getRawValue().budget;

    this.store.calculateSuggestion(budget);

  }

  reset() {
    this.form.reset({
      budget: 100
    });

    this.store.clearSuggestion();
  }

  exportCsv() {

    const suggestion = this.store.purchaseSuggestion();

    if (!suggestion) {
      return;
    }

    const escapeCsv = (value: string | number | null | undefined) => {

      if (value == null) {
        return '';
      }

      return `"${String(value).replace(/"/g, '""')}"`;

    };

    const formatPrice = (value: number) => {
      return value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2});
    };

    const rows: string[] = [];

    const budget = formatPrice(suggestion.budget);
    const totalCost = formatPrice(suggestion.totalCost);

    rows.push(`Budget disponibile;${budget}`);
    rows.push(`Costo totale;${totalCost}`);
    rows.push(`Score totale;${suggestion.totalScore}`);

    rows.push('');

    rows.push(['Titolo', 'Autore', 'Prezzo stimato', 'Voti', 'Score'].join(';'));

    suggestion.books.forEach(book => {
      rows.push([escapeCsv(book.title), escapeCsv(book.author), formatPrice(book.estimatedPrice), book.votes, book.score].join(';'));
    });

    const csvContent = rows.join('\n');

    const BOM = '\uFEFF';

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;'});

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download = `purchase-suggestions-${new Date().toISOString().substring(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

  }

}