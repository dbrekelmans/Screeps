import { LoggerFactory, LoggerOptions } from "framework/logger/LoggerFactory"
import { Logger } from "framework/logger/Logger"
import { ConsoleLogger } from "framework/logger/ConsoleLogger"

export class ConsoleLoggerFactory implements LoggerFactory {
  public create(options?: LoggerOptions): Logger {
    return new ConsoleLogger(options)
  }
}
