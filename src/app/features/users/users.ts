import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { UsersStore } from "./users.store";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ CommonModule ],
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

  ngOnInit(): void {
    this.store.loadUsers();
  }

}
