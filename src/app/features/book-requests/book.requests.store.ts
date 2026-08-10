import { Injectable, signal } from "@angular/core";
import { BaseFeatureStore } from "../../core/store/base-feature.store";
import { BookRequestDto } from "../../shared/models/book.request.dto";
import { BookRequestService } from "../../core/services/book.request.service";
import { BookRequestDetailDto } from "../../shared/models/book.request-detail.dto";
import { Subscription } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { BookRequestUpdatedPayloadEventDto } from "../../shared/models/events/book-request-updated-payload-event-dto";

@Injectable({
  providedIn: 'root'
})
export class BookRequestsStore extends BaseFeatureStore {

  private wsSub?: Subscription;

  readonly bookRequests = signal<BookRequestDto[]>([]);

  readonly selectedRequest = signal<BookRequestDetailDto | null>(null);

  constructor(private service: BookRequestService, private notificationService: NotificationService) {
    super();
    this.startRealtimeUpdates();
  }

  loadBookRequests() {
    this.executeRequest(this.service.getBookRequests(), requests => this.bookRequests.set(requests));
  }

  loadBookRequest(requestId: string) {
    this.executeRequest(this.service.getBookRequestDetail(requestId), request => this.selectedRequest.set(request));
  }

  approveRequest(requestId: string) {
    this.executeRequest(this.service.approveRequest(requestId));
  }
  
  voteRequest(requestId: string) {
    this.executeRequest(this.service.voteRequest(requestId));
  }

  rejectRequest(requestId: string, reason: string) {
    this.executeRequest(this.service.rejectRequest(requestId, reason));
  }

  updatePrice(requestId: string, estimatedPrice: number) {
    this.executeRequest(this.service.updatePrice(requestId, estimatedPrice));
  }

  startRealtimeUpdates() {

    if (this.wsSub) {
      return;
    }

    this.wsSub = this.notificationService.messages().subscribe(event => {

      if (event.eventType !== 'BOOK_REQUEST_UPDATED') {
        return;
      }

      this.handleBookRequestUpdated(event.payload);
     
    });

  }

  private handleBookRequestUpdated(payload: BookRequestUpdatedPayloadEventDto) {
      this.updateBookRequests(payload);
      this.updateBookRequestDetail(payload);
  }
  
  private updateBookRequests(payload: BookRequestUpdatedPayloadEventDto) {
  
    const updatedBookRequest: BookRequestDto = {
      isbn: payload.isbn,
      title: payload.title,
      author: payload.author,
      votes: payload.votes,
      requestId: payload.requestId,
      status: payload.status
    };
  
    this.bookRequests.update(list => {
  
      const index = list.findIndex(bookRequest => bookRequest.requestId === payload.requestId);
  
      if (index === -1) {
        return [
          updatedBookRequest,
          ...list
        ];
  
      }
  
      return list.map(bookRequest => bookRequest.requestId === payload.requestId ? updatedBookRequest : bookRequest);
  
    });
  
  }
  
  private updateBookRequestDetail(payload: BookRequestUpdatedPayloadEventDto) {

    const selected = this.selectedRequest();

    if (selected && selected.requestId === payload.requestId) {
      this.loadBookRequest(payload.requestId);
    }

  }

}