import { LoggerFactory, LoggerOptions } from "utils/logger/LoggerFactory"
import { Logger } from "utils/logger/Logger"
import { ConsoleLogger } from "utils/logger/ConsoleLogger"

export class ConsoleLoggerFactory implements LoggerFactory {
  create(options?: LoggerOptions): Logger {
    return new ConsoleLogger(options)
  }
}
