import { Logger } from "framework/logger/Logger"
import { injectable } from "tsyringe"

@injectable()
export class Brain {
  constructor(private readonly logger: Logger) {}

  public tick(): void {
    this.logger.notice(`Current game tick is ${Game.time}`)
    Game.spawns["StartSpawn"].spawnCreep([WORK, MOVE, CARRY, MOVE], "Creep1")
    const creep = Game.creeps["Creep1"]

    if (creep.store.energy === 0) {
      const source = creep.room.find(FIND_SOURCES)[0]

      creep.moveTo(source)
      creep.harvest(source)
    } else {
      const controller = creep.room.controller

      if (controller !== undefined) {
        creep.moveTo(controller)
        creep.upgradeController(controller)
      }
    }
  }
}
