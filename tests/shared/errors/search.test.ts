import { describe, expect, it } from "vitest";

import { AppError } from "@shared/errors/AppError";
import { DuplicateSearchError, SearchInProgressError } from "@shared/errors/search";

describe("SearchInProgressError", () => {
  it("is an AppError with warning severity and its own name", () => {
    const error = new SearchInProgressError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("SearchInProgressError");
    expect(error.severity).toBe("warning");
  });
});

describe("DuplicateSearchError", () => {
  it("is an AppError with warning severity and its own name", () => {
    const error = new DuplicateSearchError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("DuplicateSearchError");
    expect(error.severity).toBe("warning");
  });
});
