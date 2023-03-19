import { CreatePickup } from './tag/pickup/pickup-init'
import { CreateScoreboard } from './tag/scoreboard/scoreboard-init'
import { CreateTotems } from './tag/totem/totem-init'

export const Tag = {
  init: (): void => {
    CreateTotems()
    CreatePickup()
    CreateScoreboard()
  }
}
