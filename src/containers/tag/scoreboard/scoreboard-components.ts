
import { engine, Schemas } from '@dcl/sdk/ecs'

export type PickupSphereType = {
    userId: string
    displayName: string
}
export const ScorboardContainer = {
    wall: engine.defineComponent('scorboard-wall-id', {}),
    text: engine.defineComponent('scoreboard-text-id', {

    })
} 
