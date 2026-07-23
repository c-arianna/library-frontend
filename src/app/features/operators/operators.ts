import { Component, inject, OnInit } from '@angular/core';
import { OperatorsStore } from './operators.store';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OperatorCreateDialogComponent } from './operator-create-dialog/operator-create-dialog';

@Component({
  selector: 'app-operators',
  imports: [RouterLink],
  templateUrl: './operators.html',
  styleUrl: './operators.scss',
})
export class OperatorsComponent implements OnInit {

  readonly store = inject(OperatorsStore);
  private readonly dialog = inject(MatDialog);

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

  readonly roleLabels = {
    ADMIN: 'Amministratore',
    LIBRARIAN: 'Bibliotecario',
    READER: 'Utente Biblioteca'
  };


  ngOnInit(): void {
    this.store.loadOperators();
  }

  openCreateOperatorDialog() {
    this.dialog.open(OperatorCreateDialogComponent, { width: '500px', panelClass: 'custom-dialog' });
  }

}