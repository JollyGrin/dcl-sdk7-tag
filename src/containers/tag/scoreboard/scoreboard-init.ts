import { engine, Entity, MeshRenderer, TextShape, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { PickupSphere } from '../pickup/pickup-components'
import { ScorboardContainer } from './scoreboard-components'

export const CreateScoreboard = () => {
  const wall = ScoreboardWall()
  const redText = TeamText(wall, 'red')

  engine.addSystem(RedLength)
}

const ScoreboardWall = (): Entity => {
  const scoreboard = engine.addEntity()
  MeshRenderer.setPlane(scoreboard)
  Transform.create(scoreboard, {
    position: Vector3.create(0.5, 2, 18),
    rotation: Quaternion.fromEulerDegrees(0, 90, 0),
    scale: Vector3.create(6, 3, 1)
  })
  return scoreboard
}

const TeamText = (parent: Entity, team: 'red' | 'blue') => {
  const Spheres = engine.getEntitiesWith(PickupSphere)
  const text = engine.addEntity()
  ScorboardContainer.text.create(text)
  TextShape.create(text, {
    text: team + ' - ' + [...Spheres].length,
    fontSize: 2
  })
  Transform.create(text, {
    parent: parent,
    position: Vector3.create(0, 0, 0.05),
    scale: Vector3.create(0.4, 1, 1)
  })
}

const RedLength = () => {
  const Spheres = engine.getEntitiesWith(PickupSphere)
  const SpheresLength = [...Spheres].length
  console.log('qqqqq', SpheresLength)
  const Text = engine.getEntitiesWith(ScorboardContainer.text)
  for (const [entity] of Text) {
    TextShape.getMutable(entity).text = `Red: ${SpheresLength}`
  }
}
