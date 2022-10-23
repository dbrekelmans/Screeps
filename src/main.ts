import { ErrorHandler } from "utils/ErrorHandler"
import { ConsoleLoggerFactory } from "utils/logger/ConsoleLoggerFactory"
import { GarbageCollector } from "utils/GarbageCollector"

// declare global {
//   /*
//     Example types, expand on these or remove them and add your own.
//     Note: Values, properties defined here do no fully *exist* by this type definition alone.
//           You must also give them an implementation if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)
//
//     Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
//     Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
//   */
//   // Memory extension samples
//   interface Memory {
//     uuid: number
//     log: any
//   }
//
//   interface CreepMemory {
//     role: string
//     room: string
//     working: boolean
//   }
// }

export const loop = ErrorHandler.call(() => {
  const loggerFactory = new ConsoleLoggerFactory()
  const logger = loggerFactory.create()

  logger.notice(`Current game tick is ${Game.time}`)
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

  const garbageCollectorLogger = loggerFactory.create({ channel: "garbage-collector" })
  new GarbageCollector(Memory, Game, garbageCollectorLogger).collect()
})
