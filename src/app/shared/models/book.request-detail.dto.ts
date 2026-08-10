import { BookRequestStatus } from "./book.request.status.dto";
import { BookRequestVoteDto } from "./book.request.vote.dto";

export interface BookRequestDetailDto{
    requestId: string;
    requesterUserId: string;
    cardNumber: string;
    isbn?: string;
    author: string;
    title: string;
    notes: string;
    status: BookRequestStatus;
    votes: number;
    canVote: boolean;
    bookRequestVotes: BookRequestVoteDto[],
    estimatedPrice: number | null;
}