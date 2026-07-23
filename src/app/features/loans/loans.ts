import { Component, inject, OnInit } from '@angular/core';
import { HasRoleDirective } from '../../core/directives/has.role';
import { LoansStore } from './loans.store';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [ HasRoleDirective, RouterLink],
  templateUrl: './loans.html',
  styleUrl: './loans.scss'
})
export class LoansComponent implements OnInit {

  readonly store = inject(LoansStore);
  private readonly route = inject(ActivatedRoute);

  readonly statuses = [
    { value: 'PENDING', label: 'In attesa' },
    { value: 'CONFIRMED', label: 'Confermato' },
    { value: 'RESERVED', label: 'Prenotato' },
    { value: 'RETURNED', label: 'Restituito' },
    { value: 'FAILED', label: 'Fallito' },
    { value: 'CANCELED', label: 'Annullato'}
  ];

  readonly statusLabels = {
    PENDING: 'In attesa',
    CONFIRMED: 'Confermato',
    RESERVED: 'Prenotato',
    RETURNED: 'Restituito',
    FAILED: 'Fallito',
    CANCELED: 'Annullato'
  };

  ngOnInit() {

    this.store.clearFilters();

    const isbn = this.route.snapshot.queryParamMap.get('isbn');

    if (isbn) {
      this.store.updateFilter('isbn', isbn);
    }

    const cardNumber = this.route.snapshot.queryParamMap.get('cardNumber');

    if (cardNumber) {
      this.store.updateFilter('cardNumber', cardNumber);
    }

    this.store.loadLoans();
}

}