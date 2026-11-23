import { ReadingPathStep } from "./reading-path-step.dto";

export interface ReadingJourneyResult {
    books: ReadingPathStep[];
    explanation: string;
}