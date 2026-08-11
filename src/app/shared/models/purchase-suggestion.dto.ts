import { PurchaseSuggestionStatus } from "./purchase-suggestion-status.dto";
import { SuggestedBookDto } from "./suggested-book.dto";

export interface PurchaseSuggestionDto{
    status: PurchaseSuggestionStatus;
    budget: number;
    totalCost: number;
    totalScore: number;
    books: SuggestedBookDto[];
}