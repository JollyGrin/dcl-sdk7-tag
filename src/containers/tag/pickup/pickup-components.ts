import { engine, Schemas } from '@dcl/sdk/ecs'

export type PickupSphereType = {
  userId: string
  displayName: string
}
export const PickupSphere = engine.defineComponent('pickupsphere-id', {
  userId: Schemas.String,
  displayName: Schemas.String
})
