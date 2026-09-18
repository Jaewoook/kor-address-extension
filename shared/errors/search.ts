import { AppError } from "./AppError";

export class SearchInProgressError extends AppError {
  constructor() {
    super("Search skipped: a search is already in progress", "warning");
  }
}

export class DuplicateSearchError extends AppError {
  constructor() {
    super("Search skipped: identical to the previous search", "warning");
  }
}
