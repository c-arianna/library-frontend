export interface WebsocketEvent<T> {
  eventType: string;
  payload: T;
}