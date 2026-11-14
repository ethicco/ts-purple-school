export interface IStreamLogger {
  log(...args: unknown[]): void;
  error(...args: unknown[]): void;
  end(): void;
}
