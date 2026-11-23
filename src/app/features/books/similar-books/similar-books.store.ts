import { Injectable, signal } from "@angular/core";
import { BaseFeatureStore } from "../../../core/store/base-feature.store";
import { AssistantService } from "../../../core/services/assistant.service";
import { SimilarBooksResult } from "../../../shared/models/similar-books-response.dto";

@Injectable()
export class SimilarBooksStore extends BaseFeatureStore {

    readonly similarBooksResult = signal<SimilarBooksResult| null>(null);;

    constructor(private assistantService: AssistantService) {
        super();
    }

    loadBooks(isbn: string) {
        this.similarBooksResult.set(null);
        this.executeRequest(this.assistantService.getSimilarBooks(isbn), book => this.similarBooksResult.set(book));
    }
}