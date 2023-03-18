import { engine } from '@dcl/sdk/ecs'

export const Totem = {
  red: engine.defineComponent('totem-red-id', {}),
  blue: engine.defineComponent('totem-blue-id', {}),
  green: engine.defineComponent('totem-green-id', {})
}
