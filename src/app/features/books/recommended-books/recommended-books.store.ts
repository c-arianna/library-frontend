import { computed, Injectable, signal } from "@angular/core";
import { BaseFeatureStore } from "../../../core/store/base-feature.store";
import { RecommendedBook } from "../../../shared/models/recommended.book.dto";
import { AssistantService } from "../../../core/services/assistant.service";
import { BookRecommendationsResult, RecommendedBookType } from "../../../shared/models/recommended.book.response.dto";

@Injectable()
export class RecommendedBooksStore extends BaseFeatureStore {

  readonly recommendations = signal<BookRecommendationsResult | null>(null);
  readonly explanations = signal<Record<string, string>>({});
  readonly expanded = signal<Record<string, boolean>>({});
  readonly isPersonalized = computed(() => this.recommendations()?.type === RecommendedBookType.PERSONALIZED);
  
  constructor(private assistantService: AssistantService) {
    super();
  }

  loadRecommendations() {
    this.recommendations.set(null);
    this.executeRequest(this.assistantService.getRecommendedBooks(), result => this.recommendations.set(result));
  }

  loadExplanation(isbn: string) {

    this.assistantService.explainRecommendation(isbn).subscribe(result => {

        this.explanations.update(
          explanations => ({
            ...explanations,
            [isbn]: result.explanation
          })
        );

      });
  }

  isExpanded(isbn: string) {
    return !!this.expanded()[isbn];
  }

  getExplanation(isbn: string) {
    return this.explanations()[isbn] ?? null;
  }

  toggleExplanation(isbn: string) {

    const expanded = this.expanded()[isbn];

    this.expanded.update(state => ({
      ...state,
       [isbn]: !expanded
      }));

    if (!expanded && !this.explanations()[isbn]) {
      this.loadExplanation(isbn);
    }
  }

}