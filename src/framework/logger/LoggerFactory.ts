import { Logger, LogLevel } from "framework/logger/Logger"

export type LoggerOptions = {
  channel?: string
  minLevel?: LogLevel
}

export interface LoggerFactory {
  create(options?: LoggerOptions): Logger
}
