import { Logger, LogLevel } from "utils/logger/Logger"
import { LoggerOptions } from "utils/logger/LoggerFactory"

export class ConsoleLogger implements Logger {
  private readonly channel: string
  private readonly minLevel: LogLevel

  constructor(options?: LoggerOptions) {
    this.channel = options?.channel ?? ""
    this.minLevel = options?.minLevel ?? LogLevel.DEBUG
  }

  log(logLevel: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (logLevel.valueOf() < this.minLevel.valueOf()) {
      return
    }

    console.log(
      (this.channel.length !== 0 ? `[${this.channel}] ` : "") +
        `${LogLevel[logLevel]}: ${message}` +
        (context !== undefined ? ` ${JSON.stringify(context)}` : "")
    )
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context)
  }

  notice(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.NOTICE, message, context)
  }

  warning(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARNING, message, context)
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context)
  }

  critical(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.CRITICAL, message, context)
  }
}
