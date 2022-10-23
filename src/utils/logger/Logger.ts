export enum LogLevel {
  DEBUG,
  INFO,
  NOTICE,
  WARNING,
  ERROR,
  CRITICAL,
}

export interface Logger {
  log(logLevel: LogLevel, message: string, context?: Record<string, unknown>): void

  debug(message: string, context?: Record<string, unknown>): void

  info(message: string, context?: Record<string, unknown>): void

  notice(message: string, context?: Record<string, unknown>): void

  warning(message: string, context?: Record<string, unknown>): void

  error(message: string, context?: Record<string, unknown>): void

  critical(message: string, context?: Record<string, unknown>): void
}
