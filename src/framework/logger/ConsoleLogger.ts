import { Logger, LogLevel } from "framework/logger/Logger"
import { LoggerOptions } from "framework/logger/LoggerFactory"

export class ConsoleLogger implements Logger {
  private readonly channel: string
  private readonly minLevel: LogLevel

  constructor(options?: LoggerOptions) {
    this.channel = options?.channel ?? ""
    this.minLevel = options?.minLevel ?? LogLevel.DEBUG
  }

  public log(logLevel: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (logLevel.valueOf() < this.minLevel.valueOf()) {
      return
    }

    console.log(
      (this.channel.length !== 0 ? `[${this.channel}] ` : "") +
        `${LogLevel[logLevel]}: ${message}` +
        (context !== undefined ? ` ${JSON.stringify(context)}` : "")
    )
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context)
  }

  public notice(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.NOTICE, message, context)
  }

  public warning(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARNING, message, context)
  }

  public error(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context)
  }

  public critical(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.CRITICAL, message, context)
  }
}
