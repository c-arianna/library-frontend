import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookRequestsStore } from '../book.requests.store';
import { HasRoleDirective } from '../../../core/directives/has.role';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { BookRequestRejectDialogComponent } from '../book-request-reject-dialog/book-request-reject-dialog';

@Component({
  selector: 'app-book-request-detail',
  standalone: true,
  imports: [RouterLink, HasRoleDirective],
  templateUrl: './book-request-detail.html',
  styleUrl: './book-request-detail.scss'
})
export class BookRequestDetailComponent implements OnInit {

  readonly store = inject(BookRequestsStore);

  private readonly route = inject(ActivatedRoute);

  private readonly dialog = inject(MatDialog);

  readonly statusLabels = {
    PENDING: 'In attesa',
    APPROVED: 'Approvata',
    REJECTED: 'Rigettata'
  };
  
  ngOnInit() {

    const requestId = this.route.snapshot.paramMap.get('requestId');

    if (requestId) {
      this.store.loadBookRequest(requestId);
    }

  }

  openVoteDialog() {

    const request = this.store.selectedRequest();

    if (!request) {
      return;
    }

    this.dialog.open(ConfirmDialogComponent,
    {
      panelClass: 'custom-dialog',
      data: {
        title: 'Vota la richiesta',
        message: `Confermi il voto per la richiesta del libro "${request.title}"?`,
        confirmLabel: 'Vota'
      }
    }
    ).afterClosed().subscribe(confirmed => {

      if (!confirmed) {
        return;
      }

      this.store.voteRequest(request.requestId);

    });

  }

  openApproveDialog() {

    const request = this.store.selectedRequest();

    if (!request) {
      return;
    }

    this.dialog.open(ConfirmDialogComponent,
    {
      panelClass: 'custom-dialog',
      data: {
        title: 'Approvazione richiesta',
        message: `Confermi l'approvazione della richiesta per il libro "${request.title}"?`,
        confirmLabel: 'Approva'
      }
    }
    ).afterClosed().subscribe(confirmed => {

      if (!confirmed) {
        return;
      }

      this.store.approveRequest(request.requestId);

    });

  }

  openRejectDialog() {

    const request = this.store.selectedRequest();

    if (!request) {
      return;
    }

    this.dialog.open(BookRequestRejectDialogComponent,
    {
      panelClass: 'custom-dialog',
      data: {
        title: 'Rigetto richiesta',
        message: `Confermi il rigetto della richiesta per il libro "${request.title}"?`
      }
    }
    ).afterClosed().subscribe(result => {

      if (!result?.confirmed) {
        return;
      }

      this.store.rejectRequest(request.requestId, result.reason);

    });

  }

}
