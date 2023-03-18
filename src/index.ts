import { engine, Material, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { Totems } from './components'

// export all the functions required to make the scene work
export * from '@dcl/sdk'

const totemRed = engine.addEntity()
Totems.red.create(totemRed)
MeshRenderer.setBox(totemRed)
Transform.create(totemRed, { position: Vector3.create(8,1,8), scale: Vector3.create(1, 3, 1)})
Material.setPbrMaterial(totemRed, {
  albedoColor: Color4.Red(),
  emissiveColor: Color4.Red(),
  emissiveIntensity: 2,
})

