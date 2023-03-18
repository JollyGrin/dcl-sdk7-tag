import { engine, Entity, Material, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { Totem } from './totem-components'

type TotemCategoryType = 'red' | 'blue' | 'green'

const totemFactory = (category: TotemCategoryType, { x, y, z }: Vector3): Entity => {
  const color = {
    red: Color4.Red(),
    blue: Color4.Blue(),
    green: Color4.Green()
  }

  const totem = engine.addEntity()
  Totem[category].create(totem)
  MeshRenderer.setBox(totem)
  Transform.create(totem, { position: Vector3.create(x, y, z), scale: Vector3.create(1, 3, 1) })
  Material.setPbrMaterial(totem, {
    albedoColor: color[category],
    emissiveColor: color[category],
    emissiveIntensity: 2
  })

  return totem
}

export const CreateTotems = () => {
  const totemRed = totemFactory('red', { x: 8, y: 1, z: 8 })
  const totemBlue = totemFactory('blue', { x: 10, y: 1, z: 8 })
  const totemGreen = totemFactory('green', { x: 12, y: 1, z: 8 })
}
