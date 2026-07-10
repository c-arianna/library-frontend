import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NotificationEvent } from '../../shared/models/events/notification-events.dto';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private client!: Client;
  private subject = new Subject<NotificationEvent>();
 
  constructor(private auth: AuthService) {

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/notifications`;

    this.client = new Client({

        webSocketFactory: () => new WebSocket(wsUrl),

        connectHeaders: {
          Authorization: `Bearer ${this.auth.getToken()}`
        },

        reconnectDelay: 0,

        onConnect: () => {
          console.log('WebSocket connected');

          this.client.subscribe('/topic/books', message => {
            const event = JSON.parse(message.body);
            this.subject.next(event);
          });
        },

        onDisconnect: () => {
          console.log('WebSocket disconnetted');
        },

        onStompError: frame => {
          console.error('STOMP error:', frame.headers['message']);
          console.error('STOMP details:', frame.body);
        },

        onWebSocketError: error => {
          console.error('WebSocket error', error);
        },

        onWebSocketClose: (evt) => {
          console.warn('WebSocket closed',
            {
              code: evt.code,
              reason: evt.reason
            }
          );
        }
    });

    this.client.activate();
  }

  messages(): Observable<NotificationEvent> {
    return this.subject.asObservable();
  }

  disconnect(): void {
    if (this.client?.active) {
      this.client.deactivate();
    }
  }

}