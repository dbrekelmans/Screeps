import { ErrorHandler } from "framework/ErrorHandler"
import { GarbageCollector } from "framework/GarbageCollector"
import { container } from "tsyringe"
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container"
import { Brain } from "brain/Brain"
import { Logger, LogLevel } from "framework/logger/Logger"
import { LoggerFactory } from "framework/logger/LoggerFactory"
import { ConsoleLoggerFactory } from "framework/logger/ConsoleLoggerFactory"

export enum Environment {
  DEVELOPMENT,
  PRODUCTION,
}

export const FRAMEWORK = {
  game: Symbol("game"),
  memory: Symbol("memory"),
  environment: Symbol("environment"),
  loggerFactory: Symbol("logger-factory"),
  logger: Symbol("logger"),
}

export class Kernel {
  private readonly container: DependencyContainer

  constructor(environment: Environment) {
    this.container = container

    this.container.register(FRAMEWORK.game, { useValue: Game })
    this.container.register(FRAMEWORK.memory, { useValue: Memory })
    this.container.register(FRAMEWORK.environment, { useValue: environment })
    this.container.register<LoggerFactory>(FRAMEWORK.loggerFactory, { useClass: ConsoleLoggerFactory })
    this.container.register<Logger>(FRAMEWORK.logger, {
      useFactory: (container) => {
        const environment = container.resolve(FRAMEWORK.environment)
        return container
          .resolve<LoggerFactory>(FRAMEWORK.loggerFactory)
          .create({ minLevel: environment === Environment.PRODUCTION ? LogLevel.WARNING : LogLevel.DEBUG })
      },
    })
    this.container.register(GarbageCollector, {
      useFactory: (container) => {
        const environment = container.resolve(FRAMEWORK.environment)
        const logger = container.resolve<LoggerFactory>(FRAMEWORK.loggerFactory).create({
          channel: "garbage-collector",
          minLevel: environment === Environment.PRODUCTION ? LogLevel.WARNING : LogLevel.DEBUG,
        })

        return new GarbageCollector(container.resolve(FRAMEWORK.memory), container.resolve(FRAMEWORK.game), logger)
      },
    })
  }

  public run(): void {
    const brain = this.container.resolve(Brain)
    const environment = this.container.resolve(FRAMEWORK.environment)

    if (environment === Environment.PRODUCTION) {
      brain.tick()
    } else {
      ErrorHandler.call(() => brain.tick())()
    }

    this.container.resolve(GarbageCollector).collect()
  }
}
