import { RecommendedBook } from "./recommended.book.dto";

export interface BookRecommendationsResult{
    books: RecommendedBook[];
    type: RecommendedBookType;
}

export enum  RecommendedBookType {
    PERSONALIZED = 'PERSONALIZED',
    POPULAR = 'POPULAR'
}