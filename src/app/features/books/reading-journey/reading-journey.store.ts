import { computed, Injectable, signal } from "@angular/core";
import { BaseFeatureStore } from "../../../core/store/base-feature.store";
import { AssistantService } from "../../../core/services/assistant.service";

import { ReadingJourneyResult } from "../../../shared/models/reading-journey.response.dto";

@Injectable()
export class ReadingJourneyStore extends BaseFeatureStore {

    readonly journey  = signal<ReadingJourneyResult| null>(null);

    readonly orderedBooks = computed(() =>  (this.journey()?.books ?? []).slice().sort((a, b) => a.order - b.order));

    constructor(private assistantService: AssistantService) {
        super();
    }

    loadReadingJourney(isbn: string) {
        this.journey.set(null);
        this.executeRequest(this.assistantService.getReadingJouney(isbn), result  => this.journey .set(result));
    }
}