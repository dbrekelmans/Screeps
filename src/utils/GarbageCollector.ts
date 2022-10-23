import { Logger } from "utils/logger/Logger"

export class GarbageCollector {
  constructor(private readonly memory: Memory, private readonly game: Game, private readonly logger: Logger) {}

  public collect(): void {
    this.collectCreeps()
  }

  private collectCreeps(): void {
    for (const name in this.memory.creeps) {
      if (!(name in this.game.creeps)) {
        delete this.memory.creeps[name]

        this.logger.debug("Collected creep", { name })
      }
    }
  }
}
