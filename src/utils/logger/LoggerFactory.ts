import { Logger, LogLevel } from "utils/logger/Logger"

export type LoggerOptions = {
  channel?: string
  minLevel?: LogLevel
}

export interface LoggerFactory {
  create(options?: LoggerOptions): Logger
}
