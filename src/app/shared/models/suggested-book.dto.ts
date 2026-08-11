export interface SuggestedBookDto {
  requestId: string;
  title: string;
  author: string;
  estimatedPrice: number;
  votes: number;
  score: number;
}