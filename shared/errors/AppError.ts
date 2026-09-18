export type ErrorSeverity = "info" | "warning" | "error" | "critical";

export abstract class AppError extends Error {
  readonly severity: ErrorSeverity;

  protected constructor(message: string, severity: ErrorSeverity) {
    super(message);
    this.name = new.target.name;
    this.severity = severity;
  }
}
