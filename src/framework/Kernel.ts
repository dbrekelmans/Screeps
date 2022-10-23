import { ErrorHandler } from "framework/ErrorHandler"
import { GarbageCollector } from "framework/GarbageCollector"
import { container } from "tsyringe"
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container"
import { Brain } from "brain/Brain"
import { Logger, LogLevel } from "framework/logger/Logger"
import { LoggerFactory } from "framework/logger/LoggerFactory"
import { ConsoleLoggerFactory } from "framework/logger/ConsoleLoggerFactory"
import { IDENTIFIER } from "framework/dependency-injection/FrameworkInjectionTokens"

export enum Environment {
  DEVELOPMENT,
  PRODUCTION,
}

export class Kernel {
  private readonly container: DependencyContainer

  constructor(environment: Environment) {
    this.container = container

    this.container.register(IDENTIFIER.game, { useValue: Game })
    this.container.register(IDENTIFIER.memory, { useValue: Memory })
    this.container.register(IDENTIFIER.environment, { useValue: environment })
    this.container.register<LoggerFactory>(IDENTIFIER.loggerFactory, { useClass: ConsoleLoggerFactory })
    this.container.register<Logger>("logger", {
      useFactory: (container) => {
        const environment = container.resolve(IDENTIFIER.environment)
        return container
          .resolve<LoggerFactory>(IDENTIFIER.loggerFactory)
          .create({ minLevel: environment === Environment.PRODUCTION ? LogLevel.WARNING : LogLevel.DEBUG })
      },
    })
    this.container.register(GarbageCollector, {
      useFactory: (container) => {
        const environment = container.resolve(IDENTIFIER.environment)
        const logger = container.resolve<LoggerFactory>(IDENTIFIER.loggerFactory).create({
          channel: "garbage-collector",
          minLevel: environment === Environment.PRODUCTION ? LogLevel.WARNING : LogLevel.DEBUG,
        })

        return new GarbageCollector(container.resolve(IDENTIFIER.memory), container.resolve(IDENTIFIER.game), logger)
      },
    })
  }

  public run(): void {
    const brain = this.container.resolve(Brain)
    const environment = this.container.resolve(IDENTIFIER.environment)

    if (environment === Environment.PRODUCTION) {
      brain.tick()
    } else {
      ErrorHandler.call(() => brain.tick())()
    }

    this.container.resolve(GarbageCollector).collect()
  }
}
