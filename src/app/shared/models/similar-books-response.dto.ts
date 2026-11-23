import { SimilarBookDto } from "./similar-book.dto";
import { SimilarBookSource } from "./similar-books-source.dto";

export interface SimilarBooksResult{
    sourceBook : SimilarBookSource;
    books : SimilarBookDto[];
}