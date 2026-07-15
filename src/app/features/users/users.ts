import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { UsersStore } from "./users.store";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class UsersComponent implements OnInit {

  readonly store = inject(UsersStore);

  readonly statusLabels = {
    ACTIVE: 'Attivo',
    SUSPENDED: 'Sospeso',
    DISABLED: 'Disabilitato'
  };

  readonly statuses = [
    { value: 'ACTIVE', label: 'Attivo' },
    { value: 'SUSPENDED', label: 'Sospeso' },
    { value: 'DISABLED', label: 'Disabilitato' }
  ];

  ngOnInit(): void {
    this.store.loadUsers();
  }

}
